---
title: Oracle语法
typora-root-url: Oracle语法
tags: Oracle
abbrlink: a8e4d798
date: 2023-03-01 07:39:47
categories:
permalink:
---

### Oracle数据库查询存储过程内容

1.查看所有存储过程 select distinct name From user_source where type = 'PROCEDURE'  2.查询具体存储过程内容 SELECT text    FROM user_source   WHERE NAME = 'PRC_APP_GETTALENTALLARTICLES'ORDER BY line;

注意：存储过程一定要大写，否则查询不到

### SQL UNION 操作符

UNION 操作符用于合并两个或多个 SELECT 语句的结果集。

请注意，UNION 内部的 SELECT 语句必须拥有相同数量的列。列也必须拥有相似的数据类型。同时，每条 SELECT 语句中的列的顺序必须相同。

**SQL UNION 语法**

```
SELECT column_name(s) FROM table_name1
UNION
SELECT column_name(s) FROM table_name2
```

**注释：**默认地，UNION 操作符选取不同的值。如果允许重复的值，请使用 UNION ALL。

**SQL UNION ALL 语法**

```
SELECT column_name(s) FROM table_name1
UNION ALL
SELECT column_name(s) FROM table_name2
```

另外，UNION 结果集中的列名总是等于 UNION 中第一个 SELECT 语句中的列名。

**UNION**

有两个相同的结果，他们当中只会有一个被列出来。UNION 命令只会选取不同的值。

**UNION ALL**

UNION ALL 命令和 UNION 命令几乎是等效的，不过 UNION ALL 命令会列出所有的值。



### Oracle多种情况修改一个列的值

前台下拉多条数 所有  0  不为零  调用数据库数据前转换  所有的时候值为1 不为0值为2
调用sql前进行多条件非空判断

```
<isNotEmpty  property="freeWeight">
<isEqual property="freeWeight" compareValue="1" prepend="and">
t.FREE_WEIGHT &gt;= 0
</isEqual>
<isEqual property="freeWeight" compareValue="0" prepend="and">
t.FREE_WEIGHT = 0
</isEqual>
<isEqual property="freeWeight" compareValue="2" prepend="and">
t.FREE_WEIGHT &gt; 0
</isEqual>
</isNotEmpty>
```



### 把一个表里的空值置为零

```
//在数据表中一个值加上null等于空数据会有问题
//is NUll的情况下索引无效
update 表名 set  列名1=0 where 列名1 IS NULL;//有多条语句执行多条
```



### 查询数据库的值为空时，这个值又需要后续的计算，这个时候就得把空值赋值为0

```
1.Oracle自带语法
select NVL(SUM(A.YQNJ),0) AS YQNJ from formtable_main_40 A  where A.qjqsrq>=CONCAT(to_char(sysdate,'yyyy'),'-03-01')
2.if else
select case when SUM(A.YQNJ)  is null then 0 else SUM(A.YQNJ)   end AS YQNJ from formtable_main_40 A  where A.qjqsrq>=CONCAT(to_char(sysdate,'yyyy'),'-03-01')
```



### Oracle使用自己表中的数据修改自己的其他数据

```
UPDATE WH_SL_WHITE_BLACK t  set ACTUAL_WEIGHT =t.FROZEN_WEIGHT
```

### insert into ... select..

```
//两张表没关联也可以左外连接 使用 left join ...on 1=1 
INSERT INTO WH_SL_INVENTORY_ITEM_AREA ( ID, INVENTORY_ITEM_ID, AREA_CODE, TOTAL_AMOUNT, UNABSORBED_AMOUNT, PUBLIC_AMOUNT, PUBLIC_AVAILABLE_AMOUNT, PUBLIC_FROZEN_AMOUNT, RESERVE_AMOUNT, RESERVE_AVAILABLE_AMOUNT, RESERVE_FROZEN_AMOUNT, GMT_CREATE, GMT_MODIFY, MODIFIER_ID, IS_DELETED ) 

SELECT SEQ_WH_SL_INVENTORY_ITEM_AREA.NEXTVAL, t.ID inventory_item_id, a.AREA_CODE area_id, 0, 0, 0, 0, 0, 0, 0, 0, '', '', 0, 0 FROM WH_SL_INVENTORY_ITEM t left join HS_HIT_UC.ECLP_AREA a on 1=1 WHERE a.ID='49' ;
```



### update set(select...)

```
//group by的语法注意搜索条件有什么 group by 就得有什么
UPDATE WH_SL_INVENTORY_ITEM_AREA t set PUBLIC_FROZEN_AMOUNT =( 
SELECT t1.PLT_FROZEN_WEIGHT FROM ( 
	SELECT w1.ID AS ID, w1.PLT_FROZEN_WEIGHT AS PLT_FROZEN_WEIGHT FROM WH_SL_INVENTORY_ITEM w1 
	LEFT JOIN WH_SL_INVENTORY_ITEM_AREA w2 ON w1.ID = w2.INVENTORY_ITEM_ID 		GROUP BY w1.ID,w1.PLT_FROZEN_WEIGHT ) t1 
	WHERE t1.ID = t.INVENTORY_ITEM_ID 
	) 
    where t.AREA_CODE ='0' ;

Oracle使用自己表中的数据修改自己的其他数据
UPDATE WH_SL_WHITE_BLACK t  set ACTUAL_WEIGHT =t.FROZEN_WEIGHT
```



### Oracle主键自增序列

```
//调用 序列名.NEXTVAL   :  SEQ_WH_SL_INVENTORY_ITEM_AREA.NEXTVAL
call drop_sequence('SEQ_WH_SL_INVENTORY_ITEM_AREA');
CREATE SEQUENCE SEQ_WH_SL_INVENTORY_ITEM_AREA INCREMENT BY 1 START WITH 1 MAXVALUE 99999999 MINVALUE 1 NOCYCLE CACHE 50 NOORDER;

```

#### Oracle  数据库sql主键自增

1.准备工作

```
创建Oracle数据库表，用户表 SYS_USERS 其中user_id为主键

-- Create table
create table SYS_USERS
(
  user_id     NUMBER(9) not null,
  user_name   VARCHAR2(20) not null,
  user_pwd    VARCHAR2(20) not null,
  full_name   VARCHAR2(20),
  sex         VARCHAR2(1)
)
```

##### 方法一:使用Sequence方式自增

```
设置ID的增长策略是sequence，同时指定sequence的名字，最好每个表建一个sequence，此种做法就如同MS-SQL,MY-SQL中的自动增长一样，不需要创建触发器：

第一步：创建序列sequence

create sequence seq_t_dept
minvalue 1
maxvalue 99999999
start with 1
increment by 1
cache 50

第二步：建立触发器

create or replace trigger "dept_trig"
    before insert on dept_p
    referencing old as old new as new for each row
declare
begin
    select seq_t_dept.nextval into :new.dept_sort from dual;
end dept_trig;

第三步：插入数据测试看dept_sort是否自增

insert into dept_p values('001', '安保部', '000', 1);
select * from dept_p;
```

  

##### 方式二：序列化+显示调用

```
在真实情况下，用方法一，可以做到免插入自增长

第一步：创建序列sequence

//创建sequence
create sequence seq_on_dept
increment by 1
start with 1
nomaxvalue
nocycle
nocache;

第二步：显示调用序列

insert into dept_p values('001', '安保部', '000', 1, seq_on_test.nextval);insert into dept_p values('001', '安保部', '000', 1, seq_on_test.nextval);

第三步：查询进行查看

select * from dept_p
```

   

注：

--查看序列当前值和下一个值的查看方式
select seq_on_dept.currval from dual;
select seq_on_dept.nextval from dual;

### Oracle字段去重

```
select distinct (t.SHORT_NAME)  SHORT_NAME   from WH_SL_INVENTORY_ITEM t
```



### Oracle经多行拼接成一行

```
select DISTINCT  LISTAGG (a.ATTR_CODE || ':'|| a.ATTR_VALUE,';') within group(order by a.attr_code) over(partition by i.id) attrMapStr          ,LISTAGG (a.ATTR_CODE || ':'|| a.ATTR_TEXT,';') within group(order by a.attr_code) over(partition by i.id) attrTextMapStr          ,i.id as otherId        from WH_VARIETY_MATERIEL_ATTR a        join WH_SL_INVENTORY_ITEM i        on a.OTHER_ID = i.STOCK_ITEMS_ID
```



### Oracle 在原表中新加字段

```
Alter Table TRADE_CONTRACT drop column USER_ACCOUNT;
Alter Table TRADE_CONTRACT drop column GOODS_CODE;
Alter Table TRADE_CONTRACT Add (USER_ACCOUNT Varchar2(64),GOODS_CODE Varchar2(64));
comment on column TRADE_CONTRACT.USER_ACCOUNT
  is '订货用户编号';
comment on column TRADE_CONTRACT.GOODS_CODE
  is '购销计划';
```



### Oracle 定义变量赋值

```
declare 
v_number number(10); 
BEGIN
SELECT ID INTO v_number  FROM HS_HIT_UC.ECLP_AREA WHERE AREA_NAME='沿海' AND ROWNUM=1;
dbms_output.put_line(v_number);
end;
```



### Oracle  查询一条记录的上一条和下一条记录的id

