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

## 选型

选型要素   负载   臂展（工作范围）

## 机器人定点

### 定点规则

```markdown
命名规则：
    R1C1P1
    R1 层
    C1 从左到右第几位
    P1 每一位有几个点
```

### 点位数量

一般点位数量在4到5个

一般抓取点间隙比较小的都是4个点就可以，托盘的这种夹具一般需要5个点

```markdown
抓取点外点
抓取点近点（看情况这个点可以省略）
抓取点
抬升点
抬升点外点
```

### 定点类型

```markdown
1.厍位点
2.需要机器人动作的工作台点
3.厍位的home点
4.机床、工作台的home点
4.机器人轨迹修正的home点
```

机器人定位准确的前提是机器人抓取的产品的位置和放产品的位置，相对于机器人夹爪来说夹住是同一位置，
取和放的点夹住的位置不一样，机器人的误差就会变大

### 系统参数

```
PTP $POS_ACT：执行一个点对点（PTP，Point-to-Point）运动，目标位置是当前位置（$POS_ACT）
WAIT FOR $T1：等待手动模式
WAIT FOR $EXT：等待外部控制模式
```

### 机器人定位不准

机器人定位准确的前提是机器人抓取的产品的位置和放产品的位置，相对于机器人夹爪来说夹住是同一位置， 取和放的点夹住的位置不一样，机器人的误差就会变大

```markdown
机器人定位不准的原因
			机器人遭受撞击机构/工具变形
			机器人伺服电机出现反馈传感器故障、驱动器配置错误、编码器损坏等问题通常会导致机器人运动不精确或完全无法运动，影响其操作效率和精度。
```



## 运动

### 手动运动

1.调整到轴运动模式进行单个轴的运动

2.调整到工具坐标进行工具的三轴运动，通过左右偏，前后翻转，左右反转来调整工具姿势

### 程序运动

**点到点运动PTP**

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

**线性运动LIN**

![](lin.png)

**圆周运行CIRC**

![](circ.png)

### 运动安全性

在间隙比较小的地方运动时要设置安全的回转路径

在进行机器人运动之前先检查机器人位置和夹具的状态等



### 外部控制运动





## BCO

库卡机器人启动时候，会低速运行到点位，当机器人到达点位以后会停止并且报已达BCO,这里BCO是让机器人首次运行运行时候到达安全点位pHome，确保机器人安全，这时候我们还需要再次按下启动按键，机器人正式正常运行程序；        

注意：BCO 是 B Block coincidence （即程序段重合）的缩写。 重合意为 “ 一致 ” 及 “ 时间 / 空间事件的会合 ”。如果选定的运动语句包括 PTP 运行指令，则 BCO 运行将作为PTP 运动从实际位置移动到目标位置。 如果选定的运动语句包括 LIN 或 CIRC，则 BCO 运行将作为 LIN 运动被执行。 观察此运动，防止碰撞。 在 BCO 运行中速度自动降低。 

### 

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

## plc控制机器人动作的原理	

plc通过和机器人建立通讯以外部控制的方式来给机器人下达指令，通过程序号控制机器人要执行的逻辑，通过确定好的点位和输入输出信号，控制机器人具体的动作

## WorkVisual 6.0 项目配置

### 下载

库卡机器人使用WorkVisual 6.0  下载需要对应库卡机器人的kop文件
包括EthernetKRL、 KUKA.PROFINET MS、UserTech等文件

