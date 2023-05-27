---
title: hexo指令
abbrlink: 89e11d40
date: 2022-11-11 22:30:29
---

### hexo基础命令

hexo new post "文章名" :创建文章
hexo clean ：删除之前生成的文件，若未生成过静态文件，可忽略此命令。
hexo generate ：生成静态文章，可以用hexo g缩写
hexo deploy ：部署文章，可以用hexo d缩写
hexo s -p 8000 : 搜索启动
hexo server :运行服务
hexo algolia ：搜集更新博文数据

### 多台电脑都可以使用个人博客

除了master分支再建立一个hexo分支(设为默认)

创建一个叫hexo（或者blog，名字随意）的分支，并切换到这个分支
git checkout -b hexo

添加所有文件到暂存区
git add –all

进行提交
git commit -m “提交信息xxx”

推送hexo分支的文件到github仓库
git push –set-upstream origin hexo

下次要写博客从仓库里把代码拉下来

执行

npm install hexo

npm install hexo-cli -g

npm install

npm install hexo-deployer-git

这四条命令

然后创建文章

^\s*(?=\r?$)\n  :在vscode中替换空行的正则



### 更新giuhub仓库hexo分支

git status  :查看修改的文件
git add .  :放入缓存区
git commit -m “本次提交的备注”  :本次提交的文字说明
git push -u origin hexo    :将项目上传到远程仓库的hexo分支



###  报错 :

#### failed to push some refs to 'github.com:PorcoRosso000/PorcoRosso000.github.io.git' 

远程库和本地库不一致 
解决方案: 拉取远程库数据同步到本地库      

git pull --rebase origin hexo 



#### error: cannot pull with rebase: Your index contains uncommitted changes.

error: cannot pull with rebase: Your index contains uncommitted changes.
error: please commit or stash them.

解决方案：修复冲突

git stash

git pull --rebase

git stash pop

之后就可以继续提交