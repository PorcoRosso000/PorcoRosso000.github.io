---
title: sql日期格式转换
typora-root-url: sql日期格式转换
abbrlink: 598bc4eb
date: 2023-04-18 00:01:49
tags:
categories:
permalink:
---



## Oracle日期和字符串互相转换

### 1 日期转字符串

1.1 yyyy年mm月dd日hh24時mi分ss秒

手动拼接年月日

select
      to_char(sysdate, 'yyyy') || '年' 
   || to_char(sysdate, 'mm') || '月' 
   || to_char(sysdate, 'dd') || '日'
   || ' '
   || to_char(sysdate, 'hh24') || '時' 
   || to_char(sysdate, 'mi') || '分' 
   || to_char(sysdate, 'ss') || '秒' 
from
  dual

⏹结果
2021年09月08日

1.2 yyyy-mm-dd hh24:mi:ss

日期不去掉0,并且以24小时制显示

select
  to_char(sysdate, 'yyyy-mm-dd hh24:mi:ss') 
from
  dual

⏹结果
2021-09-08 11:12:02

1.3 yyyyfm-mm-dd hh24:mi:ss
日期去掉0,并且以24小时制显示

select
  to_char(sysdate, 'yyyyfm-mm-dd hh24:mi:ss') 
from
  dual

⏹结果
2021-9-8 11:21:55

1.4 yyyy/mm/dd
只显示年月日,并且有分隔符

select
  to_char(sysdate, 'yyyy/mm/dd') 
from
  dual

⏹结果
2021/09/08

1.5 yyyymmdd
只显示年月日,没有分隔符

select
  to_char(sysdate, 'yyyymmdd') 
from
  dual

⏹结果
20210908

### 2 字符串转日期

使用to_date(‘日期’, ‘格式’)函数,具体格式和to_char()中的格式相同

select
  to_date('20210908', 'yyyymmdd') 
from
  dual

⏹结果
2021/09/08 0:00:00

select
  to_date('2021-9-8 11:21:55', 'yyyyfm-mm-dd hh24:mi:ss') 
from
  dual

⏹结果
2021/09/08 11:21:55







## Mysql日期和字符串互相转换

参考资料: MySQL中日期时间类型与格式化

### 1 日期转字符串

DATE_FORMAT( )函数

1.1 yyyy年mm月dd日 hh时ii分ss秒
SELECT
	DATE_FORMAT(NOW(), '%Y年%m月%d日 %H时%i分%s秒' );
⏹结果
2021年09月08日 21时04分59秒

1.2 yyyy-mm-dd hh:ii:ss
SELECT
	DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')

### 2 字符串转日期

STR_TO_DATE函数

SELECT
	STR_TO_DATE('2019年01月17日 19时05分05秒', '%Y年%m月%d日 %H时%i分%s秒');

⏹结果
2019-01-17 19:05:05

### 3.数据判空并进行日期转换

xxxx年xx月xx日 格式或者其他格式转换成  xxxx-xx-xx

SELECT IF('2019年01月17日' = 'NULL',NULL
,IF('2019年01月17日' like '%日%',STR_TO_DATE('2019年01月17日','%Y年%m月%d日'),DATE_FORMAT('2019年01月17日','%Y-%m-%d')))

xxxx年xx月xx日 xx时xx分xx秒 格式或者其他格式转换成  xxxx-xx-xx xx:xx:xx

IF ( st_approve_start_time = 'NULL', NULL,IF(st_approve_start_time like '%日%',STR_TO_DATE(st_approve_start_time,'%Y年%m月%d日 %H时%i分%s秒'),DATE_FORMAT(st_approve_start_time,'%Y-%m-%d %H:%i:%s'))) as st_approve_start_time



## 版权声明：

本文为CSDN博主「fengyehongWorld」的原创文章
原文链接：https://blog.csdn.net/feyehong/article/details/120177756