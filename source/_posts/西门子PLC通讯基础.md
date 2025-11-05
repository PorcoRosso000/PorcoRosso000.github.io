---
title: 西门子PLC通讯基础
typora-root-url: 西门子PLC通讯基础
keywords: '通讯'
abbrlink: eecff6c8
date: 2025-11-04 16:39:03
tags: 通讯
categories: 通讯
photos:
description:
top:
---

西门子PLC通讯基础

<!--more-->

------

## 通讯

### plc端开放式用户通信



```markdown
		组态模块：

				通信-->开放式用户通信（Socket通信）

						TSend_C：建立连接发送数据

								触发条件：

										REQ："Clock_5Hz"
										CONNECT：使用模块右上角小蓝盒进行组态
										DATA：plc发送给机器人指令数据

						TRCV_C：建立连接接收数据

								触发条件：

										EN_R："AlwaysTRUE"
										CONNECT：使用模块右上角小蓝盒进行组态
										DATA：机器人响应并返回给plc的数据

		注意：机器人与plc的数据是不兼容的需要进行数据的转换，输入/输出进行单独转换

		案例：机器人与PLC通讯交互
```



ip8.10plc 创建主动通信块

拉取通信块-->开放式用户通信-->TSEND_C块和TRCV_C块

<img src="plc开放式用户通信数据块.png" style="zoom:75%;" />

点击小蓝盒配置主动建立连接

<img src="配置8.10主动建立连接.png" style="zoom:75%;" />

创建开放式用户通信发送数据接收数据

<img src="开放式用户通信数据发送接收数据块.png" style="zoom:75%;" />

ip8.11plc 创建被动通信块

拉取通信块-->开放式用户通信-->TSEND_C块和TRCV_C块

点击小蓝盒配置建立连接

<img src="开放式用户通信8.11配置被动建立连接.png" style="zoom:75%;" />

接收端数据块

<img src="接收端数据块.png" style="zoom:75%;" />

### MODBUS TCP

```markdown
		组态模块：

				通信-->其他-->Modbus Tcp

				MB_CLIENT：通过PROFINET进行通信，作为客户端

						触发条件：

								REQ："AlwaysTRUE"
								DISCONNECT："AlwaysFALSE"
								MB_MODE：Modbus 的请求模式（读取、写入或诊断）  0：读    1，2：写
								MB_DATA_ADDR：这里对应需要匹配的仓位的起始地址
								MB_DATA_LEN：代表仓位的数量
								MB_DATA_PTR：P#DB4.DBX14.0 BOOL 8 表示哪个db块数据类型和所占存储区容量
								CONNECT ：连接通信协议TCON_IP_v4，一般建立单独db块，数据类型选择
										InterfaceId：默认64
										ID：不重复就可以
										ActiveEstablished：
												主动连接：true，将当前PLC作为TCP通信的客户端
												被动连接：false，将当前PLC作为TCP通信的服务器
										RemoteAddress：表示要连接的设备ip地址
										RemotePort：要连接的设备的端口

				MB_SERVER：通过PROFINET进行通信，作为服务端

		案例：立体仓库
```



### RFID

