---
title: java运行环境JDK
typora-root-url: java运行环境JDK
abbrlink: a90fd208
date: 2023-06-03 20:11:54
keywords: 'jdk'
tags: jdk
categories: jdk
photos:
description: java运行环境JDK
---

java运行环境JDK

<!--more-->

------



### jdk更换版本  

直接去修改系统变量JAVA_HOME的话会发现不起作用

原因是安装JDK1.8版本时，会在C:\ProgramData\Oracle\Java目录中生成一些配置文件，并同时将此目录写到环境变量中的Path中，所以我们应该去把系统变量Path中的C:\ProgramData\Oracle\Java\javapath删除了，这样问题就解决了！ 

JAVA_HOME
%JAVA_HOME7%

CLASSPATH
.;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar; 

JAVA_HOME7
D:\Program Files\job\Java\jdk1.7.0_67 JAVA_HOME8D:\Program Files\job\java_1.8\jdk 

Path
%JAVA_HOME%\bin;
%JAVA_HOME%\jre\bin; 

用于切换的版本的配置JAVA_HOME：如需切换到8只需要修改为“%JAVA_HOME8%”即可



### java运行时的编译问题

java.lang.ClassNotFoundException: com.hundsun.exchange.delivery.constant.util.ServiceExcepiton
解决方式：1.maven clean compile 2.找到包在哪个类然后删除target   3.右击包名->maven->reload project 4.点小锤子编译 

### 打war包

vn clean install -DskipTests