---
title: 搭建SpringCloudAlibaba
typora-root-url: 搭建SpringCloudAlibaba
abbrlink: 39e58a97
date: 2023-10-16 15:06:59
keywords: 'SpringCloudAlibaba'
tags: SpringCloudAlibaba
categories: SpringCloudAlibaba
photos:
description: 搭建SpringCloudAlibaba
---

搭建SpringCloudAlibaba

<!--more-->

------



**所有项目搭建遵守技术约束：**[技术约束](https://shimo.im/docs/wV3VVOR0dahlmY3y) 

**MySQL****安装：**[docker安装MySQL](https://shimo.im/docs/VMAPV8wpKNCeJjqg) 

**nacos****安装：**[docker安装nacos](https://shimo.im/docs/KrkEVQL4JXIdKKAJ) 

### nacos

#### 配置文件

![图片](./clip_image002.gif)

#### 服务列表

![图片](./clip_image004.gif)

### 确定nacos注册中心

这是我的nacos地址：http://xx.xx.xx.xx:8848/nacos/

![图片](./clip_image006.gif)

共享配置

新建公共配置文件yml格式 application-dev.yml

![图片](./clip_image008.gif)

 

 

```
spring:
  main:
    allow-bean-definition-overriding: true
  autoconfigure:
    exclude: com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceAutoConfigure
 
#请求处理的超时时间
ribbon:
  ReadTimeout: 10000
  ConnectTimeout: 10000

# feign 配置
feign:
  sentinel:
    enabled: true
  okhttp:
    enabled: true
  httpclient:
    enabled: false
  client:
    config:
      default:
        connectTimeout: 10000
        readTimeout: 10000
  compression:
    request:
      enabled: true
    response:
      enabled: true

# 暴露监控端点
management:
  endpoints:
    web:
      exposure:
        include: '*'
```



### 框架搭建

#### 整体项目结构

```
|--project
  |-- gateway
  |-- auth
  |-- common
  |-- modules
    |-- 项目A
    |-- 项目B
  |--pom
```



#### 新建父项目 - xxx

![图片](./clip_image010.gif)

![图片](./clip_image012.gif)

#### 父级pom文件

主要用于规定项目依赖的各个版本，用于进行项目版本约束

```
<!-- 规定SpringBoot版本 -->
<!-- 父级pom文件 主要用于规定项目依赖的各个版本，用于进行项目版本约束 -->
<parent>
    <artifactId>spring-boot-starter-parent</artifactId>
    <groupId>org.springframework.boot</groupId>
    <version>2.6.2</version>
    <relativePath/>
</parent>
<!-- 依赖声明 -->
<dependencyManagement>
    <dependencies>
        <!-- SpringCloud 微服务 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>2021.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <!-- SpringCloud Alibaba 微服务 -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>2021.1</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <!-- Alibaba Nacos 配置 -->
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-client</artifactId>
            <version>2.0.4</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

#### 公共模块 xxx-common

![图片](./clip_image014.gif)

在父级pom当中添加 xxx-common 的依赖

```
<!-- 公共依赖 -->
<dependency>
    <groupId>com.xxx</groupId>
    <artifactId>xxx-common</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

#### pom

```
<dependencies>
    <!-- bootstrap 启动器 -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-bootstrap</artifactId>
    </dependency>

    <!-- SpringCloud Alibaba Nacos -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>

    <!-- SpringCloud Alibaba Nacos Config -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    </dependency>

    <!-- SpringCloud Alibaba Sentinel -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
    </dependency>

    <!-- 负载均衡-->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-loadbalancer</artifactId>
    </dependency>

    <!-- SpringCloud Openfeign -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-openfeign</artifactId>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.9.1</version>

    </dependency>
    <!-- Alibaba Fastjson -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>1.2.80</version>
    </dependency>

    <!-- SpringBoot Boot Redis -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>

    <!-- Druid -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid-spring-boot-starter</artifactId>
        <version>1.2.8</version>
    </dependency>

    <!-- Mysql Connector -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>

    <!-- Mybatis 依赖配置 -->
    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>2.2.2</version>
    </dependency>

    <!-- Pagehelper -->
    <dependency>
        <groupId>com.github.pagehelper</groupId>
        <artifactId>pagehelper-spring-boot-starter</artifactId>
        <version>1.4.1</version>
    </dependency>

    <!-- Hibernate Validator -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Apache Lang3 -->
    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-lang3</artifactId>
    </dependency>

    <!-- lombok依赖 -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
</dependencies>
```

#### 项目结构

```
|--pom
|--src/com/xxx
    |--result 返回结果集
    |--constant 常量
    |--domain 实体对象
      |--request  接受的参数bean
      |--response 返回参数bean
    |--utils工具类    
```

![图片](./clip_image016.gif)

#### 编写类

##### 常量 - constant

###### Constants

```
/**
 * @description: 系统常量
 * @author 
 */
public class Constants {
    /**
     * 成功标记
     */
    public static final Integer SUCCESS = 200;
    public static final String SUCCESS_MSG = "操作成功";
    /**
     * 失败标记
     */
    public static final Integer ERROR = 500;
    public static final String ERROR_MSG = "操作异常";
}
```



###### JwtConstants

```
/**
 * @author 
 * @description: Jwt常量
 */
public class JwtConstants {
    /**
     * 用户ID字段
     */
    public static final String DETAILS_USER_ID = "user_id";
    /**
     * 用户名字段
     */
    public static final String DETAILS_USERNAME = "username";
    
    /**
     * 用户标识
     */
    public static final String USER_KEY = "user_key";
 
    /**
     * 令牌秘钥
     */

    public final static String SECRET = "abcdefghijklmnopqrstuvwxyz";

}
```



###### TokenConstants

```java
/**
 * @author 
 * @description: 令牌常量
 */

public class TokenConstants {
    /**
     * 缓存有效期，默认720（分钟）
     */
    public final static long EXPIRATION = 720;

    /**
     * 缓存刷新时间，默认120（分钟）
     */
    public final static long REFRESH_TIME = 120;

    /**
     * 权限缓存前缀
     */
    public final static String LOGIN_TOKEN_KEY = "login_tokens:";

    /**
     * token标识
     */
    public static final String TOKEN = "token";

}
```



##### 返回结果集 - result

###### Result

```
/**
 * @description: 响应信息主体
 * @author 
 */
@Data
public class Result<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 成功 */
    public static final int SUCCESS = Constants.SUCCESS;
    /** 失败 */
    public static final int FAIL = Constants.ERROR;

    private int code;
    private String msg;
    private T data;

    public static <T> Result<T> success() {
        return restResult(null, SUCCESS, Constants.SUCCESS_MSG);
    }

    public static <T> Result<T> success(T data) {
        return restResult(data, SUCCESS, Constants.SUCCESS_MSG);
    }

    public static <T> Result<T> success(T data, String msg) {
        return restResult(data, SUCCESS, msg);
    }
    public static <T> Result<T> error() {
        return restResult(null, FAIL, Constants.ERROR_MSG);
    }

    public static <T> Result<T> error(String msg) {
        return restResult(null, FAIL, msg);
    }

    public static <T> Result<T> error(T data) {
        return restResult(data, FAIL, Constants.ERROR_MSG);
    }

    public static <T> Result<T> error(T data, String msg) {
        return restResult(data, FAIL, msg);
    }

    public static <T> Result<T> error(int code, String msg) {
        return restResult(null, code, msg);
    }

    private static <T> Result<T> restResult(T data, int code, String msg) {
        Result<T> apiResult = new Result<>();
        apiResult.setCode(code);
        apiResult.setData(data);
        apiResult.setMsg(msg);
        return apiResult;
    }
}
```



###### PageResult

```
/**
 * @author 
 * @description: 列表返回结果集
 */

@Data
public class PageResult<T> implements Serializable {
    /**
     * 总条数
     */
    private long total;

    /**
     * 结果集合
     */
    private List<T> list;

    public PageResult() {
    }

    public PageResult(long total, List<T> list) {
        this.total = total;
        this.list = list;
    }

    public static <T> PageResult<T> toPageResult(long total, List<T> list){
        return new PageResult(total , list);
    }

    public static <T> Result<PageResult<T>> toResult(long total, List<T> list){
        return Result.success(PageResult.toPageResult(total,list));
    }
}
```



##### 工具类 - utils

###### JwtUtils

```
/**
 * @description: Jwt工具类
 * @author 
 */
public class JwtUtils {
    public static String secret = JwtConstants.SECRET;
    /**
     * 从数据声明生成令牌
     *
     * @param claims 数据声明
     * @return 令牌
     */

    public static String createToken(Map<String, Object> claims){
        String token = Jwts.builder().setClaims(claims).signWith(SignatureAlgorithm.HS512, secret).compact();
        return token;
    }

    /**
     * 从令牌中获取数据声明
     *
     * @param token 令牌
     * @return 数据声明
     */

    public static Claims parseToken(String token){
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    }

    /**
     * 根据令牌获取用户标识
     *
     * @param token 令牌
     * @return 用户ID
     */

    public static String getUserKey(String token){
        Claims claims = parseToken(token);
        return getValue(claims, JwtConstants.USER_KEY);
    }

    /**

     * 根据令牌获取用户标识
     *
     * @param claims 身份信息
     * @return 用户ID
     */

    public static String getUserKey(Claims claims){
        return getValue(claims, JwtConstants.USER_KEY);
    }

    /**
     * 根据令牌获取用户ID
     *
     * @param token 令牌
     * @return 用户ID
     */

    public static String getUserId(String token){
        Claims claims = parseToken(token);
        return getValue(claims, JwtConstants.DETAILS_USER_ID);
    }

    /**
     * 根据身份信息获取用户ID
     *
     * @param claims 身份信息
     * @return 用户ID
     */
    public static String getUserId(Claims claims){
        return getValue(claims, JwtConstants.DETAILS_USER_ID);
    }

    /**
     * 根据令牌获取用户名
     *
     * @param token 令牌
     * @return 用户名
     */
    public static String getUserName(String token){
        Claims claims = parseToken(token);
        return getValue(claims, JwtConstants.DETAILS_USERNAME);
    }

    /**
     * 根据身份信息获取用户名
     *
     * @param claims 身份信息
     * @return 用户名
     */
    public static String getUserName(Claims claims){
        return getValue(claims, JwtConstants.DETAILS_USERNAME);
    }

    /**
     * 根据身份信息获取键值
     *
     * @param claims 身份信息
     * @param key 键
     * @return 值
     */

    public static String getValue(Claims claims, String key){
        Object obj = claims.get(key);
        return obj == null ? "" : obj.toString();
    }
}
```



###### StringUtils

```
/**
 * @author 
 * @description: 字符串处理工具类
 */
public class StringUtils extends org.apache.commons.lang3.StringUtils {

    /**
     * * 判断一个对象是否为空
     *
     * @param object Object
     * @return true：为空 false：非空
     */
    public static boolean isNull(Object object) {
        return object == null;
    }


    /**
     *  判断一个Collection是否为空， 包含List，Set，Queue
     *
     * @param coll 要判断的Collection
     * @return true：为空 false：非空
     */
    public static boolean isEmpty(Collection<?> coll) {
        return isNull(coll) || coll.isEmpty();
    }

 

    /**
     * 查找指定字符串是否匹配指定字符串列表中的任意一个字符串
     *
     * @param str 指定字符串
     * @param strs 需要检查的字符串数组
     * @return 是否匹配
     */
    public static boolean matches(String str, List<String> strs) {
        if (isEmpty(str) || isEmpty(strs)) {
            return false;
        }
        for (String pattern : strs) {
            if (isMatch(pattern, str))
            {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断url是否与规则配置:
     * ? 表示单个字符;
     * * 表示一层路径内的任意字符串，不可跨层级;
     * ** 表示任意层路径;
     *
     * @param pattern 匹配规则
     * @param url 需要匹配的url
     * @return
     */

    public static boolean isMatch(String pattern, String url) {
        AntPathMatcher matcher = new AntPathMatcher();
        return matcher.match(pattern, url);
    }
}
```



### 网关模块 xxx-gateway

![图片](./clip_image018.gif)

 

#### pom

```
<dependencies>
    <!-- 公共依赖 -->
    <dependency>
        <groupId>com.xxx</groupId>
        <artifactId>xxx-common</artifactId>
    </dependency>
    <!-- SpringCloud Gateway -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <!-- SpringCloud Alibaba Sentinel Gateway -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-alibaba-sentinel-gateway</artifactId>
    </dependency>
    <!-- 引入阿里巴巴sentinel限流 依赖-->
    <dependency>
        <groupId>com.alibaba.csp</groupId>
        <artifactId>sentinel-spring-cloud-gateway-adapter</artifactId>
    </dependency>
</dependencies>

<build>
    <finalName>${project.artifactId}</finalName>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <executions>
                <execution>
                    <goals>
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```



#### 项目结构

```
|--pom
|--src/com/xxx
    |--constant 常量
    |--utils    工具类    
    |--filter   过滤器
    |--config   配置
```



#### 启动类

```
/**
 * @author 
 * @description: 服务网关启动程序
 * 排除数据源自动配置
 */
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```



#### 编写类

##### 工具类 - utils

###### GatewayUtils

```
/**
 * @author 
 * @description: 网关处理工具类
 */
@Log4j2
public class GatewayUtils {
    /**
     * 添加请求头参数
     * @param mutate 修改对象
     * @param key    键
     * @param value  值
     */
    public static void addHeader(ServerHttpRequest.Builder mutate, String key, Object value) {
        if (StringUtils.isEmpty(key)){
            log.warn("添加请求头参数键不可以为空");
            return;
        }
        if (value == null) {
            log.warn("添加请求头参数：[{}]值为空",key);
            return;
        }
        String valueStr = value.toString();
        mutate.header(key, valueStr);
        log.info("添加请求头参数成功 - 键:[{}] , 值:[{}]", key , value);
    }

    /**
     * 删除请求头参数
     * @param mutate 修改对象
     * @param key    键
     */
    public static void removeHeader(ServerHttpRequest.Builder mutate, String key) {
        if (StringUtils.isEmpty(key)){
            log.warn("删除请求头参数键不可以为空");
            return;
        }
        mutate.headers(httpHeaders -> httpHeaders.remove(key)).build();
        log.info("删除请求头参数 - 键:[{}]",key);
    }

    /**
     * 错误结果响应
     * @param exchange 响应上下文
     * @param msg      响应消息
     * @return
     */
    public static Mono<Void> errorResponse(ServerWebExchange exchange, String msg) {
        ServerHttpResponse response = exchange.getResponse();
        //设置HTTP响应头状态
        response.setStatusCode(HttpStatus.OK);
        //设置HTTP响应头文本格式
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, "application/json");
        //定义响应内容
        Result<?> result = Result.error(msg);
        String resultJson = JSONObject.toJSONString(result);
        log.error("[鉴权异常处理]请求路径:[{}]，异常信息：[{}]，响应结果：[{}]", exchange.getRequest().getPath(), msg, resultJson);
        DataBuffer dataBuffer = response.bufferFactory().wrap(resultJson.getBytes());
        //进行响应
        return response.writeWith(Mono.just(dataBuffer));
    }
 }
```



##### 配置 - config

###### 白名单 - IgnoreWhiteConfig

```
/**
 * @description: 放行白名单配置
 * @author 
 */
@Configuration
@RefreshScope
@ConfigurationProperties(prefix = "ignore")
@Data
@Log4j2
public class IgnoreWhiteConfig {
    /**
     * 放行白名单配置，网关不校验此处的白名单
     */
    private List<String> whites = new ArrayList<>();
    public void setWhites(List<String> whites) {
        log.info("加载网关路径白名单:{}", JSONObject.toJSONString(whites));
        this.whites = whites;
    }
}
```



###### 限流 - GatewaySentinelConfig

```
/**
 * @deprecation: 网关限流控件
 * @author 
 */
@Configuration
public class GatewaySentinelConfig {
    /**
     * 查看解析器
     */
    private final List<ViewResolver> viewResolvers;

    /**
     * 服务器编解码器配置
     */
    private final ServerCodecConfigurer serverCodecConfigurer;
    public GatewaySentinelConfig(ObjectProvider<List<ViewResolver>> viewResolversProvider,
                                 ServerCodecConfigurer serverCodecConfigurer) {
        this.viewResolvers = viewResolversProvider.getIfAvailable(Collections::emptyList);
        this.serverCodecConfigurer = serverCodecConfigurer;
    }

    /**
     * Sentinel 网关块异常处理程序
     * @return
     */
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public SentinelGatewayBlockExceptionHandler sentinelGatewayBlockExceptionHandler() {
        // 给 Spring Cloud Gateway 注册块异常处理程序。
        return new SentinelGatewayBlockExceptionHandler(viewResolvers, serverCodecConfigurer);
    }

 

    /**
     * 初始化网关配置
     */
    @PostConstruct
    public void doInit() {
        initGatewayRules();
    }

    /**
     * 配置限流规则
     */
    private void initGatewayRules() {
        Set<GatewayFlowRule> rules = new HashSet<>();
        rules.add(new GatewayFlowRule("cloud-user")
            // 限流阈值
            .setCount(1)
            // 统计时间窗口，单位是秒，默认是 1 秒
            .setIntervalSec(5)
        );

        //添加到限流规则当中
        GatewayRuleManager.loadRules(rules);
    }
}
```



##### 过滤器 - filter

###### AuthFilter

```
/**
 * @description: 鉴权过滤器
 * @author 
 */
@Component
@Log4j2
public class AuthFilter implements GlobalFilter, Ordered {
    /**
     * redis操作
     */
    private final StringRedisTemplate redisTemplate;

    /**
     * 白名单
     */
    private final IgnoreWhiteConfig ignoreWhite;
    public AuthFilter(StringRedisTemplate redisTemplate, IgnoreWhiteConfig ignoreWhite) {
        this.redisTemplate = redisTemplate;
        this.ignoreWhite = ignoreWhite;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 请求作用域
        ServerHttpRequest request = exchange.getRequest();

        // 请求头
        HttpHeaders headers = request.getHeaders();

        // 请求方式
        HttpMethod method = request.getMethod();

        // header操作对象
        ServerHttpRequest.Builder mutate = request.mutate();
        String uri = request.getURI().getPath();
        log.info("请求日志：uri:[{}] , 请求方式:[{}]", uri, method);

        // 跳过不需要验证的路径
        if (StringUtils.matches(uri, ignoreWhite.getWhites())) {
            return chain.filter(exchange);
        }

        String token = headers.getFirst(TokenConstants.TOKEN);
        if (StringUtils.isEmpty(token)) {
            return GatewayUtils.errorResponse(exchange, "令牌不能为空");
        }

        Claims claims = JwtUtils.parseToken(token);
        if (claims == null) {
            return GatewayUtils.errorResponse(exchange, "令牌已过期或验证不正确！");
        }

        String userKey = JwtUtils.getUserKey(claims);
        boolean isLogin = redisTemplate.hasKey(TokenConstants.LOGIN_TOKEN_KEY + userKey);
        if (!isLogin) {
            return GatewayUtils.errorResponse(exchange, "登录状态已过期");
        }

        String userid = JwtUtils.getUserId(claims);
        String username = JwtUtils.getUserName(claims);

        // 设置用户信息到请求
        GatewayUtils.addHeader(mutate, JwtConstants.USER_KEY, userKey);
        GatewayUtils.addHeader(mutate, JwtConstants.DETAILS_USER_ID, userid);
        GatewayUtils.addHeader(mutate, JwtConstants.DETAILS_USERNAME, username);

        // 内部请求来源参数清除
        GatewayUtils.removeHeader(mutate, TokenConstants.TOKEN);
        return chain.filter(exchange.mutate().request(mutate.build()).build());
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
```



##### 配置文件

###### 本地

![图片](./clip_image020.jpg)

```
# Tomcat
server:
  port: 8080
# Spring
spring:
  application:
    # 应用名称
    name: xxx-gateway
  profiles:
    # 环境配置
    active: dev
  main:
    # 允许使用循环引用
    allow-circular-references: true
    # 允许定义相同的bean对象 去覆盖原有的
    allow-bean-definition-overriding: true
  cloud:
    nacos:
      discovery:
        # 服务注册地址
        server-addr: 47.100.67.180:8848
      config:
        # 配置中心地址
        server-addr: 47.100.67.180:8848
        # 配置文件格式
        file-extension: yml
        # 共享配置
        shared-configs:
          - application-${spring.profiles.active}.${spring.cloud.nacos.config.file-extension}
```



###### nacos

创建nacos配置文件xxx-gateway.yml

![图片](./clip_image022.gif)

内容

```
spring:
  redis:
    host: localhost
    port: 6379
    password: 
  cloud:
    gateway:
      discovery:
        locator:
          lowerCaseServiceId: true
          enabled: true
      routes:
        - id: xxx-system
          uri: lb://xxx-system
          predicates:
            - Path=/system/**
          filters:
            - StripPrefix=1

 

# 不校验白名单
ignore:
  whites:
    - /auth/logout
    - /auth/login
```



### 授权中心 xxx-auth

![图片](./clip_image024.gif)

#### 项目结构

```
|-- pom
|-- src/com/xxx
  |-- controller 控制层
  |-- service    业务层
    |-- impl
    |-- 接口
  |-- utils      工具类
|-- resources
  |-- XXX.yml
```

![图片](./clip_image026.gif)

#### pom

```
<dependencies>
    <!-- 项目公共 依赖 -->
    <dependency>
        <groupId>com.xxx</groupId>
        <artifactId>xxx-common</artifactId>
    </dependency>

    <!-- SpringBoot Web-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```



#### 配置文件

##### 本地

```

```

##### nacos

新建配置文件 xxx-auth-dev.yml

![图片](./clip_image028.gif)

```
spring: 
  redis:
    host: localhost
    port: 6379
    password: 
```



#### 启动类

```
/**
 * @author 
 * @description: 鉴权中心启动类
 */
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@EnableDiscoveryClient
public class AuthApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthApplication.class);
    }
}
```



### 新建 modules

![图片](./clip_image030.gif)

 

删除src

![图片](./clip_image032.gif)

#### 系统模块 xxx-system

![图片](./clip_image034.gif)

删除src

![图片](./clip_image036.gif)

##### 项目结构

```
|--pom
|--remote 服务远程调用
|--common 服务公共包
|--server 服务实例
```



#### 系统公共 xxx-system-common

![图片](./clip_image038.gif)

##### 添加项目约束

![图片](./clip_image040.gif)

 

```
<!-- 系统服务公共 依赖 -->
<dependency>
    <groupId>com.xxx</groupId>
    <artifactId>xxx-system-common</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```



##### 项目结构

```
|--xxx-system-common 服务公共包
  |--src/com/xxx
      |--constant常量
      |--domain 实体类
        |--request 接受的参数bean
        |--response返回参数bean
      |--utils 项目独立工具类      
```

![图片](./clip_image042.gif)

#### 系统实例 xxx-system-server

![图片](./clip_image044.gif)

 

##### 项目结构

```
|--pom
|--server 服务实例
  |--src/com/xxx
      |--controller
      |--service
        |--impl
        接口
      |--mapper
  |--resource
      |--mapper
          |--xxxxMapper.xml
      |--config
          |--xxxConfig.xml
      yml      
```

##### pom

```
<dependencies>

    <!-- 系统公共 依赖 -->
    <dependency>
        <groupId>com.xxx</groupId>
        <artifactId>xxx-system-common</artifactId>
    </dependency>

    <!-- SpringBoot Web-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

</dependencies>
```



##### 配置文件

###### 本地

创建本地配置文件 bootstrap.yml

```
# Tomcat
server:
  port: 9201
# Spring
spring:
  main:
    allow-circular-references: true
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: GMT+8
  application:
    # 应用名称
    name: xxx-system
  profiles:
    # 环境配置
    active: dev
  cloud:
    nacos:
      discovery:
        # 服务注册地址
        server-addr: 47.100.67.180:8848
      config:
        # 配置中心地址
        server-addr: 47.100.67.180:8848
        # 配置文件格式
        file-extension: yml
        # 共享配置
        shared-configs:
          - application-${spring.profiles.active}.${spring.cloud.nacos.config.file-extension}
```

###### nacos

nacos创建配置文件 xxx-system-dev.yml

![图片](./clip_image046.gif)

配置内容

```
# spring配置
spring:
  redis:
    host: localhost
    port: 6379
    password:
  datasource:
    druid:
      stat-view-servlet:
        enabled: true
        loginUsername: xxx
        loginPassword: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/ry-cloud?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
    username: root
    password: root
    type: com.alibaba.druid.pool.DruidDataSource
 
# mybatis配置
mybatis:
  # 搜索指定包别名
  typeAliasesPackage: com.xxx.system
  # 配置mapper的扫描，找到所有的mapper.xml映射文件
  mapperLocations: classpath:mapper/**/*.xml
# 将mapper接口所在包的日志级别改成debug，可以在控制台打印sql

logging:
  level:
    com.bawei.**: debug  
```



###### 启动类

```
/**
 * @author 
 * @description: 系统服务启动类
 */
@SpringBootApplication
@EnableFeignClients( basePackages = {"com.xxx.**"})
@EnableDiscoveryClient
public class SystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(SystemApplication.class);
    }
}
```



#### 系统远程调用 xxx-system-remote

![图片](./clip_image048.gif)

##### 添加项目约束

![图片](./clip_image050.gif)

```
<!-- 添加服务远程调用 依赖 -->
<dependency>
    <groupId>com.xxx</groupId>
    <artifactId>xxx-system-remote</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```



##### 项目结构

```
|--pom
|--xxx-system-remote 服务远程调用
  |--src/com/xxx
    |--remote 远程调用
    |--factory务降级处理
```

![图片](./clip_image052.gif)

##### pom

```
<dependencies>
    <!-- 系统公共 依赖 -->
    <dependency>
        <groupId>com.xxx</groupId>
        <artifactId>xxx-system-common</artifactId>
    </dependency>
</dependencies>
```

### 业务编写

### 注:

​	xxx: 表示随意的名称

### 参考资料:

muyu的笔记资料