```
EthernetKRL 负责通用的数据通信，PROFINET MS 负责工业以太网总线集成，而 UserTech 则用于定制操作界面。

📡 EthernetKRL：通用的数据通信接口
它的核心作用是让机器人控制器与外部系统（如视觉相机、PC、传感器）进行灵活的数据交换。

通信方式：基于 TCP/IP 或 UDP 协议，进行异步通信，支持 XML 或二进制格式的数据。

角色灵活：机器人控制器既可以作为服务器，也可以作为客户端，且最多支持同时建立 16 个独立连接。

典型场景：发送启动指令给智能相机并接收检测结果，或与外部 PC 交换状态数据。

🔗 KUKA.PROFINET MS：工业总线集成
这是一个用于将机器人集成到 PROFINET 工业网络中的选件包。

核心功能：它使机器人控制器能够作为 PROFINET 控制器、PROFINET 设备或 PROFIsafe 设备来运行。

通信对象：主要用于与上级的 PROFINET PLC（如西门子 S7-1500）进行安全或非安全信号通信，也可以连接支持 PROFINET 的外围设备（如抓手）。

🖥️ UserTech：可定制的操作界面
它的作用是让用户无需深入编程，就能在示教器（smartPAD）上创建自定义的操作按钮和界面。

核心价值：通过图形化编辑器（集成在 WorkVisual 中），用户可以通过拖拽的方式创建 Inline forms（内联表单） 和 Status keys（状态键），从而简化复杂 KRL 程序的使用。

使用效果：例如，操作员可以配置一个实体按键，按一下就能自动执行打开或关闭夹爪的完整逻辑，而不需要在示教器上手动编写代码。

简单总结：如果你需要让机器人与相机或 PC 自由对话，选 EthernetKRL；如果你需要把机器人接入西门子 PLC 的产线网络，用 PROFINET MS；如果你希望让现场操作员用起来更简单（比如做一个一键启动的按钮），那就用 UserTech。
```



### io名称修改

```markdown
编辑器-->长文本编辑器
```

更改完之后下载

### 库卡配置倍福模块

```
配置说明

	https://www.toutiao.com/article/7616718349292159540/

接线说明

硬件连接与电源接线

首先将三个模块在导轨上依次卡装好，顺序通常为：EK1100 → EL1809 → EL2809。

EK1100 耦合器上有两组电源端子，必须都接，且功能不同：

上方端子（24V / 0V）：给 EK1100 耦合器自身及内部通信电路供电。

下方端子（+ / -）：这是现场电源，专门用于给后续的 EL1809 和 EL2809 模块所连接的外部传感器、负载提供电源。

接线时，用螺丝刀压住端子上的方孔，将导线插入圆孔后松开即可固定。

EL1809 输入模块接线（接传感器/开关）

EL1809 是 16 通道数字量输入模块，用于采集信号。它的公共端参考点是 0V，因此接法为源型输入（PNP） 逻辑。

传感器/开关的一端：接入 EL1809 上任意一个输入端子（1-16）。

传感器/开关的另一端：必须接到 EK1100 下方端子中的“+”（即 24V 正极）。

这样当开关闭合时，24V 正信号才会进入 EL1809 的输入端，被识别为“1”。

EL2809 输出模块接线（接负载/继电器）

EL2809 是 16 通道数字量输出模块，用于驱动负载。它的输出端提供 24V 电压，因此负载的回路需要回到 0V。

负载（如继电器线圈、指示灯）的一端：接入 EL2809 上对应的输出端子（1-16）。

负载的另一端：必须接到 EK1100 下方端子中的“-”（即 0V 负极）。

EL2809 单通道最大驱动电流通常为 0.5A，接线时请确认负载电流不超限。

网络与组态提示
EtherCAT 网线：将主站（如 PLC 或工控机）的网线接入 EK1100 上方的 EtherCAT IN 口。如果后续还有从站，从下方的 OUT 口引出即可。

软件配置：接线完成后，需要在对应的工程软件（如 TwinCAT 或 KUKA WorkVisual）中扫描或添加 EK1100，并在其下挂载 EL1809 与 EL2809，最后进行 I/O 映射才能正常使用。
```

### IO映射

PROFINET_IO映射

PROFINET  IO点设置

![](PROFINET_IO点设置 .png)

PROFINET IO点映射

![IO配置组件.png](IO配置组件.png)

![输入](输入.png)

两个绿色箭头点亮可以进行输入映射

![输出](输出.png)

两个红色箭头点亮可以进行输出映射

