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

--------HIVE UNION ALL 部分数据丢失------
set hive.optimize.index.filter=false; --关闭元数据检查

 -------矢量化查询-----------
STARTSET HIVE.EXECUTION.ENGINE=TEZ;
SET HIVE.VECTORIZED.EXECUTION.ENABLED=TRUE;
SET HIVE.VECTORIZED.EXECUTION.REDUCE.ENABLED=TRUE;

--------优化GROUP BY------------------
SET HIVE.MAP.AGGR = TRUE
SET HIVE.GROUPBY.MAPAGGR.CHECKINTERVAL = 100000
SET HIVE.GROUPBY.SKEWINDATA = TRUE

---------------MAP 任务内存总大小--------
SET MAPREDUCE.MAP.MEMORY.MB=2048 MAP

--------------------堆大小--------
SET MAPREDUCE.MAP.JAVA.OPTS=-XMX1024M; 
SET MAPREDUCE.REDUCE.MEMORY.MB=2500; 
SET MAPREDUCE.REDUCE.JAVA.OPTS=-XMX2048M;

--hive的mapjoin在头上加上这两句，小表left join会自动转换成mapjoin---- 适合于left join 较多的情况

SET hive.auto.convert.join=true;
SET hive.mapjoin.smalltable.filesize=25000000;

--hive查询或者插入数据报return code 2的错误

set mapreduce.map.memory.mb=4096;

如果设置成4096还是报return code 2 。那么可以加大这个值。设置这个值就是1024的整数倍

SET hive.mapjoin.smalltable.filesize=25000000;

## hive函数

### 窗口函数

```
ROW_NUMBER() 开窗函数
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

sum()开窗函数
CPM_BALANCE.BOOK_BALANCE + SUM( CASE 
        WHEN CPM_VOUCHER.DIR_FLAG = '1' THEN CPM_VOUCHER.AMOUNT 
        WHEN CPM_VOUCHER.DIR_FLAG = '2' THEN -CPM_VOUCHER.AMOUNT 
        END) OVER(partition by CPM_VOUCHER.ACCOUNT_ID ,CPM_VOUCHER.BOOK_TIME  order by  CPM_VOUCHER.ACCOUNT_ID,CPM_VOUCHER.BOOK_TIME DESC )   AS CURR_BAL-- 账户余额

排序后，显示排名

涉及排序的问题，我们需要考虑到遇到“相同值“的情况，如何显示排名
例如，遇到并列第1的情况
工具：

row_number()，不管是否相同，顺序排序。

例如输出名次: 1，2，3，4
rank()，相同的排序是一样的，但下一个不同值是跳着排序的。

例如输出名次，1，1，3，4
dense_rank()，相同的排序是一样的，且名次是连续的

例如输出名次，1，1，2，3
语句都类似，

select * ,row_number() over (ORDER BY col1) as index0 from table1
select * ,rank() over (ORDER BY col1) as index0 from table1
select * ,dense_rank() over (ORDER BY col1) as index0 from table1

偏移函数
	向后偏移  lead()
    获取当前记录的id，以及下一条记录的id 
    select id ,
           lead(id, 1, null) over (order by id)  next_id
    from table1
    order by id

    lead（字段，N，默认）
    用lead函数指定要偏移的【字段】，并指定向后偏移【N】行
    若没有符合条件的数据，则输出【默认】值。
    计算不同消费者的复购间隔。

    问题解析：难点在于如何锁定同一个消费者相邻的两个订单。
    下面给出一个实例，计算不同类目下，消费者复购的时间间隔。

    select categoryname,users,diff_day
    from
    (
        select categoryname,users
        ,dt
        -- 下一次的购买行为时间
        ,lead(dt,1,'1970-01-01') over(partition by categoryname,users order by dt) as next_buy_time   
        -- 下一次的购买行为和当前购买行为的时间间隔
        ,datediff(lead(dt,1,'1970-01-01') over(partition by categoryname,users order by dt),dt) as diff_day   
        from Table1
    ) a1
    where a1.diff_day > 0 

	向前偏移 lag()函数，二者语法都是相同


     count() over(partition by ... order by ...)：求分组后的总数。
     max() over(partition by ... order by ...)：求分组后的最大值。
     min() over(partition by ... order by ...)：求分组后的最小值。
     avg() over(partition by ... order by ...)：求分组后的平均值。
     lag() over(partition by ... order by ...)：取出前n行数据。　　
     lead() over(partition by ... order by ...)：取出后n行数据。

      ratio_to_report() over(partition by ... order by ...)：Ratio_to_report() 括号中就是分子，over() 括号中就是分母。

      percent_rank() over(partition by ... order by ...)：


```



### hive中取最大值最小值的函数

