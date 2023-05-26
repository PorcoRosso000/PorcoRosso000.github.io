---
title: hive脚本参数和语法
typora-root-url: hive脚本参数和语法
abbrlink: 3d21d1a7
date: 2023-05-25 10:38:54
tags: hive
categories: hive
permalink:
---



## HIVE 参数设置

SET HIVE.EXEC.DYNAMIC.PARTITION=TRUE;
SET HIVE.EXEC.DYNAMIC.PARTITION.MODE=NONSTRICT; 
------ 让 UNION ALL 同步执行 ----START
SET HIVE.EXEC.PARALLEL=TRUE;SET HIVE.EXEC.PARALLEL.THREAD.NUMBER=8;
------ 让 UNION ALL 同步执行 ----END
 -------矢量化查询-----------
STARTSET HIVE.EXECUTION.ENGINE=TEZ;
SET HIVE.VECTORIZED.EXECUTION.ENABLED=TRUE;
SET HIVE.VECTORIZED.EXECUTION.REDUCE.ENABLED=TRUE;
--------矢量化查询----------END
--------优化GROUP BY------------------START
SET HIVE.MAP.AGGR = TRUE
SET HIVE.GROUPBY.MAPAGGR.CHECKINTERVAL = 100000
SET HIVE.GROUPBY.SKEWINDATA = TRUE
--------优化GROUP BY------------------END 
---------------MAP 任务内存总大小--------START
SET MAPREDUCE.MAP.MEMORY.MB=2048 MAP
---------------MAP 任务内存总大小--------END 
--------------------堆大小--------START
SET MAPREDUCE.MAP.JAVA.OPTS=-XMX1024M; 
SET MAPREDUCE.REDUCE.MEMORY.MB=2500; 
SET MAPREDUCE.REDUCE.JAVA.OPTS=-XMX2048M;
--------------------堆大小--------END 

## hive函数

### 窗口函数

```
--获取分组后的第一位
--根据  PARTITION BY 之后的值经行分组  根据ORDER BY 之后的值进行排序 根据NEWINDEX的值进行筛选数据
SELECT 
            ACCOUNT_ID
            ,BOOK_BALANCE
            ,NEWINDEX
            ,BOOK_DATE 
            FROM
            (
                SELECT 
                    ACCOUNT_ID
                    ,BOOK_BALANCE
                    ,ROW_NUMBER() OVER(PARTITION BY account_id ORDER BY BOOK_DATE DESC) AS NEWINDEX 
                    ,BOOK_DATE
                    FROM  DC_HIVE.STG_CPM_BALANCE 
                    WHERE thedate='${beforeDate}' 
            )table1
            WHERE table1.NEWINDEX =1
```

### hive  REGEXP_REPLACE 正则表达式

```
regexp_replace(string INITIAL_STRING, string PATTERN, string REPLACEMENT)

REGEXP_REPLACE(aa, '[a-z]', '')    -- 替换所有字母
        ,REGEXP_REPLACE(aa, '[abc]', '')    -- 替换指定字母
        ,REGEXP_REPLACE(aa, '[^abc]', '')    -- 替换所有非字母
        ,REGEXP_REPLACE(aa, '[0-9]', '')    -- 替换所有数字
        ,REGEXP_REPLACE(aa, '[\s\S]', '')    -- 替换空白符、换行，\s：是匹配所有空白符，包括换行，\S：非空白符，不包括换行。
        ,REGEXP_REPLACE(aa, '\w', '')    -- 替换所有字母、数字、下划线。等价于 [A-Za-z0-9_]
        ,REGEXP_REPLACE(aa, '[-8+]', '')    -- 只替换-8这个字符
        ,REGEXP_REPLACE(aa, '[-8*]', '')    -- 替换-8、-、8这几个字符

例:
 REGEXP_REPLACE(order_no, '^TH0(.)0*', '')
 
```

### hive COALESCE函数

```
COALESCE是一个函数， (expression_1, expression_2, …,expression_n)依次参考各参数表达式，遇到非null值即停止并返回该值。如果所有的表达式都是空值，最终将返回一个空值。

比如我们要登记用户的电话，数据库中包含他的person_tel,home_tel,office_tel,我们只要取一个非空的就可以，则我们可以写查询语句
例
select
 COALESCE(person_tel,home_tel,office_tel) as contact_number
 from Contact；
```

### hive 炸裂函数explode的使用

