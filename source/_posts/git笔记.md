---
title: git笔记
typora-root-url: git笔记
tags: git
categories: git
abbrlink: d9283bc6
date: 2023-08-04 22:28:50
permalink:
---



### 1、git命令大全（整理成表格，方便查阅）

#### 创建仓库命令

| 命令           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| git init       | 初始化仓库，在当前目录新建一个Git代码库，基本上是创建一个具有objects，refs/head，refs/tags和模板文件的.git目录。 |
| git clone[url] | 拷贝一份远程仓库，也就是下载一个项目和它的整个代码历史。     |

#### 配置

| 命令                                                         | 说明                     |
| ------------------------------------------------------------ | ------------------------ |
| git config --list                                            | 显示当前的Git配置        |
| git config -e [--global]                                     | 编辑Git配置文件。        |
| git config [--global] user.name "[name]" git config [--global] user.email "[email address]" | 设置提交代码时的用户信息 |

#### 增加 / 删除文件

| 命令                                  | 说明                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| git add [file1] [file2] ...           | 添加指定文件到暂存区                                         |
| git add [dir]                         | 添加指定目录到暂存区，包括子目录                             |
| git add .                             | 添加当前目录的所有文件到暂存区                               |
| git add -p                            | 添加每个变化前，都会要求确认 对于同一个文件的多处变化，可以实现分次提交 |
| git rm [file1] [file2] ...            | 删除工作区文件，并且将这次删除放入暂存区                     |
| git rm --cached [file]                | 停止追踪指定文件，但该文件会保留在工作区                     |
| git mv [file-original] [file-renamed] | 改名文件，并且将这个改名放入暂存区                           |

#### 代码提交

| 命令                                        | 说明                                                         |
| ------------------------------------------- | ------------------------------------------------------------ |
| git commit -m [message]                     | 提交暂存区到仓库区                                           |
| git commit [file1] [file2] ... -m [message] | 提交暂存区的指定文件到仓库区                                 |
| git commit -a                               | 提交工作区自上次commit之后的变化，直接到仓库区               |
| git commit -v                               | 提交时显示所有diff信息                                       |
| git commit --amend -m [message]             | 使用一次新的commit，替代上一次提交 如果代码没有任何新变化，则用来改写上一次commit的提交信息 |
| git commit --amend [file1] [file2] ...      | 重做上一次commit，并包括指定文件的新变化                     |

#### 分支

| 命令                                                         | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| git branch                                                   | 列出所有本地分支                                             |
| git branch -r                                                | 列出所有远程分支                                             |
| git branch -a                                                | 列出所有本地分支和远程分支                                   |
| git branch [branch-name]                                     | 新建一个分支，但依然停留在当前分支                           |
| git checkout -b [branch]                                     | 新建一个分支，并切换到该分支                                 |
| git branch [branch] [commit]                                 | 新建一个分支，指向指定commit                                 |
| git branch --track [branch] [remote-branch]                  | 新建一个分支，与指定的远程分支建立追踪关系                   |
| git push -u origin [branch]                                  | 一旦分支已经被创建并有一些提交，可以将该分支推送到远程存储库中。-u 参数告诉 Git 在远程存储库中设置上游（默认）分支。第一次推送分支时，它会自动创建同名远程分支 |
| git checkout [branch-name]                                   | 切换到指定分支，并更新工作区                                 |
| git checkout -                                               | 切换到上一个分支                                             |
| git branch --set-upstream [branch] [remote-branch]           | 建立追踪关系，在现有分支与指定的远程分支之间                 |
| git merge [branch]                                           | 合并指定分支到当前分支                                       |
| git cherry-pick [commit]                                     | 选择一个commit，合并进当前分支                               |
| git branch -d [branch-name]                                  | 删除分支                                                     |
| git push origin --delete [branch-name] 或 git branch -dr [remote/branch] | 删除远程分支                                                 |

#### 标签

| 命令                                 | 说明                      |
| ------------------------------------ | ------------------------- |
| git tag                              | 列出所有tag               |
| git tag [tag]                        | 新建一个tag在当前commit   |
| git tag [tag] [commit]               | 新建一个tag在指定commit   |
| git tag -d [tag]                     | 删除本地tag               |
| git push origin :refs/tags/[tagName] | 删除远程tag               |
| git show [tag]                       | 查看tag信息               |
| git push [remote] [tag]              | 提交指定tag               |
| git push [remote] --tags             | 提交所有tag               |
| git checkout -b [branch] [tag]       | 新建一个分支，指向某个tag |

#### 查看信息和历史

