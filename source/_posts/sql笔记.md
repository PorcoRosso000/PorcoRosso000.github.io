---
title: sql笔记
typora-root-url: sql笔记
date: 2023-01-07 14:34:51
tags:
permalink:
---



##  SELECT LAST_INSERT_ID()：

得到刚 insert 进去记录的主键值，只适用与自增主键；

```java
<selectKey keyProperty="id" order="AFTER" resultType="java.lang.Long">
SELECT LAST_INSERT_ID()
</selectKey>` 
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





