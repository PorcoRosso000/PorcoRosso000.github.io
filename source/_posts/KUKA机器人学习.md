---
title: KUKA机器人学习
typora-root-url: KUKA机器人学习
keywords: 'KUKA,机器人'
tags: KUKA
categories: 机器人
description: KUKA机器人学习
abbrlink: decccaa6
date: 2024-11-11 22:12:51
photos:
---

KUKA机器人学习

<!--more-->

------

## 示教器按键功能介绍

![](示教器按键功能.png)

## 状态栏使用多的数据

S 解释器后台扫描运行的程序

I 通俗理解为上电下电

R 程序复位到上一步，或者退出程序

T1 表示机器人当前的运动模式

## 程序运行

按选定可以运行程序

按打开可以查看内容

## 菜单

查看输入输出

```markdown
菜单-->显示-->输入/输出端
```

查看/修改机器人ip地址

```markdown
1.菜单-->投入运行-->网络配置
2.菜单-->关机-->重新启动控制系统pc
```

查看机器人的实际位置

```markdown
菜单-->显示-->实际位置
```





## 运动

### 手动运动

1.调整到轴运动模式进行单个轴的运动

2.调整到工具坐标进行工具的三轴运动，通过左右偏，前后翻转，左右反转来调整工具姿势

### 程序运动

点到点运动PTP

![](ptp.png)

```
PTP

机器人运动到输入位置
PTP {A1 0, A2 -80, A3 75, A4 30, A5 30, A6 110}
空间位置 （以当前激活的工具和基坐标）
PTP {X 100, Y -50, Z 1500, A 0, B 0, C 90, S 3, T3 35
机器人仅在输入一个或多个集合时运行
PTP {A1 30} ; 仅 A1 移动至 30° 
PTP {X 200, A 30} ; 仅在X至200mm， A至30°

PTP和SPTP区别
运行速度区别不大
PTP的使用范围除普通的程序模块以外还可以用在一些特殊场合，比如中断程序。
SPTP则不能使用于中断程序内。
PTP和SPTP出现在同一个模块内一起使用的话在两个指令过度的时候机器人有时会出现抖动一下。
PTP在非联机表单的形式使用时必须提前赋值相关的工具，基座标，速度，加速度等。
SPTP则可以更方便的进行变量赋值。或者根本不写也会以上一条运动指令的变量进行赋值运动。如果上面没有运动指令就会在INI行进行。
```



线性运动LIN

![](lin.png)



圆周运行CIRC

![](circ.png)



## BCO

库卡机器人启动时候，会低速运行到点位，当机器人到达点位以后会停止并且报已达BCO,这里BCO是让机器人首次运行运行时候到达安全点位pHome，确保机器人安全，这时候我们还需要再次按下启动按键，机器人正式正常运行程序；        

注意：BCO 是 B Block coincidence （即程序段重合）的缩写。 重合意为 “ 一致 ” 及 “ 时间 / 空间事件的会合 ”。如果选定的运动语句包括 PTP 运行指令，则 BCO 运行将作为PTP 运动从实际位置移动到目标位置。 如果选定的运动语句包括 LIN 或 CIRC，则 BCO 运行将作为 LIN 运动被执行。 观察此运动，防止碰撞。 在 BCO 运行中速度自动降低。 

## 编程

### 变量的声明和初始化

**在 SRC 文件中声明和初始化**

```
DEF MY_PROG ( ) 
DECL INT counter 
DECL REAL price 
DECL BOOL error 
DECL CHAR symbol 
INI 
counter = 10 
price = 0.0 
error = FALSE 
symbol = "X" 
... 
END
```

**在 DAT 文件中声明和初始化**

```
DEFDAT MY_PROG 
EXTERNAL DECLARATIONS 
DECL INT counter = 10 
DECL REAL price = 0.0 
DECL BOOL error = FALSE 
DECL CHAR symbol = "X" 
... 
ENDDAT
```

**在DAT 文件中声明和在 SRC 文件中初始化**

**DAT文件中声明**

```
DEFDAT MY_PROG 
EXTERNAL DECLARATIONS 
DECL INT counter 
DECL REAL price 
DECL BOOL error 
DECL CHAR symbol 
... 
ENDDAT
```

**SRC 文件中初始化**

```
DEF MY_PROG ( ) 
... 
INI 
counter = 10 
price = 0.0 
error = FALSE 
symbol = "X" 
... 
END
```

### 常量的声明和初始化

**在DAT文件中**

```
DEFDAT MY_PROG 
EXTERNAL DECLARATIONS 
DECL CONST INT max_size = 99 
DECL CONST REAL PI = 3.1415 
... 
ENDDAT
```

### 设置点的全局应用

​	**全局点**
​			示教器管理者模式添加全局点全局点权限
​	**全局声明**
​			在dat文件中DEFDAT  xxx 后面添加 public   在确定点DECL 之后添加 global

### 全局方法

全局方法可以被任何方法调用

```
&ACCESS RV
DEF GRPS ( )
;FOLD INI;%{PE}
  ;FOLD BASISTECH INI
    GLOBAL INTERRUPT DECL 3 WHEN $STOPMESS==TRUE DO IR_STOPM ( )
    INTERRUPT ON 3 
    BAS (#INITMOV,0 )
  ;ENDFOLD (BASISTECH INI)
  ;FOLD USER INI
    ;Make your modifications here

  ;ENDFOLD (USER INI)
;ENDFOLD (INI)



END
GLOBAL DEF  GRPS_DIANJI_OPEN ()

$OUT[3]=FALSE
$OUT[4]=TRUE
WAIT SEC 0.1
WAIT FOR (NOT $IN[4]) AND $IN[3]
WAIT SEC 0.5

END
GLOBAL DEF GRPS_DIANJI_CLOSE ()

$OUT[4]=FALSE
$OUT[3]=TRUE
WAIT SEC 0.1
WAIT FOR (NOT $IN[3]) AND $IN[4]
WAIT SEC 0.5

END
GLOBAL DEF GRPS_TUOPAN_OPEN ()

$OUT[2]=FALSE
$OUT[1]=TRUE
WAIT SEC 0.1
WAIT FOR (NOT $IN[2]) AND $IN[1]
WAIT SEC 0.5

END
GLOBAL DEF GRPS_TUOPAN_CLOSE ()

$OUT[1]=FALSE
$OUT[2]=TRUE
WAIT SEC 0.1
WAIT FOR (NOT $IN[1]) AND $IN[2]
WAIT SEC 0.5

END

```



## WorkVisual 6.0 项目配置

### io名称修改

```markdown
编辑器-->长文本编辑器
```

更改完之后生成代码，下载