| 命令                                              | 说明                                                       |
| ------------------------------------------------- | ---------------------------------------------------------- |
| git status                                        | 显示有变更的文件                                           |
| git log                                           | 显示当前分支的版本历史                                     |
| git log --stat                                    | 显示commit历史，以及每次commit发生变更的文件               |
| git log -S [keyword]                              | 搜索提交历史，根据关键词                                   |
| git log [tag] HEAD --pretty=format:%s             | 显示某个commit之后的所有变动，每个commit占据一行           |
| git log [tag] HEAD --grep feature                 | 显示某个commit之后的所有变动，其"提交说明"必须符合搜索条件 |
| git log --follow [file] 或 git whatchanged [file] | 显示某个文件的版本历史，包括文件改名                       |
| git log -p [file]                                 | 显示指定文件相关的每一次diff                               |
| git log -5 --pretty --oneline                     | 显示过去5次提交                                            |
| git shortlog -sn                                  | 显示所有提交过的用户，按提交次数排序                       |
| git blame [file]                                  | 显示指定文件是什么人在什么时间修改过                       |
| git diff                                          | 显示暂存区和工作区的差异                                   |
| git diff --cached [file]                          | 显示暂存区和上一个commit的差异                             |
| git diff HEAD                                     | 显示工作区与当前分支最新commit之间的差异                   |
| git diff [first-branch]...[second-branch]         | 显示两次提交之间的差异                                     |
| git diff --shortstat "@{0 day ago}"               | 显示今天你写了多少行代码                                   |
| git show [commit]                                 | 显示某次提交的元数据和内容变化                             |
| git show --name-only [commit]                     | 显示某次提交发生变化的文件                                 |
| git show [commit]:[filename]                      | 显示某次提交时，某个文件的内容                             |
| git reflog                                        | 显示当前分支的最近几次提交                                 |

#### 远程同步

| 命令                                                         | 说明                                                        |
| ------------------------------------------------------------ | ----------------------------------------------------------- |
| git fetch [remote]                                           | 下载远程仓库的所有变动（远程新增或删除分支都能显示）        |
| git remote -v                                                | 显示所有远程仓库                                            |
| git config [--global] user.name "[name]" git config [--global] user.email "[email address]" | 设置提交代码时的用户信息                                    |
| git remote show [remote]                                     | 显示某个远程仓库的信息                                      |
| git remote add [shortname] [url]                             | 增加一个新的远程仓库，并命名                                |
| git pull  origin [remote-branch]                             | 取回远程仓库的变化，并与本地分支合并                        |
| git pull --rebase origin  [remote-branch] [branch]           | 使用rebase的方式 , 取回远程仓库的变化，并与指定本地分支合并 |
| git push [remote] [branch]                                   | 上传本地指定分支到远程仓库                                  |
| git push [remote] --force                                    | 强行推送当前分支到远程仓库，即使有冲突                      |
| git push [remote] --all                                      | 推送所有分支到远程仓库                                      |

#### 撤销

| 命令                         | 说明                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| git checkout [file]          | 恢复暂存区的指定文件到工作区                                 |
| git checkout [commit] [file] | 恢复某个commit的指定文件到暂存区和工作区                     |
| git checkout .               | 恢复暂存区的所有文件到工作区                                 |
| git reset [file]             | 重置暂存区的指定文件，与上一次commit保持一致，但工作区不变   |
| git reset --hard             | 重置暂存区与工作区，与上一次commit保持一致                   |
| git reset [commit]           | 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变 |
| git reset --hard [commit]    | 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致 |
| git reset --keep [commit]    | 重置当前HEAD为指定commit，但保持暂存区和工作区不变           |
| git revert [commit]          | 新建一个commit，用来撤销指定commit 后者的所有变化都将被前者抵消，并且应用到当前分支 |
| git stash                    | 暂时将未提交的变化移除，稍后再移入                           |
| git stash pop                | 暂时将未提交的变化移除，稍后再移入                           |

#### 贮藏

| 命令                          | 说明                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| git stash save "save message" | 执行存储时，添加备注，方便查找，只有git stash 也要可以的，但查找时不方便识别。 |
| git stash list                | 查看stash了哪些存储                                          |
| git stash show                | 显示做了哪些改动，默认show第一个存储,如果要显示其他存贮，后面加stash@{$num}，比如第二个 git stash show stash@{1} |
| git stash show -p             | 显示第一个存储的改动，如果想显示其他存存储，命令：git stash show  stash@{$num}  -p ，比如第二个：git stash show  stash@{1}  -p |
| git stash apply               | 应用某个存储,但不会把存储从存储列表中删除，默认使用第一个存储,即stash@{0}，如果要使用其他个，git stash apply stash@{$num} ， 比如第二个：git stash apply stash@{1} |
| git stash pop                 | 命令恢复之前缓存的工作目录，将缓存堆栈中的对应stash删除，并将对应修改应用到当前的工作目录下,默认为第一个stash,即stash@{0}，如果要应用并删除其他stash，命令：git stash pop stash@{$num} ，比如应用并删除第二个：git stash pop stash@{1} |
| git stash drop stash@{$num}   | 丢弃stash@{$num}存储，从列表中删除这个存储                   |
| git stash clear               | 删除所有缓存的stash                                          |