![IO映射断开](IO映射断开.png)

点击映射连接

![IO映射连接](IO映射连接.png)

点击映射断开



倍福的IO映射

左侧点击数字输入端右侧点击EL1809模块可以将倍福的输入模块映射给kuka内部变量

![](IO数据映射.png)

左侧点击数字输出端右侧点击EL2809模块可以将倍福的输出模块映射给kuka内部变量



PROFINET的IO映射

左侧点击数字输入端/输出端点击右侧的PROFINET可以进行plc的库卡的输入输出映射

### 库卡负载

过载一当实际负载高于配置的负载时，则存在过载。
欠载一当实际负载低于配置的负载时，则存在欠载。

负载配置路径：依次选择“投入运行”-->“工具”-->没有工具就“添加”，有工具就选择工具去修改

负载报警显示也可以在这个文件里配置

## 坐标系

kuka机器人最多可建立32个不同的坐标系，一段程序里面可应用多个基坐标系。

### 工具坐标系TOOL

#### XYZ四点法确定工具坐标系原点

投入运行-->工具/基坐标管理-->工具工件-->选择对应工具点击测量选择XYZ四点法

找尖的物体固定在库卡机器人工具上，平面上也放一个尖的物体，工具上的尖端对准平面上物体的尖端，绕平面尖端走三个区别较大的位置，最后走一个工具尖端垂直于平面的位置

案例：

1：![](工具原点标定1.png)2：![](工具原点标定2.png)3：![](工具原点标定3.png)4：![](工具原点标定4.png)



#### 确定工具坐标系的姿态

投入运行-->工具/基坐标管理-->工具工件-->选择对应工具点击测量选择ABC世界

确定姿态之后就可以确定工具坐标系XYZ的方向



使用5D法

改变机器人姿态，使+X轴(工具坐标系)与-Z轴(世界坐标系)平行

![](工具姿态标定5.png)



使用6D法

改变机器人姿态，使+X轴(工具+Y轴(工具坐标系)与+Y轴(世界坐标系)平行
坐标系)与-Z轴(世界坐标系)平行

![](工具姿态标定6.png)



### 基坐标系BASE

#### 定义

基坐标系测定表示根据世界坐标系在机器人周围的某一个位置上创建坐标系。

目的是使机器人的手动运行运动以及编程设定的位置均以该坐标系为参照。

因此，例如设定的工件支座和抽屉的边缘、货盘或机器的外缘均可作为基准坐标系中合理的参照点。



#### 基座标系测定方法

**3点法**

```markdown
工件 
	-->基坐标系原点(第1点)
	-->基坐标系方向
		-->定义X轴正方向(第2点)
		-->定义Y轴正方向(XY平面)(第3点)
```

投入运行-->工具/基坐标管理-->基坐标固定工具-->选择对应基坐标点击测量进行基坐标标定

基坐标系原点

![](基坐标测量原点.png)

定义X轴正方向

![](基坐标测量X方向点.png)

定义Y轴正方向(XY平面)

![](基坐标系标定XY内一点.png)



##### 基坐标切换方式

进入点位储存程序中

选择一个点位-->点击更改

选择

![](基坐标切换1.png)

选择

![](基坐标切换2.png)

更改完所有点位，基坐标切换完成



**间接法**

当无法逼近基座原点时，例如，由于该点位于工件内部，或位于机器人工作空间之外时，须采用间接法。

## 库卡程序

### 程序结构



### ![](kuka程序结构.png)

**注释符号**   ;

**程序分段格式**   ;--------某某程序--------

**行解释**    在指令之后加入  ;说明文字

**退出子程序**，可以在子程序中编入RETURN指令，可提前终止子程序。

#### 命名规则

在对数据进行命名时，应遵守以下规定:
(1)KRL中的名称长度最多允许24个字符
(2)KRL中的名称允许含有字母(A-Z)、数字(0-9)及特殊符号""和"$”
(3)KRL中的名称不允许以数字开头
(4)KRL中的名称不允许为关键词
(5)大小写无关紧要

