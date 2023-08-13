---
title: Linux命令
typora-root-url: Linux命令
tags: Linux
categories: Linux
abbrlink: f340ee61
date: 2023-05-26 15:33:58
permalink:
---



### Linux  查看端口使用情况

netstat -tunlp | grep 8030 

### Linux  解压war包

可以用unzip命令

unzip project.war -d project 

### 文件上传

rz 上传文件

### 虚拟机查看内存 

free -m  

### 查看tomcat运行情况

ps -ef|grep tomcat   

### 查看所有服务

ps x   

### 查看日志 

tail -f logs /日志   

#### docker 查看日志 

实时查看docker容器日志
sudo docker logs -f -t --tail 行数 容器名

### 杀进程 

kill -9 pid    

### 启动服务 

sh tomcats/tomcat-ywh-ms-8010/bin/startup.sh  

### 删除镜像

1.执行 **docker stop $(docker ps -a -q)** 用来中止中止全部的container

2.**docker images** 查看镜像列表

3.**docker rmi 147051a21fd9** 删除IMAGE_ID = 147051a21fd9 的镜像
4.**docker images**再次查看镜像列表，发现被删除

5.查看一下全部的镜像文件，**docker images -a**

6.删除失败的情况下执行

```
报错: Error response fro daemon: conflict: unable to delete c218b729bf73 (must be forced) - image is being used by stoped container 945acebbca0f

docker ps -a | grep "Exited" | awk '{print $1 }'|xargs docker stop
docker ps -a | grep "Exited" | awk '{print $1 }'|xargs docker rm
docker images|grep none|awk '{print $3 }'|xargs docker rmi

上述命令 还解决了我在删除镜像文件时的一个报错：Error response from daemon: conflict: unable to delete 0138793f7e1f (cannot be forced) - image has dependent child images
```

