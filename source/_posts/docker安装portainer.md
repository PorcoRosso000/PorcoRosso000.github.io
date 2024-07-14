---
title: docker安装portainer
typora-root-url: docker安装portainer
abbrlink: c1fb5e41
date: 2023-10-17 14:56:53
keywords: 'portainer'
tags: portainer
categories: portainer
photos:
description: docker安装portainer
---

docker安装portainer

<!--more-->

------



## 创建文件夹

```shell
# 进入目录
[root@MuYu docker]# cd /usr/local/docker
# 创建文件夹
[root@MuYu docker]# mkdir -p portainer/data
```

## 汉化包

```shell
# 打开目录portainer
[root@localhost docker]# cd portainer/

# 下载汉化包(汉化包已失效,重新找汉化包)
[root@MuYu portainer]# wget https://labx.me/dl/4nat/public.zip
--2022-05-01 23:09:00--  https://labx.me/dl/4nat/public.zip
Resolving labx.me (labx.me)... 43.134.207.90
Connecting to labx.me (labx.me)|43.134.207.90|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1932694 (1.8M) [application/zip]
Saving to: ‘public.zip’

100%[===============================================================================================================================================>] 1,932,694   1.72MB/s   in 1.1s   

2022-05-01 23:09:03 (1.72 MB/s) - ‘public.zip’ saved [1932694/1932694]
# 解压汉化包
[root@MuYu portainer]# unzip public.zip
```

## 下载镜像

```shell
[root@MuYu portainer]# docker pull portainer/portainer
Using default tag: latest
latest: Pulling from portainer/portainer
94cfa856b2b1: Pull complete 
49d59ee0881a: Pull complete 
a2300fd28637: Pull complete 
Digest: sha256:fb45b43738646048a0a0cc74fcee2865b69efde857e710126084ee5de9be0f3f
Status: Downloaded newer image for portainer/portainer:latest
docker.io/portainer/portainer:latest
```

## 启动容器

```shell
# 编写脚本
[root@MuYu portainer]# vim startPortainer.sh
# 编写脚本文件
docker run -d \
 --restart=always \
 --name portainer \
 -p 9000:9000 \
 -v /var/run/docker.sock:/var/run/docker.sock \
 -v /usr/local/docker/portainer/data:/data \
 -v /usr/local/docker/portainer/public:/public \
 portainer/portainer:latest

# 赋值权限
[root@MuYu portainer]# chmod -R 777 startPortainer.sh
# 执行脚本
[root@MuYu portainer]# ./startPortainer.sh 
312623fe0b0192c645250f11e3603fd5f73f91393b22db3988a44fb93fb4dc89
```

## 可视化页面

### 启动页面

![图片](./clip_image002.gif)

### 选择本地

![图片](./clip_image004.gif)

### 管理页面

![图片](./clip_image006.gif)

### 容器页面

![图片](./clip_image008.gif)