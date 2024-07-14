---
title: svn学习
typora-root-url: svn学习
abbrlink: 75951dbb
date: 2023-10-08 21:12:12
keywords: 'svn'
tags: svn
categories: svn
photos:
description: svn学习
---

svn学习

<!--more-->

------



### idea 中使用svn步骤

svn安装的时候需要注意
1.更换下安装路径(如果你的C盘足够大,可以不进行更换)

2. 在command line client tools下拉框中选择
will be installed on local hard drive,否则安装完之后在bin目录下找不到svn.exe,就没办法在idea中进行svn的相关配置.

配置过程:

https://blog.csdn.net/weixin_49343190/article/details/112519073

### SVN 回滚（撤回）提交的代码

一、
TortoiseSVN -> Show log

![20171113115805795](./20171113115805795.png)

二、
注意：步骤二只是让你本地的代码回滚（撤回）到你未提交前的一个版本，并不会更新到SVN服务器上，也就是说你的同事依然能更新到你错误提交的代码。

右键点击你想撤回的提交 -> Revert changes from this revision

![20171113115805795](./20171113122041058.png)

或者
右键点击你想撤回提交的前一个提交 -> Revert to this version  

![20171113115805795](./20171113121500150.png)

三、
将你的代码修改正确之后 -> 重新SVN Commit  

![20171113115805795](./20171113124255359.png)

新的提交会覆盖掉你的错误提交，这样你的同事就不会更新到你错误提交的代码了。

那为什么不去直接撤销掉你错误提交的版本呢？
我认为：因为这样你还可以从你错误提交的版本日志里找到你改的代码，复制从新修改，不会因为你少部分的错误而去重新从头再写过。

