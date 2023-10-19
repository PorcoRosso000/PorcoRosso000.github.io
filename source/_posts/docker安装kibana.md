---
title: docker安装kibana
typora-root-url: docker安装kibana
tags: kibana
categories: kibana
abbrlink: 9945e44a
date: 2023-10-17 15:31:39
permalink:
---

## 准备工作

```powershell
# 打开目录
[root@MuYu docker]# cd /usr/local/docker/
# 创建 kibana 目录
[root@MuYu docker]# mkdir kibana/
# 进入 kibana 目录
[root@MuYu docker]# cd kibana/
```

## 挂载目录

```yaml
# 创建 config 挂载目录
[root@MuYu kibana]# mkdir config
```

## 配置文件

```yaml
# 进入 config 目录
[root@MuYu kibana]# cd config/
# 编写配置文件 或者直接 上传下面这个 配置文件
[root@MuYu config]# vim kibana.yml
```

[kibana.yml](https://uploader.shimo.im/f/vmnKvzuXEAFTazBC.yml?fileGuid=loqeMYlyWrfrBWqn)

赋权限：

```yaml
chmod -R 777 kibana.yml
docker logs -f -t --tail -f 容器id
```

```yaml
# 主机地址，可以是ip,主机名
server.host: 0.0.0.0
# 提供服务的端口，监听端口
server.port: 5601
# 该 kibana 服务的名称，默认 your-hostname
server.name: "MuYu-kibana"
server.shutdownTimeout: "5s"

#####----------elasticsearch相关----------#####
# kibana访问es服务器的URL,就可以有多个，以逗号","隔开
elasticsearch.hosts: [ "http://你的IP地址:9200" ]
monitoring.ui.container.elasticsearch.enabled: true

####----------日志相关----------#####

# kibana日志文件存储路径，默认stdout
logging.dest: stdout

# 此值为true时，禁止所有日志记录输出
# 默认false
logging.silent: false

# 此值为true时，禁止除错误消息之外的所有日志记录输出
# 默认false
logging.quiet: false

# 此值为true时，记录所有事件，包括系统使用信息和所有请求
# 默认false
logging.verbose: false

#####----------其他----------#####

# 系统和进程取样间隔，单位ms，最小值100ms
# 默认5000ms
ops.interval: 5000
# kibana web语言
# 默认en
i18n.locale: "zh-CN"
```

## 启动脚本

```powershell
[root@MuYu config]# cd ../  
[root@MuYu kibana]# vim startKibana.sh
```

### 脚本内容

```shell
docker run -d \
--name kibana-7.17.0 \
--privileged=true \
--restart=always \
-p 5601:5601 \
-e TZ="Asia/Shanghai" \
-v /usr/local/docker/kibana/config/kibana.yml:/usr/share/kibana/config/kibana.yml \
kibana:7.17.0
```

### 脚本赋权

```powershell
[root@MuYu kibana]# chmod -R 700 startKibana.sh 
```

## 启动脚本

```powershell
[root@MuYu kibana]# ./startKibana.sh
```

## 查看结果

![图片](./clip_image002.gif)

![图片](./clip_image004.gif)

