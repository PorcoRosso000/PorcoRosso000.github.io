---
title: AQS
typora-root-url: AQS
abbrlink: dfdb52be
date: 2022-11-26 17:02:38
tags:
permalink:
---



### AQS

 AQS（AbstractQuenedSynchronizer ），抽象的队列式同步器，除了 java 自带的 synchronized 关键字之外的锁机制。

 AQS 基于 CLH 队列，用 volatile 修饰共享变量 (state)，线程通过 CAS 去改变状态符，成功则获取锁成功，失败则进入等待队列，等待被唤醒。

#### AQS底层原理

 AQS维护volatile下的共享资源state，如果获取到锁了那么就去改变state的状态，如果没有获取到那么就进入一个阻塞的状态，放入阻塞队列中去

 原理就是：AQS实际是通过CLH队列操作的，CLH队列是一个虚拟的双向队列，通过CAS去获取，获取到修改state状态，获取不到就放入阻塞队列中去

#### AQS的实现

 ReentrantLock和countdownlatch

 独占锁：ReentrantLock

 共享锁：countdownlatch