```markdown
通过硬件通讯：

		组态硬件：

				使用串口硬件 RF_120C RS422进行通信

				对芯片进行读写时Ident设备/系统要选择  通过FB/光学阅读器获取参数

		组态软件：

				Ident工艺对象

						普通阅读器

		组态模块：

				选件包--> SIMATIC Ident（全双工：使用串口RF_120C 422）

						复位块：
								Reset_RF300：错误复位  （根据模块的实际型号选最近的）

										触发条件：

												EXECUTE：使用常开开关+FirstScan进行控制（FirstScan程序启动先执行一次进行复位）
												TAG_TYPE：选择1 ，所有的ISO都可以发送应答（ISO西门子早期的以太网协议）
												RF_POWER：默认
												HW_CONNECT：
														两种连接方式
																TO_IDENT：创建Ident 工艺对象
																IID_HW_CONNECT：	
																		HW_ID：模块RF_120C的硬件标识符
																		LADDR：模块io地址						

						Read:读数据

								触发条件：

										EXECUTE：开关类型
										ADDR_TAG：默认
										LEN_DATA：是具体要读取的数据数组长度和写入长度相同
										HW_CONNECT：连接TO_IDENT工艺对象或者IID_HW_CONNECT
										IDENT_DATA：读取数组的db数据				

						Write:写数据

								触发条件：

										EXECUTE：开关类型
 										ADDR_TAG：默认
 										LEN_DATA：是具体要写入的数据数组长度和读取长度相同
 										HW_CONNECT：连接TO_IDENT工艺对象或者IID_HW_CONNECT
 										IDENT_DATA：写入数组的db数据					
		注意：
 		读写器一次一般只能执行112BYTE 根据芯片来决定
		

通过MODBUS TCP进行通信
		
		组态模块：
			
				通信-->其他-->Modbus Tcp
				
					使用MB_CLIENT的两个同名DB块（因为走一个协议所以应该是一个通道 用同一个db块）
						
						触发条件：
							写：
								REQ："AlwaysTRUE"或者做一个开关
								MB_MODE：1  模式为1表示写
								MB_DATA_ADDR：根据具体的读写器寄存器地址和要使用什么模式来决定，写和读，一致 例：03模式下MB_DATA_ADDR的起始地址是40001，读写器寄存器地址是14 所以MB_DATA_ADDR地址是两者相加等于40015（03模式下MB_DATA_ADDR的起始地址是40001也可以是400001，当40001不够用的时候选择400001）
								MB_DATA_LEN：RFID设备对应的写寄存器数量
								MB_DATA_PTR：指向自定义的数据块的写数据起始位置和结束位置，例P#DB2.DBX14.0 INT 4
								CONNECT ：写和读使用同一个协议（TCON_IP_V4）
								
							读：
								REQ：做一个开关
								MB_MODE：0 模式为0表示读
								MB_DATA_ADDR：根据具体的读写器寄存器地址和要使用什么模式来决定，写和读，一致 例：03模式下MB_DATA_ADDR的起始地址是40001，读写器寄存器地址是14 所以MB_DATA_ADDR地址是两者相加等于40015（03模式下MB_DATA_ADDR的起始地址是40001也可以是400001，当40001不够用的时候选择400001）
								MB_DATA_LEN：RFID设备对应的读寄存器数量
								MB_DATA_PTR：指向自定义的数据块的读数据起始位置和结束位置，例P#DB2.DBX22.0 INT 4
								CONNECT ：写和读使用同一个协议（TCON_IP_V4）
				
				
		报错：
		80A3:看读模式的块和写模式的块的名称是否不同，不同的db块会产生两个不同的通道，一个通讯协议不能在两个不同通道进行数据交换
		8383:看数据的长度和类型，国产的一般可以用INT进行通讯，可以将读取/写入的array数组改成INT数据类型，一般常见最长的长度是112个BYTE，也就是56个INT
		40011-40015 这四位是系统常数 总共是11位  前四位可以不读，所以可以写成40015 7位
```

**Modbus协议的数据模型和地址模型**

**数据模型**是对从站设备可访问的数据进行抽象，Modbus协议的数据模型定义了四种可访问的数据，为了简化数据模型与设备存储区的对应关系，又引入了**地址模型**的概念，通过编号的方式对不同类型数据进行区分，也就是通过特定的编号作为前缀加到所讨论的数据地址中。如表中所示，通过0,1,3,4分别表示线圈，离散量输入，输入寄存器，和保持寄存器。

| 地址前缀编号 | 编号范围(1~65536) | 编号范围(1~9999) | 数据区块                      | **数据**类型    | 访问类型 |
| ------------ | ----------------- | ---------------- | ----------------------------- | --------------- | -------- |
| **0**        | 000001~065536     | 00001~09999      | 线圈(Coils)                   | 布尔            | 读/写    |
| **1**        | 100001~165536     | 10001~19999      | 离散量输入(Discrete Input)    | 布尔            | 只读     |
| **3**        | 300001~365536     | 30001~39999      | 输入寄存器(Input registers)   | 无符号2字节整型 | 只读     |
| **4**        | 400001~465536     | 40001~49999      | 保持寄存器(Holding registers) | 无符号2字节整型 | 读/写    |

理论上，

线圈地址范围：000001~065536

离散量输入地址范围：100001~165536

输入寄存器地址范围：300001~365536

保持寄存器地址范围：400001~465536

由于65536是比较大的数值，实际应用一般不需要这么大的存储区，因此设备厂家普遍采用的是10000以内的地址范围，即：

线圈地址范围：00001~09999

离散量输入地址范围：10001~19999

输入寄存器地址范围：30001~39999

保持寄存器地址范围：40001~49999

有了该地址模型，我们就可以从Modbus寄存器的地址判断要访问的区块的类型。

### MODBUS (RTU)

