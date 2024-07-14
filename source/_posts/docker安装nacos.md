---
title: docker安装nacos
typora-root-url: docker安装nacos
abbrlink: b2cc0cbb
date: 2023-10-17 15:04:42
keywords: 'nacos'
tags: nacos
categories: nacos
photos:
description: docker安装nacos
---

docker安装nacos

<!--more-->

------



## 准备工作

```json
# 打开目录 
[root@MuYu ~]# cd /usr/local/docker/
# 创建nacos文件夹
[root@MuYu docker]# mkdir nacos
# 打开目录
[root@MuYu docker]# cd nacos/
# 创建文件夹 config
[root@MuYu docker]# mkdir config
# 打开文件夹
[root@MuYu docker]# cd config/
```

### 上传配置文件

```json
[root@MuYu docker]# 
```

[application.properties](https://uploader.shimo.im/f/RWKJhIXk8JB444Hi.properties?fileGuid=lL9WvLiIYusV3jIJ)

#### 修改配置文件

```powershell
[root@MuYu config]# vim application.properties
```

![图片](./clip_image002.jpg)

```powershell
# 连接类型
spring.datasource.platform=mysql
db.num=1
# 连接地址
db.url.0=jdbc:mysql://IP:端口/数据库名称?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&serverTimezone=UTC
# 数据库用户名
db.user=root
# 数据库密码
db.password=Dongzl828..
```

## 初始化数据库

在nacos需要连接的数据库当中，创建数据库 nacos_config 字符集类型为 utf8mb4

![图片](./clip_image004.gif)

## SQL脚本

[nacos-mysql.sql](https://uploader.shimo.im/f/GAM432RosXNTiQcB.sql?fileGuid=ZzkLM4NQv4CyoeAQ)

## 导入SQL脚本

![图片](./clip_image006.gif)

## 导入完成

![图片](./clip_image008.gif)

## 下载nacos镜像

```json
[root@MuYu nacos]# docker pull nacos/nacos-server:v2.0.4
```

## 编写脚本

```json
# 根目录
[root@MuYu config]# cd ../
# 编写脚本
[root@MuYu nacos]# vim startNacos.sh
```

## 脚本内容

```json
docker run -d \
--privileged=true \
--restart=always \
--name nacos-8848 \
--network host \
-e MODE=standalone \
-e JVM_XMS=256m \
-e JVM_XMX=256m \
-e JVM_XMN=256m \
-p 8848:8848 \
-p 9848:9848 \
-v /usr/local/docker/nacos/config/application.properties:/home/nacos/conf/application.properties \
nacos/nacos-server:v2.0.4
```

## nacos/nacos-server:v2.0.4启动脚本

```powershell
# 权限
[root@MuYu nacos]# chmod -R 777 startNacos.sh
# 启动
[root@MuYu nacos]# ./startNacos.sh
```

## 验证

![图片](./clip_image010.gif)

查看容器日志命令：

docker logs -f -t --tail -f 容器名|id

