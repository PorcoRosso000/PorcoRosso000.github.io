---
title: ABB工业机器人学习
typora-root-url: ABB工业机器人学习
keywords: 'ABB,机器人'
tags: ABB
categories: ABB
description: ABB机器人学习
abbrlink: b469a95b
date: 2024-10-30 19:59:17
photos:
---



<!--more-->

------

## ABB机器人编程参数介绍

### 机器人操作法则

**矩形法则**

机器人夹爪使用**双信号**  如果突然断电，夹爪会保持不动

### fine

选fine机器人会走到指定位置

用fine可以预读下一个程序

信号前设置为fine  信号后设置延时

### z50

转弯半径，机器人会走圆角

### noeoffs 

不偏移

### v200  

移动速度

## ABB机器人编程指令

### Set  Reset

Set 指令：设置数字输出信号。

Set 用于将数字输出信号的值设置为 1，即打开数字输出信号

Reset指令：重置数字输出信号。

Reset 用于将数字输出信号的值重置为 0，即关闭数字输出信号

### setdo

SetDO 指令的语法通常是:
SetQ<输出号>,<状态>。
DO数字输出
其中，输出号是指数字输出的编号，状态是指要设置的状态，通常是0或1，分别表示关闭和打开。

### waittime

程序流程指令-WaitTime abb时间单位：s  大多数是毫秒
当前指合只用于机器人等待相应时间后，才执行以后指合,使用参变量[InPos]，机器人及其外轴必须在完全停止的情况下，
才进行等待时间计时,此指合会延长循环时间。

实例：
waitTime 3;
waitTime \InPos ,0 . 5;
waitTime \InPos ,0 ;

### movel的offs功能

偏移指令offs
以选定目标点为基准，沿着选定工件坐标系的X、Y、Z轴方向偏移一定的距离。
movel offs(p1,0,0,5),v10,z5,tool0\wobj=wobj1；

将机器人TCP移动到p1为基准点，沿着wobj1的Z轴正方向偏移5mm。当工件坐标系为默认值wobj0时，偏移指令offs的偏移数据XYZ就相当于大地坐标系。

### movel 

线性移动

### moveabsj

 关节运动

​		控制轴回原点 

### movec

弧形行动  常用于画圆弧