---
title: Canal
typora-root-url: Canal
tags: Canal
categories: Canal
abbrlink: 2040d45d
date: 2023-07-04 23:33:18
permalink:
---



### 什么是Canal？

canal是阿里开源的中间件，主要用于同步mysql数据库变更；

### Canal数据库监听的原理是什么？

canal可以用来监听数据库的变化，从而获得新增数据，或者修改的数据；
Canal的同步机制：

![20200210163638624](./20200210163638624.png)

### 为什么使用Canal？

(1). 更灵活的架构，多机房同步比较简单。
(2). 异构表之间也可以同步，同时可以控制不同步DDL以免出现数据丢失和不一致。
(3). Canal可以实现一个表一线程，多个表多线程的同步，速度更快。同时会压缩简化要传输的binlog，减少网络压力。
(4). 双A机房同步. 目前mysql的M-M部署结构，不支持解决数据的一致性问题，基于canal的双向复制+一致性算法，可一定程度上解决这个问题，实现双A机房；

### 同步原理：

1.canal模拟mysql sllave的交互协议，伪装自己为mysql salve；
2.mysql master收到dump请求，开始推送binary log给 slave（也就是canal）；
3.canal解析binary log 对象（原始byte流）；

### canal在项目中主要做什么事情？

主要用于数据增量同步操作，可以将数据同步到Redis，其他Mysql，ES等；
可以首页广告缓存，网站公布，商品数据，击穿缓存更新，商品数据缓存更新，ES（索引库数据增量更新）；



### 参考文献:

「d  nn y@1」原文链接：https://blog.csdn.net/mrDyang/article/details/104250049