#### 变量、数据类型



**局部变量**:局部变量可以分为程序文件(.src)中的局部变量或局部数据列表(*.dat)中的局部变量。

如果变量是在.src文件中定义的，则该变量仅在程序运行时存在。我们将此称为“运行时间变量”。

如果变量是在.dat文件中被定义为局部变量，并且仅在相关程序文件中已知，则其值在关闭程序后保持不变。

**全局变量**:如果变量为全局变量，则随时都可以显示。在这种情况下，变量全局:如果变量为全局变量必须保存在系统文件或者局部数列表中作为全局变量。

**KRL中变量的生存期**
1)生存期是为变量预留存储位置的时间
2)运行时间变量在退出程序或功能时将其存储位置重又空出

**KRL中变量的有效性**
1)局部声明的变量仅在其被声明的程序中可用并可见
2)而全局变量则建立在一个中央(全局)数据列表中
3)全局变量也可建立在一个局部数据列表中，声明时冠以关键词global

##### 变量声明

变量在使用前必须先总是进行声明，每一个变量均划归一种数据类型，**声明**的关键词为**DECL**。

变量的声明以不同的形式进行:

```markdown
1)在**SRC文件**中声明
	对于SRC文件程序运行结束时，运行时间变量“死亡”，变量仅在局部DEF和END行之间可用
	案例：
		DECL INT counter
		DECL REAL price
		DECL BOOL error
		INI
2)在**局部DAT文件**中声明
	对于DAT文件在程序运行结束后变量还保持着
		案例：打开程序-->编辑-->FOLD-->打开所有FOLD
			DECL INT counter
			DECL REAL price
			DECL BOOL error
			INI
3)在**$CONFIG.DAT**中声明
		案例：打开程序-->编辑-->FOLD-->打开所有FOLD
			DECL INT counter
			DECL REAL price
			DECL BOOL error
			INI

4)在局部DAT文件中配上关键词“全局”声明，因为从中得出相应变量的生存期和有效性
5)创建**常量**，要用关键词**CONST**建立，只允许在数据列表中建立。
```

##### 变量声明、初始化

```markdown
SRC声明和初始化
	DEF MY PROG ( )
	DECL INT counter
	DECL REAL price
	DECL BOOL error
	DECL CHAR symbol
	INI
	counter = 10
	price = 0.0
	error = FALSE
	symbol = "x"
	END
	
在局部DAT文件中声明和初始化
	DEF MY PROG ( )
	DECL INT counter = 10
	DECL REAL price = 0.0
	DECL BOOL error = FALSE
	DECL CHAR symbol = "x"
	
也可以在局部DAT文件中声明在SRC文件中初始化

```

##### 数组

```
dimensionl[4] = TRUE    1维数组
dimension2[2,1] = 3.25  2维数组
dimensionl[3,4,1] = 21  3维数组
声明时，数组大小金额数据类型必须已知，KRL中的起始下标始终从1开始，初始化始终可以逐个进行，在SRC文件中的初始化也可以采用循环方式进行。
数组的维数有1维数组，2维数组，3维数组，但KRL不支持4维及4维以上的数组。

数组可以在SRC中声明

DEF MY PROG()
	DECL BOOL error[10]
	DECL REAL value(50,2]
	DECL INT parts[10,10,10]
	INI
END

数组初始化

DECL BOOL error[10]
error[1]=FALSE
error[2]=FALSE
error[3]=FALSE
error[3]=FALSE
error[4]=FALSE
error[5]=FALSE
error[6]=FALSE
error[7]=FALSE
error[8]=FALSE
error[9]=FALSE
error[10]=FALSE


```





**数据类型**

1)预定义的标准数据类型
2)数组/Array
3)枚举类型
4)负荷数据类型/结构



简单的数据类型
INT、REAL、BOOL、CHAR



### 主程序

#### 主程序

库卡主程序CELL

;FOLD  

;ENDFOLD (INIT)

