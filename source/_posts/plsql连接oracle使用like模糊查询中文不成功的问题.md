---
title: plsql连接oracle使用like模糊查询中文不成功的问题
typora-root-url: plsql连接oracle使用like模糊查询中文不成功的问题
tags: oracle
categories: oracle
abbrlink: ccde7bb5
date: 2023-01-23 12:41:47
permalink:
---



## plsql连接oracle使用like模糊查询中文不成功的问题

1.执行：select userenv('language') from dual;   
查看oracle服务器的编码集 

2.在你的操作系统下，设置环境变量。
变量名：NLS_LANG，变量值：（第一步的编码集） 

3.打开plsql–首选项–Oracle—连接

①设置Oracle主目录名：D:\softwareRepository\plsql\instantclient_21_8

②设置OCI库：D:\softwareRepository\plsql\instantclient_21_8\oci.dll（对应在你的Oracle客户端地址下）

③应用并重启plsql

重启plsql问题解决。

## 原文链接:

版权声明：本文为CSDN博主「Sun_String」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。原文链接：https://blog.csdn.net/qq_18948889/article/details/81949730