```
有时也可通过这种方法实现避免或解决冲突，当你修改的内容是最新的，但是你需要pull下来的代码是需要被替换的，你pull的时候还是会冲突，可以先把你的修改stash临时保存，pull完代码以后在恢复stash的保存，即可替换pull下来的需要被替换的代码，当然不保存直接对比解决冲突也是可以的
```

#### 其他

| 命令                   | 说明                                                         |
| ---------------------- | ------------------------------------------------------------ |
| git archive            | 生成一个可供发布的压缩包                                     |
| git repack             | 打包未归档文件                                               |
| git count-objects      | 计算解包的对象数量                                           |
| git help 或 git --help | Git帮助，查看git相关命令，如果想看某个特定命令的具体细节，可使用git [命令] --help,如 git commit --help 表示查看提交相关命令的帮助 |

### 2、Git操作流程

git的操作往往都不是一个命令能解决的，就比如下图所示，单单**代码提交和同步代码**，就涉及到6个命令的组合。

看完了git命令大全，这节列举了实际操作中的不同场景，为大家一一解答如何组合不同git命令，进行git的操作流程。

**代码提交和同步代码**

![1](./1.png)

**代码撤销和撤销同步**

![2](./2.png)

#### 1、代码提交和同步代码

- 第零步: 工作区与仓库保持一致
- 第一步: 文件增删改，变为已修改状态
- 第二步: git add ，变为已暂存状态

```text
$ git status
$ git add --all # 当前项目下的所有更改
$ git add .  # 当前目录下的所有更改
$ git add xx/xx.py xx/xx2.py  # 添加某几个文件
```

- 第三步: git commit，变为已提交状态

```text
$ git commit -m"<这里写commit的描述>"
```

- 第四步: git push，变为已推送状态

```text
$ git push -u origin master # 第一次需要关联上
$ git push # 之后再推送就不用指明应该推送的远程分支了
$ git branch # 可以查看本地仓库的分支
$ git branch -a # 可以查看本地仓库和本地远程仓库(远程仓库的本地镜像)的所有分支
```

> 在某个分支下，我最常用的操作如下

```text
$ git status
$ git add -a
$ git status
$ git commit -m 'xxx'
$ git pull --rebase
$ git push origin xxbranch` 
```

#### 2、代码撤销和撤销同步

##### 一、已修改，但未暂存

```text
$ git diff # 列出所有的修改
$ git diff xx/xx.py xx/xx2.py # 列出某(几)个文件的修改

$ git checkout # 撤销项目下所有的修改
$ git checkout . # 撤销当前文件夹下所有的修改
$ git checkout xx/xx.py xx/xx2.py # 撤销某几个文件的修改
$ git clean -f # untracked状态，撤销新增的文件
$ git clean -df # untracked状态，撤销新增的文件和文件夹

# Untracked files:
#  (use "git add <file>..." to include in what will be committed)
#
# xxx.py
```

##### 二、已暂存，未提交

> 这个时候已经执行过git add，但未执行git commit，但是用git diff已经看不到任何修改。 因为git diff检查的是工作区与暂存区之间的差异。

```text
$ git diff --cached # 这个命令显示暂存区和本地仓库的差异

$ git reset # 暂存区的修改恢复到工作区
$ git reset --soft # 与git reset等价，回到已修改状态，修改的内容仍然在工作区中
$ git reset --hard # 回到未修改状态，清空暂存区和工作区
```

> git reset --hard 操作等价于 git reset 和 git checkout 2步操作

##### 三、已提交，未推送

> 执行完commit之后，会在仓库中生成一个版本号(hash值)，标志这次提交。之后任何时候，都可以借助这个hash值回退到这次提交。

```text
$ git diff <branch-name1> <branch-name2> # 比较2个分支之间的差异
$ git diff master origin/master # 查看本地仓库与本地远程仓库的差异