```
max()和min()函数
select a,max(b) from t group by a
 
select a,min(b) from t group by a
max和min函数是取某一列中的最大或者最小值

greatest()和least()函数
select greatest(-1, 0, 5, 8) --8
 
select least(-1, 0, 5, 8) --  -1
greatest和least函数是取某一行中的最大或者最小值，但一定是比较相同类型的数据，如果数据类型不同，返回null

max()  over()和min() over()函数
select   a
        ,b
        ,max(b) over(partition by a)  as  max_val
        ,min(b) over(partition by a)  as  min_val
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



### in/not in 函数

hive在where函数之后不能加子查询

**HIVE 多值not in**

```
select a, b
  from table1 t1
 where not exists (select 1
          from table2 t2
         where t1.a = t2.a
           and t1.b = t2.b)

select t1.a, t2.b
from table1 t1
left join table2 t2on (t1.a = t2.a and t1.b = t2.b)
where t2.a is null

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

### hive周月季年初末获取方式

```
获取当月月份  >>>    select substr(current_date , 1 ,7 );
获取本月月初第一天   >>>    select date_sub(current_date,dayofmonth(current_date)-1);
获取本月月初第一天   >>>    select from_unixtime(unix_timestamp(date_sub(from_unixtime(unix_timestamp('20231231','yyyyMMdd'),'yyyy-MM-dd'),dayofmonth(from_unixtime(unix_timestamp('20231231','yyyyMMdd'),'yyyy-MM-dd'))-1),'yyyy-MM-dd'),'yyyyMMdd') 
获取本月月末     >>>    select last_day(current_date) ;
查询下个月的第一天     >>>    select add_months(date_sub(current_date,dayofmonth(current_date)-1),1);
查询上个月 月份   >>>  select substr(add_months(FROM_UNIXTIME(UNIX_TIMESTAMP(),'yyyy-MM-dd HH:mm:ss'), -1 ) ,1, 7);  
注：如果想查询前6个月等 将 -1 改成 -6 即可，查询 后半年的  将-1 改成 6 即可 
获取上个月的今天    >>>     select add_months(FROM_UNIXTIME(UNIX_TIMESTAMP(),'yyyy-MM-dd HH:mm:ss'), -1 );
注 要是想获取前两个月 就将-1改成 -2 ， 
获取上个月的最后一天  >>>   select last_day(add_months(FROM_UNIXTIME(UNIX_TIMESTAMP(),'yyyy-MM-dd HH:mm:ss'), -1 ) )
注：想获取得上上个月的月末  可以将 -1 改成 -2 ，可根据你的需要时间进行修改
获取下下个月的 将  -1  改成 2  即可  可根据你的需要时间进行修改
获取某月的天数  >>>   select  datediff (last_day("2020-08-22") ,  date_sub("2020-08-22",dayofmonth("2020-08-22")-1)  ) ;
时间差 datediff  >>>  select datediff('2020-12-04','2020-12-03');
获取上月的今天时间 时间环比同比计算  >>>  select add_months(from_unixtime(unix_timestamp('2020-10-31', 'yyyy-MM-dd'), 'yyyy-MM-dd HH:mm:ss'), -1)
上周一    >>>  select date_sub('2020-12-12',pmod(datediff(cast('2020-12-12' as string),'2000-01-03'),7)+7)
上周日   >>>  select date_sub('2020-12-12',pmod(datediff(cast('2020-12-12' as string),'2000-01-03'),7)+1)
上月月初   >>>  select CONCAT(date_format(add_months(from_unixtime(unix_timestamp(), 'yyyy-MM-dd'),-1),'yyyyMM'),'01');
上月月末   >>>  select date_format(date_sub(from_unixtime(unix_timestamp(CONCAT(from_unixtime(unix_timestamp(), 'yyyyMM'),'01'), 'yyyyMMdd'), 'yyyy-MM-dd'),1),'yyyyMMdd');
季初     >>>    SELECT
                    CASE
                        WHEN month('2020-12-12') BETWEEN 1 AND 3 THEN concat(year('2020-12-12'),'0101')
                        WHEN month('2020-12-12') BETWEEN 4 AND 6 THEN concat(year('2020-12-12'),'0401')
                        WHEN month('2020-12-12') BETWEEN 7 AND 9 THEN concat(year('2020-12-12'),'0701')
                        ELSE concat(year('2020-12-12'),'1001')
                    END AS first_day_of_current_quarter
季末    >>>     SELECT
                    CASE
                        WHEN month('2020-12-12') BETWEEN 1 AND 3 THEN concat(year('2020-12-12'),'0331')
                        WHEN month('2020-12-12') BETWEEN 4 AND 6 THEN concat(year('2020-12-12'),'0630')
                        WHEN month('2020-12-12') BETWEEN 7 AND 9 THEN concat(year('2020-12-12'),'0930')
                        ELSE concat(year('2020-12-12'),'1231')
                    END AS first_day_of_current_quarter
--同比上年本月月初
-- SELECT from_unixtime(unix_timestamp(trunc(add_months(from_unixtime(unix_timestamp('20231231','yyyyMMdd'),'yyyy-MM-dd'), -12), 'MM'),'yyyy-MM-dd'),'yyyyMMdd') 
--同比上年本月月末
-- SELECT from_unixtime(unix_timestamp(add_months(from_unixtime(unix_timestamp('20231231','yyyyMMdd'),'yyyy-MM-dd'), -12),'yyyy-MM-dd'),'yyyyMMdd') 
-- 上周一：
select date_sub(current_date(),pmod(datediff(cast(current_date() as string),'2000-01-03'),7)+7)
-- 上周日：
select date_sub(current_date(),pmod(datediff(cast(current_date() as string),'2000-01-03'),7)+1)
-- 上月第一天：
select  add_months(trunc(current_date(),'MM'),-1)
-- 上月最后一天：
select  date_add(trunc(current_date(),'MM'),-1)
-- 上季度第一天 ：
select to_date(concat(date_format(current_date(),'y'),'-',floor((cast(date_format(add_months(current_date(),-3),'M') as int)+2)/3)*3-2,'-',date_format(trunc(current_date(),'MM'),'dd')))
-- 上季度最后一天 ：
select last_day(to_date(concat(date_format(current_date(),'y'),'-',floor((cast(date_format(add_months(current_date(),-3),'M') as int)+2)/3)*3,'-','01')))
-- 去年第一天 ：
select  add_months(trunc(current_date(),'YY'),-12)
-- 去年最后一天 ：
select date_add(trunc(current_date(),'YY'),-1)
```



