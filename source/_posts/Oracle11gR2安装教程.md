---
title: Oracle11gR2安装教程
typora-root-url: Oracle11gR2安装教程
tags: Oracle
categories: Oracle
abbrlink: 16e89da7
date: 2023-01-23 16:39:38
permalink:
---



### 【Oracle 11gR2安装教程】

链接: https://pan.baidu.com/s/1zr1UYgGeA11hz1J_E7-tSg?pwd=aih8 提取码: aih8 

1、Oracle的安装程序分成2个文件，下载后将2个文件解压到同一目录即可。
![img](201904161047242646.jpg)
2、下载完成后，将2个压缩文件一起选中，鼠标右键—>解压文件，如下图所示。两个压缩文件解压到同一目录下。
需要注意的是，路径名称中最好不要出现中文、空格等不规则字符。（由于小编是在本地解压后再拷贝到服务器上，所以本地路径无所谓，只要服务器上的路径负荷这个规则就行。）
![img](20190416104729141.jpg)
3、打开相应的解压路径，找到安装文件“setup.exe”，双击进行安装，如下图所示：
![img](201904161047393332.jpg)
4、配置安全更新。电子邮件可写可不写，取消下面的“我希望通过My Oracle Support接受安全更新(W)”，如下图所示，单击下一步。
![img](201904161047421655.jpg)
5、安装选项。直接选择默认的“创建和配置数据库”，如下图所示，单击下一步。
![img](201904161047525397.jpg)
6、系统类。由于咱们安装的是服务器，所以选择“服务器类”，如下图所示，单击下一步。
![img](20190416104756308.jpg)
7、网格安装选项。选择“单实例数据库安装”，如下图所示，单击下一步。
![img](201904161048051763.jpg)
8、安装类型。选择“高级安装”，如下图所示，单击下一步。
![img](201904161048092374.jpg)
9、产品语言。直接默认即可（简体中文、英语），如下图所示，单击下一步。
![img](201904161048186484.jpg)
10、数据库版本。选择“企业版”，如下图所示，单击下一步。
![img](201904161048229985.jpg)
11、安装位置。填入安装路径（只需要填“Oracle基目录”即可，“软件位置”会自动生成），如下图所示，单击下一步。
![img](201904161048333417.jpg)
12、配置类型。选择“一般用途/事务处理”，如下图所示，单击下一步。
![img](201904161048377703.jpg)
13、数据库标识符。填入全局数据库名和SID，如下图所示，单击下一步。
![img](201904161048509606.jpg)
14、配置选项。切换到“字符集”选项卡，选择“使用Unicode（AL32UTF8）”，如下图所示，单击下一步。
![img](201904161048541535.jpg)
15、管理选项。直接单击下一步，如下图所示。
![img](201904161049044031.jpg)
16、数据库存储。直接单击下一步，如下图所示。
![img](201904161049087992.jpg)
17、备份和恢复。如果需要对数据进行备份，就启用自动备份，小编这里选择“不启用自动备份”，如下图所示，单击下一步。
![img](201904161049182133.jpg)
18、方案口令。为了便于测试，这里使用了相同的密码，实际部署时可根据实际情况自行决定。
![img](201904161049212714.jpg)
![img](201904161049395327.jpg)
19、概要。完成先决条件检查后，单击完成就可以正式开始安装了，如下图所示，单击下一步。
![img](20190416104942832.jpg)
20、安装产品。安装完成后，会列出相关数据库配置清单，这个最好截图保存，如下图所示，单击确定。
![img](201904161049521919.jpg)
21、完成。这时安装已完成，单击关闭即可。
![img](201904161049569321.jpg)
22、测试一下。打开Oracle自带的SQL PLUS，如下图所示。
![img](201904161050116268.jpg)
23、输入用户名、密码（就是第18步设置的密码），测试成功！可以直接输入SQL语句了！需要注意的是，这里Oracle输入的口令是不显示的。
![img](201904161050166255.jpg)

