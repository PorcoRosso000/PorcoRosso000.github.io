---
title: docker安装ES
typora-root-url: docker安装ES
tags: ES
categories: ES
abbrlink: 921863cb
date: 2023-10-17 15:45:05
permalink:
---

## 准备工作

```powershell
# 打开目录
[root@MuYu docker]# cd /usr/local/docker/
# 创建 es 目录
[root@MuYu docker]# mkdir es
# 打开 es 目录
[root@MuYu docker]# cd es/
```

## 挂载目录

```powershell
# 创建 数据 挂载目录
[root@MuYu es]# mkdir data
# 创建 配置 挂载目录
[root@MuYu es]# mkdir config
# 创建 插件 挂载目录
[root@MuYu es]# mkdir plugins
# 权限赋值
[root@MuYu es]# chmod -R 777 /usr/local/docker/es/
```

### 编辑配置

```powershell
# 打开 config 目录
[root@MuYu es]# cd config/
```

### 编写配置文件

```powershell
# 编写配置文件
[root@MuYu config]# vim elasticsearch.yml
```

### 配置文件内容

```yaml
# 可访问IP
http.host: 0.0.0.0
# 跨域
http.cors.enabled: true
http.cors.allow-origin: "*"
```

## 启动脚本

```powershell
# 打开目录
[root@MuYu es]# cd /usr/local/docker/es
# 编辑脚本
[root@MuYu es]# vim startEs.sh
```

### 脚本内容

```yaml
docker run --name es-7.17.0 \
 --restart=always \
 --privileged=true \
 -p 9200:9200  -p 9300:9300 \
 -e "discovery.type=single-node" \
 -e ES_JAVA_OPTS="-Xms84m -Xmx256m" \
 -v /usr/local/docker/es/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
 -v /usr/local/docker/es/data:/usr/share/elasticsearch/data \
 -v /usr/local/docker/es/plugins:/usr/share/elasticsearch/plugins \
 -d elasticsearch:7.17.0
```

### 脚本赋权

```powershell
[root@MuYu es]# chmod -R 700 startEs.sh
```

## 启动脚本

```powershell
# 执行脚本
[root@MuYu es]# ./startEs.sh

```

## 查看结果

![图片](./clip_image002.gif)

网址请求ip：9200 获得如下信息

![图片](./clip_image004.gif)