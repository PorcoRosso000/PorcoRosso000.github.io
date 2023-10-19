---
title: docker安装redis
typora-root-url: docker安装redis
tags: redis
categories: redis
abbrlink: cbab506c
date: 2023-10-17 15:22:21
permalink:
---

## 拉取镜像

```shell
docker pull redis:6.2.6
```

## docker配置redis

使用前下载redis配置文件：[redis.conf](https://uploader.shimo.im/f/GWTjtzHwGe3j3HD0.conf?fileGuid=rqhjpZwZC7Q4TzUJ)

## 基础准备

```shell
# 打开目录
[root@MuYu /]# cd /usr/local/

# 在其目录下创建 docker/redis
[root@MuYu local]# mkdir -p docker/redis

# 进入 docker/redis目录
[root@MuYu local]# cd docker/redis/

# 创建 redis的config和redis的data
[root@MuYu redis]# mkdir config
[root@MuYu redis]# mkdir data

# 上传配置文件到 config目录下面
[root@MuYu redis]# cd config/

# 使用rz上传文件
[root@MuYu config]# rz
[root@MuYu config]# ll
total 92
-rw-r--r-- 1 root root 93724 Oct  4  2021 redis.conf
```

### 修改配置文件

#### 数据存储目录

```shell
# 修改配置文件
dir ./                ->   dir /data
```

![图片](./clip_image002.jpg)

#### IP访问

```shell
bind 127.0.0.1 -::1   ->   bind 0.0.0.0
```

![图片](./clip_image004.jpg)

## 脚本编写

```shell
# 退出目录
[root@MuYu config]# cd ..

# 编辑sh脚本
[root@MuYu redis]# vim startRedis.sh
```

### 脚本内容

```shell
docker run  --privileged=true -p 6379:6379 --name redis --restart=always \
 -v /usr/local/docker/redis/config/redis.conf:/etc/redis/redis.conf \
 -v /usr/local/docker/redis/data:/data \
 -d redis:6.2.6 redis-server /etc/redis/redis.conf
```

![图片](./clip_image006.jpg)

```shell

# 脚本设置可执行权限
[root@MuYu redis]# chmod -R 777 startRedis.sh
```

## 启动redis

```shell
# 运行脚本
[root@MuYu redis]# ./startRedis.sh 
46bc734d227e3a8a1dada5588a2683c1a433fa021488a07cbad510c5410edee3

# 查看docker当中运行的redis
[root@MuYu redis]# docker ps
CONTAINER ID   IMAGE         COMMAND                  CREATED         STATUS         PORTS                                       NAMES
46bc734d227e   redis:6.2.6   "docker-entrypoint.s…"   3 seconds ago   Up 2 seconds   0.0.0.0:6379->6379/tcp, :::6379->6379/tcp   redis
```

## 测试redis

![图片](./clip_image008.gif)

## 一键重置redis脚本

```shell
# 创建sh脚本
[root@MuYu redis]# vim resetRedis.sh
# 编写sh脚本
docker rm -f redis
./startRedis.sh
# 赋权
[root@MuYu redis]# chmod -R 777 resetRedis.sh
# 执行
[root@MuYu redis]# ./resetRedis.sh 
redis
bbb4e496f5b9b98fd61ce21fa4133c401e2a069f326894594adfd472632e13e3
```