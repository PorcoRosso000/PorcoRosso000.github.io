---
title: git笔记
typora-root-url: git笔记
tags: git
categories: git
abbrlink: d9283bc6
date: 2023-08-04 22:28:50
permalink:
---

### 新建了一个git仓库，本地代码上传gitlab

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

### git status 出错 interactive rebase in progress； onto 796e78f

```
使用 git commit --amend 命令修订当前的提交
使用 git rebase --continue 命令继续代码的提交(推荐),执行之后,需要重新提交,解决一下当前的代码冲突之后重新提交直至没有rebase提示,就可以正常提交了
```

### 切换仓库源

**移除之前的git源：**

```html
git remote rm origin
```

**连接新的git源：**

```html
git remote add origin '仓库地址'
```

### git冲突解决

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



### git commit 最后一次提交的注释信息，如何修改？ 如何退出编辑器？

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

### 查看提交历史

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

### 变基 

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

### 命令说明

> pick：保留该commit（缩写:p）
>  reword：保留该commit，但我需要修改该commit的注释（缩写:r）
>  edit：保留该commit, 但我要停下来修改该提交(不仅仅修改注释)（缩写:e）
>  squash：将该commit和前一个commit合并（缩写:s）
>  fixup：将该commit和前一个commit合并，但我不要保留该提交的注释信息（缩写:f）
>  exec：执行shell命令（缩写:x）
>  drop：我要丢弃该commit（缩写:d）

### 查看提交信息

git show commit_id | grep diff | cut -d" " -f 3

例如 :
a/README.md

### 提交规范

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

### git回退版本

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

### Git如何做到同一个分支只上线部分功能 Cherry-Pick

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



### cherry-pick 详细用法

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



### 参考文章:

作者：指尖跳动链接：https://www.jianshu.com/p/dca42de8aed7来源：简书著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

作者（阮一峰）[http://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2020%2F04%2Fgit-cherry-pick.html)

作者：猫大顾
链接：https://www.jianshu.com/p/31a74fec358e
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。