```markdown
		组态硬件：

 				使用硬件CM1241进行组态以半双工RS485/232的方式进行通讯

 		组态模块：

 				通信-->通信处理器-->MODBUS(RTU)

 				Modbus_Comm_Load：组态Modbus 的端口（Modbus_Comm_Load模式改成4）

 						REQ："AlwaysTRUE"
 					    PORT：硬件CM1241的具体硬件标识符
 						BAUD：默认 ，数据传输速率
 						PARITY：默认，奇偶检验
 						FLOW_CTRL：默认，流控制
 						RTS_ON_DLY：50，接通延迟
 						RTS_OFF_DLY：50，关断延迟
 						RESP_TO：默认，响应超时时间
 						MB_DB：Modbus_Master.MB_DB 对 Modbus_Master 或 Modbus_Slave 指令的背景数据块的引用	

 				Modbus_Master：作为主站通讯，写入通讯

 						触发条件：

 								REQ：常闭的写入DONE，写入BUSY，读取DONE，读取BUSY串联，并联常开的写入ERROR+5HZ时钟,并联常开的读取ERROR+5HZ时钟作为使能条件
 								MB_ADDR：一般为1，Modbus RTU 站地址 
 								MODE：1，写入
 								DATA_ADDR：从站中的起始地址，要根据实际设备的写入起始地址决定，例如读取电能表2000H电压对应的数据时2000H对应的10进制数是8192，03模式下MB_DATA_ADDR的起始地址是40001，故起始地址是两者相加等于48193（03模式下MB_DATA_ADDR的起始地址是40001也可以是400001，当40001不够用的时候选择400001）
 								DATA_LEN：要根据实际设备的写入地址长度决定
 								COM_RST：进行Modbus RTU 的重置
 								DATA_PTR：写入数据块，根据实际设备参数决定（创建数据块，设备中的参数如果是32位的可以用real类型数组来接收/写入数据，使用P#DB100.DBX0.0 word 18这种形式定义数据的起始位置和结束位置）

 				Modbus_Master：作为主站通讯， 读取通讯

 						触发条件：

 								REQ：写入DONE作为使能条件，写入操作完成之后才能开始读取
 								MB_ADDR：一般为1，Modbus RTU 站地址 
 								MODE：0，读取
 								DATA_ADDR：从站中的起始地址，要根据实际设备的写入起始地址决定，例如读取电能表2000H电压对应的数据时2000H对应的10进制数是8192，03模式下MB_DATA_ADDR的起始地址是40001，故起始地址是两者相加等于48193（03模式下MB_DATA_ADDR的起始地址是40001也可以是400001，当40001不够用的时候选择400001）
 								DATA_LEN：要根据实际设备的读取地址长度决定
 								COM_RST：进行Modbus RTU 的重置
 								DATA_PTR：读取数据块，根据实际设备参数决定（创建数据块，设备中的参数如果是32位的可以用real类型数组来接收/写入数据，使用P#DB100.DBX0.0 word 18这种形式定义数据的起始位置和结束位置）

 		案例：变位机伺服控制
```

DATA_LEN的值根据需要读取是数据长度来确定的，如下图

<img src="rtu下电能表需要读取的数据.png" style="zoom:75%;" />

总共需要读取九个数据，但是每个数据都是32位的数据，DATA_ADDR地址的数据48193是16位的，所以DATA_LEN的值是18



Modbus_Comm_Load模式改成4，在系统块-->程序资源-->Modbus_Comm_Load数据块static中MODE改成4

<img src="Modbus_Comm_Load操作模式修改.png" style="zoom:75%;" />

原因是半双工模式在操作模式中是第四个

<img src="1241RTU操作模式.png" style="zoom:75%;" />

电能表中读取的数据除了2000H还有4000H的，由于不是连续的数据4000H的数据需要新建一个Modbus_Master的数据块进行读取

<img src="电能表4000H参数.png" style="zoom:75%;" />

4000H是16进制的转化成10进制是16384 ，不能用40001加40001的最大值是49999，会超范围，所以DATA_ADDR地址要用400001加16384等于416385



### 工艺-轴控制

```markdown
		组态软件：轴工艺对象

 		组态模块：

 				MC_POWER :轴启动和停止

 						触发条件：

 								Axis：轴对象
 								Enable：常开使能开关
 								StartMode：1，轴位置控制
 								StopMode：0，停止模式

 				MC_RESET: 进行出错重置

 						触发条件：

 								Axis：轴对象
 								Execute：常开使能开关

 				MC_HOME: 回原点

 						触发条件：

 								Axis：轴对象
 								Execute：常开使能开关
 								Position：默认是0，回原点之后轴的相对位置
 								Mode：3,回原点的模式

 				MC_MoveAbsolute:绝对位移

 						触发条件：

 								Axis：轴对象
 								Execute：常开使能开关
 								Position：绝对目标位置，-1.0E12 ≤ Position ≤ 1.0E12
 								Velocity：轴的速度，启动/停止速度 ≤ Velocity ≤ 最大速度
 								Direction：默认是1，轴的运动方向，1是正方向，2是负方向，3是最短距离

 				MC_MoveRelative:相对位移

 						触发条件：
 								Axis：轴对象
 								Execute：常开使能开关
 								Distance：定位操作的移动距离
 								Velocity：轴的速度，启动/停止速度 ≤ Velocity ≤ 最大速度

 				MC_MoveJog:点动

 						触发条件：

 								Axis：轴对象
 								JogForward：常开使能开关，点动正向移动
 								JogBackward：常开使能开关，点动反向移动
 								Velocity：点动预设速度，启动/停止速度 ≤ 速度 ≤ 最大速度
 								PositionControlled：默认true

 				MC_ReadParam:读取轴对象参数比如：实时位置 			

 						触发条件：

 								Enable："AlwaysTRUE"
 								Parameter："轴_1".ActualPosition，获取轴的数据
 								Value：DB中定义的实际位置变量，指向写入所读取值的目标变量或目标地址的 VARIANT 指针

 		案例：旋转供料模块控制
```



