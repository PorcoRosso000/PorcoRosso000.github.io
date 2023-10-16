---
title: docker安装gitlab
typora-root-url: docker安装gitlab
tags: gitlab
categories: gitlab
abbrlink: 8dbcf254
date: 2023-10-16 16:37:32
permalink:
---



### 安装步骤

#### 1.先建gitlab文件夹

```plain
cd /usr/local/docker
mkdir gitlab
```

#### 2.docker 安装配置阿里云镜像源

```plain
1. sudo mkdir -p /etc/docker

2. sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://yxzrazem.mirror.aliyuncs.com"]
}
EOF
3.sudo systemctl daemon-reload
4.sudo systemctl restart docker
```

#### 3.gitlab 镜像拉取

```plain
# gitlab-ce为稳定版本，后面不填写版本则默认pull最新latest版本
$ docker pull gitlab/gitlab-ce 
```

4.提前建好docker文件夹 为了挂载镜像路径

```plain
cd /usr/local/docker/gitlab
mkdir config
mkdir logs
mkdir data
```

#### 5.编写启动配置文件

```plain
vim startGitlab.sh
```

配置文件内容

```plain
docker run -d \
-p 443:443 \
-p 9001:80 \
-p 9002:22 \
--name gitlab \
--restart always 
-v /usr/local/docker/gitlab/config:/etc/gitlab \
-v /usr/local/docker/gitlab/logs:/var/log/gitlab \
-v /usr/local/docker/gitlab/data:/var/opt/gitlab \
gitlab/gitlab-ce
```

#### 6.给配置文件赋权

```plain
chmod -R 777 startGitlab.sh
```

启动gitlab

```plain
./startGitlab.sh
```

#### 7.修改gitlab.rb 文件 

```plain
vim /usr/local/docker/gitlab/config/gitlab.rb

# 配置http协议所使用的访问地址,不加端口号默认为80
external_url 'http://192.168.xxx.xxx'
# 配置ssh协议所使用的访问地址和端口
gitlab_rails['gitlab_ssh_host'] = '192.168.xxx.xxx'
gitlab_rails['gitlab_shell_ssh_port'] = 9002 # 此端口是run时22端口映射的222端口
```

8.查看已开启的端口

```plain
firewall-cmd --list-ports
```

查看防火墙状态

```plain
firewall-cmd --state
```

开启防火墙:

```plain
[root@localhost gitlab]# systemctl start firewalld
```

在防火墙中对外开启此端口:开启9001和9002端口

```plain
[root@localhost gitlab]# firewall-cmd --zone=public --add-port=9001/tcp --permanent
[root@localhost gitlab]# firewall-cmd --reload
```

重新启动gitlab加载配置

```plain
docker restart gitlab
```

此时项目的仓库地址就变了。如果ssh端口地址不是默认的22，就会加上ssh:// 协议头

 打开浏览器输入ip地址(因为我的gitlab端口不是80，所以浏览器url要输入端口号，如果端口号不是80，则打开为：ip:端口号)

```plain
http://192.168.227.xxx:9001/
```

登录gitlab修改密码

初始密码位置

```plain
vim /usr/local/docker/gitlab/config/initial_root_password
```

接下来就可以创建项目了

#### 没有卸载干净的情况

由于汉化版本都低于英文版本，为了不产生不必要的麻烦就要先下载汉化包，查看汉化包的版本号，根据汉化包的版本号来安装指定版本的GitLab。若你安装的版本是最新的比汉化包高太多，那么你汉化时需要忽略数百到上千次的文件。若你是刚装的GitLab，可以考虑重新卸载后安装和汉化包版本一致的版本。下面是如何彻底卸载GitLab。

1、停止gitlab

```plain
docker stop gitlab
```

2、卸载gitlab（注意这里写的是gitlab-ce）

```plain
rpm -e gitlab-ce
```

3、查看gitlab进程

```plain
ps aux | grep gitlab
```

4、杀掉第一个进程（就是带有好多…的进程） kill -9 进程号

杀掉后，在ps aux | grep gitlab确认一遍，还有没有gitlab的进程。若还存在，可以把它的主要组件的进程也杀一边。

```plain
run: alertmanager: (pid 100019) 13376s; run: log: (pid 82025) 86211s
run: gitaly: (pid 100032) 13376s; run: log: (pid 82041) 86211s
run: gitlab-monitor: (pid 100047) 13375s; run: log: (pid 82047) 86211s
run: gitlab-workhorse: (pid 100054) 13375s; run: log: (pid 82031) 86211s
run: logrotate: (pid 121160) 2574s; run: log: (pid 82039) 86211s
run: nginx: (pid 100070) 13374s; run: log: (pid 82037) 86211s
run: node-exporter: (pid 100077) 13374s; run: log: (pid 82027) 86211s
run: postgres-exporter: (pid 100082) 13373s; run: log: (pid 82023) 86211s
run: postgresql: (pid 100097) 13372s; run: log: (pid 82035) 86211s
run: prometheus: (pid 100100) 13372s; run: log: (pid 82021) 86211s
run: redis: (pid 100114) 13372s; run: log: (pid 82033) 86211s
run: redis-exporter: (pid 100118) 13371s; run: log: (pid 82043) 86211s
run: sidekiq: (pid 100124) 13370s; run: log: (pid 82029) 86211s
run: unicorn: (pid 100136) 13369s; run: log: (pid 82045) 86211s
```

日志的进程不用管。

5、删除所有包含gitlab文件

```plain
find / -name gitlab | xargs rm -rf
```

当然若你没有全杀权限。那么可以可以把这三个目录给干掉也可以：

```plain
rm -rf  /opt/gitlab
rm -rf  /etc/gitlab
rm -rf  /var/log/gitlab
```