### hive字段转换数据类型

CAST来显式的将一个类型的数据转换成另一个数据类型
基础语法：
CAST(value AS TYPE)

![cast数据转换图](./cast数据转换图.png)

### hive自增列

```sql
row_number() over (ORDER BY 1) AS NEWINDEX
```

### hive 常用运算

#### 第一部分：关系运算

```go
Hive支持的关系运算符
•常见的关系运算符
•等值比较: =
•不等值比较: <>
•小于比较: <
•小于等于比较: <=
•大于比较: >
•大于等于比较: >=
•空值判断: IS NULL
•非空判断: IS NOT NULL
•LIKE比较: LIKE
•JAVA的LIKE操作: RLIKE
•REGEXP操作: REGEXP
•等值比较: =
   语法：A=B
操作类型：所有基本类型
描述: 如果表达式A与表达式B相等，则为TRUE；否则为FALSE
举例：
hive> select 1 from dual where 1=1;
•不等值比较: <>
语法: A <> B
操作类型: 所有基本类型
描述: 如果表达式A为NULL，或者表达式B为NULL，返回NULL；如果表达式A与表达式B不相等，则为TRUE；否则为FALSE
举例：
hive> select 1 from dual where 1 <> 2;
•小于比较: <
语法: A < B
操作类型: 所有基本类型
描述: 如果表达式A为NULL，或者表达式B为NULL，返回NULL；如果表达式A小于表达式B，则为TRUE；否则为FALSE
举例：
hive> select 1 from dual where 1 < 2;
•小于等于比较: <=
语法: A <= B
操作类型: 所有基本类型
描述: 如果表达式A为NULL，或者表达式B为NULL，返回NULL；如果表达式A小于或者等于表达式B，则为TRUE；否则为FALSE
举例：
hive> select 1 from dual where 1 <= 1;
•大于等于比较: >=
语法: A >= B
操作类型: 所有基本类型
描述: 如果表达式A为NULL，或者表达式B为NULL，返回NULL；如果表达式A大于或者等于表达式B，则为TRUE；否则为FALSE
举例：
hive> select 1 from dual where 1 >= 1;
•空值判断: IS NULL
语法: A IS NULL
操作类型: 所有类型
描述: 如果表达式A的值为NULL，则为TRUE；否则为FALSE
举例：
hive> select 1 from dual where null is null;
 

•非空判断: IS NOT NULL
语法: A IS NOT NULL
操作类型: 所有类型
描述: 如果表达式A的值为NULL，则为FALSE；否则为TRUE
举例：
hive> select 1 from dual where 1 is not null;
 

•LIKE比较: LIKE
语法: A LIKE B
操作类型: strings
描述: 如果字符串A或者字符串B为NULL，则返回NULL；如果字符串A符合表达式B   的正则语法，则为TRUE；否则为FALSE。B中字符”_”表示任意单个字符，而字符”%”表示任意数量的字符。
举例：
hive> select 1 from dual where ‘key' like 'foot%';
1
hive> select 1 from dual where ‘key ' like 'foot____';
1
注意：否定比较时候用 NOT A LIKE B
hive> select 1 from dual where NOT ‘key ' like 'fff%';
•JAVA的LIKE操作: RLIKE
语法: A RLIKE B
操作类型: strings
描述: 如果字符串A或者字符串B为NULL，则返回NULL；如果字符串A符合JAVA正则表达式B的正则语法，则为TRUE；否则为FALSE。
举例：
hive> select 1 from dual where 'footbar’ rlike '^f.*r$’;
1
注意：判断一个字符串是否全为数字：
hive>select 1 from dual where '123456' rlike '^\\d+$';
1
hive> select 1 from dual where '123456aa' rlike '^\\d+$';
1
•REGEXP操作: REGEXP
语法: A REGEXP B
操作类型: strings
描述: 功能与RLIKE相同
举例：
hive> select 1 from dual where ‘key' REGEXP '^f.*r$';
1
```