KUKA折叠函数



#### 子程序

**局部子程序**
1.局部子程序的定义
局部子程序是只在一个程序模块中有效的程序，也就是说只能在对它们进行编程的SRC文件范围内调用。
(1)程序模块中的SRC文件最多只能由255个局部i子程序组成。
(2)局部子程序在同一个程序模块中允许被多次调用。

```
;局部子程序位于主程序之后
DEF MY PROG( );此为主程序
END
DEF LOCAL_PROG1();此为局部子程序1
END
DEF LOCAL_PROG2( );此为局部子程序2
END
DEF LOCAL_PROG3( );此为局部子程序3
END
```

局部子程序的运行具有如下特点:
(1)局部子程序运行完后，会跳回到调出子程序后面的第一个指令。
(2)一个主程序中，最多可相互嵌入20个子程序。
(3)局部子程序的点坐标数据存在于所属的主程序的DAT列表中，可以用于整个主程序文件。
(4)用RETURN可以结束子程序，并跳回到调用该子程序的主程序模块中

```
DEF MY_PROG();此为主程序
LOCAL_PROG1()
END
DEF LOCAL_PROG1()
IF SIN[12]==FALSE THEN
RETURN;跳回主程序
ENDIF
END
```



**全局子程序**

1.全局子程序定义
全局子程序是对所有程序模块都有效的程序，它是一个独立的机器人子程序，可由另一个机器人程序调用，它被存放在一个自己的SRC文件中，全局子程序特点如下:
(2)全局子程序允许被多次调用
(1)全局子程序具有单独的SRC文件和DAT文件
(3)调用子程序的句法:名称()

全局子程序的运行特点:
(1)子程序运行完后，跳回到调出自称序后面的第一个指令。

```
DEF GLOBAL1()
GLOBAL2()
END
```

(2)最多可相互嵌入20个子程序。
(3)子程序点坐标保存在各个所属的DAT列表中，并且仅供相关程序使用。
(4)用RETURN可结束子程序，并由此跳回到先前调用该子程序的程序模块中。



### 气缸控制

```markdown
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

;气缸控制
;$OUT[1] 托盘气缸回
;$OUT[2] 托盘气缸出
;$IN[1] 托盘气缸回到位
;$IN[2] 托盘气缸出到位

;$OUT[3] 电极气缸出
;$OUT[4] 电极气缸回
;$IN[3] 电极气缸回到位
;$IN[4] 电极气缸出到位


END
GLOBAL DEF  GRPS_DIANJI_OPEN ()
;电极$IN[3]和$OUT[4]在设置的时候对应的是同一信号
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
;等待 NOT $IN[1] 等于 true（$IN[1]需为false） 并且 $IN[2] 等于 true
WAIT FOR (NOT $IN[1]) AND $IN[2]
WAIT SEC 0.5

END

```



### 初始化

```
;FOLD INIT
  DECL CHAR DMY[3]
  DECL INT i
  DMY[]="---"
  i=0
$TIMER_STOP[50]=TRUE
$TIMER[50]=-5000
 
$OUT[127]=FALSE
 FOR i= 141 TO 155
   $OUT[i]=FALSE
 ENDFOR

;ENDFOLD (INIT)
```

### 手动回初始点

```markdown
   ;FOLD BASISTECH INI
  GLOBAL INTERRUPT DECL 3 WHEN $STOPMESS==TRUE DO IR_STOPM ( )
  INTERRUPT ON 3 
  BAS (#INITMOV,0 )
  ;ENDFOLD (BASISTECH INI)
  
  ;FOLD CHECK HOME
  $H_POS=XHOME
  IF CHECK_HOME==TRUE THEN
  P00 (#CHK_HOME,#PGNO_GET,DMY[],0 ) ;Testing Home-Position 
  ENDIF
  ;ENDFOLD (CHECK HOME)
 
 	WAIT FOR $T1
    CHANGE_TOOL1()
    GoWuliaoku()
  	GRPS_DIANJI_OPEN ()
  	GRPS_TUOPAN_OPEN ()
  	WAIT FOR $EXT
```

