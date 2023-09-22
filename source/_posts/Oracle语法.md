---
title: Oracle语法
typora-root-url: Oracle语法
tags: Oracle
abbrlink: a8e4d798
date: 2023-03-01 07:39:47
categories:
permalink:
---



### ORACLE数据库查询存储过程内容

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
1.oracle自带语法
select NVL(SUM(A.YQNJ),0) AS YQNJ from formtable_main_40 A  where A.qjqsrq>=CONCAT(to_char(sysdate,'yyyy'),'-03-01')
2.if else
select case when SUM(A.YQNJ)  is null then 0 else SUM(A.YQNJ)   end AS YQNJ from formtable_main_40 A  where A.qjqsrq>=CONCAT(to_char(sysdate,'yyyy'),'-03-01')
```



### oracle使用自己表中的数据修改自己的其他数据

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

oracle使用自己表中的数据修改自己的其他数据
UPDATE WH_SL_WHITE_BLACK t  set ACTUAL_WEIGHT =t.FROZEN_WEIGHT
```



### oracle主键自增序列

```
//调用 序列名.NEXTVAL   :  SEQ_WH_SL_INVENTORY_ITEM_AREA.NEXTVAL
call drop_sequence('SEQ_WH_SL_INVENTORY_ITEM_AREA');
CREATE SEQUENCE SEQ_WH_SL_INVENTORY_ITEM_AREA INCREMENT BY 1 START WITH 1 MAXVALUE 99999999 MINVALUE 1 NOCYCLE CACHE 50 NOORDER;

```



### oracle字段去重

```
select distinct (t.SHORT_NAME)  SHORT_NAME   from WH_SL_INVENTORY_ITEM t
```



### oracle经多行拼接成一行

```
select DISTINCT  LISTAGG (a.ATTR_CODE || ':'|| a.ATTR_VALUE,';') within group(order by a.attr_code) over(partition by i.id) attrMapStr          ,LISTAGG (a.ATTR_CODE || ':'|| a.ATTR_TEXT,';') within group(order by a.attr_code) over(partition by i.id) attrTextMapStr          ,i.id as otherId        from WH_VARIETY_MATERIEL_ATTR a        join WH_SL_INVENTORY_ITEM i        on a.OTHER_ID = i.STOCK_ITEMS_ID
```



### oracle 在原表中新加字段

```
Alter Table TRADE_CONTRACT drop column USER_ACCOUNT;
Alter Table TRADE_CONTRACT drop column GOODS_CODE;
Alter Table TRADE_CONTRACT Add (USER_ACCOUNT Varchar2(64),GOODS_CODE Varchar2(64));
comment on column TRADE_CONTRACT.USER_ACCOUNT
  is '订货用户编号';
comment on column TRADE_CONTRACT.GOODS_CODE
  is '购销计划';
```



### oracle 定义变量赋值

```
declare 
v_number number(10); 
BEGIN
SELECT ID INTO v_number  FROM HS_HIT_UC.ECLP_AREA WHERE AREA_NAME='沿海' AND ROWNUM=1;
dbms_output.put_line(v_number);
end;
```



### oracle  查询一条记录的上一条和下一条记录的id

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

### 存储过程

### ORACLE decode函数

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



### 参考文献：

CSDN博主「鱼丸丶粗面」：https://blog.csdn.net/qq_34745941/article/details/85085866

CSDN博主「Kerwin Ma」: https://blog.csdn.net/MCJ_2017/article/details/114822608