$ git reset --hard origin/master # 回退与本地远程仓库一致
$ git reset --hard HEAD^ # 回退到本地仓库上一个版本
$ git reset --hard <hash code> # 回退到任意版本
$ git reset --soft/git reset # 回退且回到已修改状态，修改仍保留在工作区中。 
```

##### 四、已推送到远程

```text
$ git push -f orgin master # 强制覆盖远程分支
$ git push -f # 如果之前已经用 -u 关联过，则可省略分支名
```

> 慎用，一般情况下，本地分支比远程要新，所以可以直接推送到远程，但有时推送到远程后发现有问题，进行了版本回退，旧版本或者分叉版本推送到远程，需要添加 -f参数，表示强制覆盖。

#### ️3、其它常见操作

##### 一、关联远程仓库

- 如果还没有Git仓库，你需要

```text
$ git init
```

- 如果你想关联远程仓库

```text
$ git remote add <name> <git-repo-url>
# 例如 git remote add origin https://github.com/xxxxxx # 是远程仓库的名称，通常为 origin 
```

- 如果你想关联多个远程仓库

```text
$ git remote add <name> <another-git-repo-url>
# 例如 git remote add coding https://coding.net/xxxxxx 
```

- 忘了关联了哪些仓库或者地址

```text
$ git remote -v
# origin https://github.com/gzdaijie/koa-react-server-render-blog.git (fetch)
# origin https://github.com/gzdaijie/koa-react-server-render-blog.git (push) 
```

- 如果远程有仓库，你需要clone到本地

```text
$ git clone <git-repo-url>
# 关联的远程仓库将被命名为origin，这是默认的。
```

- 如果你想把别人仓库的地址改为自己的

```text
$ git remote set-url origin <your-git-url>
```

##### 二、 切换分支

> 新建仓库后，默认生成了master分支

- 如果你想新建分支并切换

```text
$ git checkout -b <new-branch-name>
# 例如 git checkout -b dev
# 如果仅新建，不切换，则去掉参数 -b
```

- 看看当前有哪些分支

```text
$ git branch
# * dev
#   master # 标*号的代表当前所在的分支
```

- 看看当前本地&远程有哪些分支

```text
$ git branch -a
# * dev
#   master
#   remotes/origin/master
```

- 切换到现有的分支

```text
$ git checkout master
```

- 你想把dev分支合并到master分支

```text
$ git merge <branch-name>
# 例如 git merge dev
```

- 你想把本地master分支推送到远程去

```text
$ git push origin master
# 你可以使用git push -u origin master将本地分支与远程分支关联，之后仅需要使用git push即可。
```

- 远程分支被别人更新了，你需要更新代码

```text
$ git pull origin <branch-name>
# 之前如果push时使用过-u，那么就可以省略为git pull
```

- 本地有修改，不能先git pull

```text
$ git stash # 工作区修改暂存
$ git pull  # 更新分支
$ git stash pop # 暂存修改恢复到工作区  
```

##### 三、 撤销操作

- 恢复暂存区文件到工作区

```text
$ git checkout <file-name> 
```

- 恢复暂存区的所有文件到工作区

```text
$ git checkout .
```

- 重置暂存区的某文件，与上一次commit保持一致，但工作区不变

```text
$ git reset <file-name>
```

- 重置暂存区与工作区，与上一次commit保持一致

```text
$ git reset --hard <file-name>
# 如果是回退版本(commit)，那么file，变成commit的hash码就好了。 
```

- 去掉某个commit

```text
$ git revert <commit-hash>
# 实质是新建了一个与原来完全相反的commit，抵消了原来commit的效果 
```

- reset回退错误恢复

```text
$ git reflog #查看最近操作记录
$ git reset --hard HEAD{5} #恢复到前五笔操作
$ git pull origin backend-log #再次拉取代码
```

##### 四、版本回退与前进

- 查看历史版本

```text
$ git log
```

- 你可能觉得这样的log不好看，试试这个

```text
$ git log --graph --decorate --abbrev-commit --all
```

- 检出到任意版本

```text
$ git checkout a5d88ea
# hash码很长，通常6-7位就够了
```

- 远程仓库的版本很新，但是你还是想用老版本覆盖

```text
$ git push origin master --force
# 或者 git push -f origin master
```

- 觉得commit太多了? 多个commit合并为1个

```text
$ git rebase -i HEAD~4
# 这个命令，将最近4个commit合并为1个，HEAD代表当前版本。将进入VIM界面，你可以修改提交信息。推送到远程分支的commit，不建议这样做，多人合作时，通常不建议修改历史。 
```

- 想回退到某一个版本

```text
$ git reset --hard <hash>
# 例如 git reset --hard a3hd73r
# --hard代表丢弃工作区的修改，让工作区与版本代码一模一样，与之对应，--soft参数代表保留工作区的修改。
```

- 想回退到上一个版本，有没有简便方法?

```text
$ git reset --hard HEAD^ 
```

- 回退到上上个版本呢?

```text
$ git reset --hard HEAD^^
# HEAD^^可以换作具体版本hash值。
```

- 回退错了，能不能前进呀

```text
$ git reflog
# 这个命令保留了最近执行的操作及所处的版本，每条命令前的hash值，则是对应版本的hash值。使用上述的git checkout 或者 git reset命令 则可以检出或回退到对应版本。
```

- 刚才commit信息写错了，可以修改吗

```text
$ git commit --amend
```

- 看看当前状态吧

```text
$ git status 
```

##### 五、配置属于你的Git

- 看看当前的配置

```text
$ git config --list 
```

- 估计你需要配置你的名字

```text
$ git config --global user.name "<name>
#  --global为可选参数，该参数表示配置全局信息` 
```

- 希望别人看到你的commit可以联系到你

```text
$ git config --global user.email "<email address>" 
```

- 有些命令很长，能不能简化一下

```text
$ git config --global alias.logg "log --graph --decorate --abbrev-commit --all"
# 之后就可以开心地使用 git log了
```



### 3、新建了一个git仓库，本地代码上传gitlab

```csharp
$ git init  //建立一个新的git链接
$ git remote add origin https://gitee.com/xxx/XXX.git  //https：自己的仓库地址
$ git config --global user.email "you@example.com"   //自己的邮箱
$ git config --global user.name "Your Name"  //用户名
$ git add .  //. 是添加所有文件到git仓库
$ git commit -m "提交的内容名称"
$ git pull origin master  //先拉取下后提交不容易错
$ git push -u origin master  //提交到master分支
```

### 4、git status 出错 interactive rebase in progress； onto 796e78f

```
使用 git commit --amend 命令修订当前的提交
使用 git rebase --continue 命令继续代码的提交(推荐),执行之后,需要重新提交,解决一下当前的代码冲突之后重新提交直至没有rebase提示,就可以正常提交了
```

### 5、切换仓库源

**移除之前的git源：**

```html
git remote rm origin
```

**连接新的git源：**

```html
git remote add origin '仓库地址'
```

### 6、git冲突解决

用

```
git fetch origin master
```

该命令会将远程仓库的代码同步到本地，但是不会合并到任何分支上，而是存放到一个 origin/master分支上；

之后调用

```
git diff origin/master   可以查看远程仓库到底修改了哪些东西 
```

git diff 对比两次文件修改了什么。但如何退出呢？按q即可

最后调用

```
git merge origin/master
```

将远程仓库的代码与本地主干分支进行合并；执行完这一步后所有本地与远程的代码就合并了，只是存在冲突的地方

被加上了标记，需要手动去解决冲突；执行完该命令后git中会显示每个冲突所在的文件，

例如：Conflicts XXXXXX>XXX>XX  之类的

你就去你项目的文件下，在AndroidStudio打开该文件。手动合并的方法：

> <<<<<<<到=======是在当前分支合并之前的文件内容*
>
> =======到>>>>>>> psr/psr-02是在其它分支下修改的内容
>
> 需要在这个两个版本中选择一个，然后把标记符号也要一起删除

合并完成后执行  

```
git add . 命令 
```

将你合并的文件添加进去 然后

```
git commit -m “你的提交信息”
```

提交合并成功后就可以上传到远程仓库啦

```
git push -u origin master
```

另外在 git commit 这步常常忘记输入提交信息导致进入 编辑提交信息的界面 应该就是下面的git bash vim吧；



### 7、git commit 最后一次提交的注释信息，如何修改？ 如何退出编辑器？

今天用git commit -m “注释”提交的时候，注释写错了，

首先 使用 git commit --amend 命令（修改最近一次提交的注释信息），会进入到 vim 编辑器

然后 你会发现编辑器里你怎么输入都没反应，这是因为vim处在不可编辑状态，

```
按下字母键 c（此时进入编辑状态）
```

，可以开始修改注释信息了

修改好后，你会发现怎么都退出不了，然后如下操作：

```
按下 Esc (退出编辑状态)； 接着连按两次大写字母Z
```

，你会惊喜的发现，终于保存好退出来了！

### 8、查看提交历史

```
git log :列出历史提交记录  (退出方式 : 英文状态下输入q就可以直接退出了)
例:
commit 64487e1132ed01fea1c87c315a2f9de2b80c75ed
Author: porcorosso <1332355083@qq.com>
Date:   Fri Aug 4 22:04:48 2023 +0800

    init

