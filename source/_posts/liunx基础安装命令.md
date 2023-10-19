---
title: liunx基础安装命令
typora-root-url: liunx基础安装命令
c: 8
abbrlink: 2b8db47c
date: 2023-10-17 16:37:17
tags:
categories:
permalink:
---



## 关闭防火墙

```xml
[root@localhost ~]# systemctl disable firewalld
```

## 安装ll

按照顺序输入

```plain
# 编写
[root@localhost ~]# vi ~/.bashrc
```

![图片](./clip_image002.jpg)

```plain
# 刷新
[root@localhost ~]# source ~/.bashrc
```

## 安装wget

```plain
[root@localhost ~]# yum install -y wget
```

## 安装ifconfig

```plain
[root@localhost ~]# yum install -y net-tools
```

## 安装xinetd

```plain
[root@localhost ~]# yum install -y gcc automake autoconf libtool make
```

## 安装rzrs

```plain
[root@localhost ~]# yum install -y xinetd
```

## 安装unzip

```plain
[root@localhost ~]# yum install -y unzip
```

## 安装service

```plain
[root@localhost ~]# yum install -y initscripts

```

## 安装sudo

```plain
[root@localhost ~]# yum install -y sudo

```

## 安装libaio

```plain
[root@localhost ~]# yum install -y libaio-devel.x86_64

```

## 安装GCC-C++

```powershell
yum -y install gcc
yum -y install gcc-c++

```

## 安装GCC

```plain
[root@localhost ~]# yum install -y centos-release-scl
[root@localhost ~]# yum install -y devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils
[root@localhost ~]# scl enable devtoolset-9 bash
#如果要长期生效的话，执行如下：
[root@localhost ~]# echo "source /opt/rh/devtoolset-9/enable" >>/etc/profile

```

## 安装vim

```plain
[root@localhost ~]# yum install -y vim*

```

## 安装rz

```plain
[root@localhost ~]# yum install lrzsz -y

```

