---
title: CPU飙高
typora-root-url: CPU飙高
abbrlink: f64d8ae3
date: 2022-11-26 16:45:15
keywords: 'CPU,cpu'
tags: CPU飙高
categories: CPU飙高
photos: 
description: CPU飙高
---

CPU飙高

<!--more-->

------



# jvm如何排查生产环境cpu飙高的问题

 原因：1.CAS自旋没有控制自旋次数           方案：设置固定自旋次数

- 死循环 	                            方案：全面考虑业务场景，设定退出标志条件，限制循环的次数

- 被注入挖矿程序 	                    方案：Redis不要能够被外网访问

- 服务器被DDOS工具攻击 	           方案：通过限流，ip黑名单，图形验证码防止机器模拟攻击

  

   2.cpu频繁的上下文切换

   	原因创建了大量线程
		
   	解决方案：保存运行线程的执行状态
		
   		    让处于等待中的线程执行

   3.cpu资源消耗过多

   	原因：有线程一直占用cpu
		
   	解决方案：使用top命令找到线程中的利用率较高的线程     通过jstack获取线程的demp日志

 ![img](lu152441l02jn_tmp_79357f887fcf3b51.png) 

 ![img](lu152441l02jn_tmp_9bff40fc76171577.png) 

 ![img](lu152441l02jn_tmp_cb66cbd545b9b8e2.png)



