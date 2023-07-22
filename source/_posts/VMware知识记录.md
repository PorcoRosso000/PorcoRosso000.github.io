---
title: VMware知识记录
typora-root-url: VMware知识记录
tags: VMware
categories: VMware
abbrlink: 5b52618
date: 2023-07-22 15:18:17
permalink:
---

### 虚拟机ifconfig或ip addr不显示ip地址



报错图片：

一直查不到ip地址，有重新启动很多次

![20210318222104836](./20210318222104836.png)

#### 解决方法

（1）命令查看配置文件：

vi /etc/sysconfig/network-scripts/ifcfg-ens33

ens33 注意看这个修改的文件后缀

把ONBOOT的状态no改为yes

然后重启，应该就没问题了。

![20210318222623751](./20210318222623751.png)

（2）:还有一种可能是因为虚拟网卡没有正常连接，解决方法是开启虚拟网卡的服务：打开任务管理器，选择服务标签，为了保险，开启所有的和vmware有关的服务

![20210318223141577](./20210318223141577.png)

检查带VM的服务是否都开启了
打开后重启

（3）:

第一步：

```
命令：systemctl stop NetworkManager
```

第二步：

```
命令：systemctl disable NetworkManager
```

第三步：

```
命令：service network start
```

先执行这三步，等网卡重新启动。

![20210318225907899](./20210318225907899.png)

再执行：

```
命令：ifup ens33
```

然后重新启动再去查看ip地址，问题解决



版权声明：

本文为CSDN博主「原味Java」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qq_49466168/article/details/114993569