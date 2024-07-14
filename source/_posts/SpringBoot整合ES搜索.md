---
title: SpringBoot整合ES搜索
typora-root-url: SpringBoot整合ES搜索
abbrlink: dc2aa829
date: 2023-10-18 09:46:15
keywords: 'es'
tags: es
categories: es
photos:
description: SpringBoot整合ES搜索
---

SpringBoot整合ES搜索

<!--more-->

------



## 创建索引

```yaml
# 创建文章索引
PUT article
{
  "mappings": {
    "properties": {
      "title":{
        "type": "text",
        "analyzer": "ik_smart",
        "search_analyzer": "ik_smart"
      },
      "author": {
        "type": "keyword"
      },
      "type": {
        "type": "keyword"
      },
      "address": {
        "type": "text",
        "analyzer": "ik_max_word",
        "search_analyzer": "ik_max_word"
      },
      "price":{
        "type": "double"
      },
      "createTime":{
        "type": "long"
      }
    }
  }
}
```

## ES依赖

```xml
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
</dependency>
```

## 初始化ES

```java
// 构建 ES 高级客户端
private final RestHighLevelClient client;
public ArticleController(HttpServletRequest request) {
    client = new RestHighLevelClient(
            RestClient.builder(
                    new HttpHost("192.168.23.129", 9200, "http")));
    log.info("初始化ES：IP地址：【192.168.23.129】，端口：【9200】");
} 
```

## 构建实体类

```java
@Data
public class Article {

    /**
     * 主键
     */
    private String id;
    /**
     * 文章标题
     */
    private String title;
    /**
     * 作者
     */
    private String author;
    /**
     *  地址
     */
    private String address;
    /**
     * 文章类型
     */
    private String type;
    /**
     * 创建时间
     */
    private Date createTime;
    /**
     * 价格
     */
    private Double price;
}
```

## 新增数据/修改

```java
    @PostMapping
    public Result add(@RequestBody Article article) {
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        log.info("功能名称：【{}】，请求路径：【{}】，请求方式【{}】，请求参数：【{}】", "添加文章", requestURI, method, JSON.toJSONString(article));
        // 添加
        try {
            // 1: 创建索引请求对象传入索引名
            IndexRequest request = new IndexRequest(INDEX_NAME);
            // 2：设置 数据
            article.setCreateTime(new Date());
            // id
            if (StringUtils.isEmpty(article.getId())) {  // 添加
                request.id(UUID.randomUUID().toString().replace("_", ""));
            } else {  // 修改
                request.id(article.getId());
            }
            request.source(JSON.toJSONString(article), XContentType.JSON)  
            // 3: 发送请求
            IndexResponse response = client.index(request, RequestOptions.DEFAULT);
            log.info("添加文章,响应结果：【{}】", JSON.toJSONString(response));
        } catch (IOException e) {
            log.error(e);
//            e.printStackTrace();
        }
        Result result = Result.success();
        log.info("功能名称：【{}】，请求路径：【{}】，请求方式【{}】，响应结果：【{}】", "添加文章", requestURI, method, JSON.toJSONString(result));
        return result;
    }
```

## 删除数据

```java
@DeleteMapping("/{id}")
public Result deleteById(@PathVariable String id) {
    String requestURI = request.getRequestURI();
    String method = request.getMethod();
    log.info("功能名称：【{}】，请求路径：【{}】，请求方式【{}】，请求参数：【{}】", "根据ID删除文章", requestURI, method, id);
    try {
        // 1： 创建 删除请求对象
        DeleteRequest deleteRequest = new DeleteRequest(INDEX_NAME, id);
        // 2； 发送
        DeleteResponse response = client.delete(deleteRequest, RequestOptions.DEFAULT);
        log.info("删除ID为【{}】的文章,响应结果：【{}】", id, JSON.toJSONString(response));
    } catch (Exception ex) {
        log.error(ex);
    }
    Result result = Result.success();
    log.info("功能名称：【{}】，请求路径：【{}】，请求方式【{}】，响应结果：【{}】", "根据ID删除文章", requestURI, method, JSON.toJSONString(result));
    return result;
}

```

## 查询单条数据

```java
@GetMapping("/{id}")
public Result<Article> findOneById(@PathVariable String id) {
    String requestURI = request.getRequestURI();
    String method = request.getMethod();
    log.info("功能名称：【{}】，请求路径：【{}】，请求方式【{}】，请求参数：【{}】", "根据ID查询文章", requestURI, method, id);
    try {
        // 1: 创建查询对象
        GetRequest getRequest = new GetRequest(INDEX_NAME, id);
        // 2: 发送请求进行查询
        GetResponse response = client.get(getRequest, RequestOptions.DEFAULT);
        // 3: 解析查询响应结果
        if (response.isExists()) {
            // 存在 查询到了
            String respJson = response.getSourceAsString();  // JSON结果
            Article article = JSONObject.parseObject(respJson, Article.class);
            // 设置 id
            article.setId(id);
            Result<Article> result = Result.success(article);
            log.info("功能名称：【{}】，请求路径：【{}】，请求方式【{}】，响应结果：【{}】", "根据ID查询文章", requestURI, method, JSON.toJSONString(result));
            return result;
        } else {
            // 没有查询到
            return Result.error("没有查询到");
        }
    } catch(Exception ex) {
        log.error("根据id查询文章出现异常，异常信息是【{}】", ex);
    }
    return null;
}
```

## 搜索查询参数对象