#### 第二部分：逻辑运算与数学运算

```
Hive数学运算
•加法操作: +
•减法操作: -
•乘法操作: *
•除法操作: /
•取余操作: %
•位与操作: &
•位或操作: |
•位异或操作: ^
•位取反操作: ~
•加法操作: +
语法: A + B
操作类型：所有数值类型
说明：返回A与B相加的结果。结果的数值类型等于A的类型和B的类型的最小父类型（详见数据类型的继承关系）。比如，int + int 一般结果为int类型，而int + double 一般结果为double类型
举例：
hive> select 1 + 9 from dual;
10
•减法操作: -
语法: A – B
操作类型：所有数值类型
说明：返回A与B相减的结果。结果的数值类型等于A的类型和B的类型的最小父类型（详见数据类型的继承关系）。比如，int – int 一般结果为int类型，而int – double 一般结果为double类型
举例：
hive> select 10 – 5 from dual;
5
 

• 乘法操作 : *
语法: A * B
操作类型：所有数值类型
说明：返回A与B相乘的结果。结果的数值类型等于A的类型和B的类型的最小父类型（详见数据类型的继承关系）。注意，如果A乘以B的结果超过默认结果类型的数值范围，则需要通过cast将结果转换成范围更大的数值类型
举例：
hive> select 40 * 5 from dual;
200
• 除法操作 : /
语法: A / B
操作类型：所有数值类型
说明：返回A除以B的结果。结果的数值类型为double
举例：
hive> select 40 / 5 from dual;
8.0
 
注意： hive 中最高精度的数据类型是 double, 只精确到小数点后 16 位，在做除法运算的时候要 特别注意
hive>select ceil(28.0/6.999999999999999999999) from dual limit 1;   
结果为4
hive>select ceil(28.0/6.99999999999999) from dual limit 1;          
结果为5
 
• 取余操作 : %
语法: A % B
操作类型：所有数值类型
说明：返回A除以B的余数。结果的数值类型等于A的类型和B的类型的最小父类型（详见数据类型的继承关系）。
举例：
hive> select 41 % 5 from dual;
1
hive> select 8.4 % 4 from dual;
0.40000000000000036
注意：精度在 hive 中是个很大的问题，类似这样的操作最好通过 round 指定精度
hive> select round(8.4 % 4 , 2) from dual;
0.4
 
• 位与操作 : &
语法: A & B
操作类型：所有数值类型
说明：返回A和B按位进行与操作的结果。结果的数值类型等于A的类型和B的类型的最小父类型（详见数据类型的继承关系）。
举例：
hive> select 4 & 8 from dual;
0
hive> select 6 & 4 from dual;
4
• 位或操作 : |
语法: A | B
操作类型：所有数值类型
说明：返回A和B按位进行或操作的结果。结果的数值类型等于A的类型和B的类型的最小父类型（详见数据类型的继承关系）。
举例：
hive> select 4 | 8 from dual;
12
hive> select 6 | 8 from dual;
14
• 位异或操作 : ^
语法: A ^ B
操作类型：所有数值类型
说明：返回A和B按位进行异或操作的结果。结果的数值类型等于A的类型和B的类型的最小父类型（详见数据类型的继承关系）。
举例：
hive> select 4 ^ 8 from dual;
12
hive> select 6 ^ 4 from dual;
2
• 位取反操作 : ~
语法: ~A
操作类型：所有数值类型
说明：返回A按位取反操作的结果。结果的数值类型等于A的类型。
举例：
hive> select ~6 from dual;
-7
hive> select ~4 from dual;
-5
Hive逻辑运算
•逻辑与操作: AND
•逻辑或操作: OR
•逻辑非操作: NOT
 
• 逻辑与操作 : AND
语法: A AND B
操作类型：boolean
说明：如果A和B均为TRUE，则为TRUE；否则为FALSE。如果A为NULL或B为NULL，则为NULL
举例：
hive> select 1 from dual where 1=1 and 2=2;
1
• 逻辑或操作 : OR
语法: A OR B
操作类型：boolean
说明：如果A为TRUE，或者B为TRUE，或者A和B均为TRUE，则为TRUE；否则为FALSE
举例：
hive> select 1 from dual where 1=2 or 2=2;
1
• 逻辑非操作 : NOT
语法: NOT A
操作类型：boolean
说明：如果A为FALSE，或者A为NULL，则为TRUE；否则为FALSE
举例：
hive> select 1 from dual where not 1=2;
• 逻辑非操作 : NOT
语法: NOT A
操作类型：boolean
说明：如果A为FALSE，或者A为NULL，则为TRUE；否则为FALSE
举例：
hive> select 1 from dual where  not 1=2 ;
 
```

