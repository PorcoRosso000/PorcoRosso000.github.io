---
title: mysql语法
typora-root-url: mysql语法
abbrlink: d36bd08c
date: 2023-01-07 14:34:51
tags: mysql
permalink:
---



# java代码

##  SELECT LAST_INSERT_ID()：

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



## <include refid="Base_Column_List"

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

## sql中使用in/not in关键字后集合参数遍历方式

```java
<select id="getIdsByOrgNums" resultType="java.lang.Long">
select id
from user_organization where org_num in
<foreach collection="orgNums" index="index" item="orgNum" open="(" separator="," close=")">
#{orgNum}
</foreach>
</select> 
```

## 集合方式批量添加

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

## Unknown collation: ‘utf8mb4_0900_ai_ci‘ 的解决方案高版本的数据库数据导入时报错解决方案

将MySQL8.0导出的sql文件中，所有的utf8mb4_0900_ai_ci替换为utf8_general_ci   

## jpa在mapper层上通过注解的方式写sql 

```
@Query(      value = "SELECT id,report_type,report_id,project_id,project_no,report_name,change_type,change_user,change_date,change_content,status,process_version,process_description,compound_id,production_type,report_section FROM notification WHERE CASE WHEN :no = true THEN project_no in (:projects) ELSE 1=1 END AND CASE WHEN :changeType = true THEN change_type in (:changeTypes) ELSE 1=1 END AND CASE WHEN :reportType = true THEN report_type in (:reportTypes) ELSE 1=1 END order by change_date desc limit :size offset :page",      nativeQuery = true) 
```



## jpa多条件多表联合查询

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



# sql语句

## CASE WHEN ELSE END 

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





## union all

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







## INSERT INTO SELECT 语法

### 将一个表的所有列复制到另一个表：

INSERT INTO *table2*
SELECT * FROM *table1*WHERE *condition*;

### 仅将一个表中的一些列复制到另一个表中：

INSERT INTO *table2* (*column1*, *column2*, *column3*, ...)
SELECT *column1*, *column2*, *column3*, ...
FROM *table1*
WHERE *condition*;



也可以将几个表联查的数据复制到另一个表中

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







本文借鉴：

CSDN博主「生活压力大」 原文链接：https://blog.csdn.net/weixin_37783650/article/details/111588665