```java
@Data
public class ArticleRequest {
    /**
     * 标题
      */
    private String title;
    /**
     * 类型
     */
    private String type;
    /**
     * 地址
     */
    private String address;
    /**
     * 价格区间
     */
    private Double startPrice;
    /**
     * 价格区间
     */
    private Double endPrice;
    /**
     * 时间区间
     */
    private String startTime;
    /**
     * 时间区间
     */
    private String endTime;
    /**
     * 页码
     */
    private Integer pageNum = 1;
    /**
     * 每页记录数
     */
    private Integer pageSize = 2;
}
```

## 搜索查询

```java
@PostMapping("/search")
public Result<PageResult<Article>> search(@RequestBody ArticleRequest articleRequest) {
    String requestURI = request.getRequestURI();
    String method = request.getMethod();
    log.info("功能名称：【{}】，请求路径：【{}】，请求方式【{}】，请求参数：【{}】", "文章搜索", requestURI, method, JSON.toJSONString(articleRequest));
    // 先定义返回结果
    long total = 0; // 总记录数
    List<Article> list = new ArrayList<>(); // 结果集
    // 发送请求
    try {
        // 1: 创建搜索请求对象
        SearchRequest searchRequest = new SearchRequest(INDEX_NAME);
        // 2: 搜索载体
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        // 3: 构建拼接查询条件对象
        BoolQueryBuilder bqb = QueryBuilders.boolQuery();
        // 4: 判断搜索条件   标题
        if (StringUtils.isNotEmpty(articleRequest.getTitle())) {
            MatchQueryBuilder mb = QueryBuilders.matchQuery("title", articleRequest.getTitle());
            bqb.must(mb);
        }
        // 作者
        if (StringUtils.isNotEmpty(articleRequest.getAuthor())) {
            MatchQueryBuilder mb = QueryBuilders.matchQuery("author", articleRequest.getAuthor());
            bqb.must(mb);
        }
        // 地址
        if (StringUtils.isNotEmpty(articleRequest.getAddress())) {
            MatchQueryBuilder mb = QueryBuilders.matchQuery("address", articleRequest.getAddress());
            bqb.must(mb);
        }
        // 时间区间
        if (articleRequest.getStartTime() != null) {
            RangeQueryBuilder rangeQueryBuilder =  QueryBuilders.rangeQuery("createTime").gte(articleRequest.getStartTime().getTime());
            bqb.must(rangeQueryBuilder);
        }
        if (articleRequest.getEndTime() != null) {
            RangeQueryBuilder rangeQueryBuilder = QueryBuilders.rangeQuery("createTime").lte(articleRequest.getEndTime().getTime());
            bqb.must(rangeQueryBuilder);
        }
        // 放入 查询条件
        searchSourceBuilder.query(bqb);
        // 分页
        searchSourceBuilder.from((articleRequest.getPageNum() - 1) * articleRequest.getPageSize());
        searchSourceBuilder.size(articleRequest.getPageSize());
        // 排序
        searchSourceBuilder.sort("createTime", SortOrder.DESC);
        searchRequest.source(searchSourceBuilder);
        SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
        // 获取结果 【命中】
        SearchHits hits = response.getHits();
        // 获取总记录数
        total = hits.getTotalHits().value;
        // 获取结果
        SearchHit[] getHits = hits.getHits();
        for (SearchHit hit : getHits) {
            String articleJson = hit.getSourceAsString();
            // 转换成Article
            Article article = JSONObject.parseObject(articleJson, Article.class);
            article.setId(hit.getId());  // 单独设置ID
            // 将 文章对象 添加到  结果集
            list.add(article);
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
    Result<PageResult<Article>> result = PageResult.toResult(total, list);
    log.info("功能名称：【{}】，请求路径：【{}】，请求方式【{}】，响应结果：【{}】", "文章搜索", requestURI, method, JSON.toJSONString(result));
    return result;
}
```

```java
// 高亮
HighlightBuilder highlightBuilder = new HighlightBuilder();
highlightBuilder.field("goodsName");
highlightBuilder.preTags("<span style=\"color:red\">");
highlightBuilder.postTags("</span>");
searchSourceBuilder.highlighter(highlightBuilder);
```

```java
// 设置高亮  原字段 替换成 高亮字段
Map<String, HighlightField> highlightFields = hit.getHighlightFields();
if (highlightFields != null) {
    HighlightField highlightField = highlightFields.get("goodsName");
    if (highlightField != null) {
        Text[] fragments = highlightField.getFragments();
        String str = "";
        for (Text fragment : fragments) {
            str += fragment;
        }
        goodsResponse.setGoodsName(str);
    }
}
```



## es基本操作

### 索引操作

#### 新增索引

```plain
PUT 索引名
{
  "settings": {
    "index": {
      "number_of_shards": "3",
      "number_of_replicas": "0"
    }
  }
}
```

#### 删除索引

```plain
DELETE 索引名
```

#### 设置索引mapping

```plain
PUT 索引名/_doc/_mapping?include_type_name=true
{
  "properties": {
    "id": {
      "type": "keyword"
    },
    "name": {
      "type": "text"
    },
    "age": {
      "type": "integer"
    },
    "sal": {
      "type": "double"
    },
    "create_time": {
      "type": "integer"
    }
  }
}
```

### 数据操作

#### 新增

```plain
指定ID插入
PUT user_info/_doc/1
{
	"name":"wei",
	"sal":"188.68",
	"age":28,
	"create_time":"1647911799000"
}

自动ID插入
POST user_info/_doc/
{
	"name":"wei",
	"sal":"188.68",
	"age":28,
	"create_time":"1647911799000"
}
```

#### 删除

```plain
#DELETE /索引/文档类型/文档id
```

### 查询操作

#### 简单查询

```plain
GET user_info/_search
{
  "query": {
    "match": {
      "name": {
        "query": "张三"
      }
    }
  }
}
```



