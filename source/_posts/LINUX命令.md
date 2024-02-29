---
title: Linux命令
typora-root-url: Linux命令
tags: Linux
categories: Linux
abbrlink: f340ee61
date: 2023-05-26 15:33:58
permalink:
---

### Linux指令

#### 删除文件中的所有内容

```
第一种方式:按esc后，然后使用:1,.d即可删除所有内容
第二种方式:进入文件后直接输入100dd，可以删除100行的数据
```

#### 删除当前目录下的所有文件

```
rm -f *
```

#### 删除当前目录下的所有文件夹

```
rm -rf *
```

#### 删除当前目录下所有类型的文件

```
find . -type f -delete
```

#### 删除指定目录下的文件

```
rm -f <指定目录>
```

#### 删除指定目录下所有类型的文件

```
find <指定目录> -type f -delete
```

#### Linux  查看端口使用情况

```
netstat -tunlp | grep 8030 
```

#### Linux  解压war包

可以用unzip命令

```
unzip project.war -d project 
```

#### 文件上传

```
rz 上传文件
```

#### 虚拟机查看内存 

```
free -m  
```

#### 查看tomcat运行情况

```
ps -ef|grep tomcat   
```

#### 查看所有服务

```
ps x   
```

#### 查看日志 

```
tail -f logs /日志   
```

#### 杀进程 

```
kill -9 pid  
```

#### 启动服务 

```
sh tomcats/tomcat-ywh-ms-8010/bin/startup.sh 
```

#### 删除镜像

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

#### 创建目录

创建多级目录

mkdir -p <目录路径>

例如 mkdir -p mysql/config   就会创建mysql 目录及 config目录

创建单级目录

mkdir <目录名>



#### 防火墙配置

##### 开启防火墙

```
查看防火墙状态 
systemctl status firewalld 
开启防火墙 
systemctl start firewalld   
关闭防火墙 
systemctl stop firewalld
重启防火墙 
service firewalld start  


若遇到无法开启 先用：
systemctl unmask firewalld.service  
然后：
systemctl start firewalld.service
```

##### 查询指定端口是否已开

```
firewall-cmd --query-port=666/tcp
```

##### 防火墙添加端口

```
开放端口保存-添加指定需要开放的端口： 
firewall-cmd --add-port=123/tcp --permanent 
重载入添加的端口： 
firewall-cmd --reload 
查询指定端口是否开启成功： 
firewall-cmd --query-port=123/tcp
```

##### 移除端口-移除指定端口： 

```
firewall-cmd --permanent --remove-port=123/tcp
```

##### 查询开放的防火墙列表

```
firewall-cmd --zone=public --list-ports
若开放了端口还是连接不上你想要的端口，
注意：有可能是你阿里云自带安全组策略限制的原因，这种情况需要在阿里云官方云服务器管理控制台手动开放。
```





### docker指令

#### 实时查看docker容器日志

```
sudo docker logs -f -t --tail 行数 容器名
```

#### 查看docker 版本

```
docker version
```

#### 将可执行权限应用于二进制文件docker-compose

```
sudo chmod +x /usr/local/bin/docker-compose
```



拉取docker镜像

```
docker pull image_name
```

查看宿主机上的镜像，Docker镜像保存在/var/lib/docker目录下:

```
docker images
```

删除镜像

```
docker rmi docker.io/tomcat:7.0.77-jre7 或者 docker rmi b39c68b7af30
```

启动、停止、重启容器命令：

```
docker start container_name/container_id docker stop container_name/container_id docker restart container_name/container_id
```

后台启动一个容器后，如果想进入到这个容器，可以使用attach命令：

```
docker attach container_name/container_id
```

#### 删除容器的命令：

```
docker rm container_name/container_id
```

#### 查看当前系统Docker信息

```
docker info
```

#### 从Docker hub上下载某个镜像:

```
docker pull centos:latest docker pull centos:latest
```

#### 查找Docker Hub上的nginx镜像

```
docker search nginx
```

执行docker pull centos会将Centos这个仓库下面的所有镜像下载到本地repository。

#### 查看所有正在运行容器

```
docker ps 
```

#### 根据容器id停止容器

```
docker stop containerId // containerId 是容器的ID
```

#### 查看所有容器

```
docker ps -a 
```

#### 查看所有容器ID

```
docker ps -a -q 
```

#### start启动所有停止的容器

```
docker start $(docker ps -a -q) 
```

#### stop停止所有容器

```
docker stop $(docker ps -a -q) 
```

#### remove删除所有容器

```
docker rm $(docker ps -a -q) 
```

#### 删除所有的镜像

```
docker rmi $(docker images -q)
```

#### 查看所有容器

```
docker ps -a
```

#### 通过ID删除指定的容器

```
docker rm -f  CONTAINER ID
```

#### WARNING: Published ports are discarded when using host network mode 解决方法

问题：

     docke启动时总是遇见标题中的警告，-p 8889:8888的设置也不起任何作用。

原因：

    docker启动时指定--network=host或-net=host，如果还指定了-p或-P，那这个时候就会有此警告，并且通过-p或-P设置的参数将不会起到任何作用，端口号会以主机端口号为主，重复时则递增。

解决:

    解决的办法就是使用docker的其他网络模式，例如--network=bridge，这样就可以解决问题，

docker的网络模式：

   **bridge模式(默认)**：它的作用是扩展网络和通信手段，在各种传输介质中转发数据信号，扩展网络的距离，同时又有选择地将有地址的信号从一个传输介质发送到另一个传输介质，并能有效地限制两个介质系统中无关紧要的通信。

   **host模式**: 使Docker 容器内的程序看起来像是在主机本身上运行。 它允许容器比它通常可以获得的更大的网络访问权限。

   **none模式**: 一般应用于对安全性要求高并且不需要联网的封闭环境 下的场景，比如某个容器的唯 用途是生成随机密码，就可以放到 none 网络中避免密码被窃取。

   **container模式**：使用时要指定容器名，这种模式可以节约一定的网络资源，并能降低容器间的通信的难度。container网络模式使多个容器共享网络环境，在这种模式下容器可以通过访问localhost来访问 namespace下的其他容器,网络性能高。

   **overlay模式**: 可以按照需求建立不同的虚拟拓扑组网，无需对底层网络作出修改。 通过加密手段可以解决保护私密流量在互联网上的通信。 支持网络切片与网络分段。 将不同的业务分割开来，可以实现网络资源的最优分配。 支持多路径转发。 在Overlay网络中，流量从源传输到目的可通过多条路径，从而实现负载分担，最大化利用线路的带宽。

#### docker-compose 启动当前yml对应的容器

docker-compose up -d

#### docker-compose 如果需要强制重新构建

docker-compose up --force-recreate -d



### 参考文章:

[csdn Tilyp](https://blog.csdn.net/Tilyp) 原文链接：https://blog.csdn.net/tilyp/article/details/103371360

原文链接：https://blog.csdn.net/weixin_45517017/article/details/123618933