---
title: LINUX命令
typora-root-url: LINUX命令
tags: LINUX
categories: LINUX
abbrlink: f340ee61
date: 2023-05-26 15:33:58
permalink:
---



## Linux  查看端口使用情况

netstat -tunlp | grep 8030 

## Linux  解压war包

可以用unzip命令

unzip project.war -d project 

## 文件上传

rz 上传文件

## 虚拟机查看内存 

free -m  

## 查看tomcat运行情况

ps -ef|grep tomcat   

## 查看所有服务

ps x   

## 查看日志 

tail -f logs /日志    

## 杀进程 

kill -9 pid    

## 启动服务 

sh tomcats/tomcat-ywh-ms-8010/bin/startup.sh  