### 自动程序（案例）

```
AUTOEXT INI
  P00 (#INIT_EXT,#PGNO_GET,DMY[],0 ) ; Initialize extern mode
  ;ENDFOLD (AUTOEXT INI)
  LOOP
    P00 (#EXT_PGNO,#PGNO_GET,DMY[],0 )
    SWITCH  PGNO ; Select with Programnumber

    CASE 1
      P00 (#EXT_PGNO,#PGNO_ACKN,DMY[],0 ) ; Reset Progr.No.-Request
      WULIAOKU_PICK(WULIAOKUNUM)
      DROP_LOAD()
    CASE 2
      P00 (#EXT_PGNO,#PGNO_ACKN,DMY[],0 ) ; Reset Progr.No.-Request
      PICK_LOAD()
      WULIAOKU_DROP(WULIAOKUNUM)
    CASE 11
      P00 (#EXT_PGNO,#PGNO_ACKN,DMY[],0 ) ; Reset Progr.No.-Request
      WULIAOKU_PICK(WULIAOKUNUM)
      DROP_TUOPAN1()
    CASE 12
      P00 (#EXT_PGNO,#PGNO_ACKN,DMY[],0 ) ; Reset Progr.No.-Request
      WULIAOKU_PICK(WULIAOKUNUM)
      DROP_TUOPAN2()
    CASE 13
      P00 (#EXT_PGNO,#PGNO_ACKN,DMY[],0 ) ; Reset Progr.No.-Request
      DIANJIKU_PICK1()
      DROP_DIANJI1()
    CASE 14
      P00 (#EXT_PGNO,#PGNO_ACKN,DMY[],0 ) ; Reset Progr.No.-Request
      DIANJIKU_PICK2()
      DROP_DIANJI2()      
    CASE 15
      P00 (#EXT_PGNO,#PGNO_ACKN,DMY[],0 ) ; Reset Progr.No.-Request
      PICK_DIANJI1()
      DIANJIKU_DROP1()
    CASE 16
      P00 (#EXT_PGNO,#PGNO_ACKN,DMY[],0 ) ; Reset Progr.No.-Request
      PICK_DIANJI2()
      DIANJIKU_DROP2()      
    CASE 21
      P00 (#EXT_PGNO,#PGNO_ACKN,DMY[],0 ) ; Reset Progr.No.-Request
      PICK_TUOPAN1()
      WULIAOKU_DROP(WULIAOKUNUM)      
    CASE 22
      P00 (#EXT_PGNO,#PGNO_ACKN,DMY[],0 ) ; Reset Progr.No.-Request
      PICK_TUOPAN2()
      WULIAOKU_DROP(WULIAOKUNUM)            
    CASE 31
      P00 (#EXT_PGNO,#PGNO_ACKN,DMY[],0 ) ; Reset Progr.No.-Request
      WULIAOKU_PICK(WULIAOKUNUM)
      DROP_UNLOAD()
    CASE 32
      P00 (#EXT_PGNO,#PGNO_ACKN,DMY[],0 ) ; Reset Progr.No.-Request
      PICK_UNLOAD()
      WULIAOKU_DROP(WULIAOKUNUM)
    DEFAULT
      P00 (#EXT_PGNO,#PGNO_FAULT,DMY[],0 )
    ENDSWITCH

;FOLD PULSE 127 '' State=True  Time=0.5 sec ;%{PE}
;FOLD Parameters ;%{h}
;Params IlfProvider=kukaroboter.basistech.inlineforms.logics.out.pulse; Kuka.Logics.Io=127; Kuka.Logics.IoName=; Kuka.Logics.State=True; Kuka.Logics.Cont=False; Kuka.Logics.Time=0.5
;ENDFOLD
PULSE($OUT[127], TRUE, 0.5)
;ENDFOLD
WAIT SEC 1
  ENDLOOP
END
```

