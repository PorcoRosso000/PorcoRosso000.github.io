---
title: SpringBoot整合MongoDB
typora-root-url: SpringBoot整合MongoDB
date: 2023-10-18 09:23:27
tags: MongoDB
categories: MongoDB
permalink:
---

## 引入依赖

```xml
<dependencies>
    <dependency>
        <groupId>com.bawei</groupId>
        <artifactId>bawei-common</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!--mongodb 依赖-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb</artifactId>
    </dependency>
</dependencies>
```

## 配置MongoDB

```yaml
server:
  port: 10069
spring:
  application:
    name: bawei-mongo
  data:
    mongodb:
      host: 192.168.23.129
      database: 2001A
#eureka注册中心地址
eureka:
  instance:
    # 微服务实例IP地址
    instance-id: 127.0.0.1:${server.port}
    # 使用IP进行访问
    prefer-ip-address: true
  client:
    service-url:
      defaultZone: http://localhost:10086/eureka/

```

## MongoDB操作

### 创建实体类

```java
@Document("sys_user")
@Data
public class SysUser {
    @Id
    private String id;
    private String username;
    private String password;
    private int age;
    private String sex;
    private Date createTime;
}
```

### 增加

```java
@PostMapping
public Result insert(@RequestBody SysUser sysUser) {
    sysUser.setCreateTime(new Date());
    SysUser user = mongoTemplate.insert(sysUser);
    return Result.success(user);
}
```

### 修改

```java
@PutMapping
public Result update(@RequestBody SysUser sysUser) {
    // 构建查询条件
    Query query = new Query();
    query.addCriteria(Criteria.where("_id").is(sysUser.getId()));
    Update update = new Update();
    if (StringUtils.isNotEmpty(sysUser.getUsername())) {
        update.set("username", sysUser.getUsername());
    }
    mongoTemplate.updateFirst(query, update, SysUser.class);
    return Result.success();
}
```

### 查询所有

```java
@GetMapping
public Result findAll() {
    List<SysUser> sysUsers = mongoTemplate.findAll(SysUser.class);
    return Result.success(sysUsers);
}
```

### 根据id查询

```java
@GetMapping("/{id}")
public Result findById(@PathVariable String id) {
    SysUser sysUser = mongoTemplate.findById(id, SysUser.class);
    return Result.success(sysUser);
}
```

### 删除

```java
  @DeleteMapping("/{id}")
  public Result delete(@PathVariable String id) {
      mongoTemplate.remove(Query.query(Criteria.where("_id").is(id)), SysUser.class);
      return Result.success();
  }
```

### 模糊分页条件查询

```java
@PostMapping("/list")
@SystemLog("mongo查询系统用户列表")
public Result<PageResult<SysUser>> list(@RequestBody SysUserRequest sysUserRequest) {
    log.info("功能名称：mongo查询系统用户列表，请求路径：【{}】，请求方式：【{}】，请求参数：【{}】", request.getRequestURI(),
            request.getMethod(), JSONObject.toJSONString(sysUserRequest));
    // 封装查询条件
    Query query = new Query();
    if (StringUtils.isNotEmpty(sysUserRequest.getSex())) {
        query.addCriteria(Criteria.where("sex").is(sysUserRequest.getSex()));
    }
    // 根据用户名模糊查询
    if (StringUtils.isNotEmpty(sysUserRequest.getUsername())) {
        Pattern pattern = Pattern.compile("^.*" + sysUserRequest.getUsername() + ".*$");
        query.addCriteria(Criteria.where("username").regex(pattern));
    }
    // 区间
    if (sysUserRequest.getStartTime() != null && sysUserRequest.getEndTime() != null) {
        query.addCriteria(Criteria.where("createTime").gte(sysUserRequest.getStartTime()).lte(sysUserRequest.getEndTime()));
    } else if (sysUserRequest.getStartTime() != null) {
        query.addCriteria(Criteria.where("createTime").gte(sysUserRequest.getStartTime()));
    } else if (sysUserRequest.getEndTime() != null) {
        query.addCriteria(Criteria.where("createTime").lte(sysUserRequest.getEndTime()));
    }
    // 计算总记录数
    long total = mongoTemplate.count(query, SysUser.class);
    // 分页
    // 跳过几条数据
    query.skip((sysUserRequest.getPageNum() - 1) * sysUserRequest.getPageSize());
    // 设置每页记录数
    query.limit(sysUserRequest.getPageSize());
    // 根据创建时间降序
    query.with(Sort.by(Sort.Order.desc("createTime")));
    // 查询操作
    List<SysUser> list = mongoTemplate.find(query, SysUser.class);
    Result<PageResult<SysUser>> result = PageResult.toResult(total, list);
    log.info("功能名称：mongo查询系统用户列表，请求路径：【{}】，请求方式：【{}】，响应结果：【{}】", request.getRequestURI(),
            request.getMethod(), JSONObject.toJSONString(result));
    return result;
}

```

## MongoDB记录日志

### 修改网关微服务添加路由匹配到mongo微服务

```yaml
routes:
  # mongodb
  - id: bawei-mongo
    uri: lb://bawei-mongo
    predicates:
      - Path=/mongo/**
    filters:
      - StripPrefix=1

```

### 添加网关过滤器用来记录日志

