---
title: idea操作文档
typora-root-url: idea操作文档
abbrlink: 5646c163
date: 2023-09-21 07:08:07
keywords: 'idea'
tags: idea
categories: idea
photos:
description: idea操作文档
---

idea操作文档

<!--more-->

------



### idea代码快速追踪定位

1.类、方法是否被使用、被哪里调用

（1）Ctrl+鼠标左键单击

（2）Ctrl+Alt+H：查看方法被哪里调用

（3）快捷键Alt+F7：显示该类、方法被哪里调用

缺点：追踪的是方法名称，如果是jdk内置方法（比如toString），它会将搜索所有toString方法；如果调用者使用反射等字符串形式调用方法，该方法不会显示被调用

（4）快捷键Ctrl+Shift+F：全局搜索，大家熟知的Ctrl+F是本文件搜索，而前者是可以整个项目进行搜索。

（5）修改要追踪的类的类名、方法的方法名，之后运行项目，查看哪里报错即可。

2.回到上一次光标位置

Ctrl+Alt+向左或向右箭头，可以在追踪时方便查看紧邻的两次代码调用场景。

注意，Alt+向左或向右箭头是切换编辑窗口页面的，对于同一个页面内的两次光标无法来回查看。

3.查看接口的实现类

快捷键：Ctrl+Alt+B

或者：Ctrl+Alt+鼠标左键单击

4.查看类继承图

快捷键：Ctrl+Alt+U

这种方式是显示当前类（接口）的继承、实现关系。

要想显示包括其子类的继承关系，可以使用Ctrl+H

5.Alt+7查看当前类的所有方法

6.打开文件：双击Shift 或 Ctrl+Shift+N（:行数）

7.重命名文件：Shift+F6

8.注释光标所在行代码：Ctrl + /
代码块注释：Ctrl + Shift + /

9.展开代码：Ctrl + +
展开所有代码：Ctrl + Shift + +

10.格式化代码快捷键：Ctrl+Alt+L

11.自动生成变量名：Ctrl+Alt+V

12.显示当前类中的所有方法：Alt+7

13、复制一行：Ctrl+D

14、撤销：Ctrl+Z
重做：Ctrl + Shift + Z

15、跳转到行：Ctrl+G

16、替换当前文件内容 ：ctrl+R

17、打开类中所有方法的界面：ctrl+F12



### IDEA 调试 (Debug) 功能的使用

Debug(调试)是编码过程必不可少的操作，我们可以利用 Debug 功能来追踪代码的运行流程，一般在程序运行过程中如果出现异常，我们会启用 Debug 模式来分析、定位异常发生的位置，以及观察运行过程中数据的变化。另外我们也可以使用 Debug 功能来跟踪代码的运行流程去学习他人代码或第三方框架的源码。

IDEA 具有非常强大的 Debug 功能，以下是一些使用 IDEA 进行调试时的常用操作。

#### Debug相关快捷键

| 快捷键            | 说明                                                         |
| ----------------- | ------------------------------------------------------------ |
| Ctrl +F8          | 设置/取消当前光标所在行断点                                  |
| Shift + F9        | Debug模式运行                                                |
| F7                | Debug状态下下一步，如果运行的当前行是一个方法调用，**会**进入该方法 |
| F8                | Debug状态下下一步，如果运行的当前行是一个方法调用，则**不会**进入该方法 |
| F9                | Debug状态下恢复程序运行，如果后续还有断点，则停留到下一个断点上 |
| Shift + F7        | Debug状态下智能下一步，运行的当前行有多个方法调用，将弹出方法选择框 |
| Shift + F8        | 恢复程序运行，同F9效果                                       |
| Alt + F8          | Debug状态下选择对象，输入相关表达式，可得到计算结果          |
| Alt + F9          | Debug状态下，运行到光标所在行                                |
| Ctrl + Shift + F8 | 如果当前光标所处行是断点则弹出设置断点进入的条件框 如果不在断点行，则弹出查看所有断点，可进行相关设置 |
| Alt + Shift + F7  | Debug状态下下一步，如果运行的当前行是一个方法调用，**会**进入该方法，与F7区别在于该操作会进入更底层的方法调用 |

#### 设置/取消断点

在代码行按快捷键 Ctrl +F8 或者点击代码行数与编辑区的中间区域，可以在为该行设置或取消断点

![v2-24d03efc3f1be60311f85bbf97a7999f_1440w](/v2-24d03efc3f1be60311f85bbf97a7999f_1440w.webp)

#### 调试运行

调试运行有如下几种方式

* 点击工具栏的 debug 按钮

* 使用 Shift + F9 快捷键

* 选择类或在代码编辑区，右键 >Debug 'xxxxxx'

![v2-aafad25bb51cc8358903a1140ce264ad_1440w](/v2-aafad25bb51cc8358903a1140ce264ad_1440w.webp)

![v2-2bb2150f90c726bcbc33cb83d81b1a1a_1440w](/v2-2bb2150f90c726bcbc33cb83d81b1a1a_1440w.webp)



#### 运行下一步

运行下一步有如下几种方式

* 点击 Debug 面板的 Step Over 按钮或使用快捷键 F8，如果代码行有方法调用，不会进入方法

* 点击 Debug 面板的 Step Into 按钮或使用快捷键 F7，如果代码行有方法调用，会进入方法

* 点击 Debug 面板的 Force Step Into 按钮或使用快捷键 Alt + Shift + F7，如果代码行有方法调用或底层有方法调用，会进入该方法，与 F7 区别在于该操作会进入更底层的方法调用

使用快捷键 Shift + F7，Debug 状态下智能下一步，运行的当前行有多个方法调用，将弹出方法选择框

