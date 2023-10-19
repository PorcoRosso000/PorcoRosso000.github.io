---
title: Liunx安装docker
typora-root-url: Liunx安装docker
tags: docker
categories: docker
abbrlink: 2259f19c
date: 2023-10-17 15:53:02
permalink:
---



## 配置yum国内镜像加速

```powershell
# 1、备份
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
# 2、下载新的CentOS-Base.repo 到/etc/yum.repos.d/
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
# 3、生成缓存
yum makecache
```

## 安装docker运行环境

```powershell
# 由于 Docker 是基于 C 和 C++ 开发的，所以需要先安装相关环境。
yum -y install gcc
yum -y install gcc-c++
```

## 卸载docker

如果之前安装过docker先卸载之前的docker，如果没安装过请忽略这一步

```powershell
yum -y remove docker docker-common docker-selinux docker-engine
```

## 环境准备

根据docker官方的建议，需要先安装一些环境

```powershell
yum install -y yum-utils device-mapper-persistent-data lvm2
```

## 设置镜像仓库

```powershell
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

## 更新yum软件包索引

```powershell
yum makecache fast
```

## 安装docker

```powershell
# 这里的 docker-ce 社区版，docker-ee 企业版
yum -y install docker-ce docker-ce-cli containerd.io
```

## 启动docker

```powershell
# 查看docker状态
systemctl status docker

# 启动docker
systemctl start docker

# 停止docker
systemctl stop docker

# 查看docker版本信息
docker version

# 设置docker容器开机自启
systemctl enable docker
```

## 创建docker的工作目录

```xml
# 打开目录
[root@localhost ~]# cd /usr/local/
# docker的工作空间
[root@localhost local]# mkdir docker
```