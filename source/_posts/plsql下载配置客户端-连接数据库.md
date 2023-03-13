---
title: plsql下载配置客户端_连接数据库
typora-root-url: plsql下载配置客户端_连接数据库
tags: oracle
categories: oracle
abbrlink: b6044a20
date: 2023-01-23 16:36:25
permalink:
---



## plsql下载配置客户端_连接数据库

## 一、工具准备

1.Oracle11g_64位
2.PLSQL Developer 11 64位  11
3.instantclient 64

配置中遇到的问题： 

1. error 1723 
   解决：PLSQL 和 instantclient的版本不对应。我的PLSQL 9和instantclient 32位的可以，用PLSQL 11就必须下载instantclient x64的
2. ORA-12504：TNS：监听程序在CONNECT_DATA中未获得SERVICE_NAME 
   解决：我的是在登录的时候数据库名写的未对应配置中的连接名。

## 二、安装（自行安装，网上有很多教程）

1.oracle11g安装

链接: https://pan.baidu.com/s/1zr1UYgGeA11hz1J_E7-tSg?pwd=aih8 提取码: aih8 

2.PLSQL Developer 安装

官网地址:https://www.allroundautomations.com/try-it-free/

如果想下载plsql历史版本，官网上已经没有直接的链接，可以直接访问此链接地址：
https://www.allroundautomations.com/registered-plsqldev/

3.instantclient 

下载Instant Client(轻量级的客户端)，作为本地[Oracle](https://so.csdn.net/so/search?q=Oracle&spm=1001.2101.3001.7020)环境 。这种格式的: 

instantclient-basic-windows.x64-xx.x.x.x.xdbru.zip

http://www.oracle.com/technetwork/database/features/instant-client/index-097480.html 

## 三、常见问题：

1.plsqldev 登录界面没有normal项
2.plsqldev 登录界面的database中没有选项

## 四、问题解决

1.双击plsqldev，点击 “cancel”或 叉叉，进入到主界面，依次点击 Tools --> Preferences…

![20180827212925130](./20180827212925130.png)

找到Oracle Home 和 OCI library选项，其中 Oracle Home填写的是你的instantclient的安装 根 目录， 而OCI library填的是你instantclient下的oci.dll路径。选好后Apply， 关闭，重启plsql，这时你就会发现，登录界面中 有了 normal的选项了。

配置环境变量 

使用   select userenv('language') from dual;  查询当前oracle的字符集,查出的字符集作为变量值配置环境变量

![这里写图片描述](./20170221150403956.png)

```undefined
NLS_LONG
NLS_LANGAMERICAN_AMERICA.AL32UTF8或 SIMPLIFIED CHINESE_CHINA.ZHS16GBK
```

![这里写图片描述](./20170221150419847.png)

```vbnet
TNS_ADMIN
D:\instantclient_11\network\ADMIN
```

2.创建tnsnames.ora

D:\instantclient_11，在instantclient_11下创建instantclient_11\network\ADMIN 这两个文件夹，然后再创建文件tnsnames.ora

2.1修改tnsnames.ora：

```
TEST =
  (DESCRIPTION =
    (ADDRESS_LIST =
      (ADDRESS = (PROTOCOL = TCP)(HOST = 115.28.**.**)(PORT = 1521))
    )
    (CONNECT_DATA =
      (SERVICE_NAME = corcl)
    )
  )
TEST ：连接名，连接数据库的别名，可以自己起。
HOST = 115.28.. ：host后面是数据库地址ip。
SERVICE_NAME ：是数据库名（对应jdbc:oracle:thin:@10...**:1521:corcl）。
```

注意:
	安装好后的默认端口号是1521，数据库实例名是ORCL，由于我安装了两个Oracle数据库（忘记本机装过了），所以端口号和数据库实例名改了一下。所以不需要改动里面的配置哈。如果你看了别的教程修改过了里面的IP地址，端口号什么的话，建议改回来。我就是这样被折腾的

## 五、连接Oracle数据库

用户名：sys
口令：你安装Oracle时输入的口令（我这里的是123456）
数据库：我的是TEST，你的可能是ORCL，根据你安装数据库时创建的实例名。
连接为：以超级管理员（SYSDBA）的身份连接，sys用户连接时规定是这样的，不要问为什么。

![20180827215803490](./20180827215803490.png)

## 六、注意事项

一般我们下载软件都是需要根据自己的系统的位数去下载的，然而64位的PLSQL Developer需要32位的客户端 instantclient才行。

## 七、客户端配置

切换菜单到下拉选的方式(Windows 的经典模式)

![20201120104730880](./20201120104730880.png)

开启表名和字段名的提示

![20210120153449338](./20210120153449338.png)

开启密码存储
第一步

![20210213144814873](./20210213144814873.jpg)

第二步

![20210213144822218](./20210213144822218.jpg)





## 原文链接：

CSDN博主「kmswilliam」 原文链接：https://blog.csdn.net/kmswilliam/article/details/109504145

CSDN博主「诛仙逍遥涧」 原文链接：https://blog.csdn.net/qq_39039017/article/details/82120156

CSDN博主「橙橙鲁」     原文链接：https://blog.csdn.net/Dorothy1224/article/details/56282706

