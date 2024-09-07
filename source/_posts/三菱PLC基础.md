---
title: 三菱PLC基础
typora-root-url: 三菱PLC基础
keywords: '三菱,PLC'
tags: PLC
categories: PLC
photos: PLC
description: 三菱PLC基础
abbrlink: 4e3bb898
date: 2024-08-28 10:21:00
---

三菱PLC基础

<!--more-->

------

## 软件安装：

GX Work2

GX Work3

### 软件安装错误解决

#### GX Works2 存储器空间或桌面堆栈不足或安装GX Works3显示没有文件夹权限 解决方案

安装好GX Work2之后  继续安装GX Work3 安装好就可以解决 

原因：之前安装GX Work3卸载过



### 电脑COM口被占用的超简单解决方法

打开注册表 win+r 再输入regedit 即可打开注册表

在注册表中打开
HKEY_LOCAL_MACHINE
/SYSTEM
/CurrentControlSet
/Control
/COM Name Arbiter

点开就可以看到com db删掉就好



