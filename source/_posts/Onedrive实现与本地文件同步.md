---
title: Onedrive实现与本地文件同步
typora-root-url: Onedrive实现与本地文件同步
tags: Onedrive
abbrlink: 644d29f9
date: 2023-02-25 13:31:02
categories:
permalink:
---



## 具体操作方法

打开Onedrive，在右下角系统托盘上点击右键，选择设置。
选择“自动保存”选项卡，在“保护重要文件夹”中勾选文档。这一步的操作是为了保证文档文件夹中的内容电脑时刻与云端保持同步。注意：选择之后本地的文档将成为指向Onedrive文件夹的目录，因此保存在其中的虚拟机或VS工程文件等有可能出现无法读取的现象，请注意在操作后进行调整。

假设我要同步的本地文件夹是E:\工作，而Onedrive在本地的保存目录为C:\Users\用户名\OneDrive。

以管理员模式打开命令提示符（Win10用户可直接搜索cmd，然后右键命令提示符搜索结果的程序，选择以管理员权限运行）。在打开的窗口中输入命令：mklink /d C:\Users\用户名\OneDrive\工作 E:\工作。注意：执行本操作时请确保C:\Users\用户名\OneDrive下没有名为“工作”的目录，否则将会报错。

回车键执行后，命令提示符返回“……创建的文件链接”字样的文字，即说明建立连接成功。

**注意**：如果文件目录中包含空格，则在输入命令的时候应使用英文双引号将该完整目录括起来。

## windows 软链接的建立及删除        

### 1.建立举例

1. \##建立d:develop链接目录，指向远程的目标服务器上的e盘的对应目录。
2. mklink /d d:\develop \\138.20.1.141\e$\develop
3. 
4. \##建立d:develop链接目录，指向远程的目标服务器上的e盘的对应目录。
5. mklink /d d:\recivefiles \\138.20.1.141\e$\recivefiles
   mklink/d d：\recivefiles \\138.20.1.141\e$\recivefiles

### 2.删除举例

1. \#删除虚拟的链接目录，并不会删除远程文件夹真实文件，注意千万不能用del，del会删除远程的真实文件。
2. rmdir d:\recivefiles rmdir d：\recivefiles
3. rmdir d:\develop rmdir d：\development

### 3.补充mklink用法

1. C:\Users\joshua>mklink C：\Users\joshua>mklink
2. Creates a symbolic link. 创建符号链接。
3. MKLINK [[/D] | [/H] | [/J]] Link Target
4. MKLINK[[/D] |[/H] |[/J]]链接目标
5.  /D Creates a directory symbolic link. Default is a file symbolic link.
6.  /D Createsadirectory symbolic link.默认为文件符号链接。
7.  /H Creates a hard link instead of a symbolic link.
   /HCreatesahardlink而不是asymboliclink。
8. /J Creates a Directory Junction. /j CreatesaDirectory Junction.   
10. Link specifies the new symbolic link name. 
    链接指定新的符号链接名称。
11. Target specifies the path (relative or absolute) that the new link refers to.
    目标指定新链接引用的路径（相对或绝对）。

命令格式：mklink /d(定义参数) \MyDocs(链接文件) \Users\User1\Documents(原文件)

/d：建立目录的符号链接符号链接(symbolic link)
/j：建立目录的软链接（联接）(junction)

/h：建立文件的硬链接(hard link)

## 引用链接

1.CSDN博主「Caleb_Sung」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qq_41933331/article/details/86761373

2.CSDN博主「[zhe哲](https://blog.csdn.net/qq_37861937)」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qq_37861937/article/details/79064841