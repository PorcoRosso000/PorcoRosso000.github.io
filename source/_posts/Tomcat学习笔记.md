---
title: Tomcat学习笔记
typora-root-url: Tomcat学习笔记
abbrlink: 32dc7368
date: 2023-02-25 14:24:00
keywords: 'tomcat'
tags: tomcat
categories: tomcat
photos:
description: tomcat学习笔记
---

 tomcat学习笔记

<!--more-->

------



## 1、Tomcat启动、停止

| `首先进入tomcat 所在bin目录 cd  /home/server/Tomcat/bin (需根据个人tomcat目录进入)` |
| ------------------------------------------------------------ |
| `关闭tomcat服务: ./shutdown.sh 或则 sh shutdown.sh　　`      |
| 启动tomcat:  <br />（1）给bin文件夹可执行权限：chmod -R 777 文件目录<br />（2）执行./startup.sh 看不见日志的启动方式 或则 sh startup.sh<br />（3）执行./catalina.sh 可以看见启动日志的启动方式 |

## 2、查看正在运行的Tomcat进程

| （1）ps aux \| grep tomcat |
| -------------------------- |
| （2）ps -ef \| grep tomcat |

## 3、杀死Tomcat进程

| 通过查看运行的Tomcat进程后 可对 进程进行kill |
| -------------------------------------------- |
| kill -9 1234   （kill -9 进程ID）            |

## 4、查看Tomcat占据的端口　　

| netstat -nat  或则 netstat -apn  （查看所有的端口）          |
| ------------------------------------------------------------ |
| netstat -anlp \| grep 12345   或则  netstat -anop \| grep 12345 (根据进程号查看端口号) |
| lsof -i:80   （通过端口号，查看其所属的进程号相关信息）      |

##  5、查看tomcat运行日志

| 先切换到：cd /home/server/Tomcat/logs (需根据个人tomcat目录进入) |
| ------------------------------------------------------------ |
| tail -f catalina.out   (实时查看运行日志)![img](/570408-20181018113638172-1772219512.png) 　　Ctrl+c 是退出tail命令。 |
|                                                              |

## 6.防火墙设置端口

cat /proc/version  Linux 查看当前操作系统版本信息
iptables -L -n  查看当前iptables(防火墙)规则添加指定端口到防火墙中  
iptables -I INPUT -p 协议 --dport 端口号 -j ACCEPT
#iptables -I INPUT -p udp --dport 161 -j ACCEPT
#iptables -I INPUT -p tcp --dport 8080 -j ACCEPT

 

## 7.Tomcat下载地址

官网:https://archive.apache.org/dist/tomcat/

国内快速镜像:https://mirrors.cnnic.cn/apache/tomcat/

 

## 8.一个系统下同时运行多个tomcat

1、配置运行tomcat 首先要配置java的jdk环境，这个就不在谢了 不懂去网上查查，这里主要介绍再jdk环境没配置好的情况下 如何配置运行多个tomcat	

2、第一个tomcat： 找到"我的电脑" 里面的环境变量 ， 添加"CATALINA_HOME"=“E:\apache-tomcat-6.0.29” 这个时候第一个tomcat启动运行是没有问题的	

3、接着开始配置第二个tomcat的：增加环境变量CATALINA_HOME2，值为新的tomcat的地址；
增加环境变量CATALINA_BASE2，值为新的tomcat的地址;	

4、找到第二个tomcat中的startup.bat文件，把里面的CATALINA_HOME改为CATALINA_HOME2

5、找到第二个tomcat中的catalina.bat，把里面的CATALINA_HOME改为CATALINA_HOME2，CATALINA_BASE改为CATALINA_BASE2	

6、找到conf/server.xml文件 修改里面的内容如下(这一步说白了就是修改端口)：
<Server port="8005" shutdown="SHUTDOWN">把端口改为没有是使用的端口，如8006。
<Connector port="8080" protocol="HTTP/1.1" 
connectionTimeout="20000" 
redirectPort="8443" /> 把端口改为没有是使用的端口，如8081。
<Connector port="8009" protocol="AJP/1.3" redirectPort="8443" /> 把端口改为没有是使用的端口，如8090。	

7、启动第二个tomcat，如果上面的配置没问题的话 这个时候是可以运行成功的！

## 9.一个系统同一个tomcat同时运行多次

使用tomcat9压缩版,环境只需要配置一个,复制在不同的路径下改掉conf/server.xml上述那三处端口号就可以运行