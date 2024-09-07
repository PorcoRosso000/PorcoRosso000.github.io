---
title: 西门子PLC组态基础
typora-root-url: 西门子PLC组态基础
keywords: '组态,西门子'
tags: 西门子PLC组态
categories: 西门子PLC组态
description: 研究西门子PLC组态积木搭建
abbrlink: 8e6eb1e2
date: 2024-08-31 23:08:53
photos:
---

西门子PLC组态基础

<!--more-->

------

## 组态：

“组态(Configure)”的含义是“配置”、“设定”、“设置”等意思，是指用户通过类似“搭积木”的简单方式来完成自己所需要的软件功能，而不需要编写计算机程序，也就是所谓的“组态”。

## 组态积木搭建方式：

### 步进：

使用轴工艺对象进行组态



电机每转的负载位移=电机轴单圈角度 ÷ 减速比

### 伺服：

使用RF120C_1 、CM1241和 modbus_RTU进行组态

目标位置=定位位置 ÷(电机轴单圈角度 ÷ 减速比)x 单圈脉冲当量

### 仓库：

使用modbus_TCP还有 Tcon_ip_v4 进行组态