### 【oracle存储过程】

oracle下载64位破解版怎么创建存储数据库？

步骤一：我们使用存储过程实现往表中循环插入语句。首先创建一个表
create table t_class(
couseid number(10) primary key,
classname varchar2(20) not null,
classtype varchar2(4)
);
![img](201904161052001616.png)
步骤二：创建一个存储过程，往t_class表插入20W数据
create or replace procedure aa
as
begin
for i in 1..200000 loop
insert into t_class(couseid,classname,classtype) values(i,'math','主课');
end loop;
end;
![img](201904161052052001.png)
步骤三：调用存储过程，插入数据，在plsql中调用上面定义的存储过程aa，如图执行成功
BEGIN
aa();
END;
然后提交commit;
![img](201904161052141424.png)
步骤四：查询存储过程执行后的表数据已经存在，总数正好为20W
![img](201904161052183904.png)
![img](201904161052281323.png)

### 【oracle[卸载](http://www.cncrk.com/softwareuninstall/)教程】

oracle下载64位破解版怎么卸载？
1、停用oracle服务：进入计算机管理，在服务中，找到oracle开头的所有服务，右击选择停止
![img](201904161053519097.jpg)
![img](201904161053563313.jpg)
![img](201904161054058047.jpg)
2、在开始菜单中，找到Universal Installer，运行Oracle Universal Installer，单击卸载产品
![img](201904161054321096.png)
![img](201904161054368498.jpg)
![img](201904161054438055.jpg)
3、在产品清单窗口中，单击全部展开，除了OraDb11g_home1外，勾选其他项目，单击删除
![img](201904161057177119.jpg)
![img](201904161057218189.jpg)
![img](20190416105731595.jpg)
![img](201904161057352849.jpg)
![img](201904161058044517.jpg)
4、按Windows徽标键和R键，打开运行窗口，输入regedit，打开注册表，依次展开HKEY_LOCAL_MACHINE\SOFTWARE，找到oracle，删除之
![img](201904161058099979.jpg)
![img](201904161058184253.jpg)
![img](201904161058223066.jpg)
5、依次展开HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services中，删除所有oracle开头的项
![img](20190416105830753.jpg)
![img](201904161058344805.jpg)
6、依次展开HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Eventlog\Application，删除所有oracle开头的项；
在HKEY_CLASSES_ROOT，删除以ora开头的项
![img](201904161058428590.jpg)
![img](201904161058467402.jpg)
7、重启电脑，删除oracle目录，删除Oracle的安装目录app等
![img](201904161058544466.jpg)
![img](20190416105858552.jpg)

### 【oracle本地数据库安装报错指南】

#### 安装ORACLE服务出现Oracle Net Configuration Assistant 失败问题

**解决方法：**
以管理员身份运行 ORACLE_HOME 下 BIN 目录中的 netca.bat，通过这种方式配置监听，就会配置成功。

右击netca.bat以管理员身份运行,选第一个 监听程序配置——添加 不成功，提示已经运行，那么选择 监听程序配置——**重新配置**，配置成功，然后在oracle安装页面跳过刚才的错误，继续安装即可。

安装完成之后启动OracleOraDb11g_home1TNSListener服务,再连接数据库

#### 本地计算机上的OracleOraDb11g_home1TNSListener服务启动后停止。某些服务在未由其它服务或程序使用时将自动停止。

安装好Oracle服务器之后，接着安装客户端PL/SQL Developer，可以使用，但是重启计算机之后，再次使用PL/SQL Developer连接Oracle时，提示说

没有开启监听，于是到服务里查看，确实没有开启Oracle的监听项目OracleOraDb11g_home1TNSListener，于是开启，好了，报错了：

　　本地计算机上的OracleOraDb11g_home1TNSListener服务启动后停止。某些服务在未由其它服务或程序使用时将自动停止。

怀疑是Oracle的ORACLE_HOME出现问题，打开环境变量，找到系统变量中的ORACLE_HOME，把值改为ORACLE的安装目录，如下路径：