### 硬件伺服控制

```markdown
		组态硬件：

 			IS620F-RT伺服

 				+驱动+111报文

 		组态模块：

 				SinaPos:报文111位置控制轴指令

 						触发条件：
 								ModePos：运动方式
 								EnableAxis：常开使能开关
 								CancelTraversing：默认，是否拒绝激活状态的运行作业
 								IntermediateStop：默认，激活状态的运行指令中断
 								Positive：默认，正方向
 								Negative：默认，正方向
 								Jog1：Jog 信号源1，正转
 								Jog2：Jog 信号源2，反转
 								FlyRef：默认，取消主动回原点参考
 								AckError：常开开关，故障应答/故障清除
 								ExecuteMode：常开开关，激活运行作业/接收设定值/激活回参考点功能
 								Position：具体模式执行的位置
 								Velocity：具体模式执行的速度
 								OverV：默认
 								OverAcc：默认
 								OverDec：默认
 								ConfigEPos：一般为16#07
 								HWIDSTW：伺服驱动对象报文
 								HWIDZSW：伺服驱动对象报文

 						响应重要参数：
 								AxisPosOk：使能是否成功状态
 								ActVelocity：当前速度
 								ActPosition：当前位置
 								ActMode：当前处于激活状态的运行模式
 								Error：是否存在故障
 								Status：故障错误码
```

### RS422

422全双工 读写可以同时进行
		全双工（Full Duplex）通信允许数据在两个方向上同时传输，它在能力上相当于两个单工通信方式的结合。全双工指可以同时（瞬时）进行信号的双向传输（A→B且B→A）。指A→B的同时B→A，是瞬时同步的。

### RS485

通信模式

485半双工  只读或者只写，通信线路上的数据只能单向传输
半双工（Half Duplex）数据传输指数据可以在一个信号载体的两个方向上传输，但是不能同时传输。			RS485是串行数据传输的标准，主要用于多点通信，使用差分信号进行数据传输，也就是通过两根通信线之间的电压差表示传递的信号，一般采用主从的通讯模式，主站发送数据，从站接收数据，上传数据

电气特性

```markdown
逻辑电平：逻辑1表示电压在+2~+6v之间，逻辑0表示电压在-2~-6v之间
```

网络拓扑和节点数量

RS485总线，一条总线将各个节点串联起来，一般情况下可以接32个节点

### 不同的设备使用了不同的通讯协议，这两者怎么进行通讯？

1.使用网关或者协议转换器

 网口 **MODBUS TCP** 转  串口**MODBUS (RTU)**    使用 **串口服务器**

**Profinet**转**MODBUS (RTU)**  协议需要使用  **Profinet 转 MODBUS (RTU) 网关**

**MODBUS (RTU)** 转**EtherCAT** 需要使用**RS485转EtherCAT网关**

2.将有线的转为无线的网关

串口转Lora

串口转RF(无线射频)

串口转MQTT（MQTT可以连接到云平台，云平台可以连接不同类型的设备，方便远程监控和管理）

### PLC之间进行GET,PUT通讯（S7通讯）

从右侧工具栏拖取  通信-->S7通信-->GET,PUT模块

<img src="拉取s7通讯块.png" style="zoom:50%;" />

从开放式用户通信-->其他-->拉取检查连接模块T_DIAG

<img src="s7检查连接模块.png" style="zoom:75%;" />

判断时候连接成功

<img src="判断S7是否通讯成功.png" style="zoom:50%;" />

建立S7通讯数据块

<img src="建立S7发送接收的通讯数据.png" style="zoom:75%;" />

建立S7通讯应用层模块

<img src="建立S7通讯应用层模块.png" style="zoom:50%;" />

ID：16#100来源

<img src="/S7连接ID来源.png" style="zoom:60%;" />

另一个PLC建立对应的S7交互数据块

<img src="/另一个PLC建立对应的S7交互数据块.png" style="zoom:75%;" />