```
explode的作用
将一行集合类型的数据炸裂为多行数据。

格式
lateral view explode(字段) 表别名 as 列别名
如果字段类型是map：lateral view explode(字段) 表别名 as key别名,value别名

示例
有如下表数据

+-------------------+----------------------+
| movie_info.movie  | movie_info.category  |
+-------------------+----------------------+
| 《疑犯追踪》            | 悬疑,动作,科幻,剧情          |
| 《Lie to me》       | 悬疑,警匪,动作,心理,剧情       |
| 《战狼2》             | 战争,动作,灾难             |
+-------------------+----------------------+

想要的结果：

+--------------+-----------+
|   m.movie    | tbl.type  |
+--------------+-----------+
| 《疑犯追踪》       | 悬疑        |
| 《疑犯追踪》       | 动作        |
| 《疑犯追踪》       | 科幻        |
| 《疑犯追踪》       | 剧情        |
| 《Lie to me》  | 悬疑        |
| 《Lie to me》  | 警匪        |
| 《Lie to me》  | 动作        |
| 《Lie to me》  | 心理        |
| 《Lie to me》  | 剧情        |
| 《战狼2》        | 战争        |
| 《战狼2》        | 动作        |
| 《战狼2》        | 灾难        |
+--------------+-----------+

select movie,tbl.type
from movie_info
lateral view explode(split(category,',')) tbl as type;

如果想要如下结果：

+-----------+-----------------------------------+
| tbl.type  |                _c1                |
+-----------+-----------------------------------+
| 剧情        | ["《疑犯追踪》","《Lie to me》"]          |
| 动作        | ["《疑犯追踪》","《Lie to me》","《战狼2》"]  |
| 心理        | ["《Lie to me》"]                   |
| 悬疑        | ["《疑犯追踪》","《Lie to me》"]          |
| 战争        | ["《战狼2》"]                         |
| 灾难        | ["《战狼2》"]                         |
| 科幻        | ["《疑犯追踪》"]                        |
| 警匪        | ["《Lie to me》"]                   |
+-----------+-----------------------------------+


这个是列转行的实现，我们可以按照类型分组，然后把电影名放在集合中。

select tbl.type,collect_list(movie)
from movie_info
lateral view explode(split(category,',')) tbl as type
group by tbl.type;


```

### hive防止数据倾斜的方式

#### 默认添加空值的方式

```
hive使用  直接默认添加空值的方式    防止数据倾斜 (左右边的数据量严重不一致  1千条  10条)
select  *  from 
dc_hive.dwd_contract_order_info_chind_order_info_2 as order_info
left join dc_hive.dwd_contract_order_info_child_order_and_contract_2 as contract_info
on COALESCE(contract_info.st_order_no,concat('contract',rand()))  = COALESCE(order_info.st_order_no,concat('order',rand()))
```

### hive  查询分区字段是不是空值

```
select * from ods_pre_audit_additional_df  where thedate='${beforeDate}' and st_tongdun_four_no is not null
```

### hive当前时间

```
FROM_UNIXTIME(UNIX_TIMESTAMP() ,'yyyy-MM-dd HH:mm:ss')
```

### If 函数

```
语法: if(boolean testCondition, T valueTrue, T valueFalseOrNull)
返回值: T
说明:  当条件testCondition为TRUE时，返回valueTrue；否则返回valueFalseOrNull
举例：
hive> select if(1=2,100,200) from dual;
200
hive> select if(1=1,100,200) from dual;
100
例:例 : IF (customer_type = 'PERSON', '个人', '企业')
```

###  CASE函数

```
语法 : CASE a WHEN b THEN c [WHEN d THEN e]* [ELSE f] END
返回值 : T
说明：如果 a 等于 b ，那么返回 c ；如果 a 等于 d ，那么返回 e ；否则返回 f
举例：
hive> Select case 100 when 50 then 'tom' when 100 then 'mary' else 'tim' end from dual;
mary
```

### 日期转字符串

```
from_unixtime(unix_timestamp(V_CPM_ACCOUNT.OPEN_DATE,'yyyy-MM-dd'),'yyyyMMdd')
```

### 取昨天的前一天

```
select    from_unixtime(unix_timestamp(date_add(from_unixtime(unix_timestamp('${beforeDate}','yyyyMMdd'),'yyyy-MM-dd'),-1),'yyyy-MM-dd'),'yyyyMMdd') 
```

### hive获取本月的上月

```
date_format(xxx_time,'yyyy-MM') = substr(add_months(FROM_UNIXTIME(UNIX_TIMESTAMP(),'yyyy-MM-dd HH:mm:ss'), -1 ) ,1, 7)
```



## 版权声明: 

本文借鉴的原文作者和链接

「伴生伴熟」原创文章：https://blog.csdn.net/chinacmt/article/details/118721972

「yjgithub」原创文章：https://blog.csdn.net/yjgithub/article/details/104796304

「yj2434」原创文章：https://blog.csdn.net/yj2434/article/details/108059867

「小甜瓜Melon」原创文章：https://www.jianshu.com/p/ceed17d93c70
