---
title: hexo指令
abbrlink: 89e11d40
date: 2022-11-11 22:30:29
keywords: 'hexo'
tags: hexo
categories: hexo
photos:
description: hexo指令
---

hexo指令

<!--more-->

------

### hexo基础命令

```markdown
hexo new post "文章名" :创建文章
hexo clean ：删除之前生成的文件，若未生成过静态文件，可忽略此命令。
hexo generate ：生成静态文章，可以用hexo g缩写 (尽量使用 hexo g -c 8 可以防止内存溢出)
hexo deploy ：部署文章，可以用hexo d缩写
hexo s -p 8000 : 搜索启动
hexo server :运行服务
hexo algolia ：搜集更新博文数据
hexo cl && hexo g && hexo d && hexo s ：一条命令部属
```

### 多台电脑都可以使用个人博客

除了master分支再建立一个hexo分支(设为默认)

创建一个叫hexo（或者blog，名字随意）的分支，并切换到这个分支

```markdown
git checkout -b hexo
```

添加所有文件到暂存区

```markdown
git add –all
```

进行提交

```markdown
git commit -m “提交信息xxx”
```

推送hexo分支的文件到github仓库

```markdown
git push –set-upstream origin hexo
```

#### 下次要写博客从仓库里把代码拉下来

执行

```markdown
npm install hexo

npm install hexo-cli -g

npm install

npm install hexo-deployer-git

//执行完这四条命令 然后创建文章
```

#### 刚拉下来博客

```markdown
//需要执行下面命令安装依赖启动hexo服务
npm install
hexo server
```

### 替换md文件空行

```markdown
^\s*(?=\r?$)\n  :在vscode中替换空行的正则
```

### 更新giuhub仓库hexo分支

```markdown
//如果本地代码没有写新的东西 第四条命令可以放到第一步去执行
git status  :查看修改的文件
git add .  :放入缓存区
git commit -m “本次提交的备注”  :本次提交的文字说明
git pull origin hexo  :远程更新本地没更新先更新远程脚本到本地
git push -u origin hexo    :将项目上传到远程仓库的hexo分支
```

### 提交出错回滚到上个版本

```markdown
git reset HEAD~1
```

###  报错 :

#### failed to push some refs to 'github.com:PorcoRosso000/PorcoRosso000.github.io.git' 

远程库和本地库不一致 
解决方案: 拉取远程库数据同步到本地库      

<<<<<<< HEAD

```markdown
git pull --rebase origin hexo 
```
#### error: cannot pull with rebase: Your index contains uncommitted changes.

```markdown
error: cannot pull with rebase: Your index contains uncommitted changes.
error: please commit or stash them.

解决方案：修复冲突

git stash     :储藏dev分支下的修改

git pull --rebase    : 想要更好的提交树，使用rebase操作会更好一点。这样可以线性的看到每一次提交，并且没有增加提交节点。merge 操作遇到冲突的时候，当前merge不能继续进行下去。手动修改冲突内容后，add 修改，commit 就可以了。而rebase 操作的话，会中断rebase,同时会提示去解决冲突。解决冲突后,将修改add后执行git rebase –continue继续操作，或者git rebase –skip忽略冲突。

git stash pop     :取出之前储藏的修改

之后就可以继续提交
```

### 文章配置

Front-matter
Front-matter 是 markdown 文件最上方以---分隔的区域，用于指定个别档案的变数。

Page Front-matter 用于页面配置
Post Front-matter 用于文章页配置
如果标注可选的参数，可根据自己需要添加，不用全部都写在markdown里

#### Page Front-matter

title:
date:
updated:
type:
comments:
description:
keywords:
top_img:
mathjax:
katex:
aside:
aplayer:
highlight_shrink:

------

写法	解释
title	【必需】页面标题
date	【必需】页面创建日期
type	【必需】标籤、分类和友情链接三个页面需要配置
updated	【可选】页面更新日期
description	【可选】页面描述
keywords	【可选】页面关键字
comments	【可选】显示页面评论模块(默认 true)
top_img	【可选】页面顶部图片
mathjax	【可选】显示mathjax(当设置mathjax的per_page: false时，才需要配置，默认 false)
katex	【可选】显示katex(当设置katex的per_page: false时，才需要配置，默认 false)
aside	【可选】显示侧边栏 (默认 true)
aplayer	【可选】在需要的页面加载aplayer的js和css,请参考文章下面的音乐 配置
highlight_shrink	【可选】配置代码框是否展开(true/false)(默认为设置中highlight_shrink的配置)

------

#### Post Front-matter

------

title:
date:
updated:
tags:
categories:
keywords:
description:
top_img:
comments:
cover:
toc:
toc_number:
toc_style_simple:
copyright:
copyright_author:
copyright_author_href:
copyright_url:
copyright_info:
mathjax:
katex:
aplayer:
highlight_shrink:
aside:

------

写法	解释
title	【必需】文章标题
date	【必需】文章创建日期
updated	【可选】文章更新日期
tags	【可选】文章标籤
categories	【可选】文章分类
keywords	【可选】文章关键字
description	【可选】文章描述
top_img	【可选】文章顶部图片
cover	【可选】文章缩略图(如果没有设置top_img,文章页顶部将显示缩略图，可设为false/图片地址/留空)
comments	【可选】显示文章评论模块(默认 true)
toc	【可选】显示文章TOC(默认为设置中toc的enable配置)
toc_number	【可选】显示toc_number(默认为设置中toc的number配置)
toc_style_simple	【可选】显示 toc 简洁模式
copyright	【可选】显示文章版权模块(默认为设置中post_copyright的enable配置)
copyright_author	【可选】文章版权模块的文章作者
copyright_author_href	【可选】文章版权模块的文章作者链接
copyright_url	【可选】文章版权模块的文章连结链接
copyright_info	【可选】文章版权模块的版权声明文字
mathjax	【可选】显示mathjax(当设置mathjax的per_page: false时，才需要配置，默认 false)
katex	【可选】显示katex(当设置katex的per_page: false时，才需要配置，默认 false)
aplayer	【可选】在需要的页面加载aplayer的js和css,请参考文章下面的音乐 配置
highlight_shrink	【可选】配置代码框是否展开(true/false)(默认为设置中highlight_shrink的配置)
aside	【可选】显示侧边栏 (默认 true)