commit 8b495e74edfea974f5eb087530fede425800fa51
Author: porcorosso <1332355083@qq.com>
Date:   Fri Aug 4 21:39:59 2023 +0800

    init

commit f88b2e6cb8996f9b7d3fc4b8a847c20e9bddbe19
Author: Administrator <admin@example.com>
Date:   Wed Aug 2 23:21:08 2023 +0000

    Initial commit

git log --oneline :查看历史记录的简洁的版本
例:
4b7e397 (HEAD -> master, origin/master) md
64487e1 init
8b495e7 init
f88b2e6 Initial commit

```

### 9、变基 

#### 本分支变基

在master分支上添加了5次提交，我们的目标是把最后三个提交合并为一个提交：

变基命令：
 `git rebase -i [startpoint] [endpoint]`

-  `-i`: 意思是`--interactive`，即弹出交互式的界面让用户编辑完成合并操作;
-  `[startpoint] [endpoint]`则指定了一个编辑区间，如果不指定`[endpoint]`，则该区间的终点默认是当前分支`HEAD`所指向的`commit`(注：该区间指定的是一个前开后闭的区间)。

变基步骤：

- 输入命令：

```cpp
git rebase -i 073ea5e //第三次提交ID

//上面等同如下命令
git rebase -i HEAD~3
```

在交互界面使用下面命令对提交进行操作

![20230805141202](./20230805141202.png)

比如要合并那三次提交,
第一次提交使用pick 后面的都改成 squash ,
这样三次提交就可以合并

### 10、命令说明

> pick：保留该commit（缩写:p）
>  reword：保留该commit，但我需要修改该commit的注释（缩写:r）
>  edit：保留该commit, 但我要停下来修改该提交(不仅仅修改注释)（缩写:e）
>  squash：将该commit和前一个commit合并（缩写:s）
>  fixup：将该commit和前一个commit合并，但我不要保留该提交的注释信息（缩写:f）
>  exec：执行shell命令（缩写:x）
>  drop：我要丢弃该commit（缩写:d）

### 11、查看提交信息

git show commit_id | grep diff | cut -d" " -f 3

例如 :
a/README.md

### 12、提交规范

- feat: 新功能
- fix: 修复问题
- docs: 修改文档
- style: 修改代码格式，不影响代码逻辑
- refactor: 重构代码，理论上不影响现有功能
- perf: 提升性能
- test: 增加修改测试用例
- chore: 修改工具相关（包括但不限于文档、代码生成等）
- deps: 升级依赖

**例如**

```bash
git commit -m 'fix:修复xxxbug'
```

-----------------------------------------------------------------------------

抛弃本地的 commit，采用远程的 commit。慎用：因为你本地的修改都会失去。

```
git rebase --skip
```

终止这次 rebase 操作

```
git rebase --abort
```

手动处理冲突的文件：执行git add .，再 git rebase --continue，反复操作直到解决完所有冲突，并合并到分支上。

```
git rebase --continue
```

### 13、git回退版本

#### git reset 回退  

缺点: 回退并且窗口关闭后 错误的版本会消失 找不到  ,没有关闭窗口的话还可以通过 git reset --hard 错误的版本号 回退到错误的版本

1.**使用git log 找到要回退的版本号**

```
git log 

