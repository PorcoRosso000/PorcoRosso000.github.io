---
title: Oracle语法
typora-root-url: Oracle语法
tags: Oracle
abbrlink: a8e4d798
date: 2023-03-01 07:39:47
categories:
permalink:
---



## ORACLE数据库查询存储过程内容

1.查看所有存储过程 select distinct name From user_source where type = 'PROCEDURE'  2.查询具体存储过程内容 SELECT text    FROM user_source   WHERE NAME = 'PRC_APP_GETTALENTALLARTICLES'ORDER BY line;

注意：存储过程一定要大写，否则查询不到

## SQL UNION 操作符

UNION 操作符用于合并两个或多个 SELECT 语句的结果集。

请注意，UNION 内部的 SELECT 语句必须拥有相同数量的列。列也必须拥有相似的数据类型。同时，每条 SELECT 语句中的列的顺序必须相同。

### SQL UNION 语法

```
SELECT column_name(s) FROM table_name1
UNION
SELECT column_name(s) FROM table_name2
```

**注释：**默认地，UNION 操作符选取不同的值。如果允许重复的值，请使用 UNION ALL。

### SQL UNION ALL 语法

```
SELECT column_name(s) FROM table_name1
UNION ALL
SELECT column_name(s) FROM table_name2
```

另外，UNION 结果集中的列名总是等于 UNION 中第一个 SELECT 语句中的列名。

### UNION

有两个相同的结果，他们当中只会有一个被列出来。UNION 命令只会选取不同的值。

### UNION ALL

UNION ALL 命令和 UNION 命令几乎是等效的，不过 UNION ALL 命令会列出所有的值。



## Oracle多种情况修改一个列的值

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



## 把一个表里的空值置为零

```
//在数据表中一个值加上null等于空数据会有问题
//is NUll的情况下索引无效
update 表名 set  列名1=0 where 列名1 IS NULL;//有多条语句执行多条
```



## 查询数据库的值为空时，这个值又需要后续的计算，这个时候就得把空值赋值为0

```
1.oracle自带语法
select NVL(SUM(A.YQNJ),0) AS YQNJ from formtable_main_40 A  where A.qjqsrq>=CONCAT(to_char(sysdate,'yyyy'),'-03-01')
2.if else
select case when SUM(A.YQNJ)  is null then 0 else SUM(A.YQNJ)   end AS YQNJ from formtable_main_40 A  where A.qjqsrq>=CONCAT(to_char(sysdate,'yyyy'),'-03-01')
```



## oracle使用自己表中的数据修改自己的其他数据

```
UPDATE WH_SL_WHITE_BLACK t  set ACTUAL_WEIGHT =t.FROZEN_WEIGHT
```

## insert into ... select..

```
//两张表没关联也可以左外连接 使用 left join ...on 1=1 
INSERT INTO WH_SL_INVENTORY_ITEM_AREA ( ID, INVENTORY_ITEM_ID, AREA_CODE, TOTAL_AMOUNT, UNABSORBED_AMOUNT, PUBLIC_AMOUNT, PUBLIC_AVAILABLE_AMOUNT, PUBLIC_FROZEN_AMOUNT, RESERVE_AMOUNT, RESERVE_AVAILABLE_AMOUNT, RESERVE_FROZEN_AMOUNT, GMT_CREATE, GMT_MODIFY, MODIFIER_ID, IS_DELETED ) 

SELECT SEQ_WH_SL_INVENTORY_ITEM_AREA.NEXTVAL, t.ID inventory_item_id, a.AREA_CODE area_id, 0, 0, 0, 0, 0, 0, 0, 0, '', '', 0, 0 FROM WH_SL_INVENTORY_ITEM t left join HS_HIT_UC.ECLP_AREA a on 1=1 WHERE a.ID='49' ;
```



## update set(select...)

```
//group by的语法注意搜索条件有什么 group by 就得有什么
UPDATE WH_SL_INVENTORY_ITEM_AREA t set PUBLIC_FROZEN_AMOUNT =( 
SELECT t1.PLT_FROZEN_WEIGHT FROM ( 
	SELECT w1.ID AS ID, w1.PLT_FROZEN_WEIGHT AS PLT_FROZEN_WEIGHT FROM WH_SL_INVENTORY_ITEM w1 
	LEFT JOIN WH_SL_INVENTORY_ITEM_AREA w2 ON w1.ID = w2.INVENTORY_ITEM_ID 		GROUP BY w1.ID,w1.PLT_FROZEN_WEIGHT ) t1 
	WHERE t1.ID = t.INVENTORY_ITEM_ID 
	) 
    where t.AREA_CODE ='0' ;
```



## oracle主键自增序列

```
//调用 序列名.NEXTVAL   :  SEQ_WH_SL_INVENTORY_ITEM_AREA.NEXTVAL
call drop_sequence('SEQ_WH_SL_INVENTORY_ITEM_AREA');
CREATE SEQUENCE SEQ_WH_SL_INVENTORY_ITEM_AREA INCREMENT BY 1 START WITH 1 MAXVALUE 99999999 MINVALUE 1 NOCYCLE CACHE 50 NOORDER;

```



## oracle字段去重

```
select distinct (t.SHORT_NAME)  SHORT_NAME   from WH_SL_INVENTORY_ITEM t
```



oracle经多行拼接成一行

```
select DISTINCT  LISTAGG (a.ATTR_CODE || ':'|| a.ATTR_VALUE,';') within group(order by a.attr_code) over(partition by i.id) attrMapStr          ,LISTAGG (a.ATTR_CODE || ':'|| a.ATTR_TEXT,';') within group(order by a.attr_code) over(partition by i.id) attrTextMapStr          ,i.id as otherId        from WH_VARIETY_MATERIEL_ATTR a        join WH_SL_INVENTORY_ITEM i        on a.OTHER_ID = i.STOCK_ITEMS_ID
```