#### 第三部分：数值运算

```
•取整函数: round
•指定精度取整函数: round
•向下取整函数: floor
•向上取整函数: ceil
•向上取整函数: ceiling
•取随机数函数: rand
•自然指数函数: exp
•以10为底对数函数: log10
•以2为底对数函数: log2
• 对数函数: log
•幂运算函数: pow
•幂运算函数: power
•开平方函数: sqrt
•二进制函数: bin
•十六进制函数: hex
•反转十六进制函数: unhex
•进制转换函数: conv
•绝对值函数: abs
•正取余函数: pmod
•正弦函数: sin
•反正弦函数: asin
•余弦函数: cos
•反余弦函数: acos
•positive函数: positive
•negative函数: negative
• 取整函数 : round
语法: round(double a)
返回值: BIGINT
说明: 返回double类型的整数值部分 （遵循四舍五入）
举例：
hive> select round(3.1415926) from dual;
3
hive> select round(3.5) from dual;
4
hive> create table dual as select round(9542.158) from dual;
hive> describe dual;
_c0     bigint
 
• 指定精度取整函数 : round
语法: round(double a, int d)
返回值: DOUBLE
说明: 返回指定精度d的double类型
举例：
hive> select round(3.1415926,4) from dual;
3.1416
 
• 向下取整函数 : floor
语法: floor(double a)
返回值: BIGINT
说明: 返回等于或者小于该double变量的最大的整数
举例：
hive> select floor(3.1415926) from dual;
3
hive> select floor(25) from dual;
25
 
• 向上取整函数 : ceil
语法: ceil(double a)
返回值: BIGINT
说明: 返回等于或者大于该double变量的最小的整数
举例：
hive> select ceil(3.1415926) from dual;
4
hive> select ceil(46) from dual;
46
• 向上取整函数 : ceiling
语法: ceiling(double a)
返回值: BIGINT
说明: 与ceil功能相同
举例：
hive> select ceiling(3.1415926) from dual;
4
hive> select ceiling(46) from dual;
46
 
• 取随机数函数 : rand
语法: rand(),rand(int seed)
返回值: double
说明: 返回一个0到1范围内的随机数。如果指定种子seed，则会等到一个稳定的随机数序列
举例：
hive> select rand() from dual;
0.5577432776034763
 
• 自然指数函数 : exp
语法: exp(double a)
返回值: double
说明: 返回自然对数e的a次方
举例：
hive> select exp(2) from dual;
7.38905609893065
自然对数函数: ln
语法: ln(double a)
返回值: double
说明: 返回a的自然对数
• 以 10 为底对数函数 : log10
语法: log10(double a)
返回值: double
说明: 返回以10为底的a的对数
举例：
hive> select log10(100) from dual;
2.0
• 以 2 为底对数函数 : log2
语法: log2(double a)
返回值: double
说明: 返回以2为底的a的对数
举例：
hive> select log2(8) from dual;
3.0
• 对数函数 : log
语法: log(double base, double a)
返回值: double
说明: 返回以base为底的a的对数
举例：
hive> select log(4,256) from dual;
4.0
• 幂运算函数 : pow
语法: pow(double a, double p)
返回值: double
说明: 返回a的p次幂
举例：
hive> select pow(2,4) from dual;
16.0
• 幂运算函数 : power
语法: power(double a, double p)
返回值: double
说明: 返回a的p次幂,与pow功能相同
举例：
hive> select power(2,4) from dual;
16.0
• 开平方函数 : sqrt
语法: sqrt(double a)
返回值: double
说明: 返回a的平方根
举例：
hive> select sqrt(16) from dual;
4.0
• 二进制函数 : bin
语法: bin(BIGINT a)
返回值: string
说明: 返回a的二进制代码表示
举例：
hive> select bin(7) from dual;
111
• 十六进制函数 : hex
语法: hex(BIGINT a)
返回值: string
说明: 如果变量是int类型，那么返回a的十六进制表示；如果变量是string类型，则返回该字符串的十六进制表示
举例：
hive> select hex(17) from dual;
11
hive> select hex(‘abc’) from dual;
616263
• 反转十六进制函数 : unhex
语法: unhex(string a)
返回值: string
说明: 返回该十六进制字符串所代码的字符串
举例：
hive> select unhex(‘616263’) from dual;
abc
hive> select unhex(‘11’) from dual;
-
hive> select unhex(616263) from dual;
abc
• 进制转换函数 : conv
语法: conv(BIGINT num, int from_base, int to_base)
返回值: string
说明: 将数值num从from_base进制转化到to_base进制
举例：
hive> select conv(17,10,16) from dual;
11
hive> select conv(17,10,2) from dual;
10001
• 绝对值函数 : abs
语法: abs(double a)   abs(int a)
返回值: double        int
说明: 返回数值a的绝对值
举例：
hive> select abs(-3.9) from dual;
3.9
hive> select abs(10.9) from dual;
10.9
• 正取余函数 : pmod
语法: pmod(int a, int b),pmod(double a, double b)
返回值: int double
说明: 返回正的a除以b的余数
举例：
hive> select pmod(9,4) from dual;
1
hive> select pmod(-9,4) from dual;
3
• 正弦函数 : sin
语法: sin(double a)
返回值: double
说明: 返回a的正弦值
举例：
hive> select sin(0.8) from dual;
0.7173560908995228
• 反正弦函数 : asin
语法: asin(double a)
返回值: double
说明: 返回a的反正弦值
举例：
hive> select asin(0.7173560908995228) from dual;
0.8
• 余弦函数 : cos
语法: cos(double a)
返回值: double
说明: 返回a的余弦值
举例：
hive> select cos(0.9) from dual;
0.6216099682706644
• 反余弦函数 : acos
语法: acos(double a)
返回值: double
说明: 返回a的反余弦值
举例：
hive> select acos(0.6216099682706644) from dual;
0.9
• positive 函数 : positive
语法: positive(int a), positive(double a)
返回值: int double
说明: 返回a
举例：
hive> select positive(-10) from dual;
-10
hive> select positive(12) from dual;
12
• negative 函数 : negative
语法: negative(int a), negative(double a)
返回值: int double
说明: 返回-a
举例：
hive> select negative(-5) from dual;
5
hive> select negative(8) from dual;
-8
```

