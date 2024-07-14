---
title: java时间段重叠判断
typora-root-url: java时间段重叠判断
abbrlink: 10fd86b3
date: 2023-01-16 20:13:41
keywords: '时间段重叠判断'
tags: java基础
categories: java基础
photos:
description: java时间段重叠判断
---

java时间段重叠判断

<!--more-->

------



## 思路:

时间段的开始时间一定要小于结束时间！！

准备：为了方便，我把几个时间段拆分成两部分，假设时间A->B，C->D,E->F，然后把每个时间段的开始时间和结束时间放到两个数组里，如：开始时间放到startList:{A,C,D}，结束时间放到endList:{B,D,F}

该时间段的开始时间如何大于另个一个时间段的结束时间，那么这个两个时间段不会有重叠；如果该时间段的结束时间小于另一个时间段的时间，那么这个两个时间段也不会有重叠。

## 代码：

​	

```java
package com.test1;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**

- 

- @Describtion：时间段是否重叠

- @author： weiRB

- 2020年1月8日下午5:39:43
  */
  public class PeriodTimeIsOverlap {

  public static void main(String[] args) {
  	try {
  		boolean b = isOverlap();
  		System.out.println("是否重复(true:重复，false:不重复)："+b);
  	} catch (ParseException e) {
  		// TODO Auto-generated catch block
  		e.printStackTrace();
  	}
  }

  public static boolean isOverlap() throws ParseException{
      //造3个时间段数据
      List<Timestamp> periodStart = new ArrayList<Timestamp>();
      List<Timestamp> periodend = new ArrayList<Timestamp>();
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      //第一个时间段
      Date start1 = sdf.parse("2020-1-1 00:00:00");
      Date end1 = sdf.parse("2020-1-5 00:00:00");
      //第二个时间段
      Date start2 = sdf.parse("2020-1-5 00:00:00");
      Date end2 = sdf.parse("2020-1-6 00:00:00");
      //第三个时间段
      Date start3 = sdf.parse("2020-1-9 00:00:00");
      Date end3 = sdf.parse("2020-1-10 00:00:00");
      //开始时间放到一个数组
      periodStart.add(new Timestamp(start1.getTime()));
      periodStart.add(new Timestamp(start2.getTime()));
      periodStart.add(new Timestamp(start3.getTime()));
      //结束时间放到一个数组
      periodend.add(new Timestamp(end1.getTime()));
      periodend.add(new Timestamp(end2.getTime()));
      periodend.add(new Timestamp(end3.getTime()));
      /**
         * 两两循环比较
         * 这里的3代表有三组数据，先写死
         */
      for (int i = 0; i < periodStart.size()-1; i++) {
          Timestamp start0 = periodStart.get(i);
          Timestamp end0 = periodend.get(i);
          for (int j = i+1; j < periodStart.size(); j++) {
              Timestamp start = periodStart.get(j);
              Timestamp end = periodend.get(j);
              if(start0.compareTo(end)>=0 || end0.compareTo(start)<=0){
                  /**
                     * 说明不重复。
                     * 思路：该时间段的开始时间如何大于另个一个时间段的结束时间，那么这个两个时间段不会有重叠；
                     * 如果该时间段的结束时间小于另一个时间段的时间，那么这个两个时间段也不会有重叠。
                     */
                  continue;
              }else{
                  //说明该时间段重复
                  return true;
              }
          }
      }

return false;
	}

}
```



————————————————
版权声明：本文为CSDN博主「跨海之梦」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/weixin_40480741/article/details/103895379