```java
/**
 * 自定义过滤器
 */
@Component
@Slf4j
public class AuthFilter implements GlobalFilter, Ordered {

    /**
     * 过滤逻辑
     * @param exchange  请求上下文对象
     * @param chain  过滤器链
     * @return
     */
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 1：通过请求上下文对象 获取请求对象
        ServerHttpRequest request = exchange.getRequest();
        // 2: 获取请求的URI
        String path = request.getURI().getPath();
        // 3: 获取请求的方式
        HttpMethod method = exchange.getRequest().getMethod();
        // 4: 通过log4j记录请求日志
        log.info("请求的路径是：[{}]，请求的方式是：[{}]", path, method);
        return chain.filter(exchange);  // 放行
    }

    /**
     * 定义过滤器的执行顺序，返回值越小执行越靠前
     * @return
     */
    @Override
    public int getOrder() {
        return 0;
    }
}

```

### mongo微服务添加日志记录

```java
@PostMapping("/list")
public Result list(@RequestBody SysUserRequest sysUserRequest) {
    String requestURI = request.getRequestURI();
    String method = request.getMethod();
    String reqJson = JSON.toJSONString(sysUserRequest);
    log.info("本次请求的路径是：[{}]，请求方式是：[{}]，请求参数是：[{}]", requestURI, method, reqJson);
    // 构建查询条件
    Criteria criteria = new Criteria();
    if (StringUtils.isNotEmpty(sysUserRequest.getSex())) {
       criteria.and("sex").is(sysUserRequest.getSex());
    }
    if (StringUtils.isNotEmpty(sysUserRequest.getUsername())) {
        Pattern pattern = Pattern.compile("^.*"+ sysUserRequest.getUsername() +".*$");
        criteria.and("username").regex(pattern);
    }
    if (sysUserRequest.getStart() != null) {
        criteria.and("age").gt(sysUserRequest.getStart());
    }
    if (sysUserRequest.getEnd() != null) {
        criteria.and("age").lt(sysUserRequest.getEnd());
    }
    // 添加查询条件
    Query query = new Query();
    query.addCriteria(criteria);
    // 查询总记录数
    long count = mongoTemplate.count(query, SysUser.class);
    // 分页查询
    // 指定从MongoDB中读取的记录条数
    query.limit(sysUserRequest.getPageSize());
    // 指定跳过指定数量的数据
    query.skip((sysUserRequest.getPageNum() - 1) * sysUserRequest.getPageSize());
    List<SysUser> users = mongoTemplate.find(query, SysUser.class);
    String respJson = JSON.toJSONString(users);
    log.info("本次请求的路径是：[{}]，请求方式是：[{}]，响应数据是：[{}]", requestURI, method, respJson);
    return PageResult.toResult(count, users);
}

```

### 使用AOP全局记录日志

#### 自定义注解@SysLog用来标注需要记录日志的方法

```java
/**
 * 自定义注解 用来标注需要记录日志的方法
 */
@Target(ElementType.METHOD)  // 作用于方法上
@Retention(RetentionPolicy.RUNTIME) //运行时生效
@Document
public @interface SystemLog {

    String value() default "";

}

```

#### 编写日志记录对应的实体类

```java
@Document("sys_log")
@Data
public class SysLog {

    @Id
    private String id;

    /**
     * 请求路径
     */
    private String requestURI;

    /**
     * 请求方式
     */
    private String requestMethod;

    /**
     * 功能描述
     */
    private String functionDesc;

    /**
     * 请求类名
     */
    private String clazzName;

    /**
     * 请求方法名
     */
    private String methodName;

    /**
     * 方法执行时长
     */
    private long requestTime;

    /**
     * 请求参数
     */
    private String reqJson;

    /**
     * 响应参数
     */
    private String respJson;

}

```

#### 编写记录日志业务逻辑层

```java
public interface SysLogService {

    void addLog(SysLog log);

}

@Service
public class SysLogServiceImpl implements SysLogService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void addLog(SysLog log) {
        mongoTemplate.insert(log);
    }
    
}

```

#### 编写AOP全局记录日志

```java
@Component
@Aspect
@Log4j2
public class LogAop {
    @Autowired
    private SysLogService sysLogService;
    @Around("@annotation(sysLog)")
    public Object doLog(ProceedingJoinPoint pjp, SystemLog sysLog) {
        SysLog slog = new SysLog();
        // 1: 获取请求对象
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        // 2: 获取请求方式 请求路径
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        slog.setRequestURI(requestURI);
        slog.setRequestMethod(method);
        // 3：统计方法执行时间
        long s = System.currentTimeMillis();
        Object res = null;
        try {
            res = pjp.proceed();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
        long e = System.currentTimeMillis();
        long requestTime = e- s;
        slog.setRequestTime(requestTime);
        // 4：获取请求的类名方法名
        String name = pjp.getTarget().getClass().getName();
        String methodName = pjp.getSignature().getName();
        slog.setClazzName(name);
        slog.setMethodName(methodName);
        // 5: 获取功能名称
        String value = sysLog.value(); // 功能名称
        slog.setFunctionDesc(value);
        // 6： 请求响应 参数
        Object[] args = pjp.getArgs();
        String reqJson = "";
        String respJson = "";
        if (args.length > 0) {
            // 请求参数
            reqJson = JSON.toJSONString(args[0]);
        }
        if (res != null) {
            respJson = JSON.toJSONString(res);
        }
        slog.setReqJson(reqJson);
        slog.setRespJson(respJson);
        sysLogService.addLog(slog);
        log.info("本次请求的功能是：[{}]，请求路径：[{}]，请求方式：[{}]，类名：[{}]，方法名：[{}]，请求参数：[{}]，响应参数：[{}]，请求时间：[{}]",
                value, requestURI, method, name, methodName, reqJson, respJson, requestTime);
        return res;
    }
}

```