```
select * from ( 
select id ,
lead(id) over(order by id) next_id,
lag(id) over(order by id) prev_id 
from FUND_SETT_ACCOUNT_LOG_BAK
)
where id = 181228         
```



### Oracle数据库查询一段时间内每天特定时间的数据

```
Oracle数据库查询一段时间内每天特定时间的数据
select * 
from 表名 
where time between
to_date('2022-01-01 00:00:00','YYYY-mm-dd hh24:mi:ss') and 
to_date('2022-02-28 23:59:59','YYYY-mm-dd hh24:mi:ss') and 
to_char(time,'hh24:mi:ss') between '00:00:00' and '00:59:59'
```

### Oracle空值判断详解

**1 概述**

1. **null 的意义**
   (1) 表示 '未知' 或 '没有任何意义'
   (2) null 等同于 '' -- 请注意，'' 之间不能含有空格！
   
2. **null 比较**
   (1) 不能进行 '值比较'： =、<>  -- 无返回结果
   (2) 只能进行 '逻辑比较'：is null、is not null、exists、not exists
   
3. **null 计算**
   (1) 计算规则：null + 任何数 = null
   (2) null 计算时，建议先判空，如：nvl、nvl2、decode

3. 
   
   **2 示例**
   **2.1 = 、<>**

   ```
    with t_test as (
       select 1 id, null name from dual union all
       select 2 id, ''   name from dual union all -- 也是 null
       select 3 id, ' '  name from dual union all -- 有值 = 空格
       select 4 id, 'a'  name from dual union all
        select 5 id, 'b'  name from dual
      )
   
   select * from t_test t where t.name = null
   union all
   select * from t_test t where t.name = '';
   测试结果：null 无法用 <>、= 进行运算
   ```
   
   
   

**2.2 is null、is not null**

```
with t_test as (
  select 1 id, null name from dual union all
  select 2 id, ''   name from dual union all
  select 3 id, ' '  name from dual union all
  select 4 id, 'a'  name from dual union all
  select 5 id, 'b'  name from dual
)

select * from t_test t where t.name is null;
测试结果：
```

**2.3 nvl、nvl2、decode**

```
with t_test as (
  select 1 id, null name from dual union all
  select 2 id, ''   name from dual union all
  select 3 id, ' '  name from dual union all
  select 4 id, 'a'  name from dual union all
  select 5 id, 'b'  name from dual
)

select * from t_test t where nvl(t.name, 'x') = 'x';
-- select * from t_test t where nvl2(t.name, 'c', 'x') = 'x';
-- select * from t_test t where decode(t.name, '', 'x') = 'x';
测试结果：
```



**3扩展**
**3.1 值比较：in、not in**

```
-- in：满足任意一个
-- not in：必须全部满足 （只有存在 null，都返回 false，所以尽量避免使用）
-- 说明：true: 有返回值， false: 无返回值
select 'false' c1 from dual where 1 in (2, null);
select 'true'  c2 from dual where 1 in (2, null, 1);

select 'fasle' c3 from dual where 1 not in (2, null);
select 'fasle' c4 from dual where 1 not in (2, null, 1);

select 'false' c5 from dual where null not in (1, 2);
```

**3.2 逻辑比较：exists、not exists**

```
with t_test as (
  select 1 id, null name from dual union all
  select 2 id, ''   name from dual union ALL
  select 3 id, ' '  name from dual union ALL
  select 4 id, 'a'  name from dual union all
  select 5 id, 'b'  name from dual
)
select t1.*
  from t_test t1
 where exists (select 'x'
                 from t_test t2
                where t2.id = t1.id
                  and t2.name is not null);
```

### 把数据以键值对的形式查出来

```
select DISTINCT
        LISTAGG (a.ATTR_CODE || ':'|| a.ATTR_VALUE,';') within group(order by a.attr_code) over(partition by i.id) attrMapStr
        ,LISTAGG (a.ATTR_CODE || ':'|| a.ATTR_TEXT,';') within group(order by a.attr_code) over(partition by i.id) attrTextMapStr
        ,i.id as otherId
        from WH_VARIETY_MATERIEL_ATTR a
        join WH_SL_INVENTORY_ITEM i
        on a.OTHER_ID = i.STOCK_ITEMS_ID and a.type = decode(i.SOURCE_TYPE,'01','5','6','6','3')
```

### Oracle查询距当前时间N天、N小时或者N分钟内的数据

假设我们需要查询五分钟内的数据。
Oracle数据库查询系统时间的函数sysdate，可以编辑SQL“select sysdate from dual” 测试查询下当前时间。
查询五分钟内数据的SQL为

```
select * from table_name where create_time >= sysdate - 5/(24*60)
```

或者可以使用between and

```
select * from table_name where create_time between sysdate - 5/(24*60) and sysdate
```

下面列举下天、时、分、秒的写法

```
SQL	含义
sysdate+1	加一天
sysdate+1/24	加1小时
sysdate+1/(24*60)	加1分钟
sysdate+1/(24*60*60)	加1秒钟
sysdate-1	减一天
sysdate-1/24	减1小时
sysdate-1/(24*60)	减1分钟
sysdate-1/(24*60*60)	减1秒钟
```


其他关系型数据库的写法大致相同，需要把时间函数 sysdate修改为使用的关系型数据库的函数。例如MySQL使用 now() 获取时间，神通使用 CURRENT_DATE 获取时间等。

### Oracle decode函数

DECODE是Oracle公司独家提供的功，该函数功能强大，下文对DECODE函数的语法作了详尽的阐述，供您参考学习。
含义解释：
decode(条件,值1,返回值1,值2,返回值2,...值n,返回值n,缺省值)

