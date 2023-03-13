---
title: Tomcat学习笔记
typora-root-url: Tomcat学习笔记
tags: Tomcat
abbrlink: 32dc7368
date: 2023-02-25 14:24:00
categories:
permalink:
---



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

 

 