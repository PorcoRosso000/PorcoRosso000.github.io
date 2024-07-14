---
title: docker安装rabbitmq
typora-root-url: docker安装rabbitmq
abbrlink: 8bf81981
date: 2023-10-16 17:08:53
keywords: 'rabbitmq'
tags: rabbitmq
categories: rabbitmq
photos:
description: docker安装rabbitmq
---

docker安装rabbitmq

<!--more-->

------



# 准备工作

```yaml
# 打开docker目录
[root@MuYu ~]# cd /usr/local/docker/
# 创建rabbitmq文件夹
[root@MuYu docker]# mkdir rabbitmq
# 打开rabbitmq文件夹
[root@MuYu docker]# cd rabbitmq/
```

# 挂载目录

```yaml
# 创建挂载目录
[root@MuYu rabbitmq]# mkdir data
```

# 启动脚本

```yaml
# 编写脚本
[root@MuYu rabbitmq]# vim startRabbitMq.sh
```

## 脚本内容

```shell
docker run -d \
-v /usr/local/docker/rabbitmq/data:/var/lib/rabbitmq \
-p 5672:5672 -p 15672:15672 \
--name rabbitmq \
--privileged=true \
--restart=always \
--hostname host rabbitmq:3.9.13-management
```

## 脚本赋权

```yaml
[root@MuYu rabbitmq]# chmod -R 700 startRabbitMq.sh
```

# 启动脚本

```powershell
[root@MuYu rabbitmq]# ./startRabbitMq.sh
Unable to find image 'rabbitmq:3.9.13-management' locally
3.9.13: Pulling from library/rabbitmq
4d32b49e2995: Pull complete 
2108a18330ce: Pull complete 
5c6af9d52173: Pull complete 
0f88690b6c7c: Pull complete 
9531e199a7d9: Pull complete 
efaba55aede6: Pull complete 
41502a4f43bc: Pull complete 
11b60d9df2ff: Pull complete 
ac0763dc13e5: Pull complete 
Digest: sha256:f5c8c7fd99e4c88527276df319556fdcb56e4d289614c5fefda5ee8d17c5ea89
Status: Downloaded newer image for rabbitmq:3.9.13-management
ee7636e3d0baa7df4d5490c99616fef006bceedb08c46d7a2fea5650a6f01429
```



![图片](./clip_image002.gif)

查看结果

![图片](./clip_image004.jpg)

用户名：guest 密码：guest

![图片](./clip_image006.gif)