![v2-dc546d3ce568baa44f5b3ef79da98774_1440w](/v2-dc546d3ce568baa44f5b3ef79da98774_1440w.webp)

#### 恢复程序运行

恢复程序运行有如下方式

点击 Debug 窗口的 Resume Program 按钮

使用快捷键 F9

使用快捷键 Shift + F8

以上操作将在 Debug 状态下恢复程序运行，如果后续还有断点，则停留到下一个断点上

![v2-0d7377dbe1270c100e568994aedaa1dc_14401w](/v2-0d7377dbe1270c100e568994aedaa1dc_14401w-1695252420767.webp)

#### 条件断点

打断点后，在断点行按快捷键 Shift + Ctrl + F8，设置进入断点的条件

![v2-0d7377dbe1270c100e568994aedaa1dc_1440w](.//v2-0d7377dbe1270c100e568994aedaa1dc_1440w.webp)

#### 表达式求值

Debug 状态下，选择某个变量，按 Alt+F8 就可以求值

![v2-69d1937a3bd50f15a4abd4bc93140a89_1440w](/v2-69d1937a3bd50f15a4abd4bc93140a89_1440w-1695252550319.webp)

#### 运行期修改值

Debug 状态下，在变量区及 Variables 区选择相关变量，按快捷键 F2 或 右键>Set Value，可修改变量值

![v2-0bef8ae886bcae57f087f442e4752cb6_1440w](/v2-0bef8ae886bcae57f087f442e4752cb6_1440w.webp)

#### 终止调试

点击如下按钮，或使用快捷键 Ctrl + F2，可终止调试

![v2-5ab86f2add263692508e4830d076a9e7_1440w](/v2-5ab86f2add263692508e4830d076a9e7_1440w.webp)

#### Watch 功能

在 Variables 区域可以使用 Watch 功能，以查看检查相关的数据，添加 Watch 有如下方式

在 Variables 区域按 Insert 键

右键 >New Watch

如下条件了一个 Watch 表达式，我们可以直接看到表达式最后的值

![v2-a5a5b4f9ce04c109a64638d801bebab1_1440w](/v2-a5a5b4f9ce04c109a64638d801bebab1_1440w.webp)

禁止/打开所有断点

![v2-2cb53af5d05727f06a185e3c1a780e61_1440w](/v2-2cb53af5d05727f06a185e3c1a780e61_1440w.webp)

#### 练习代码

```java
public class DebugDemo {

    public static void main(String[] args){
        ArrayList<String> list = new ArrayList<>();
        list.add("tom");
        list.add("rose");
        list.add("jack");

        String str = concatListToStr(list);
        System.out.println(str);
    }

    private static String concatListToStr(ArrayList<String> list) {
        if (list == null){
            return  "";
        }
        String result = "";
        for (String itemStr : list) {
            result +=  itemStr;
        }
        String helloWord =  sayHello()  + sayWorld();
        return result;
    }

    private static String sayHello() {
        System.out.println("hello");
        return "hello";
    }

    private static String sayWorld() {
        System.out.println("world");
        return "world";
    }
}

```



### idea 2023破解

补丁安装教程：

https://www.exception.site

补丁网盘链接:

链接：https://pan.baidu.com/s/1SLqgNTlowhCz_f8SXCuEhg?pwd=rp79 

提取码：rp79

备用链接:

链接：https://pan.baidu.com/s/1DzOZztyQDwlmzsFWdk_6CQ?pwd=6200 

提取码：6200

无限速蓝奏云网盘链接：https://wwc.lanzoul.com/iSxmd0e57peb



#### JetBrains 系列软件-激活码教程

https://www.yuque.com/strive-rd6n1/mpd5f0/evctz34d87o5yo7k?singleDoc=

### idea SpringBoot热部署

#### 开启IDEA的热部署策略（非常重要）

菜单Run -> EditConfiguration , 然后配置指定服务器下，右侧server标签下on frame deactivation = Update classes and resource。

#### 开启IDEA的自动编译（静态）

IDEA开启项目自动编译，进入设置，Build,Execut, Deployment -> Compiler 勾选中左侧的Build Project automatically

#### 开启IDEA的自动编译（动态）

IDEA开启项目运行时自动make, ctrl + shift + alt + / 命令：registry 

-> 勾选

compiler.automake.allow.when.app.running-> 自动编译

compile.document.save.trigger.delay -> 自动更新文件

没有的话 `File`—>`Settings`—>`Advanced Settings`, 找到右侧的`Compiler`选项 勾选 Allow auto-make to start even if developed application is currently running

#### 在项目添加热部署插件（可选）

> 温馨提示：
>  如果因为旧项目十分臃肿，导致每次都自动热重启很慢而影响开发效率，笔者建议直接在POM移除`spring-boot-devtools`依赖，然后使用Control+Shift+F9进行手工免启动快速更新！！

具体步骤：在POM文件添加热部署插件



```xml
       <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
        </dependency>
```

#### 关闭浏览器缓存（重要）

打开谷歌浏览器，打开F12的Network选项栏，然后勾选【✅】Disable cache 。



### 解决控制台乱码 

File--> Settings--> Editor--> File Encodings 

​									--> Glabal Encoding --> UTF-8
​									--> Project Encoding --> UTF-8
​									--> Default Encoding for properties files --> UTF-8

Help-->Edit Custom VM options -->  -Dfile.encoding=UTF-8

VM options:  -Dfile.encoding=UTF-8

### 参考文献:

happy 链接：http://testingpai.com/article/1599809695935

CSDN博主「Winn~」 链接：https://blog.csdn.net/GoGleTech/article/details/106229338