commit f88b2e6cb8996f9b7d3fc4b8a847c20e9bddbe19
Author: Administrator <admin@example.com>
Date:   Wed Aug 2 23:21:08 2023 +0000

    Initial commit

commit  后面就是版本号
```

2.**使用git reset --hard 版本号 回退到版本**

其”--soft 、--mixed以及--hard是三个恢复等级。
 使用--soft就仅仅将头指针恢复，已经add的暂存区以及工作空间的所有东西都不变。
 如果使用--mixed，就将头恢复掉，已经add的暂存区也会丢失掉，工作空间的代码什么的是不变的。
 如果使用--hard，那么一切就全都恢复了，头变，add的暂存区消失，代码什么的也恢复到以前状态。

回退代码快捷操作：

```git
git reset --hard HEAD^ #回退到上一个版本
git reset --hard HEAD^^ #回退到上上一个版本
git reset --hard HEAD~3 #回退到往上3个版本
git reset --hard HEAD~10 #回退到往上10个版本
```

3.**git push origin 仓库名 --force 推送代码**

提交后 

![12665637-84cd705d964a100c](./12665637-84cd705d964a100c.png)

#### git revert 回退

优点: 既可以回退代码，又可以保存错误的提交

git revert的作用通过反做创建一个新的版本，这个版本的内容与我们要回退到的目标版本一样，但是HEAD指针是指向这个新生成的版本，而不是目标版本。

使用 git revert 命令来实现上述例子的话，我们可以这样做：先 revert D，再 revert C （有多个提交需要回退的话需要由新到旧进行 revert）：

```undefined
git revert 5lk4er
git revert 76sdeb
```

这里会生成两个新有提交：D' 和 C'，如下图示：

![12665637-cf079bb4922d85e5](./12665637-cf079bb4922d85e5.png)

这里只有两个提交需要 revert，我们可以一个个回退。但如果有几十个呢？一个个回退肯定效率太低而且容易出错。我们可以使用以下方法进行批量回退：

```
git revert OLD_COMMIT_ID^..NEW_COMMIT_ID
```

这样操作的话 HEAD 指针是往后移动的，可以直接使用 git push 命令推送到远程仓库里

举个更难一点的例子。

假如现在有三个提交，但很不巧的是，那个错误的提交刚好位于中间。如下图示：

![12665637-cae2607ac18a7f47](./12665637-cae2607ac18a7f47.png)

这时，直接使用 git reset 命令将 HEAD 指针重置到 A 提交显然是不行的，因为 C 提交是正确的，需要保留的。先把 C 提交 及 B 提交全部回退，再使用 cherry-pick 命令将 C 提交重新再生成一个新的提交 C''，这样就实现了将 B提交回退的需求。

```
git cherry-pick 76sdeb
```

完整的过程如下：

![12665637-fec52bf232159982](./12665637-fec52bf232159982.png)

### 14、Git如何做到同一个分支只上线部分功能 Cherry-Pick

在开发的时候，我们通常会在同一个开发分支(B)上，同时开发多个功能，但最终可能只需要上线(合并到master分支)部分功能。显然这时直接将B分支合并（pull request）到master分支，是会将所有提交都合并到master，所以这里我们无法直接使用pull requst。直接将B分支推送到master分支是同一个结果。

这时我们可以使用到cherry-pick命令拉取代码，cherry-pick可以做到commit维度的代码拉取，也就是只拉取某次commit中的所有代码变更。我们想要上线部分功能可以从这个命令入手。



```shell
git cherry-pick <commit id>
```

> cherry-pick:选出自己喜欢的

#### 案例

当俩分支（B、D）在同一个版本时，此时再在B分支开发功能，第一天B与M分支为同样的版本（即一样的代码），在第2、3、4天都有在B分支上开发新的功能或者做了修改，每次改动都会及时提交（commit）。到了第五天，经理说马上要上线用户查询和用户新增的功能到D分支，进行功能测试。

| 时间/天 | B分支版本                                                    | D分支版本                                  |
| ------- | ------------------------------------------------------------ | ------------------------------------------ |
| 1       | 版本1                                                        | 版本1                                      |
| 2       | 版本2 (用户查询:commit1)                                     | 版本1                                      |
| 3       | 版本3 (用户查询:commit1)(登录功能:commit2)                   | 版本1                                      |
| 4       | 版本4 (用户查询:commit1)(登录功能:commit2)(用户新增:commit3) | 版本1                                      |
| 5       | 版本4 (用户查询:commit1)(登录功能:commit2)(用户新增:commit3) | 版本4 (用户查询:commit1)(用户新增:commit3) |

想要达到第五天的效果，我们可以使用cherry-pick，来选出自己想要的commit，来合并到D分支上。



```shell
#需要先切换到D分支后，再执行cherry-pick命令，可以将别的分支的commit选取拉到当前分支。
# 切换到 D 分支
git checkout D
git cherry-pick commit1编号
git cherry-pick commit3编号
```

#### 注意点

在拉取多个提交时应按照先后提交顺序拉取，并将某个功能的所有commit都拉取到以免代码丢失。

假如，只拉取commit3，但是commit3与commit1是在同一个文件中做修改，这是会有冲突出现。但是只拉取commit1而忘记了commit3，这时不会有冲突，但是后续便丢失了commit3的代码。

#### 避免代码的冲突与丢失

为了避免冲突的出现与代码的丢失，我们可以做下面几点来预防：

1. 创建一个自己独立的分支。避免多人使用同一个分支。
2. 每次提交都只包含一个功能（能一起上线的功能）。这样可以在cherry-pick时更加方便。
3. cherry-pick时可以用idea将某个功能的所有提交，全选出来，一次性都pick出来。或者，按照先后顺序将commit依次pick过来，直接pick多次修改后的commit会存在冲突。



### 15、cherry-pick 详细用法

#### 基本用法

`git cherry-pick`命令的作用，就是将指定的提交（commit）应用于其他分支。

```bash
$ git cherry-pick <commitHash>
```

上面命令就会将指定的提交`commitHash`，应用于当前分支。这会在当前分支产生一个新的提交，当然它们的哈希值会不一样。

举例来说，代码仓库有`master`和`feature`两个分支。

```bash
    a - b - c - d   Master
         \
           e - f - g Feature