E:\app\Administrator\product\11.2.0\dbhome_1

-----------------------------（之前在安装配置PL/SQL Developer的时候可能配置错了）

重新启动OracleOraDb11g_home1TNSListener，发现可以成功启动了，再次启动连接PL/SQL Developer，发现又有报错：

　　ORA-12541: TNS: 无监听程序

解决方法：

　　开始--所有程序--Oracle OraDb11g_home1--配置和移植工具--Net Configuration Assistant，重新配置  

配置两部分

监听程序配置 和上一个错误的配置方式一样

本地网络服务名配置 一直下一步配置到主机名的时候换成127.0.0.1，顺便说一下，E:\app\Administrator\product\11.2.0\dbhome_1\NETWORK\ADMIN\listener.ora，

E:\app\Administrator\product\11.2.0\dbhome_1\NETWORK\ADMIN\tnsnames.ora，

D:\PLSQLDeveloper\instantclient_11_2\tnsnames.ora

这三个文件中的HOST统一换成127.0.0.1【一定要统一！】

到这一步，如果出现错误以上错误，“无监听程序”，打开PL/SQL Developer连接，报错：

　　　　ORA-12514: TNS:监听程序当前无法识别连接描述符中请求的服务

解决方法：

**保证下面两项服务启动**

OracleServiceORCL
OracleOra...TNSLIistener

　　1、更改登录，输入用户名和口令

　　2、如果步骤1也没能解决， 就打开下面三个文件，

E:\app\Administrator\product\11.2.0\dbhome_1\NETWORK\ADMIN\listener.ora，

E:\app\Administrator\product\11.2.0\dbhome_1\NETWORK\ADMIN\tnsnames.ora，

D:\PLSQLDeveloper\instantclient_11_2\tnsnames.ora

**不做任何修改，保存，退出即可！**

重新连接PL/SQL Developer，连接成功！

### 【使用技巧】

oracle如何like多个值？
1、打开plsql 客户端
![img](201904161109578330.png)
2、输入Username，Password，Database，然后点击OK
![img](201904161110012680.png)
3、然后点击箭头指向的图标
![img](201904161110099283.png)
4、然后选择“SQL Window”就会打开一个sql输入框
![img](201904161110133408.png)
5、然后就可以在空白处输入要like 的语句
![img](201904161110217652.png)
6、下面的演示是如何like 多个值，比如说要查询的字段是Id：
select  from “你的表名字” where Id like '%你要like的字符%' or Id like '%你要like的字符%'，每一个 like 用 or 连接，这里是2个like的例子，如果还有，就继续往后加，输入完语句就点击箭头指向的齿轮图标执行语句，就可以在下面看到执行的结果了。
![img](201904161110264064.png)

oracle如何查看锁表？1、以下代码可以查看是否被锁表：
select a.object_name,b.session_id,c.serial#,c.program,c.username,c.command,c.machine,c.lockwait
from all_objects a,v$locked_object b,v$session c where a.object_id=b.object_id and c.sid=b.session_id;

2、查询锁表原因：
select l.session_id sid,
s.serial#,
l.locked_mode,
l.oracle_username,
s.user#,
l.os_user_name,
s.machine,
s.terminal,
a.sql_text,
a.action

3、接上：
from v$sqlarea a, v$session s, v$locked_object l
where l.session_id = s.sid
and s.prev_sql_addr = a.address
order by sid, s.serial#;

4、解锁方法：alter system kill session ’146′; –146为锁住的进程号，即spid。

5、查看被锁的表： select p.spid,c.object_name,b.session_id,b.oracle_username,b.os_user_name from v$process p,v$session a, v$locked_object b,all_objects c where p.addr=a.paddr and a.process=b.process and c.object_id=b.object_id

### 【oracle注册码】

oracle注册框中分别填入下载的信息
product code： 4vkjwhfeh3ufnqnmpr9brvcuyujrx3n3le
serial Number：226959
password： xs374ca