---
title: mysql语法
typora-root-url: mysql语法
abbrlink: d36bd08c
date: 2023-01-07 14:34:51
tags: mysql
permalink:
---



### java代码

####  SELECT LAST_INSERT_ID()：

得到刚 insert 进去记录的主键值，只适用与自增主键；

mysql一个表中唯一ID生成就需要这个函数

Last_insert_id()是MYSQL提供的返回当前客户端最后一个insert或update查询中设置为AUTO_INCREMENT列的值

Last_insert_id()不受其他客户端影响，所以是线程安全的，当前客户端只能拿到当前客户端的最新值，不需加锁处理

比如fileid是主键，并且设置成自动增加，那么在插入的时候不指定fileid，插入后通过LAST_INSERT_ID()就能得到插入最后一条记录的id
 ，并且是当前线程执行的，并不需要事务控制

```java
<selectKey keyProperty="id" order="AFTER" resultType="java.lang.Long">
SELECT LAST_INSERT_ID()
</selectKey>
```



#### <include refid="Base_Column_List"

这个在[MyBatis](https://so.csdn.net/so/search?q=MyBatis&spm=1001.2101.3001.7020)查询数据库的sql中经常会出现。它的在上面已经定义，作用相当于 ，Base_Column_List是固定的几个字段，而用*号的话会降低查询效率，因为后期数据库的字段会不断增加。

```java
<sql id="Base_Column_List">
id, tenant_id, role_type, parent_id, inherit_role, inherit_role_id, role_name, description, 
status, owner_id, period_type, period_start_time, period_end_time, create_time, update_time, 
create_user, update_user, code
</sql>

<select id="selectByPrimaryKey" parameterType="java.lang.Long" resultMap="BaseResultMap">
select 
<include refid="Base_Column_List" />
from t_role
where id = #{id,jdbcType=BIGINT}
</select>` 
```

#### sql中使用in/not in关键字后集合参数遍历方式

```java
<select id="getIdsByOrgNums" resultType="java.lang.Long">
select id
from user_organization where org_num in
<foreach collection="orgNums" index="index" item="orgNum" open="(" separator="," close=")">
#{orgNum}
</foreach>
</select> 
```

#### 集合方式批量添加

```java
<insert id="batchInsert" keyColumn="id" keyProperty="id" parameterType="map" useGeneratedKeys="true">
<!--@mbg.generated-->
insert into user_organization
(org_name, company_flag, org_type, parent_id, ent_name, ent_short_name, social_credit_code,
contact_person, billing_telephone, billing_address, opening_bank, bank_account,
introduction, org_num, org_path, outer_org_id, org_source, creator_user_id, creation_time,
update_user_id, update_time, delete_flag, gehr_org_id, sort_order, is_virtual_dept,
department_name_en, department_level, app_code, gdc_org_id)
values
<foreach collection="list" item="item" separator=",">
(#{item.orgName}, #{item.companyFlag}, #{item.orgType}, #{item.parentId}, #{item.entName},
#{item.entShortName}, #{item.socialCreditCode}, #{item.contactPerson}, #{item.billingTelephone},
#{item.billingAddress}, #{item.openingBank}, #{item.bankAccount}, #{item.introduction},
#{item.orgNum}, #{item.orgPath}, #{item.outerOrgId}, #{item.orgSource}, #{item.creatorUserId},
#{item.creationTime}, #{item.updateUserId}, #{item.updateTime}, #{item.deleteFlag},
#{item.gehrOrgId}, #{item.sortOrder}, #{item.isVirtualDept}, #{item.departmentNameEn},
#{item.departmentLevel}, #{item.appCode}, #{item.gdcOrgId})
</foreach>
</insert> 
```

#### Unknown collation: ‘utf8mb4_0900_ai_ci‘ 的解决方案高版本的数据库数据导入时报错解决方案

将MySQL8.0导出的sql文件中，所有的utf8mb4_0900_ai_ci替换为utf8_general_ci   

#### jpa在mapper层上通过注解的方式写sql 

```
@Query(      value = "SELECT id,report_type,report_id,project_id,project_no,report_name,change_type,change_user,change_date,change_content,status,process_version,process_description,compound_id,production_type,report_section FROM notification WHERE CASE WHEN :no = true THEN project_no in (:projects) ELSE 1=1 END AND CASE WHEN :changeType = true THEN change_type in (:changeTypes) ELSE 1=1 END AND CASE WHEN :reportType = true THEN report_type in (:reportTypes) ELSE 1=1 END order by change_date desc limit :size offset :page",      nativeQuery = true) 
```



#### jpa多条件多表联合查询

通过实体类映射实现多表关联条件查询
jpa对于多表关联可以在实体类中进行关联映射，一对一用@OneToOne，一对多用@OneToMany，多对多用@ManyToMany，多对一用@ManyToOne，具体实体类配置就不多说了，然后对于条件查询采用Specification对象进行封装，如下

```
Specification<A> specification = new Specification<A>() {
        @Override
        public Predicate toPredicate(Root<A> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
            //创建查询条件集合
            List<Predicate> orlist = new ArrayList<Predicate>();
            //判断是否模糊查询
            if (StringUtils.isNotBlank(key)){
                //添加查询条件  cb.like：模糊查询   root.get("查询字段").as(类型.class)
                orlist.add(cb.like(root.get("name").as(String.class),"%"+  key + "%"));
                orlist.add(cb.like(root.get("phone").as(String.class), "%"+  key + "%"));
                orlist.add(cb.like(root.get("role").as(String.class),"%"+  key + "%"));
                //创建左外连接  Join<左，右>     root.join("副表实体在主表主体中的属性名"，连接方式)
                Join<A,B> join = root.join("b", JoinType.LEFT);
                //将连接表需要查询的字段写入
                orlist.add(cb.like(join.get("post").as(String.class),"%"+key+"%"));
            }
            return  cb.or(orlist.toArray(new Predicate[orlist.size()]));
        }
    };

```

通过@Query(value=“sql语句”)方式实现表关联查询
创建ARepository接口然后继承JpaRepository和JpaSpecificationExecutor，然后在repository接口中编写查询方法，如下

	public interface ARepository extends JpaRepository<A,String> , JpaSpecificationExecutor<A> {
	@Query(value="SELECT * " +
	        "FROM A_table a " +
	        "LEFT JOIN B_table b ON a.b_unid = b.unid " +
	        "LEFT JOIN C_table c ON a.c_unid = c.unid " +
	        "WHERE a.delete_flag = 0 " +
	        "AND (?1 is null or ?1='' or a.b_unid = ?1 )" +
	        "AND (?2 is null or ?2='' or a.c_unid = ?2 ) " +
	        "AND (?3 is null or ?3='' or a.created_time >= ?3 ) " +
	        "ORDER BY fqcm.created_time DESC",nativeQuery = true)
	List<Map> selectABC(String bUnid, String cUnid, String createdTimeStart);
	 }

@Query中?!,?2,?3代表传递的参数，应和下边方法中的参数顺序保持一致，其中条件

```
AND (?1 is null or ?1='' or a.b_unid = ?1 )
```

表示参数如果为空字符串或者null时条件不生效，不为空字符串和null时条件生效。
nativeQuery = true 表示可以执行原生的sql语句。

#### 代码中map文件 配置一对多

```

<resultMap id="BaseResultMap" type="com.hundsun.exchange.iwms.domain.query.inventory.WhSlInventoryIAreaQuery" >
    <id column="ID" property="id" jdbcType="NUMERIC" />
    <collection property="areaList" ofType="com.hundsun.exchange.iwms.domain.dto.inventory.WhSlInventoryItemArea">
        <id column="ID" property="id" jdbcType="NUMERIC" />
        <result column="INVENTORY_ITEM_ID" property="inventoryItemId" jdbcType="NUMERIC" />
        <result column="AREA_CODE" property="areaCode" jdbcType="VARCHAR" />
        <result column="TOTAL_AMOUNT" property="totalAmount" jdbcType="BIGINT" />
        <result column="UNABSORBED_AMOUNT" property="unabsorbedAmount" jdbcType="BIGINT" />
        <result column="PUBLIC_AMOUNT" property="publicAmount" jdbcType="BIGINT" />
        <result column="PUBLIC_AVAILABLE_AMOUNT" property="publicAvailableAmount" jdbcType="BIGINT" />
        <result column="PUBLIC_FROZEN_AMOUNT" property="publicFrozenAmount" jdbcType="BIGINT" />
        <result column="RESERVE_AMOUNT" property="reserveAmount" jdbcType="BIGINT" />
        <result column="RESERVE_AVAILABLE_AMOUNT" property="reserveAvailableAmount" jdbcType="BIGINT" />
        <result column="RESERVE_FROZEN_AMOUNT" property="reserveFrozenAmount" jdbcType="BIGINT" />
        <result column="GMT_CREATE" property="gmtCreate" jdbcType="DATE" />
        <result column="GMT_MODIFY" property="gmtModify" jdbcType="DATE" />
        <result column="MODIFIER_ID" property="modifierId" jdbcType="VARCHAR" />
        <result column="IS_DELETED" property="isDeleted" jdbcType="VARCHAR" />
    </collection>
</resultMap>
<!-- 统计货位库存的重量等  -->
<select id="getAllInventoryAreaList" resultClass="BaseResultMap" >
    SELECT i.ID,a.AREA_CODE,a.PUBLIC_AMOUNT,a.PUBLIC_AVAILABLE_AMOUNT,a.PUBLIC_FROZEN_AMOUNT,a.RESERVE_AMOUNT,a.RESERVE_AVAILABLE_AMOUNT,a.RESERVE_FROZEN_AMOUNT,a.TOTAL_AMOUNT,a.UNABSORBED_AMOUNT
    from
         WH_SL_INVENTORY_ITEM i
             LEFT JOIN  WH_SL_INVENTORY_ITEM_AREA a
                 ON i.ID=a.INVENTORY_ITEM_ID
</select>
```



### sql语句

#### CASE WHEN ELSE END 

```
1. 
CASE 
        WHEN table1.st_licence_location = 'CUSTOMER' THEN '客户'
        WHEN table1.st_licence_location = 'AGENT' THEN '经销商'
        WHEN table1.st_licence_location = 'CUSTOMERMANAGER' THEN '客户经理'
        WHEN table1.st_licence_location = 'DMV' THEN '车管所'
        WHEN table1.st_licence_location = 'OTHER' THEN '其他'
    END  AS st_licence_location, -- 登记证当前位置
2.
 case when salary <= 500 then '1'
         when salary > 500 and salary <= 600  then '2'
         when salary > 600 and salary <= 800  then '3'
         when salary > 800 and salary <= 1000 then '4'
         else null end salary_class
3.
case country
        when '中国'     then'亚洲'
        when '印度'     then'亚洲'
        when '日本'     then'亚洲'
        when '美国'     then'北美洲'
        when '加拿大'  then'北美洲'
        when '墨西哥'  then'北美洲'
        else '其他' end 
        
4.when 后有多个条件的时候可以使用and 或者or连接
```





#### union all

UNION 操作符用于合并两个或多个 SELECT 语句的结果集。

请注意，UNION 内部的 SELECT 语句必须拥有相同数量的列。列也必须拥有相似的数据类型。同时，每条 SELECT 语句中的列的顺序必须相同。

默认地，UNION 操作符选取不同的值。如果允许重复的值，请使用 UNION ALL。

```
SELECT 
    st_cust_name AS st_lessee_name,
    st_cust_no
    FROM
    ods_cust_info_df  
    UNION ALL
    SELECT 
    st_enterprise_name AS st_lessee_name,
    st_cust_no
    FROM
    ods_enterprise_customer_df  
```

#### INSERT INTO SELECT 语法

#### 将一个表的所有列复制到另一个表：

INSERT INTO *table2*
SELECT * FROM *table1*WHERE *condition*;

#### 仅将一个表中的一些列复制到另一个表中：

INSERT INTO *table2* (*column1*, *column2*, *column3*, ...)
SELECT *column1*, *column2*, *column3*, ...
FROM *table1*
WHERE *condition*;



#### 也可以将几个表联查的数据复制到另一个表中

INSERT INTO *table2* (*column1*, *column2*, *column3*, ...)
SELECT 

*column1*, *column2*, *column3*, ...
FROM 
(

select
id,

*column1*
from
table1

)
left join

(
select
id,

*column2*
from
table2

)
on table1.id =  table2.id

left join  .......

列的值也可以直接赋值  例如  '三山' as *column3*



#### with as 用法

**with as 定义**

with A as (select * from class)

也就是将重复用到的大批量 的SQL语句，放到with as 中，加一个别名，在后面用到的时候就可以直接用。对于大批量的SQL数据，起到优化的作用。

**注意点：**

1、with子句只能被select查询块引用

2.with子句的返回结果存到用户的临时表空间中，只做一次查询，反复使用,提高效率。

3.在同级select前有多个查询定义的时候，第1个用with，后面的不用with，并且用逗号隔开。

4.最后一个with 子句与下面的查询之间不能有逗号，只通过右括号分割,with 子句的查询必须用括号括起来

**用法：**

**–针对一个别名**

with tmp as (select * from tb_name)

**–针对多个别名**

with

tmp as (select * from tb_name),

tmp2 as (select * from tb_name2),

tmp3 as (select * from tb_name3),

**–相当于建了个e临时表**

with e as (select * from scott.emp e where e.empno=7499)

select * from e;

**–相当于建了e、d临时表**

with

e as (select * from scott.emp),

d as (select * from scott.dept)

select * from e, d where e.deptno = d.deptno;

#### Oracle  数据库sql主键自增

1.准备工作

```
创建oracle数据库表，用户表 SYS_USERS 其中user_id为主键

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

#### 数据库删除某条数据死锁怎么就解决?

今天想删掉一个表里所有的数据，直接删总是卡住，  最后一点点删，删到最后一条，发现是那条有问题。

不管是改表名，delete，还是truncate，还是drop都不行，就卡在那里。

最后用了navicat里面的修复功能。就好了。 

##### 1.方法一  mysql命令行修复

（1）登录数据库：mysql -u root -p密码

（2）使用数据库：use  dataName；(dataName要修复的数据库名)

（3）检查表：check table tableName；(tableName检查的表名)

（4）分析表：analyze table tableName;(tableName要分析的表名)

（5）修复表：repair table tableName;(tableName要修复的表名)

（6）优化表：optimize table tableName;(tableName要优化的表)

##### 2.方法二    使用navicat修复

 （1）右键要修复的表；

  （2）点击维护；

  （3）选择修复。



#### SQL TRUNCATE TABLE：清空表

SQL TRUNCATE TABLE 语句用来删除表中的所有记录，也即清空表，它类似于不带 WHERE 子句的 DELETE FROM 语句。

##### TRUNCATE TABLE 和 DROP TABLE

DROP TABLE 用来删除表，包括删除该表的数据、结构、索引、触发器、约束等所有信息。一旦使用 DROP TABLE 删除了表，则该表的所有信息都将丢失，该表再也无法使用了。如果您希望存储一些数据，就只能重新创建该表。
TRUNCATE TABLE 仅仅删除表的所有记录，表的结构、索引、触发器、约束等将被保留，后续仍然可以使用该表。不带 WHERE 子句的 DELETE FROM 语句同样可以达到清空表的效果，但是 TRUNCATE TABLE 使用的系统资源和日志资源更少，因此比 DELETE FROM 更加快速。

此外，TRUNCATE TABLE 还能重置具有自动递增（AUTO_INCREMENT）属性的字段，而 DELETE FROM 却不具备该功能。

- 当您不再需要该表时，使用 DROP TABLE；
- 当您仍要保留该表，只是想删除所有记录时，使用 TRUNCATE TABLE；
- 当你要删除部分记录时，使用带有 WHERE 子句的 DELETE FROM。

##### 语法

TRUNCATE TABLE 命令的基本语法如下：

TRUNCATE TABLE  table_name;

table_name 为表名。

##### 示例

有包含如下记录的 CUSTOMERS 表：

```
+----+----------+-----+-----------+----------+
| ID | NAME     | AGE | ADDRESS   | SALARY   |
+----+----------+-----+-----------+----------+
|  1 | Ramesh   |  32 | Ahmedabad |  2000.00 |
|  2 | Khilan   |  25 | Delhi     |  1500.00 |
|  3 | kaushik  |  23 | Kota      |  2000.00 |
|  4 | Chaitali |  25 | Mumbai    |  6500.00 |
|  5 | Hardik   |  27 | Bhopal    |  8500.00 |
|  6 | Komal    |  22 | MP        |  4500.00 |
|  7 | Muffy    |  24 | Indore    | 10000.00 |
+----+----------+-----+-----------+----------+
```

使用 TRUNCATE TABLE 命令清空数据表：

```
SQL > TRUNCATE TABLE CUSTOMERS;
```

现在 CUSTOMERS 表已被清空，使用 SELECT 语句的输出结果如下：

```
SQL> SELECT * FROM CUSTOMERS;
Empty set (0.00 sec)
```


### 参考文献: 

CSDN博主「生活压力大」：https://blog.csdn.net/weixin_37783650/article/details/111588665

CSDN博主「shaoduo」 ：https://blog.csdn.net/shaoduo/article/details/70888855

CSDN博主「好__好」: https://blog.csdn.net/qq_32067151/article/details/105186355

c语言中文网 「站长严长生」:http://c.biancheng.net/sql/truncate-table.html