#### 第四部分：日期函数

```
•UNIX时间戳转日期函数: from_unixtime
• 获取当前UNIX时间戳函数: unix_timestamp
•日期转UNIX时间戳函数: unix_timestamp
• 指定格式日期转UNIX时间戳函数: unix_timestamp
•日期时间转日期函数: to_date
•日期转年函数: year
• 日期转月函数: month
• 日期转天函数: day
• 日期转小时函数: hour
• 日期转分钟函数: minute
• 日期转秒函数: second
• 日期转周函数: weekofyear
• 日期比较函数: datediff
• 日期增加函数: date_add
• 日期减少函数: date_sub
• UNIX 时间戳转日期函数 : from_unixtime
语法: from_unixtime(bigint unixtime[, string format])
返回值: string
说明: 转化UNIX时间戳（从1970-01-01 00:00:00 UTC到指定时间的秒数）到当前时区的时间格式
举例：
hive> select from_unixtime(1323308943,'yyyyMMdd') from dual;
20111208
• 获取当前 UNIX 时间戳函数 : unix_timestamp
语法: unix_timestamp()
返回值: bigint
说明: 获得当前时区的UNIX时间戳
举例：
hive> select unix_timestamp() from dual;
1323309615
• 日期转 UNIX 时间戳函数 : unix_timestamp
语法: unix_timestamp(string date)
返回值: bigint
说明: 转换格式为"yyyy-MM-dd HH:mm:ss"的日期到UNIX时间戳。如果转化失败，则返回0。
举例：
hive> select unix_timestamp('2011-12-07 13:01:03') from dual;
1323234063
• 指定格式日期转 UNIX 时间戳函数 : unix_timestamp
语法: unix_timestamp(string date, string pattern)
返回值: bigint
说明: 转换pattern格式的日期到UNIX时间戳。如果转化失败，则返回0。
举例：
hive> select unix_timestamp('20111207 13:01:03','yyyyMMdd HH:mm:ss') from dual;
1323234063
• 日期时间转日期函数 : to_date
语法: to_date(string timestamp)
返回值: string
说明: 返回日期时间字段中的日期部分。
举例：
hive> select to_date('2011-12-08 10:03:01') from dual;
2011-12-08
• 日期转年函数 : year
语法: year(string date)
返回值: int
说明: 返回日期中的年。
举例：
hive> select year('2011-12-08 10:03:01') from dual;
2011
hive> select year('2012-12-08') from dual;
2012
• 日期转月函数 : month
语法: month (string date)
返回值: int
说明: 返回日期中的月份。
举例：
hive> select month('2011-12-08 10:03:01') from dual;
12
hive> select month('2011-08-08') from dual;
8
• 日期转天函数 : day
语法: day (string date)
返回值: int
说明: 返回日期中的天。
举例：
hive> select day('2011-12-08 10:03:01') from dual;
8
hive> select day('2011-12-24') from dual;
24
• 日期转小时函数 : hour
语法: hour (string date)
返回值: int
说明: 返回日期中的小时。
举例：
hive> select hour('2011-12-08 10:03:01') from dual;
10
• 日期转分钟函数 : minute
语法: minute (string date)
返回值: int
说明: 返回日期中的分钟。
举例：
hive> select minute('2011-12-08 10:03:01') from dual;
3
• 日期转秒函数 : second
语法: second (string date)
返回值: int
说明: 返回日期中的秒。
举例：
hive> select second('2011-12-08 10:03:01') from dual;
1
 
• 日期转周函数 : weekofyear
语法: weekofyear (string date)
返回值: int
说明: 返回日期在当前的周数。
举例：
hive> select weekofyear('2011-12-08 10:03:01') from dual;
49
 
• 日期比较函数 : datediff
语法: datediff(string enddate, string startdate)
返回值: int
说明: 返回结束日期减去开始日期的天数。
举例：
hive> select datediff('2012-12-08','2012-05-09') from dual;
213
• 日期增加函数 : date_add
语法: date_add(string startdate, int days)
返回值: string
说明: 返回开始日期startdate增加days天后的日期。
举例：
hive> select date_add('2012-12-08',10) from dual;
2012-12-18
 
• 日期减少函数 : date_sub
语法: date_sub (string startdate, int days)
返回值: string
说明: 返回开始日期startdate减少days天后的日期。
举例：
hive> select date_sub('2012-12-08',10) from dual;
2012-11-28
 
```

