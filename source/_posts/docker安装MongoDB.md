---
title: docker安装MongoDB
typora-root-url: docker安装MongoDB
abbrlink: afdec5ed
date: 2023-10-16 16:57:21
keywords: 'MongoDB'
tags: MongoDB
categories: MongoDB
photos:
description: docker安装MongoDB
---

docker安装MongoDB

<!--more-->

------



# 准备工作

```powershell
# 打开目录
[root@MuYu docker]# cd /usr/local/docker/
# 创建 mongodb 文件夹
[root@MuYu docker]# mkdir mongodb
# 打开 mongodb 文件夹
[root@MuYu docker]# cd mongodb/
```

# 挂载目录

```powershell
# 数据挂在目录
[root@MuYu mongodb]# mkdir data
```

# 启动脚本

```powershell
# 编写脚本
[root@MuYu mongodb]# vim startMongodb.sh
```

## 脚本内容

```shell
docker run -d \
--name mongodb-4.0.28 \
--restart=always \
-v /usr/local/docker/mongodb/data:/data/db \
-p 27017:27017 mongo:4.0.28
```

## 脚本赋权

```powershell
[root@MuYu mongodb]# chmod -R 700 startMongodb.sh
```

# 启动脚本

```powershell
[root@MuYu mongodb]# ./startMongodb.sh 
Unable to find image 'mongo:4.0.28' locally
4.0.28: Pulling from library/mongo
58690f9b18fc: Pull complete 
b51569e7c507: Pull complete 
da8ef40b9eca: Pull complete 
fb15d46c38dc: Pull complete 
8c5b4403b3cc: Pull complete 
a336ecd37208: Pull complete 
12c733cd45a4: Pull complete 
0500d06255ed: Pull complete 
94973a063374: Pull complete 
6311dd69caf7: Pull complete 
b40f828abab8: Pull complete 
8379d13e9da6: Pull complete 
12fa2eef4452: Pull complete 
Digest: sha256:d22f53e7aa6851a62f28bff4061176ceaa90ca8dfd025067dfb5db84a60eb0cc
Status: Downloaded newer image for mongo:4.0.28
e557fd76e2b1dcada82ad2f63ed29bcddb5e748d56d5e98e5379f4d8384109ac
```

# 查看结果

![图片](./clip_image002.gif)

 

![图片](./clip_image004.gif)