```

现在将提交`f`应用到`master`分支。

```bash
# 切换到 master 分支
$ git checkout master

# Cherry pick 操作
$ git cherry-pick f
```

上面的操作完成以后，代码库就变成了下面的样子。

```bash
    a - b - c - d - f   Master
         \
           e - f - g Feature
```

从上面可以看到，`master`分支的末尾增加了一个提交`f`。

`git cherry-pick`命令的参数，不一定是提交的哈希值，分支名也是可以的，表示转移该分支的最新提交。

```bash
$ git cherry-pick feature
```

上面代码表示将`feature`分支的最近一次提交，转移到当前分支。

#### 转移多个提交

Cherry pick 支持一次转移多个提交。

```bash
$ git cherry-pick <HashA> <HashB>
```

上面的命令将 A 和 B 两个提交应用到当前分支。这会在当前分支生成两个对应的新提交。

如果想要转移一系列的连续提交，可以使用下面的简便语法。

```bash
$ git cherry-pick A..B 
```

上面的命令可以转移从 A 到 B 的所有提交。它们必须按照正确的顺序放置：提交 A 必须早于提交 B，否则命令将失败，但不会报错。

注意，使用上面的命令，提交 A 将不会包含在 Cherry pick 中。如果要包含提交 A，可以使用下面的语法。

```bash
$ git cherry-pick A^..B 
```

#### 配置项

`git cherry-pick`命令的常用配置项如下。

**（1）-e，--edit**

打开外部编辑器，编辑提交信息。

**（2）-n，--no-commit**

只更新工作区和暂存区，不产生新的提交。

**（3）-x**

在提交信息的末尾追加一行`(cherry picked from commit ...)`，方便以后查到这个提交是如何产生的。

**（4）-s，--signoff**

在提交信息的末尾追加一行操作者的签名，表示是谁进行了这个操作。

**（5）-m parent-number，--mainline parent-number**

如果原始提交是一个合并节点，来自于两个分支的合并，那么 Cherry pick 默认将失败，因为它不知道应该采用哪个分支的代码变动。

`-m`配置项告诉 Git，应该采用哪个分支的变动。它的参数`parent-number`是一个从`1`开始的整数，代表原始提交的父分支编号。

```bash
$ git cherry-pick -m 1 <commitHash>
```

上面命令表示，Cherry pick 采用提交`commitHash`来自编号1的父分支的变动。

一般来说，1号父分支是接受变动的分支（the branch being merged into），2号父分支是作为变动来源的分支（the branch being merged from）。

#### 代码冲突

如果操作过程中发生代码冲突，Cherry pick 会停下来，让用户决定如何继续操作。

**（1）--continue**

用户解决代码冲突后，第一步将修改的文件重新加入暂存区（`git add .`），第二步使用下面的命令，让 Cherry pick 过程继续执行。

```bash
$ git cherry-pick --continue
```

**（2）--abort**

发生代码冲突后，放弃合并，回到操作前的样子。

**（3）--quit**

发生代码冲突后，退出 Cherry pick，但是不回到操作前的样子。

#### 转移到另一个代码库

Cherry pick 也支持转移另一个代码库的提交，方法是先将该库加为远程仓库。

```bash
$ git remote add target git://gitUrl
```

上面命令添加了一个远程仓库`target`。

然后，将远程代码抓取到本地。

```bash
$ git fetch target
```

上面命令将远程代码仓库抓取到本地。

接着，检查一下要从远程仓库转移的提交，获取它的哈希值。

```bash
$ git log target/master
```

最后，使用`git cherry-pick`命令转移提交。

```bash
$ git cherry-pick <commitHash>
```

### 16、合并分支

```
// 合并分支（多人开发中，经常一人一个分支，各自在自己分支开发，开发完成以后合并到某一个指定分支，没有问题后最后合并到master主分支，我们的流程是各自在自己的develop开发，开发完成以后合并到lastest分支，没有问题后提交合并申请到master分支，由leader审批是否统一合并到master，因为很多新人不太清楚代码的具体用途，所以讲的稍微详细点，明白命令的实现目的能更好的掌握使用，后面会有具体的操作流程）
1.本地代码依次
git status
git add .
git commit -m ""
git pull 
git push （develop-author分支，即自己的开发分支）
以后（把本地代码推送到远程对应分支）
2.git checkout lastest （切换到lastest分支）
3.git pull origin lastest  （先把远程lastest分支修改内容拉取，多人开发，需要把远程lastest上的代码pull下来）
4.git  merge develop-author   （合并自己的分支到lastest）
```

### 参考文章:

作者：指尖跳动链接：https://www.jianshu.com/p/dca42de8aed7来源：简书著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

作者（阮一峰）[http://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2020%2F04%2Fgit-cherry-pick.html)

作者：猫大顾
链接：https://www.jianshu.com/p/31a74fec358e
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

作者: 程序员奇奇  https://zhuanlan.zhihu.com/p/555637985

作者: [霖深雾起不见你](https://www.jianshu.com/u/94fed1d4e9d3)   https://www.jianshu.com/p/78246673c545