#### 第五部分：条件函数

```
第五部分：条件函数
•If函数: if
•非空查找函数: COALESCE
•条件判断函数：CASE
• If 函数 : if
语法: if(boolean testCondition, T valueTrue, T valueFalseOrNull)
返回值: T
说明:  当条件testCondition为TRUE时，返回valueTrue；否则返回valueFalseOrNull
举例：
hive> select if(1=2,100,200) from dual;
200
hive> select if(1=1,100,200) from dual;
100
• 非空查找函数 : COALESCE
语法: COALESCE(T v1, T v2, …)
返回值: T
说明:  返回参数中的第一个非空值；如果所有值都为NULL，那么返回NULL
举例：
hive> select COALESCE(null,'100','50′) from dual;
100
条件判断函数： CASE
语法 : CASE a WHEN b THEN c [WHEN d THEN e]* [ELSE f] END
返回值 : T
说明：如果 a 等于 b ，那么返回 c ；如果 a 等于 d ，那么返回 e ；否则返回 f
举例：
hive> Select case 100 when 50 then 'tom' when 100 then 'mary' else 'tim' end from dual;
mary
 
```

#### 第六部分：字符串函数

```
•字符串长度函数：length
•字符串反转函数：reverse
•字符串连接函数：concat
• 带分隔符字符串连接函数：concat_ws
• 字符串截取函数：substr,substring
• 字符串截取函数：substr,substring
• 字符串转大写函数：upper,ucase
• 字符串转小写函数：lower,lcase
• 去空格函数：trim
• 左边去空格函数：ltrim
• 右边去空格函数：rtrim
•正则表达式替换函数：regexp_replace
•正则表达式解析函数：regexp_extract
•URL解析函数：parse_url
•json解析函数：get_json_object
•空格字符串函数：space
•重复字符串函数：repeat
•首字符ascii函数：ascii
•左补足函数：lpad
•右补足函数：rpad
•分割字符串函数: split
•集合查找函数: find_in_set
• 字符串长度函数： length
语法: length(string A)
返回值: int
说明：返回字符串A的长度
举例：
hive> select length('abcedfg') from dual;
7
• 字符串反转函数： reverse
语法: reverse(string A)
返回值: string
说明：返回字符串A的反转结果999999举例：
hive> select reverse(abcedfg’) from dual;
gfdecba
例: 
查询列表字符串长度
select distinct length(TX_ID) from CPM_VOUCHER WHERE TX_ID is not null;
字符串截取
SUBSTR('20211030',0,6) = '202110'

多行变一列（字符串拼接）
hive中的concat，concat_ws，collect_set用法

    表
    user	order_type	order_number
    user1	delivered	10
    user2	returned	1
    user1	returned	3
    user2	delivered	20\
    
    目标：
    user	order
    user1	delivered(10),returned(3)
    user2	delivered(20),returned(1)
    
    1.使用concat（）函数将order_type和order_number连接起来
    concat（order_type,'(',order_number,')'）
    结果
    user	order
    user1	delivered(10)
    user2	returned(1)
    user1	returned(3)
    user2	delivered(20)
    2.使用concat_ws（）和collect_set（）进行合并行
    将上面列表中一个user可能会占用多行转换为每个user占一行的目标表格式，实际是“列转行”

    select user,concat_ws(',',collect_set(concat（order_type,'(',order_number,')'）))  order  from table group by user

    order是别名
    collect_set的作用：
    （1）去重，对group by后面的user进行去重
    （2）对group by以后属于同一user的形成一个集合，结合concat_ws对集合中元素使用，进行分隔形成字符串
    
一列变多行

	使用 : lateral view explode（）
    每个功效之间用逗号连接，例如 ”美白，补水，抗衰老“
    由于我们需要对功效进行统计，因此需要对keyword字段拆分，拆分到多行。

    select col1,effect from table1 a 
    lateral view explode(split(a.keyword,',')) t as effect where 1=1
    其中，

    explode(split(a.keyword,',')) ，将keyword字段，按照逗号切分
    lateral view explode(split(a.keyword,',')) t as effect  切分后的列取一个别名effect


    具体原理（过于难，不解释了）：

    lateral view首先为原始表的每行调用UDTF，UDTF会把一行拆分成一行或者多行，lateral view在把结果组合，产生一个支持别名表的虚拟表。
```



