---
title: 多Tomcat运行
typora-root-url: 多Tomcat运行
tags: Tomcat
abbrlink: 987b4fa
date: 2023-03-01 07:28:59
categories:
permalink:
---



## 一个系统下同时运行多个tomcat

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

## 一个系统同一个tomcat同时运行多次

使用tomcat9压缩版,环境只需要配置一个,复制在不同的路径下改掉conf/server.xml上述那三处端口号就可以运行