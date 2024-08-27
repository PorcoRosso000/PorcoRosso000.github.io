---
title: windows命令行
typora-root-url: windows命令行
abbrlink: edc4c195
date: 2023-06-03 20:51:29
keywords: 'windows'
tags: windows
categories: windows
photos:
description: windows命令行
---

windows命令行

<!--more-->

------

## windows命令

windows 查看文件列表 :  dir

windows编辑文件命令`:  notepad somefile.txt`

## Windows环境下压缩包合并

copy /B 1.zip.001 + 1.zip.002 + 1.zip.003 wuming.zip

## Windows环境下硬盘/u盘被谁占用了，查找罪魁祸首

Win+R打开【运行】–>输入eventvwr.msc回车打开【事件查看器】–>事件查看器(本地)–>Windows日志–>系统–>找到最近的【警告 来源Kernel-PnP】–>双击打开–>你会看到【进程 ID 为 **** 的应用程序已停止删除或弹出设备】，记住这个进程ID。

```
cmd 使用  
taskkill /pid 进程ID -f 强制结束进程  
也可以使用
taskkill /pid 进程ID -t 结束进程(使用-t会判断有没有子进程，有子进程就不会结束)  
```

