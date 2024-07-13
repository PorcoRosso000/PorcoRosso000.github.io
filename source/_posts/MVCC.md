---
title: MVCC
typora-root-url: MVCC
abbrlink: 148a0112
date: 2022-11-26 17:03:25
keywords: 'mvcc,MVCC'
tags: MVCC
categories: MVCC
photos:
description: 多版本并发控制
---

多版本并发控制

<!--more-->

------



### MVCC(Multi-Version Concurrency Control )

多版本并发控制，MVCC 是一种并发控制的方法，一般在数据库管理系统中，实现对数据库的并发访问，它在不同的数据库引擎中有不同的实现。MySQL中MVCC只能在Repeatable Read（可重复读）、Read Committed（读已提交）这两个隔离级别下工作。 主要是为了提高数据库的`并发性能`  

用途： MVCC实现的是普通读取不加锁，并且读写不冲突，根据28定律，通常大部分为读操作，避免了读操作的加锁可以大大提高性能。

原理：

MVCC是通过保存了数据库某个时间的快照来实现的。也就是说当几个事务开启的时间不同，可能会出现同一时刻、不同事务读取同一张表的同一行记录是不一样的。这个机制也是可重复读的实现。