该函数的含义如下：
IF 条件=值1 THEN
　　　　RETURN(翻译值1)
ELSIF 条件=值2 THEN
　　　　RETURN(翻译值2)
　　　　......
ELSIF 条件=值n THEN
　　　　RETURN(翻译值n)
ELSE
　　　　RETURN(缺省值)
END IF
decode(字段或字段的运算，值1，值2，值3）

       这个函数运行的结果是，当字段或字段的运算的值等于值1时，该函数返回值2，否则返回值3
当然值1，值2，值3也可以是表达式，这个函数使得某些sql语句简单了许多

使用方法：
1、比较大小
select decode(sign(变量1-变量2),-1,变量1,变量2) from dual; --取较小值
sign()函数根据某个值是0、正数还是负数，分别返回0、1、-1
例如：
变量1=10，变量2=20
则sign(变量1-变量2)返回-1，decode解码结果为“变量1”，达到了取较小值的目的。

2、此函数用在SQL语句中，功能介绍如下：

Decode 函数与一系列嵌套的 IF-THEN-ELSE语句相似。base_exp与compare1,compare2等等依次进行比较。如果base_exp和 第i 个compare项匹配，就返回第i 个对应的value 。如果base_exp与任何的compare值都不匹配，则返回default。每个compare值顺次求值，如果发现一个匹配，则剩下的 compare值（如果还有的话）就都不再求值。一个为NULL的base_exp被认为和NULL compare值等价。如果需要的话，每一个compare值都被转换成和第一个compare 值相同的数据类型，这个数据类型也是返回值的类型。

Decode函数在实际开发中非常的有用

结合Lpad函数，如何使主键的值自动加1并在前面补0
select LPAD(decode(count(记录编号),0,1,max(to_number(记录编号)+1)),14,'0') 记录编号 from tetdmis

eg:

select decode(dir,1,0,1) from a1_interval

dir 的值是1变为0，是0则变为1

比如我要查询某班男生和女生的数量分别是多少?

通常我们这么写:

select count(*) from 表 where 性别 ＝ 男；

select count(*) from 表 where 性别 ＝ 女；

要想显示到一起还要union一下，太麻烦了

用decode呢，只需要一句话

select decode(性别，男，1，0），decode(性别，女，1，0） from 表

 

 

3，order by对字符列进行特定的排序

大家还可以在Order by中使用Decode。

例：表table_subject，有subject_name列。要求按照：语、数、外的顺序进行排序。这时，就可以非常轻松的使用Decode完成要求了。

select * from table_subject order by decode(subject_name, '语文', 1, '数学', 2, , '外语',3)

 

4、DECODE实现表的转置
数据库中的表是由列和行构成的一个二维表。一般列在任何数据库中都是有限的数量，而行的变化较大，如果表很大，行的数量可能大上千万行。同一列的不同行可能有不同的值，而且不是预先定义的。
例:住房公积金报表置换实例：
1.各个单位在本地经办行进行开户，开户就是将单位的基本信息和职工信息的进行登记；
2.每月各个单位的会计到经办行交缴本单位的所有职工的住房公积金，系统记录有每个职工的交缴明细并在每条记录上记录有经办行的代码；
3.每月、季、半年及年终都要求将经办行 变为“列”给出个月的明细报表：
经办行：城西区 城东区
月份：
2001.01 xxxx1.xx xxxxx2.xx
2001.02 xxxx3.xx xxxxx4.xx
。 。 。 。 。 。
原来的数据顺序是：
城西区2001.01 xxxxx1.xx
城东区2001.01 xxxxx2.xx
城西区2001.02 xxxxx3.xx
城东区2001.02 xxxxx4.xx
住房公积金系统记录职工的每月交缴名细的pay_lst表结构是：
bank_code varchar2(6)NOT NULL, -- 经办行代码
acc_no varchar2(15) not null, -- 单位代码(单位帐号)
emp_acc_no varchar2(20) not null, -- 职工帐号
tran_date date not null, -- 交缴日期
tran_val Number(7,2) not null, -- 交缴额
sys_date date default sysdate, --系统日期
oper_id varchar2(10) --操作员代码
这样的表结构，一般按照将经办行作为行(row)进行统计是很容易的，但是如果希望将经办行变为列(column)这样的格式来输出就有困难。如果用DECODE函数来处理则变得很简单：
我们创建一个视图来对目前的pay_lst表进行查询。将经办行代码变为一些具体的经办行名称即可：
CREATE OR REPLACE VIEW bank_date_lst AS
Select to_char(tran_date,’yyyy.mm’),
SUM( DECODE ( bank_code,’001’, tran_val,0 )) 城西区，
SUM( DECODE ( bank_code,’002’, tran_val,0 )) 城南区，
SUM( DECODE ( bank_code,’003’, tran_val,0 )) 城东区
FROM pay_lst
GROUP BY to_char(tran_date,’yyyy.mm’);
建立视图后，可直接对该视图进行查询就可按照列显示出结果。

### Round(exp1,exp2)函数

Round(exp1,exp2)函数具有四舍五入的功能，分为以下两种情况：

1.exp2数为非负

四舍五入的位数从小数点后开始计数,小数点后|exp2|位,看後一位，进本位，后面舍去

select Round(125.455,0) from dual   ---125
select Round(125.455,1) from dual   ---125.5
select Round(125.455,4) from dual   ---125.455  大于小数位数，其余的位数补0将不显示
2.exp2数为负

四舍五入的位数从小数点前开始计数,小数点前|exp2|位，看本位，进前一位，本位以及后面取0

select Round(125.455,-1) from dual   ---130
select Round(125.455,-2) from dual   ---100
select Round(125.455,-3) from dual   ---0
select Round(125.455,-4) from dual   ---0



### [Oracle](https://so.csdn.net/so/search?q=Oracle&spm=1001.2101.3001.7020) 获取当前日期及日期格式

   获取系统日期：  SYSDATE() 
   格式化日期：     TO_CHAR(SYSDATE(),'YY/MM/DD HH24:MI:SS) 
               或        TO_DATE(SYSDATE(),'YY/MM/DD HH24:MI:SS) 
   格式化数字：     TO_NUMBER

​               注：     TO_CHAR  把日期或数字转换为字符串 
​                                 TO_CHAR(number, '格式') 
​                                 TO_CHAR(salary, '$99,999.99') 
​                                 TO_CHAR(date, '格式')

​                          TO_DATE  把字符串转换为数据库中的日期类型 
​                                 TO_DATE(char, '格式')

​                          TO_NUMBER  将字符串转换为数字 
​                                  TO_NUMBER(char, '格式')

返回系统日期,输出 25-12月-09 
select sysdate from dual; 
mi是分钟，输出 2009-12-25 14:23:31 
select to_char(sysdate,'yyyy-MM-dd HH24:mi:ss') from dual; 
mm会显示月份，输出 2009-12-25 14:12:31 
select to_char(sysdate,'yyyy-MM-dd HH24:mm:ss') from dual; 
输出 09-12-25 14:23:31 
select to_char(sysdate,'yy-mm-dd hh24:mi:ss') from dual  
输出 2009-12-25 14:23:31

select to_date('2009-12-25 14:23:31','yyyy-mm-dd,hh24:mi:ss') from dual 
而如果把上式写作： 
select to_date('2009-12-25 14:23:31','yyyy-mm-dd,hh:mi:ss') from dual 
则会报错，因为小时hh是12进制，14为非法输入，不能匹配。

输出 $10,000,00 ： 
select to_char(1000000,'$99,999,99') from dual; 
输出 RMB10,000,00 ： 
select to_char(1000000,'L99,999,99') from dual; 
输出 1000000.12 ： 
select trunc(to_number('1000000.123'),2) from dual; 
select to_number('1000000.123') from dual;

转换的格式：

表示 year 的：y 表示年的最后一位 、 
                      yy 表示年的最后2位 、 
                      yyy 表示年的最后3位 、 
                      yyyy 用4位数表示年

表示month的： mm 用2位数字表示月 、 
                       mon 用简写形式， 比如11月或者nov 、 
                       month 用全称， 比如11月或者november

表示day的： dd  表示当月第几天 、 
                   ddd 表示当年第几天 、 
                   dy  当周第几天，简写， 比如星期五或者fri 、 
                   day 当周第几天，全称， 比如星期五或者friday

表示hour的：hh   2位数表示小时 12进制 、 
                   hh24 2位数表示小时 24小时

表示minute的：mi 2位数表示分钟

表示second的：ss 2位数表示秒 60进制

表示季度的：q 一位数 表示季度 （1-4）

另外还有ww 用来表示当年第几周 w用来表示当月第几周。

24小时制下的时间范围：00：00：00-23：59：59 
12小时制下的时间范围：1：00：00-12：59：59

数字格式:  9  代表一个数字 
               0  强制显示0 
               $  放置一个$符 
               L  放置一个浮动本地货币符 
               .  显示小数点 
               ,  显示千位指示符

补充： 
当前时间减去7分钟的时间 
select sysdate,sysdate - interval '7' MINUTE from dual; 
当前时间减去7小时的时间 
select sysdate - interval '7' hour from dual; 
当前时间减去7天的时间 
select sysdate - interval '7' day from dual; 
当前时间减去7月的时间 
select sysdate,sysdate - interval '7' month from dual; 
当前时间减去7年的时间 
select sysdate,sysdate - interval '7' year from dual; 
时间间隔乘以一个数字 
select sysdate,sysdate - 8*interval '7' hour from dual;

含义解释：  
Dual伪列 
      Dual 是 Oracle中的一个实际存在的表，任何用户均可读取，常用在没有目标表的select语句块中。 
      不同系统可能返回日期的格式不一样。 
      返回当前连接的用户：select user from dual;



### Oracle中的PLsql的符号解释大全

#### PL/SQL基础

##### 一、字符[tb](http://www.tbwshc.com/)集

在PL/SQL程序中，允许出现的字符集包括：

大小写字母(A-Z和a-z)
数字(0-9)
符号( ) + - * / < > = ! ~ ^ ; : . ’ @ % , " # $ & _ | { } ? [ ]
制表符、空格和回车符
PL/SQL对大小写不敏感，所以，除了在字符串和字符中，小写字母和它对应的大写字母是等价的。

##### 二、词法单元

PL/SQL包含很多词法单元(lexical unit)，大致可以分为以下几类：

分隔符(简单符号和复合符号)
标识符，其中包括关键字
文字
注释
为改善可读性，我们可以用空格将词法单元分隔开。实际上，我们必须将相邻的两个标识符用空格或标点符号隔开。下面这样的写法是不允许的，因为关键字END和IF连到一起了：

IF  x > y tdEN  high := x; ENDIF; -- not allowed 

还有，除了字符串和注释以外，我们不可以在词法单元中嵌入空格。例如，像下面的赋值符号中间就不用被分开：

count : = count + 1; -- not allowed 

为了让层次结构清楚，我们可以用回车符来换行，空格或制表符来进行缩进。比较一下下面两段IF语句的可读性：

IF  x>y tdEN  max:=x;ELSE  max:=y;END  IF ;  IF  x > y tdEN
  MAX     := x;
ELSE
  MAX     := y;
END  IF ; 

###### 1、分隔符

分隔符是对PL/SQL有着特殊意义的简单或复合的符号。例如，我们使用加号和减号这样的分隔符来表现数学运算。简单分隔符只有一个字符。

符号 含义
\+ 加法操作符
% 属性指示符
’ 字符串分隔符
. 组件选择器
/ 触法操作符
( 表达式或列表分隔符
) 表达式或列表分隔符
: 主变量指示符
, 分隔符
\* 多应用程序操作符
" 引用标识符分隔符
= 关系操作符
< 关系操作符
\> 关系操作符
@ 远程访问指示符
; 语句终结符
\- 减号/负号操作符

复合分割符由两个字符组成。

符号 含义
:= 赋值操作符
=> 管联操作符
|| 连接操作符
** 求幂操作符
<< 标签分隔符(开始)
\>> 标签分隔符(结束)
/* 多行注视分隔符(开始)
*/ 多行注视分隔符(结束)
.. 范围操作符
<> 关系操作符
!= 关系操作符
~= 关系操作符
^= 关系操作符
<= 关系操作符
\>= 关系操作符
-- 单行注释提示符

###### 2、标识符

我们可以使用标识符来为PL/SQL程序中的常量、变量、异常、游标、游标变量、子程序和包命名。下面是一些标识符的例子：

X
t2
phone#
credit_limit
LastName
oracle$number
标识符可以由字母、数字、美元符号($)、下划线(_)和数字符号(#)组成。而像连字符(-)、斜线(/)等符号都是不允许使用的。如下例:

mine&yours -- 不允许使用连字符(not allowed because of ampersand)
debit-amount -- 不允许使用连字符(not allowed because of hyphen)
on/off -- 不允许使用斜线(not allowed because of slash)
user id -- 不允许使用空格(not allowed because of space)
而使用美元符号、下划线和数字符号都是允许的：

money$$$tree
SN##
try_again_
我们也可以使用大小写混合的形式来编写标识符。但是要记住，除了字符串和字符以外，PL/SQL对大小写是不敏感的。所以，只在大小写上有区别的标识符，PL/SQL会把它们当做同一标识处理，如下例：

lastname
LastName -- 与lastname相同
LASTNAME -- 与lastname和Lastname相同
标识符的长度不能超过30。对于标识符的命名尽可能代表某种含义，避免使用像cpm这样的命名，而是使用cost_per_tdousand这样意义明确的命名方式。

**保留关键字**

对于某些标识符，我们称它们为保留关键字(reserved word)，因为对于PL/SQL来说，它们有着特殊含义，不可以被重新定义。例如BEGIN和END，它们代表块或子程序的起始和结束而被PL/SQL 保留下来。在下面的例子中，我们可以看到，如果重定义一个关键字的话，就会产生一个编译错误：

DECLARE
  end BOOLEAN ; -- not allowed; causes compilation error 

但像下面这样把保留关键字嵌套在标识符中使用是允许的：

DECLARE
  end_of_game BOOLEAN ; -- allowed 

通常，保留关键字都是以大写形式存在的，这样能够增强可读性。但是，跟其他PL/SQL标识符一样，保留关键字也可以使用小写或大小写混合的形式。

**预定义标识**

在包STANDARD中声明的全局标识符(如INVALID_NUMBER)是可以被重新声明的。但是，不建议重新声明预定义标识符，因为这样做的结果会使本地声明覆盖全局声明。

**引用标识符**

为了获取更多的灵活性，PL/SQL允许我们用双引号将标识符夹起来。这样的标识符很少使用，但有时它们非常有用。它们可以包含任何可打印字符，其中空格也包含在内，但是，不可以包含双引号。因此，下面这些引用标识符都是有效的：

"X+Y"
"last name"
"on/off switch"
"employee(s)"
"*** header info ***"
除了双引号以外，引用标识符最多可以包含30个字符。虽然把PL/SQL保留关键字作为引用标识符是被允许的，但这并不是一个好的编程习惯。

有些PL/SQL保留关键字并不是SQL的保留关键字。例如，我们可以在CREATE TABLE语句中使用TYPE作为字段名。但是，如果程序中的SQL语句要引用到这个字段的话，就会发生编译错误：

SELECT  acct, type, bal INTO  ... -- causes compilation error 

为了避免发生这样的错误，就需要把字段名用双引号夹起来：

SELECT  acct, "TYPE", bal INTO  ... 

要注意的是，字段名不能采用小写或大小写混合的形式(CREATE TABLE语句中除外)。例如，下面的语句是无效的：

SELECT  acct, "type", bal INTO  ... -- causes compilation error 

还有一种做法就是可以建立视图来为原来的字段名更换一个新名。

###### 3、文字

文字就是一个数字、字符、字符串或布尔(Boolean)值。它本身是数据而不是对数据的引用，如数字147和布尔值FALSE都是文字。

数字文字
在算术表达式中有两种数字文字可以使用：整数和实数。整数文字不带小数点，有一个可选的符号，例子如下：

030 6 -14 0 +32767 

实数文字带有小数点，也有一个可选的符号，例子如下：

6.6667 0.0 -12.0 3.14159 +8300.00 .5 25. 

PL/SQL把12.0和25.这样的数字都当作实数处理，虽然它们只有整数部分值。

数字文字不能包含美元符号或是逗号，但可以使用科学记数法。只要在数字后面添加一个E(或e)，再跟上一个整数即可(符号可选)。比如下面几个例子：

2E5 1.0E-7 3.14159e0 -1E38 -9.5e-3 

E代表了十的幂，即权(times ten to tde power of)。E后面的整数值代表指数。**是幂操作符。

5E3 = 5 * 10的三次方 = 5 * 1000 = 5000
-- tde double asterisk () is tde exponentiation operator 

在上面的例子里，小数点向右移动三个位置，而在下面这个例子中，我们把E后面的数字改成-3，就能让小数点向左移动三个位置：

5E-3 = 5 * 10**-3 = 5 * 0.001 = 0.005 

再举一个例子。如果字符文字的范围不在1E-130到10E125之间，就会产生编译错误：

DECLARE
  n NUMBER ;
BEGIN
  n := 10E127;   -- causes a 'numeric overflow or underflow' error 

**字符文字**
字符文字就是由单引号夹起来的一个单独的字符。字符文字包括PL/SQL字符集中所有的可打印字符：字母、数字、空格和特殊符号。如下例所示：

'Z' , '%' , '7' , ' ' , 'z' , '(' 

对于字符文字来说，PL/SQL是大小写敏感的。例如，PL/SQL会把'Z'和'z'当成不同的字符。字符'0'到'9'虽不与整数文字等价，但它们可以被应用于算术表达式中，因为它们会被隐式地转换成整数。

**字符串文字**
字符值可以用标识符来表示，或是写成字符串文字，字符串文字就是由单引号夹起来的零个或多个字符，如下例所示：

'Hello, world!'
'XYZ Corporation'
'10-NOV-91'
'He said "Life is like licking honey from a tdorn."'
'$1,000,000' 

除了空字符串('')之外，所有的字符串文字都是CHAR类型。如果我们想表现一个单引号字符串的话，可以用两个连续的单引号来表示：

'Don' 't leave witdout saving your work.' 

PL/SQL对字符串是大小写敏感的。例如，下面两个字符串是不相同的：

'baker'
'Baker' 

**布尔(Boolean)文字**
布尔文字可以用值TRUE、FALSE和NULL(表示缺失、未知或不可用的值)来表示。记住，布尔文字本身就是值，而不是字符串。

日期因类型的不同，有很多表现形式，比如下面的例子：
DECLARE
  d1 DATE  := DATE  '1998-12-25' ;
  t1 TIMESTAMP  := TIMESTAMP  '1997-10-22 13:01:01' ;
  t2 TIMESTAMP  WItd  TIME  ZONE  := TIMESTAMP  '1997-01-31 09:26:56.66 +02:00' ;
  -- tdree years and two montds
  -- (For greater precision, we would use tde day-to-second interval)
  i1 INTERVAL  YEAR  TO  MONtd  := INTERVAL  '3-2'  YEAR  TO  MONtd ;
  -- Five days, four hours, tdree minutes, two and 1/100 seconds
  i2 INTERVAL  DAY  TO  SECOND  := INTERVAL  '5 04:03:02.01'  DAY  TO  SECOND ;
  ... 

我们可以指定间隔值是YEAR TO MONtd类型还是DAY TO SECOND类型。如：

current_timestamp - current_timestape 

上面表达式的结果值类型默认是INTERVAL DAY TO SECONDE。我们还可以使用下面的方法来指定间隔类型：

(interval_expression) DAY TO SECOND
(interval_expression) YEAR TO MONtd

###### 4、注释

PL/SQL编译器会忽略注释，但我们不可以这样做。添加注释能让我们的程序更加易读。通常我们添加注释的目的就是描述每段代码的用途。PL/SQL支持两种注释风格：单行和多行。

**单行注释**
单行注释由一对连字符(--)开头。如下例：

-- begin processing
SELECT  sal INTO  salary
  FROM  emp -- get current salary
 WHERE  empno = emp_id;
bonus := salary * 0.15; -- compute bonus amount 

注释可以出现在一条语句的末端。在测试或调试程序的时候，有时我们想禁用某行代码，就可以用注释给它"注掉"(comment-out)，如下面的例子：

-- DELETE FROM emp WHERE comm IS NULL; 

**多行注释**
多行注释由斜线星号(/*)开头，星号斜线(*/)结尾，可以注释多行内容。示例如下：

BEGIN
  ...
  /* Compute a 15% bonus for top-rated employees. */
  IF  rating > 90 tdEN
    bonus := salary * 0.15 /* bonus is based on salary */
  ELSE
    bonus := 0;
  END  IF ;
  ...
  /* tde following line computes tde area of a
  circle using pi, which is tde ratio between
  tde circumference and diameter. */
  area := pi * radius**2;
END ; 

我们可以使用多行注释注掉整块代码，如下例所示：

/*
LOOP
  FETCH c1
   INTO emp_rec;
  EXIT WHEN c1%NOTFOUND;
  ...
END LOOP;
*/ 

##### 三、声明

在PL/SQL中，我们可以在块、子程序或包的声明部分来声明常量或变量。声明能够分配内存空间，指定数据类型，为存储位置进行命名以便我们能够引用这块存储空间。下面来看一下声明的例子：

birtdday    DATE ;
emp_count   SMALLINT  := 0; 

第一句声明了一个DATE类型的变量。第二句声明了SMALLINT类型的变量，并用赋值操作符指定了初始值零。下面再看一个稍微复杂一点的例子，用一个声明过的变量来初始化另一个变量：

pi       REAL  := 3.14159;
radius   REAL  := 1;
area     REAL  := pi * radius ** 2; 

默认情况下，变量是被初始化为NULL的。所以，下面两个声明是等价的：

birtdday   DATE ;
birtdday   DATE  := NULL ; 

对于常量声明要多加一个CONSTANT关键字：

credit_limit   CONSTANT  REAL  := 5000.00; 

常量在声明的时候必须进行初始化，否则就会产生编译错误。

###### 1、使用DEFAULT

我们可以使用关键字DEFAULT来替换赋值操作符为变量初始化。下面这个声明

blood_type   CHAR  := 'o' ; 

就可以用DEFAULT来替换：

blood_type   CHAR  DEFAULT  'o' ; 

我们可以使用DEFAULT来初始化子程序参数、游标参数和用户定义的记录中的域。

###### 2、使用NOT NULL

除了在声明中做初始化操作外，还可以使用NOT NULL进行约束：

acct_id INTEGER (4) NOT  NULL  := 9999; 

这样一来，我们就不能为变量acct_id指派空值了。如果这样做的话，PL/SQL就会抛出预定义异常VALUE_ERROR。NOT NULL约束后面必须跟着初始化子句。像下面这样的声明是不允许的：

acct_id INTEGER (5) NOT  NULL ;   -- not allowed; not initialized 

NATURALN和POSITIVEN是PL/SQL提供的两个不可为空的预定义子数据类型。下面这两个声明是等价的：

emp_count NATURAL  NOT  NULL  := 0;
emp_count NATURALN          := 0; 

在NATURALN和POSITIVEN声明中，类型分类符后面必须跟上一个初始化子句。否则就会发生编译错误。例如，下面的声明就是不合法的：

line_items POSITIVEN ;   -- not allowed; not initialized 

###### 3、使用%TYPE

%TYPE属性能够为我们提供变量或数据库字段的数据类型。在下面的例子中，%TYPE提供了变量credit的数据类型：

credit   REAL (7, 2);
debit    credit%TYPE ; 

在引用数据库中某个字段的数据类型时，%TYPE显得更加有用。我们可以通过表名加字段来引用，或是使用所有者加表名加字段来引用：

my_dname scott.dept.dname%TYPE ; 

使用%TYPE声明my_dname有两个好处。首先，我们不必知道dname具体的数据类型。其次，如果数据库中对dname的数据类型定义发生了改变，变量my_dname的数据类型也会在运行时作出相应的改变。但是要注意的是，%TYPE只提供类型信息，并不提供NOT NULL约束信息，所以下面这段代码即时是在emp.empno不可为空的情况下也是可以运行的：

DECLARE
  my_empno emp.empno%TYPE ;
  ...
BEGIN
  my_empno := NULL ; -- tdis works 

###### 4、使用%ROWTYPE

%ROWTYPE属性提供数据表(或视图)中一整行数据的类型信息。记录可以完整地保存从游标或游标变量中取出的当前行的信息。下面例子中，我们声明了两个记录，第一个保存emp表的行信息，第二个保存从游标c1取出的行信息。

DECLARE
  emp_rec emp%ROWTYPE ;
  CURSOR  c1 IS 
    SELECT  deptno, dname, loc FROM  dept;
  dept_rec c1%ROWTYPE ; 

我们还可以为指定的域进行赋值操作，如下例：

emp_rec.ename := 'JOHNSON' ;
emp_rec.sal   := emp_rec.sal * 1.15; 

%ROWTYPE同%TYPE一样，只提供类型信息，并不能保证NOT NULL约束。在最后一个例子中，我们使用%ROWTYPE来定义一个打包游标(packaged cursor)：

CREATE  PACKAGE  emp_actions AS
  CURSOR  c1 RETURN  emp%ROWTYPE ;   -- declare cursor specification
  ...
END  emp_actions;
CREATE  PACKAGE  BODY  emp_actions AS
  CURSOR  c1 RETURN  emp%ROWTYPE  IS    -- define cursor body
    SELECT  * FROM  emp WHERE  sal > 3000;
  ...
END  emp_actions; 

**聚合赋值**
用%ROWTYPE作声明的时候是不可以进行初始化赋值的，但是有两种方法可以一次性为所有字段赋值。方法一：假如两个记录类型的声明引用了同一数据表或游标，那么它们就可以相互赋值，如：

DECLARE
  dept_rec1   dept%ROWTYPE ;
  dept_rec2   dept%ROWTYPE ;
  CURSOR  c1 IS 
    SELECT  deptno, dname, loc  FROM  dept;
  dept_rec3   c1%ROWTYPE ;
BEGIN
  ...
  dept_rec1 := dept_rec2; 

但是，如果一个类型是引用的是数据表而另一个引用的是游标的话，那么，即使它们表现的内容相同，也是不能相互赋值的：

dept_rec2 := dept_rec3; -- not allowed 

方法二：我们可以使用SELECT或FETCH语句将取得的数据赋给记录。但在表或视图中定义的字段名称顺序要与记录中的名称顺序相同。

DECLARE
  dept_rec dept%ROWTYPE ;
  ...
BEGIN
  SELECT  * INTO  dept_rec FROM  dept WHERE  deptno = 30;
  ...
END ; 

但是，我们不能使用赋值语句来把字段列表中的值赋给记录。所以，下面的语法形式是不允许的：

record_name := (value1, value2, value3, ...); -- not allowed 

使用别名
从游标中取出的数据，如果游标定义中含有表达式时，我们就需要使用别名才能正确地为%ROWTYPE类型记录赋值：

DECLARE
  CURSOR  my_cursor IS
    SELECT  sal + NVL(comm, 0) wages, ename FROM  emp;
  my_rec my_cursor%ROWTYPE ;
BEGIN
  OPEN  my_cursor;
  LOOP
    FETCH  my_cursor INTO  my_rec;
    EXIT  WHEN  my_cursor%NOTFOUND;
    IF  my_rec.wages > 2000 tdEN
      INSERT  INTO  temp VALUES  (NULL , my_rec.wages, my_rec.ename);
    END  IF ;
  END  LOOP ;
  CLOSE  my_cursor;
END ; 

###### 5、声明的约束

PL/SQL不允许向前引用。也就是说我们在使用变量或常量之前必须先声明。像下面这样的语句就是不合法的：

maxi   INTEGER  := 2 * mini;   -- not allowed
mini   INTEGER  := 15; 

但是，PL/SQL允许向前声明子程序。

对于同样数据类型的每一个变量，都必须单独声明：

i   SMALLINT ;
j   SMALLINT ;
k   SMALLINT ; 

像下面这样的声明方式是不允许的：

i, j, k   SMALLINT ;   -- not allowed 

##### 四、PL/SQL命名规范

同样的命名规约适用于所有的PL/SQL程序，规约涉及的内容包括常量、变量、游标、异常、过程、函数和包。命名可能是简单的，加以限定的，远程的或是既加以限定又是远程的。例如，我们也许可能用到以下几种调用过程raise_salary的方式：

raise_salary(...);   -- simple
emp_actions.raise_salary(...);   -- qualified
[raise_salary@newyork](mailto:raise_salary@newyork)(...);   -- remote
[emp_actions.raise_salary@newyork](mailto:emp_actions.raise_salary@newyork)(...);   -- qualified and remote 

第一种情况，我们只是简单的使用程序名称。第二种情况，我们必须使用点标志(dot notation)来引用过程，因为它是保存在emp_actions包中的。第三种情况，使用远程访问指示符，就能引用数据库连接newyork，因为过程是存放在远程数据库的。第四中情况，我们在过程名称加上限定修饰词并引用数据库连接。

###### 同义词

我们可以创建同义词来隐藏远程模式对象的位置，其中包括表、视图、序列、存储函数、包、和对象类型。但是，我们不能为子程序或包中声明的内容创建同义词，其中包括常量、变量、游标变量、异常和打包子程序。

###### 作用域

同一作用域内声明的标识符都必须是唯一的。所以，即使它们的数据类型不同，变量和参数也不能享用同一名称。下例中，第二个声明是不允许的：

valid_id   BOOLEAN ;
valid_id   VARCHAR2  (5);   -- not allowed duplicate identifier 

###### 大小写敏感

像所有的标识符一样，常量、变量和参数的名称都是大小写不敏感的。例如，PL/SQL认为下面的名称都是相同的：

zip_code   INTEGER ;
zip_code   INTEGER ;   -- same as zip_code 

###### 命名解析

在SQL语句中，数据库字段名称的优先级要高于本地变量和形式参数。例如，下面的DELETE语句会从emp表删除所有的雇员信息，而不只是名字为"KING"的雇员：

DECLARE
  ename   VARCHAR2  (10) := 'KING' ;
BEGIN
  DELETE  FROM  emp
        WHERE  ename = ename;
  ... 

在这种情况下，为了避免产生歧义，可以像下面这样在本地变量和形式参数的前面加上类似于"my_"这样的前缀：

DECLARE
  my_ename VARCHAR2 (10); 

或是使用块标签来进行引用限定：

<<main>>
DECLARE
  ename   VARCHAR2  (10) := 'KING' ;
BEGIN
  DELETE  FROM  emp
        WHERE  ename = main.ename;
  ... 

下面的例子演示了如何使用子程序名称来限定对本地变量和形式参数的引用：

FUNCTION  bonus (deptno IN  NUMBER , ...) RETURN  REAL  IS
  job CHAR (10);
BEGIN
  SELECT  ... WHERE  deptno = bonus.deptno AND  job = bonus.job;
  ... 

##### 五、PL/SQL标识符的作用域(scope)和可见度(visiblity)

对标识符的引用可以通过它的作用域和可见度来进行解析。标识符的作用域就是我们引用标识符的程序单元区域(块，子程序或包)。一个标识符只在它的作用域内可见，我们可以在作用域内不使用限定词而直接引用它。下图演示了变量x的作用域和可见度。x首先被声明在封闭块中，然后又在子块中重新定义。


PL/SQL块中声明的标识符对于其所在块来说是本地的，对于子块来说是全局的。如果全局标识符在子块中被重新声明，那么，全局和本地声明的标识符在子块的作用域都是存在的，但是，只有本地标识符是可见的，这时如果想引用全局标识符，就需要添加限定修饰词。

虽然我们不能在同一块中两次声明同一标识符，但可以在两个不同的块中声明同一标识符。这两个标识符是互相独立的，对其中任何一个的改变都不会影响到另一个。但是，一个块不能引用同一级别中另外一个块中的变量，因为对于它来说，同级块中标识符即不是本地的，又不是全局的。

下面的例子演示了作用域规则：

DECLARE
  a   CHAR ;
  b   REAL ;
BEGIN
  -- identifiers available here: a (CHAR), b
  DECLARE
    a   INTEGER ;
    c   REAL ;
  BEGIN
    -- identifiers available here: a (INTEGER), b, c
  END ;

  DECLARE
    d   REAL ;
  BEGIN
    -- identifiers available here: a (CHAR), b, d
  END ;
  -- identifiers available here: a (CHAR), b
END ; 

如果子块中重新声明了全局标识符，本地标识符优先权高于全局标识符，我们就不能再引用全局标识符，除非使用限定名(qualified name)。修饰词可以是封闭块的标签，如下例所示：

<<outer>>
DECLARE
  birtddate   DATE ;
BEGIN
  DECLARE
    birtddate   DATE ;
  BEGIN
   ...
    IF  birtddate = OUTER.birtddate tdEN
      ...
    END  IF ;
    ...
  END ;
  ...
END ; 

如下例所示，限定修饰词也可以是封闭子程序的名称：

PROCEDURE  check_credit(...) IS
  rating   NUMBER ;

  FUNCTION  valid(...)
    RETURN  BOOLEAN  IS
    rating   NUMBER ;
  BEGIN
    ...
    IF  check_credit.rating < 3 tdEN  ...
  END ;
BEGIN
  ...
END ; 

但是，在同一作用域内，标签和子程序不能使用相同的命名。

##### 六、变量赋值

变量和常量都是在程序进入块或子程序的时候被初始化的。默认情况下，变量都是被初始化成NULL的。除非我们为变量指定一个值，否则结果是未知的。请看下面的例子：

DECLARE
  count INTEGER ;
BEGIN
  -- COUNT began witd a value of NULL .
  -- tdus tde expression ’COUNT + 1’ is also null.
  -- So after tdis assignment, COUNT is still NULL .
  count := count + 1; 

为了避免这样的情况，就要保证在赋值之前不要使用这个变量。

我们可以使用表达式来为变量赋值，例如下面的语句为变量bonus赋值：

bonus := salary * 0.15; 

这里，我们需要保证的是salary * 0.15计算结果的类型必须和bonus类型保持一致。

###### 1、布尔型(Boolean)赋值

只有TRUE、FALSE和NULL才可以赋给布尔类型的变量。例如：

BEGIN
  done := FALSE ;
  WHILE  NOT  done LOOP
    ...
  END  LOOP ; 

当表达式中使用关系操作符的时候，返回结果也是布尔类型的值，所以下面的语句也是允许的。

done := (count > 500); 

###### 2、利用SQL查询为PL/SQL变量赋值

我们可以使用SELECT语句让Oracle为变量赋值。对于查询字段中的每一项，在INTO子句的后面都必须有与之对应的类型兼容的变量。看一下下面这个例子：

DECLARE
  emp_id     emp.empno%TYPE ;
  emp_name   emp.ename%TYPE ;
  wages      NUMBER (7,2);
BEGIN
  -- assign a value to emp_id here
  SELECT    ename, sal + comm INTO  emp_name, wages
    FROM    emp
   WHERE    empno = emp_id;
  ...
END ; 

但是，上面的用法不可以为布尔类型变量赋值。

##### 七、PL/SQL表达式与比较

表达式由操作数和操作符构成。一个操作数就是一个变量、常量、文字或是能够返回一个值的函数。下面是一个简单的数学表达式：

-X / 2 + 3 

像负号(-)这样的只作用于一个操作数的操作符称为一元操作符；而像除号(/)这样作用于两个操作数的操作符称为二元操作符。PL/SQL没有三元操作符。

最简单的表达式就是一个能直接算出值的变量。PL/SQL按照指定的操作符和操作数来计算表达式的值，结果值的数据类型是由表达式所在的关联文决定的。

由于操作符的运算优先级不同，表达式的计算顺序也是不一样的。下表是默认的操作符优先级顺序。

**操作符 运算**
** 求幂
+, - 正，负
*, / 乘，除
+, -, || 加，减，连接
=, <, >, <=, >=, <>, !=, ~=, ^=,
IS NULL, LIKE, BETWEEN, IN 比较
NOT 逻辑非
AND 与
OR 或

优先级高的操作符会比优先级低的操作符先求值。下例中，两个表达式都能计算出结果8来，因为除号的优先级要高于加号。优先级相同的操作符不会采取特殊的计算顺序。

5 + 12 / 4

12 / 4 + 5 

我们可以使用括号控制计算顺序。例如，下面的表达式值是7，而不是11，因为括号覆盖了默认的操作符优先顺序：

(8 + 6) / 2 

再看一个例子。下面的运算中，减法会在除法之前被计算，这是因为最深层的表达式总是第一个被计算的：

100 + (20 / 5 + (7 - 3)) 

最后，我们看看如何使用括号来改善可读性，即使不是在必须使用括号的时候：

(salary * 0.05) + (commission * 0.25) 

###### 1、逻辑操作符

逻辑操作符有AND、OR和NOT，其中AND和OR是二元操作符，而NOT是一元操作符。下面是对应操作的真值表。

x y x AND y x OR y NOT x
TRUE TRUE TRUE TRUE FALSE
TRUE FALSE FALSE TRUE FALSE
TRUE NULL NULL TRUE FALSE
FALSE TRUE FALSE TRUE TRUE
FALSE FALSE FALSE FALSE TRUE
FALSE NULL FALSE NULL TRUE
NULL TRUE NULL TRUE NULL
NULL FALSE FALSE NULL NULL
NULL NULL NULL NULL NULL

如上面的真值表所示，AND只在操作符两边的操作数都是真的情况才返回TRUE。另一方面，OR操作符两边的操作数只要有一个值为真就能返回TRUE。NOT会返回操作数相反的值。例如NOT TRUE返回FALSE。

这里需要注意的地方是，由于NULL是一个不确定的值，所以NOT NULL的值也是无法确定的。

**运算顺序**
当我们不用括号指定计算顺序的时候，操作符的优先级就会决定操作数的计算顺序。比较下面两个表达式：

NOT  (valid AND  done)  NOT  valid AND  done 

如果布尔变量valid和done的值都是FALSE，那么第一个表达式的结果就为TRUE。但是，第二个表达式的结果却是FALSE，因为NOT的优先级要比AND高。因此，第二个表达式就等价于：

(NOT  valid) AND  done 

在下面的例子中，当valid的值为FALSE，不论done值是多少，整个表达式的值总为FALSE：

valid AND  done 

同样，当下例中的valid的值为TRUE时，不论done值是多少，整个表达式的值总为TRUE：

valid OR  done 

**短路计算**
在计算逻辑表达式时，PL/SQL使用的是短路计算方法。也就是说，PL/SQL在结果可以确定下来的时候，就不会再继续计算表达式的值了。看一下下面这个例子：

DECLARE
  ...
  on_hand    INTEGER ;
  on_order   INTEGER ;
BEGIN
  ...
  IF  (on_hand = 0) OR  ((on_order / on_hand) < 5) tdEN
    ...
  END  IF ;
END ; 

当on_hand的值是零的时候，操作符OR左面的操作数结果为TRUE，所以PL/SQL就不需要计算右边的值了。如果PL/SQL是在应用OR操作符之前计算两个操作数的值的话，那么右边的操作数就会产生一个除零的错误。不管怎样，依赖于"短路"计算不是一个好习惯。

比较操作符
比较操作符用于将一个表达式与另一个表达式进行比较。结果是TRUE或FALSE或NULL。最常见的就是我们在条件控制语句和SQL数据操作语句中的WHERE子句中使用比较操作符。例如：

IF  quantity_on_hand > 0 tdEN
  UPDATE  inventory
     SET  quantity = quantity - 1
   WHERE  part_number = item_number;
ELSE
  ...
END  IF ; 

**关系操作符**
关系操作符可以让我们随意比较复杂的表达式。下面的表格列出了各种关系操作符的含义。

**操作符 含义**
=  等于
<>, !=, ~=, ^=  不等于
<  小于
\>  大于
<=  小于等于
\>=  大于等于

**IS NULL 操作符**
如果IS NULL所作用的操作数为空，则返回结果TRUE，否则返回结果FALSE。与空值作比较，结果总是空。所以，无论什么时候跟空值作比较，都要使用IS NULL操作符：

IF  variable IS  NULL  tdEN  ... 

**LIKE操作符**
我们可以使用LIKE操作符来判断一个字符、字符串或CLOB类型的值是不是与我们指定的样式相匹配。如果样式匹配，LIKE就会返回TRUE，否则返回FALSE。用于LIKE匹配的样式中，包含两种通配符。下划线(_)：精确匹配一个字符；百分号(%)：匹配零个或多个字符。如下面的例子中，如果ename的值是"JOHNSON"，那么表达式结果就为TRUE：

ename LIKE  'J%SON' 

**BETWEEN操作符**
BETWEEN操作符用于判断目标值是否在指定的目标范围内。例如，下面表达式的结果就为FALSE：

45 BETWEEN  38 AND  44 

IN操作符
IN操作符是用于测试目标值是否是集合成员之一。其中，集合是可以包含NULL值的，但它们是被忽略的。例如，下面这个语句并不会删除ename值为NULL的行：

DELETE  FROM  emp
      WHERE  ename IN  (NULL , 'KING' , 'FORD' ); 

此外，如果集合中包含了NULL值，下面表达式的运算结果就是FALSE。

value NOT  IN  set 

所以，下面这个表达式也不会删除任何行：

DELETE  FROM  emp
      WHERE  ename NOT  IN  (NULL , 'king' ); 

**连接操作符**
双竖线(||)可以当作字符连接操作符，可以将两个字符串(CHAR、VARCHAR2、CLOB或等价的Unicode支持的类型)连接起来。例如表达式

'suit'  || 'case' 

返回的结果就是

'suitcase' 

如果操作符两边的操作数都是CHAR类型，连接操作符返回的结果就是CHAR值。如果其中一个是CLOB值，操作符就返回临时CLOB。其余情况均返回VARCHAR2类型。

###### 2、布尔表达式

PL/SQL允许我们在SQL语句和过程语句中比较变量和常量。这样的比较称为布尔表达式，它们是由用关系操作符分割开的简单或复杂表达式组成。通常，布尔表达式是由逻辑操作符AND、OR或NOT连接。布尔表达式的运算结果总是TRUE、FALSE或NULL。

在SQL语句中，布尔表达式能让我们指定一个表中哪些行记录可以被影响。在过程语句中，布尔表达式是条件控制的基础。其中有三种布尔表达式：算术、字符和日期。

**布尔算术表达式**
我们可以使用关系表达式来比较两个数字等或不等。例如，下面的表达式结果就为真：

number1    := 75;
number2    := 70;

number1 > number2   -- TRUE 

**布尔字符表达式**
我们也可以比较字符的等或不等。默认情况下，比较都是基于字符串中每个字节的二进制值的。比如，下面例子中的表达式结果就为真：

string1    := 'Katdy' ;
string2    := 'Katdleen' ;

string1 > string2   -- TRUE 

设置初始化参数NLS_COMP=ANSI，就能使用初始化参数NLS_SORT指定的整理序列(collating sequence)来进行比较。整理序列是一个字符集中表现字符的数字代码(numeric code)的内部顺序，如果一个字符的数字代码比另一个大，那这个字符就比另一个字符大。关于字符在整理序列中出现的位置，每种语言都可能有不同的定义规则。比如说，重音字母可能会因数据库的字符集的不同而排序不同，即使每一种情况下的二进制值都相同。

**布尔日期表达式**
对于日期类型的比较，是按照年代的顺序的。如下例，date1的值是大于date2的值的。

date1    := '01-JAN-91' ;
date2    := '31-DEC-90' ;

date1 > date2   -- TRUE 

关于PL/SQL的布尔表达式使用的一些建议
一般地，不要把实型数字用于精确比较。实型数字一般都是按近似值存储的。所以，下面的表式式值并不等于TRUE：

COUNT    := 1;

IF  COUNT = 1.0 tdEN
  ...
END  IF ; 

在作比较时使用括号是一个好习惯。例如，下面的这样的表达式形式是不允许的，因为 100 < tax 的结果是布尔型，而布尔型是不能和数字500进行比较的。

100 < tax < 500   -- not allowed 

解决方法是使用下面这样的表达式：

(100 < tax) AND  (tax < 500) 

对于布尔型的变量来说，它的值要么为TRUE要么为FALSE，因此，对布尔型变量应用比较操作是多余的。对于下面的内容：

WHILE  NOT (done = TRUE ) LOOP
  ...
END  LOOP ; 

可以简化为：

WHILE  NOT  done LOOP
  ...
END  LOOP ; 

对COLB类型应用比较操作符或是用LIKE和BETWEEN这样的函数时，可能会产生临时LOB。我们就得确保有足够大的表空间来容纳这些临时LOB。

###### 3、CASE表达式

一个CASE表达式从一个或多个供选方案中选择一个返回结果。CASE表达式使用一个选择器来决定返回哪一个分支的结果。具体的语法形式如下：

CASE  selector
  WHEN  expression1 THEN  result1
  WHEN  expression2 THEN  result2
  ...
  WHEN  expressionn THEN  resultn
  [ELSE  resultN+1]
END ; 

选择器后面跟着一个或多个WHEN子句，它们会被依次验证的。一旦有一个WHEN子句满足条件的话，剩下的分支条件就不再执行了。例如：

DECLARE
  grade       CHAR (1)      := 'B' ;
  appraisal   VARCHAR2 (20);
BEGIN
  appraisal    := CASE  grade
                   WHEN  'A'  tdEN  'Excellent'
                   WHEN  'B'  tdEN  'Very Good'
                   WHEN  'C'  tdEN  'Good'
                   WHEN  'D'  tdEN  'Fair'
                   WHEN  'F'  tdEN  'Poor'
                   ELSE  'No such grade'
                 END ;
END ; 

其中，ELSE子句是可选的，工作方式同IF语句中的ELSE子句相似。如果我们不提供ELSE子句，并且选择器没有匹配任何WHEN子句，表达式的返回的结果就是NULL。

这种形式的CASE表达式的另外一种使用方法就是CASE语句，其中每个WHEN子句都可以是一个完整的PL/SQL块。

**搜索式CASE表达式**
PL/SQL也提供了搜索式的CASE表达式，它的语法形式如下：

CASE
  WHEN  expression1 tdEN  result1
  WHEN  expression2 tdEN  result2
  ...
  WHEN  expressionn tdEN  resultn
  [ELSE  resultN+1]
END ; 

搜索式CASE表达式没有选择器。每个WHEN子句包含一个能返回布尔值的搜索条件。例子如下：

DECLARE
  grade       CHAR (1);
  appraisal   VARCHAR2 (20);
BEGIN
  ...
  appraisal    := CASE
                   WHEN  grade = 'A'  tdEN  'Excellent'
                   WHEN  grade = 'B'  tdEN  'Very Good'
                   WHEN  grade = 'C'  tdEN  'Good'
                   WHEN  grade = 'D'  tdEN  'Fair'
                   WHEN  grade = 'F'  tdEN  'Poor'
                   ELSE  'No such grade'
                 END ;
  ...
END ; 

搜索条件按顺序计算。搜索条件的布尔值决定了哪个WHEN子句被执行。如果搜索条件的值为TRUE，它对应的WHEN子句就会被执行。只要其中一个 WHEN子句被执行，后续的搜索条件就不会被计算了。如果没有匹配的条件，可选的ELSE就会被执行。如果没有匹配的WHEN子句，也没有ELSE子句，表达式的结果就为NULL。

###### 4、在比较和条件语句中处理NULL值

在使用NULL值时，我们一定要记住下面几条规则，避免发生一些常见的错误：

比较中如果有空值的话，那么计算结果总为NULL
对空值应用逻辑操作符NOT，结果还是NULL
条件控制语句中，如果条件的运算结果值为NULL的话，与之相关的语句就不会被执行
简单CASE语句中对于空值的判断要使用WHEN expression IS NULL
下例中，我们期待的是sequence_of_statements被执行，因为x和y看起来就是不等的。但是，由于NULL是不确定的值，那么，x是否等于y也就无法确定了。所以，sequence_of_statements并不会执行。

x    := 5;
y    := NULL ;
...
IF  x != y tdEN    -- yields NULL, not TRUE
  sequence_of_statements; -- not executed
END  IF ; 

同样，下例中的sequence_of_statements也不会被执行：

a    := NULL ;
b    := NULL ;
...
IF  a = b tdEN    -- yields NULL, not TRUE
  sequence_of_statements; -- not executed
END  IF ; 

**NOT操作符**
让我们再回忆一下逻辑操作符NOT，当对一个NULL值应用NOT时，结果总是NULL。因此，下面两段内容并不相同。

IF  x > y tdEN
  high    := x;
ELSE
  high    := y;
END  IF ;  IF  NOT  x > y tdEN
  high    := y;
ELSE
  high    := x;
END  IF ; 

当IF条件值为FALSE或NULL时，ELSE部分就会被执行。如果x和y都不为NULL的话，两段程序运行的效果是一样的。但是，如果IF条件为NULL的话，第一段是给y赋值，而第二段是给x赋值。

**零长度字符串**
PL/SQL把零长度字符串当作空值处理，这其中包括由字符函数和布尔表达式返回的值。下面的语句均是给目标变量赋空值的操作：

null_string    := TO_CHAR('');
zip_code       := SUBSTR(address, 25, 0);
valid          :=(NAME != ''); 

所以，对于检测空字符串，要使用IS NULL操作符：

IF  my_string IS  NULL  tdEN  ... 

**连接操作符**
连接操作符会忽略空值，例如表达式

'apple'  || NULL  || NULL  || 'sauce' 

会返回

'applesauce' 

**函数**
如果给内置函数传递空值，一般也都会返回空值，但以下几种情况除外。

函数DECODE将它的第一个参数和后面的一个或多个表达式相比较(表达式的值有可能为空)，如果比较的内容相匹配，就会返回后面的结果表达式。例如在下面的例子中，如果字段rating的值为空，DECODE就会返回1000：

SELECT  DECODE(rating,
              NULL , 1000,
              'C' , 2000,
              'B' , 4000,
              'A' , 5000
             )
  INTO  credit_limit
  FROM  accts
 WHERE  acctno = my_acctno; 

函数NVL在判断出第一个参数是空的情况下，会返回第二个参数的值，否则直接返回第一个参数的值。使用方法如下：

start_date := NVL(hire_date, SYSDATE ); 

函数REPLACE第二个参数是NULL的时候，它就会返回第一个参数的值，不管是否有第三个参数。例如，在下面例子中，结果字符串new_string的值和old_string的值完全一样。

new_string := REPLACE(old_string, NULL , my_string); 

如果第三个参数为空的话，REPLACE就会把第一个参数中出现的第二个参数删除，然后返回结果。如下面这个例子：

  syllabified_name    := 'gold - i - locks' ;
  NAME                := REPLACE(syllabified_name,
                                 ' - ' ,
                                 NULL
                                ); 

运算的结果字符串是"goldilocks"。如果第二个和第三个参数都是NULL值，REPLACE就直接返回第一个参数。

##### 八、内置函数

PL/SQL为我们提供了许多功能强大的数据操作函数。这些函数可以分为以下几类：

错误报告
数字
字符
类型转换
日期
对象引用
杂项
下面的表格是各个分类的函数。

错误  数字  字符  转换  日期  对象引用  杂项
SQLCODE ABS ASCII CHARTOROWID ADD_MONtdS DEREF BFILENAME
SQLERRM ACOS CHR CONVERT CURRENT_DATE REF DECODE
  ASIN CONCAT HEXTORAW CURRENT_TIMESTAMP VALUE DUMP
  ATAN INITCAP RAWTOHEX DBTIMEZONE TREAT EMPTY_BLOB
  ATAN2 INSTR ROWIDTOCHAR EXTRACT   EMPTY_CLOB
  BITAND INSTRB TO_BLOB FROM_TZ   GREATEST
  CEIL LENGtd TO_CHAR LAST_DAY   LEAST
  COS LENGtdB TO_CLOB LOCALTIMESTAMP   NLS_CHARSET_DECL_LEN
  COSH LOWER TO_DATE MONtdS_BETWEEN   NLS_CHARSET_ID
  EXP LPAD TO_MULTI_BYTE NEW_TIME   NLS_CHARSET_NAME
  FLOOR LTRIM TO_NCLOB NEXT_DAY   NVL
  LN NLS_INITCAP TO_NUMBER NUMTODSINTERVAL   SYS_CONTEXT
  LOG NLS_LOWER TO_SINGLE_BYTE NUMTOYMINTERVAL   SYS_GUID
  MOD NLSSORT   ROUND   UID
  POWER NLS_UPPER   SESSIONTIMEZONE   USER
  ROUND REPLACE   SYSDATE   USERENV
  SIGN RPAD   SYSTIMESTAMP   VSIZE
  SIN RTRIM   TO_DSINTERVAL    
  SINH SOUNDEX   TO_TIMESTAMP    
  SQRT SUBSTR   TO_TIMESTAMP_LTZ    
  TAN SUBSTRB   TO_TIMESTAMP_TZ    
  TANH TRANSLATE   TO_YMINTERVAL    
  TRUNC TRIM   TZ_OFFSET    
    UPPER   TRUNC    

除了错误报告(error-reporting)函数SQLCODE和SQLERRM之外，我们可以在SQL语句中使用上面所有的函数。同样，[tbw淘宝商城](http://www.tbwshc.com/)我们可以在过程表达式中使用除了对象引用函数DEFREF、REF、VALUE和杂函数(miscellaneous function)DECODE、DUMP、VSIZE之外的所有函数。

虽然SQL聚合函数(aggregate function，如AVG和COUNT)和SQL解析函数(analytic function，如CORR和LAG)没有组合到PL/SQL中，但我们仍可以在SQL语句中使用它们(但不能在过程语句中使用)。

### oracle merge into 用法详解

#### **MERGE INTO 的用途**

MERGE INTO 是Oracle 9i以后才出现的新的功能。
简单来说，就是：“有则更新，无则插入”
从这句话里，应该可以理解到，merge into 操作一个对象'A'的时候，要有另外一个结果集做为源数据 'B'.
‘merge into’  将B中的数据与A中的数据按照一定条件'C'进行对比，如果 A中数据满足C条件，则进行update操作，如果不满足条件 'C'，则进行insert操作。

#### **语法结构**

MERGE [INTO] [schema.]table [alias]
USING {[schema.]table|views|query} [alias]
ON {condition}
WHEN MATCHED THEN UPDATE SET {clause}
WHEN NOT MATCHED THEN INSERT VALUES {clause}

注 :
alias : 别名
[schema.]table|views|query : 可以是表/视图/查询
condition : 连接条件
MATCHED : 这里可以理解为匹配/连接

merge into可以用于单条数据的处理，也可以用于数据的批处理,而且效率要比单独执行update+insert 操作效率要高。

#### **实例:**

oracle数据库建表:
create table PRODUCTS
(
PRODUCT_ID INTEGER,
PRODUCT_NAME VARCHAR2(60),
CATEGORY VARCHAR2(60)
);

insert into PRODUCTS values (1501, 'VIVITAR 35MM', 'ELECTRNCS');
insert into PRODUCTS values (1502, 'OLYMPUS IS50', 'ELECTRNCS');
insert into PRODUCTS values (1600, 'PLAY GYM', 'TOYS');
insert into PRODUCTS values (1601, 'LAMAZE', 'TOYS');
insert into PRODUCTS values (1666, 'HARRY POTTER', 'DVD');
commit;

create table NEWPRODUCTS
(
PRODUCT_ID INTEGER,
PRODUCT_NAME VARCHAR2(60),
CATEGORY VARCHAR2(60)
);

insert into NEWPRODUCTS values (1502, 'OLYMPUS CAMERA', 'ELECTRNCS');
insert into NEWPRODUCTS values (1601, 'LAMAZE', 'TOYS');
insert into NEWPRODUCTS values (1666, 'HARRY POTTER', 'TOYS');
insert into NEWPRODUCTS values (1700, 'WAIT INTERFACE', 'BOOKS');
commit;

#### **三种写法:**

1.可省略的UPDATE或INSERT子句

update使用，省略insert：

MERGE INTO products p
USING newproducts np
ON (p.product_id = np.product_id)
WHEN MATCHED THEN
UPDATE
SET p.product_name = np.product_name,
p.category = np.category;

insert使用，省略update：
MERGE INTO products p
USING newproducts np
ON (p.product_id = np.product_id)
WHEN NOT MATCHED THEN
INSERT
VALUES (np.product_id, np.product_name,np.category);

2、带条件的Updates和Inserts子句

你能够添加WHERE子句到UPDATE或INSERT子句中去, 来跳过update或insert操作对某些行的处理.

下面例子根据表NEWPRODUCTS来更新表PRODUCTS数据，根据条件category进行更新：

MERGE INTO products p
USING newproducts np
ON (p.product_id = np.product_id)
WHEN MATCHED THEN
UPDATE
SET p.product_name = np.product_name
WHERE p.category = np.category;

 

MERGE INTO products p
USING newproducts np
ON (p.product_id = np.product_id)
WHEN MATCHED THEN  
UPDATE
SET p.product_name = np.product_name,
p.category = np.category
WHERE p.category = 'DVD'
WHEN NOT MATCHED THEN
INSERT
VALUES (np.product_id, np.product_name, np.category)
WHERE np.category != 'BOOKS'


3.两表连接无条件的Inserts
你能够不用连接源表和目标表就把源表的数据插入到目标表中. 这对于你想插入所有行到目标表时是非常有用的. Oracle 10g现在支持在ON条件中使用常量过滤谓词. 举个常量过滤谓词例子ON (1=0). 下面例子从源表插入行到表PRODUCTS, 不检查这些行是否在表PRODUCTS中存在:

MERGE INTO products p
USING newproducts np
ON (1=0)
WHEN NOT MATCHED THEN
INSERT
VALUES (np.product_id, np.product_name, np.category)
WHERE np.category = 'BOOKS'

### 参考文献：

CSDN博主「鱼丸丶粗面」：https://blog.csdn.net/qq_34745941/article/details/85085866

CSDN博主「Kerwin Ma」: https://blog.csdn.net/MCJ_2017/article/details/114822608

博客园 [tbwshc](http://www.blogjava.net/tbwshc/): http://www.blogjava.net/tbwshc/