#### hive拉链表思路

```
拉链表


    SELECT s1.st_cust_name
      ,s1.st_certificate_no
        -- 如果手机号为，空则取上一条手机号补上（前提是同一个证件号下的），如果不为空则不变
      ,IF(s1.st_phone is null ,LAG(s1.st_phone,1) OVER(PARTITION BY s1.st_certificate_no order by s1.st_create_time asc),s1.st_phone) as st_phone
        -- 如果地址为空，则取上一条地址不上（前提是同一个证件号下的），如果不为空则不变
      ,IF(s1.st_present_residential_address is null,LAG(s1.st_present_residential_address,1) OVER(PARTITION BY s1.st_certificate_no order by s1.st_create_time asc)
            ,s1.st_present_residential_address
         ) as st_present_residential_address
        -- 如果起始时间为空，则设为最小时间，否则不变
      ,IF(s1.st_create_time is null ,'1970-01-01 00:00:00',s1.st_create_time) as st_create_time
        -- 取下一条起始日期作为当前的终止日期（前提是同一个证件号下的），如果取到后为空则设为无穷大时间
      ,case when LEAD(s1.st_create_time,1) OVER(PARTITION BY s1.st_certificate_no order by s1.st_create_time asc) is null then '9999-99-99 99:99:99'
            else LEAD(s1.st_create_time,1) OVER(PARTITION BY s1.st_certificate_no order by s1.st_create_time asc) end end_time
    --   ,ROW_NUMBER() OVER(PARTITION BY s1.st_phone,s1.st_present_residential_address order by s1.st_create_time asc) as cat
    --   ,LAG(s1.st_present_residential_address,1) OVER(PARTITION BY s1.st_certificate_no order by s1.st_create_time asc) as lag_address
    --   ,ty
    from (
        SELECT a.st_cust_name
              ,a.st_certificate_no
              ,a.st_phone
              ,a.st_present_residential_address
              ,a.st_create_time
            --   ,"客户" as ty
        from ods_cust_info_df a where a.thedate = '20230428' and a.st_certificate_type = 'ID_CARD'
        union all
        SELECT b.name 
              ,b.certificate_no 
              ,b.mobile 
              ,b.residence_address 
              ,b.create_time 
            --   ,"订单" as ty
        from stg_zh_orders_order_lessee_df b where b.thedate = '20230428' and b.certificate_type = 'ID_CARD' 
        ) s1 
        where length(s1.st_certificate_no) = 18 order by s1.st_certificate_no ,st_create_time  ASC
```



## 参考文献: 

本文借鉴的原文作者和链接

「伴生伴熟」原创文章：https://blog.csdn.net/chinacmt/article/details/118721972

「yjgithub」原创文章：https://blog.csdn.net/yjgithub/article/details/104796304

「yj2434」原创文章：https://blog.csdn.net/yj2434/article/details/108059867

「小甜瓜Melon」原创文章：https://www.jianshu.com/p/ceed17d93c70

 [夜空最亮的9星]  原创文章: https://www.jianshu.com/p/4a0b4cba6c6c

「爱庄哥哥」  原创文章:https://blog.csdn.net/weixin_45592182/article/details/108583050

「大大大大肉包」原创文章：https://blog.csdn.net/qq_42456324/article/details/120369629

「waiwai3」原创文章：https://blog.csdn.net/waiwai3/article/details/79071544

 [Loss Dragon](https://www.zhihu.com/people/loss-dragon)  原创文章：   https://zhuanlan.zhihu.com/p/183800056