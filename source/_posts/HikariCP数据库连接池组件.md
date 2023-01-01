---
title: HikariCP数据库连接池组件
typora-root-url: HikariCP数据库连接池组件
date: 2022-12-03 17:00:50
tags:
permalink:
---

## HikariCP数据库连接池组件

## 什么是连接池

数据库连接池负责分配、管理和释放数据库的连接。

数据库连接复用：重复使用现有的数据库长连接，可以避免连接频繁建立、关闭的开销。
统一的连接管理：释放空闲时间超过最大空闲时间的数据库连接，避免因为没有释放数据库连接而引起的数据库连接泄漏。

## 什么是HikariCP

HikariCP 是一个高性能的 JDBC 连接池组件，号称**性能最好**的后起之秀，是一个基于BoneCP做了不少的改进和优化的高性能JDBC连接池。

其作者还有产出了另外一个开源作品HikariJSON——高性能的JSON解析器。

代码体积更是少的可怜，130kb。Spring Boot 2都已经宣布支持了该组件，由之前的Tomcat换成HikariCP。

其性能远高于c3p0、tomcat等连接池，以致后来BoneCP作者都放弃了维护，在Github项目主页推荐大家使用HikariCP

### 上边说到是在BoneCP基础上做了优化，那做了哪些优化呢？

字节码精简 ：优化代码（HikariCP利用了一个第三方的Java字节码修改类库Javassist来生成委托实现动态代理，动态代理的实现在ProxyFactory类），直到编译后的字节码最少，这样，CPU缓存可以加载更多的程序代码；
优化代理和拦截器：减少代码，例如HikariCP的Statement proxy只有100行代码，只有BoneCP的十分之一；
自定义数组类型（FastStatementList）代替ArrayList：避免每次get()调用都要进行range check，避免调用remove()时的从头到尾的扫描，相对与ArrayList极大地提升了性能，而其中的区别是，ArrayList在每次执行get(Index)方法时，都需要对List的范围进行检查，而FastStatementList不需要，在能确保范围的合法性的情况下，可以省去范围检查的开销。
自定义集合类型（ConcurrentBag）：支持快速插入和删除，特别是在同一线程既添加又删除项时，提高并发读写的效率；
针对CPU的时间片算法进行优化：尽可能在一个时间片里面完成各种操作（具体机制比较模糊）。
针对连接中断的情况：比其他CP响应时间上有了极好的优化，响应时间为5S，会抛出SqlException异常，并且后续的getConnection()可以正常进行
关于Connection的操作：另外在Java代码中，很多都是在使用完之后直接关闭连接，以前都是从头到尾遍历，来关闭对应的Connection，而HikariCP则是从尾部对Connection集合进行扫描，整体上来说，从尾部开始的性能更好一些。

### HikariCP 的使用

#### 重要参数

maximum-pool-size   池中最大连接数（包括空闲和正在使用的连接）
minimum-idle   池中最小空闲连接数量。默认值10
pool-name   连接池的名字
auto-commit   是否自动提交池中返回的连接。默认值为true。
idle-timeout    空闲时间。仅在minimum-idle小于maximum-poop-size的时候才会起作用。默认值10分钟。
max-lifetime   连接池中连接的最大生命周期。当连接一致处于闲置状态时，数据库可能会主动断开连接。
connection-timeout   连接超时时间。默认值为30s，可以接收的最小超时时间为250ms。但是连接池请求也可以自定义超时时间

#
#### 配置数据源相关    使用 HikariCP 数据源
#
############################################################

#等待连接池分配连接的最大时长（毫秒），超过这个时长还没可用的连接则发生SQLException， 默认:30秒

spring.datasource.hikari.connection-timeout=30000

#最小连接数

spring.datasource.hikari.minimum-idle=5

#最大连接数

spring.datasource.hikari.maximum-pool-size=15

#自动提交

spring.datasource.hikari.auto-commit=true

#一个连接idle状态的最大时长（毫秒），超时则被释放（retired），默认:10分钟

spring.datasource.hikari.idle-timeout=600000

#连接池名字

spring.datasource.hikari.pool-name=DatebookHikariCP

#一个连接的生命时长（毫秒），超时而且没被使用则被释放（retired），默认:30分钟 1800000ms，建议设置比数据库超时时长少60秒，#参考MySQL wait_timeout参数（show variables like '%timeout%';） -->

spring.datasource.hikari.max-lifetime=28740000
spring.datasource.hikari.connection-test-query=SELECT 1

#注意：如果配置不当，数据库连接池也可能因影响到系统性能

#### Maven依赖

```java

 <!--mysql-->
            <dependency>
                <groupId>com.zaxxer</groupId>
                <artifactId>HikariCP</artifactId>
                <version>${hikaricp.version}</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-jdbc</artifactId>
                <exclusions>
                    <!-- 排除 tomcat-jdbc 以使用 HikariCP -->
                    <exclusion>
                        <groupId>org.apache.tomcat</groupId>
                        <artifactId>tomcat-jdbc</artifactId>
                    </exclusion>
                </exclusions>
            </dependency>
            <dependency>
                <groupId>mysql</groupId>
                <artifactId>mysql-connector-java</artifactId>
                <version>${mysql.version}</version>
            </dependency>
```



### 支持数据库

支持多种常见的数据库（包含但不限于）：

Oracle、MS SQL Server、MySQL、PostgreSQL
