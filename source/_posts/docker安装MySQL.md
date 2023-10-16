---
title: docker安装MySQL
typora-root-url: docker安装MySQL
tags: MYSQL
categories: MYSQL
abbrlink: 72c8f5cf
date: 2023-10-16 16:46:16
permalink:
---



# 准备工作

```json
# 打开目录
[root@MuYu ~]# cd /usr/local/docker/
# 创建文件夹
[root@MuYu docker]# mkdir mysql
# 打开文件夹
[root@MuYu docker]# cd mysql/
```

# 创建挂载目录

```json
# 创建数据挂在目录
[root@MuYu mysql]# 
# 创建配置文件目录
[root@MuYu mysql]# mkdir config
# 打开config
[root@MuYu mysql]# cd config/
# 编写配置文件
[root@MuYu config]# vim my.cnf
```

# 配置文件内容

```json
[client]
# 端口号
port=3306

[mysql]
no-beep
default-character-set=utf8mb4

[mysqld]
# 端口号
port=3306
# 数据目录
datadir=/var/lib/mysql
# 新模式或表时将使用的默认字符集
character-set-server=utf8mb4
# 默认存储引擎
default-storage-engine=INNODB
# 将 SQL 模式设置为严格
sql-mode="STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION"
#  最大连接数
max_connections=1024
# 表缓存
table_open_cache=2000
# 表内存
tmp_table_size=16M
# 线程缓存
thread_cache_size=10

# myisam设置
myisam_max_sort_file_size=100G
myisam_sort_buffer_size=8M
key_buffer_size=8M
read_buffer_size=0
read_rnd_buffer_size=0

# innodb设置
innodb_flush_log_at_trx_commit=1
innodb_log_buffer_size=1M
innodb_buffer_pool_size=8M
innodb_log_file_size=48M
innodb_thread_concurrency=33
innodb_autoextend_increment=64
innodb_buffer_pool_instances=8
innodb_concurrency_tickets=5000
innodb_old_blocks_time=1000
innodb_open_files=300
innodb_stats_on_metadata=0
innodb_file_per_table=1
innodb_checksum_algorithm=0
# 其他设置
back_log=80
flush_time=0
join_buffer_size=256K
max_allowed_packet=4M
max_connect_errors=100
open_files_limit=4161
sort_buffer_size=256K
table_definition_cache=1400
binlog_row_event_max_size=8K
sync_master_info=10000
sync_relay_log=10000
sync_relay_log_info=10000
```

下载镜像

```powershell
[root@MuYu mysql]# docker pull mysql:5.7
```

# 编写脚本

```powershell
# 打开目录
[root@MuYu config]# cd /usr/local/docker/mysql/

# 编写脚本
[root@MuYu mysql]# vim startMysql.sh

# 脚本内容
docker run -d \
--privileged=true \
--name mysql57-3306 \
-p 3306:3306 \
--restart=always \
-v /usr/local/docker/mysql/data:/var/lib/mysql \
-v /usr/local/docker/mysql/config/my.cnf:/etc/mysql/my.cnf \
-e MYSQL_ROOT_PASSWORD=Dongzl828.. mysql:5.7 \



# 权限赋予
[root@MuYu mysql]# chmod -R 777 startMysql.sh
```

# 启动脚本

```json
# 执行脚本
[root@MuYu mysql]# ./startMysql.sh
```

# 查看结果

![图片](./clip_image002.gif)

```powershell
# 进入容器
[root@MuYu mysql]# docker exec -it mysql57-3306 /bin/bash
# 连接MySQL
root@4ff92e46f363:/# mysql -uroot -pDongzl828..
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.38 MySQL Community Server (GPL)

Copyright (c) 2000, 2022, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

# 查询数据库
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.01 sec)
```

![图片](./clip_image004.gif)