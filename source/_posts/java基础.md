---
title: java基础
typora-root-url: java基础
abbrlink: b8b0eacd
date: 2022-11-26 14:38:26
keywords: 'java基础'
tags: 
categories: 
photos:
description: java基础
---

java基础

<!--more-->

------



# java基础

### NIO和BIO的主要区别

### Java BIO和NIO之间的主要区别：

| BIO    | NIO      |
| ------ | -------- |
| 面向流 | 面向缓冲 |
| 阻塞IO | 非阻塞IO |
| 无     | 选择器   |



BIO：同步阻塞IO。服务器实现模式为一个连接一个线程，即客户端有连接请求时服务器需要启动一个线程进行处理，如果这个链接不做任何事情会造成不必要的线程开销，当然可以通过线程池机制改善。

 NIO：同步非阻塞IO，服务器实现模式为一个请求一个线程，即客户端发送的连接请求都会注册到多路复用器上，多路复用器轮询到连接有IO请求时才启动一个线程进行处理。用户进程也需要时不时的询问IO操作是否就绪，这需要用户进行不停的去询问。NIO的包括三个核心概念:缓冲区(Buffer)、通道(Channel)、选择器(Selector)。

 AIO：Asynchronous IO，异步非阻塞AIO。最大的特性时具有异步能力，这种能力对socket与文件I/O都起作用。AIO其实是一种在读写操作结束之前允许进行其他操作的I/O处理。

### 类加载机制(原理)：

加载，验证，准备，解析，初始化

加载:这个阶段会在内存中生成一个代表这个类的 java.lang.Class 对象，作为方法区这个类的各种数据的入口 

验证：确保 Class 文件的字节流中包含的信息是否符合当前虚拟机的要求 

准备：即在方法区中分配这些变量所使用的内存空间 

解析：虚拟机将常量池中的符号引用替换为直接引用的过程 

初始化：初始化阶段是执行类构造器<client>方法的过程 如果一个类中没有对静态变量赋值也没有静态语句块，那么编译 器可以不为这个类生成<client>()方法  

### docker 常用命令

Docker ps  查看正在运行的容器

docker ps -a 查看全部容器

--name 指定容器名字

-p 指定容器暴露的端口

docker stop ID关闭正在运行的容器

docker start ID启动一个容器

docker restart ID 重启一个容器

docker images 查看本地镜像

docker exet 进入一个容器

docker cp ID全称:容器文件路径 本地路径   拷贝文件到本地

git 常用命令，

如：clone ，checkout，add,commit，push ，pull，merge ，冲突解决，误删除历史找回 （客户端操作和idea插件操作）

### http和https区别

http攻击者截取了Web浏览器和网站服务器之间的传输报文，就可以直接读懂其中的信息  

https为了解决HTTP协议的这一缺陷，需要使用另一种协议：安全套接字层超文本传输协议HTTPS，为了数据传输的安全，HTTPS在HTTP的基础上加入了SSL/TLS协议，SSL/TLS依靠证书来验证服务器的身份，并为浏览器和服务器之间的通信加密。  

为什么需要 HTTPS ? 因为HTTP是明文传输数据的, 不安全, 而 HTTPS 是会对内容加密的
 HTTPS 的加密策略是什么 ?(SSL/TLS依靠证书来验证服务器的身份)
 先用 非对称加密, 传递对称加密的密钥 (保证了密钥传输的安全)
 后续 使用对称加密, 进行交流 (保证了传输数据安全)
 问题: 就算是第一次交流用非对称加密, 公钥也是要在网络中传输的!
 如何证明公钥是可靠的? 如何证明网站是可靠的 ? (CA机构认证, 网站需要申请 数字证书 )
 请求时, 网站就会将数字证书给到浏览器, 浏览器默认就会检测证书的可靠性!
 (1) 是否是权威机构发布的!
 (2) 看证书中记录的地址 和 当前访问的网站的地址, 是否一致, 只有一致, 才可靠!
 (3) 看证书是否过期
 ...
 如何保证证书不被篡改 => 数字签名, 可以根据证书的所有的内容, 生成一个唯一标识!!! (Hash加密算法)
 一旦内容如果被修改了, 再次生成唯一标识时, 和之前生成的唯一标识就不一样! 检测是否被修改!

Https是传输过程加密

https是传输过程加密，而并非是数据加密传输，使用https对其他国家来说是安全的，但对美国而言，依然是不安全的 因为美国开发的

SSL/TLS原理

服务器a用服务器b生成的公钥来加密对称加密的秘钥，这样服务器b可以用对应私钥解开密文，拿到服务器a的对称加密的秘钥。
 后续服务器a就用对称加密的秘钥，进行加密数据，发到服务器b，服务器b也可以正常解密麻烦数据了。
 理论上看起来很完美，但是这里仍然可能存在中间人攻击，中间人可以监听获取到服务器b发给服务器a的公钥，然后加以伪装篡改后再转发给服务器a。
 然后中间人也可以监听获取到服务器a用伪造的公钥加密秘钥的数据，这样秘钥也被中间人拿到了，后面通信数据也就被窃取了。
 那怎么办?引入第三方认证机构，CA。
 服务器a拿到公钥后，用公钥去ca求证下，与他通信的服务器b是不是真正的在ca认证的服务器b，而不是中间人伪装的。

### Java中创建对象的5种方式

​	使用new 关键字

​	使用Class类的newInstance的方法

​	使用Constructor 的newInstance的方法

​	使用clone方法

​	使用反序列化

### Object方法

 1、hashcode 2、equals 3、wait()(三个) 4、object 5、tostring 6、getclass 7、notify 8、notifyAll  9、clone 10、finalize  

### equals和==的区别

 1、==：比较的是值是否相等

- 基本数据类型，比较的是值
- 引用数据类型 	，比较的是对象的的地址

 2、equals：一般为比较内容是否相同

- 如果没有对equals方法进行重写，比较的是引用类型的变量所指向的对象的地址
- 如果对equals进行了重写，比较的就是对象的内容

### #{}和${}的区别

 \#{}是预编译处理 是一个占位符 默认会加上单引号，${}字符串的替换 不会加上单引号

 \#{}是防止sql注入

 能少用${}就尽量少使用，但是表名作参数，或者order by 排序时用 ${}

 在mybatis中 #{}默认值是age0，age1 ${}默认值是param1、param2

 sql注入就是说传过来的参数2改变了原本的意思就是sql注入  

 比如说传一个 name="富贵 or name = 狗蛋"  

 如果使用${}那么就改变了意思，查询的就是名字是富贵或者狗蛋的，如果是#{}的话就没有改变意思，因为#{}是一个占位符

### String、StringBuilder和StringBuffer的区别

 String是不可变的，由String创建的对象需要更改的时候要重新在堆内存中进行分配，所以说消耗资源大，String是由final修饰的，不能被重写。

 StringBuilder和StringBuffer是可变的

 StringBuilder和StringBuffer的区别：StringBuilder的效率高，所以说是线程不安全的，而StringBuffer的效率低，因此是安全的，在一般情况下我们会去使用StringBuilder因为效率较高，但是如果要求要线程安全的话要使用StringBuffer。StringBuffer底层是通过锁来保证安全的（synchronized）。

#### StringBuilder为什么是线程不安全的

 继承了AbstractStringBuilder，如果创建的话变量是存在AbstractStringBuilder中的，有一个char和count，第一个不安全就是，他底层的append方法是没有加锁的，没有保证了原子性，如果说创建线程同时去执行的话，谁先获取到就谁先执行，很有可能出现两个人同时获取到，那么同时进行操作，就会出现所得结果小于真实结果，第二个就是在添加的时候会出现数组下标越界，每次添加的时候都回去判断下标和数组长度，如果长度够就可以添加，在这里又没有保证原子性，如果两个线程同时进来操作，因为cpu差一个满了，第一个添加进去了，那么就会出现第二个添加的时候已经达到最大长度了，这时候就会出现下标越界

### 抽象类和接口的区别

- 抽象类要被子类继承，接口要被类实现。
- 接口只能做方法声明，抽象类中可以作方法声明，也可以做方法实现。
- 接口里定义的变量只能是公共的静态的常量，抽象类中的变量是普通变量。
- 抽象类和接口都是用来抽象具体对象的，但是接口的抽象级别最高
- 抽象类可以有具体的方法和属性，接口只能有抽象方法和不可变常量。
- 抽象类主要用来抽象类别，接口主要用来抽象功能。

### 栈和堆的区别  

 1、内存分配方式不同：

- 栈是由系统自动分配的，主要存储的是局部变量和函数的参数
- 堆是由程序员自己分配的，如果说有没有释放的程序 	，系统会自动在一定时间内通过OS进行回收

 2、申请方式不同：

- 栈是系统 	自动分配的
- 堆是程序员自己分配的

 3、申请后系统响应不同：

- 栈要保证剩余空间比申请空间大，将内存分配给程序，否则会造成栈溢出
- 堆系统自动是由链表的形式去分配内存的，当程序提交申请的时候，会循环链表，为了找出链表的内存大于申请空间，将程序分配在此节点上，使用的结点要从空闲链表中移除，正常情况下是没有办法保证链表内存刚好能分配申请空间的，所以说，要把使用链表的空闲内存，分布在空闲链表中

 4、申请的效率不同：

- 栈是由系统分配的，所以说栈的效率高
- 堆是由程序员自己分配的，效率低

 5、申请的大小限制不同:

- 栈是由低地址扩张的，有一片连续的内存，但是是由系统分配到的所以说分配空间较小。
- 堆是由高地址扩张的，因为是链表，所以没有连续的内存，分配的空间较大

 6、存储的内容不同：

- 栈保证的是先进后出的理念，先去存放的是局部变量，随后存放是的是函数参数
- 堆是由程序员自己决定存放内容的。

### equals和hashcode的区别

 在添加数据的时候，通常会采用对比equals和hashcode的方式去添加到链表中

- equals相同那么hashcode一定相同
- hashcode相同equals不一定相同

### jdk 1.7 1.8 区别

 1.8中新增了

1.接口的默认方法
 2.lambda表达式
 3.函数式接口
 4.方法与构造函数引用
 5.访问局部变量

6.Stream的使用  例如 allList.stream().filter

### .class文件的生成和加载过程

 生成：使用javac命令可以编译该文件-----生成.class文件

 加载过程：当运行Java程序时，首先运行JVM（Java虚拟机），然后再把class文件加载到JVM的方法区里，然后在堆区创建一个java.lang.Class对象，用来封装类在方法区内的数据结构，并向程序员提供访问方法区内的数据结构的接口。

 在加载class文件的时候，JVM会先加载类中的所有静态成员( 方法，变量，静态代码块 )都加载到方法区class文件的所处静态区中
 当把所有的静态成员加载完成之后，开始给类中的所有静态成员变量进行默认初始化
 当类中的所有静态成员变量默认初始化之后，接着开始给所有静态成员变量显示赋值。
 当类中所有的静态成员变量显示赋值结束之后，静态代码块才会运行。
 当静态代码块执行结束之后，才表示class文件加载完成

### mybatis分页实现

我们使用pagehelper来实现分页的
 public Pager<User> findByPager(int page,int size){
 	Pager<User> pager = new Pager<User>();
 	Page<User> res = PageHelper.startPage(page,size);
 	userDao.findAll();
 	pager.setRows(res.getResult());
 	pager.setTotal(res.getTotal());
 	return pager;
 }

在 startPage 中将我们传入的page，size交给new Page处理生成page  然后将page传入setLocalPage中 setlocalPage又将参数传递给ThreadLocal<page>  (在ThreadLocal中线程之间不互相影响 ) 最后通过excutor.query查询数据 进入Plugin类的invoke 唤醒拦截器，通过传入page参数进行拦截，返回  当前页，每页条数，总页数，总记录数  给业务代码

MD5是一种加密方式不能解密

### 对称加密和非对称加密   

 大数据量进行加密时候使用对称加密 小数据量的时候非对称加密  进行加密  

使用AES完成对称加密  密钥默认长度128

实现方式 1.使用盐值去生成密钥 2. 然后通过原始数据和密钥通过加密方法进行加密 使用加密后的数据和密钥通过解密方法对数据进行解密

使用RSA完成非对称加密  密钥默认长度是1024

实现方式1.先获取根据盐值获取密匙对 2.根据密匙对获取公钥和密钥 3.根据公钥和加密的字符串进行加密  4.使用密文和私钥进行解密

### jwt  参数设置  

 盐值 过期时间  还有键，值，角色名称

跨域

@CrossOrigin 注解原理

利用spring的拦截器实现往response里添加 Access-Control-Allow-Origin等响应头信息

spring 在记录mapper映射时会记录对应跨域请求映射 将结果返回到了AbstractHandlerMethodMapping#register  

当一个跨域请求过来时，spring在获取handler时会判断这个请求是否是一个跨域请求，如果是，则会返回一个可以处理跨域的handler

gateway网关跨域原理

后端配置一个支持的域名集合，或者支持域名的正则表达式集合，如果前端请求的header里面的origin的值和后端的配置相匹配，那么就在repsonse里面添加 Access-Control-Allow-Origin 为request重的origin的值



## object方法

1、hashcode 2、equals 3、wait()(三个) 4、object 5、tostring 6、getclass 7、notify 8、notifyAll 9、registernative 10、clone 11、finalize  

## equals和==的区别

 1、==：比较的是值是否相等

- 基本数据类型，比较的是值
- 引用数据类型 	，比较的是对象的的地址

 2、equals：一般为比较内容是否相同

- 如果没有equals方法进行重写，比较的是引用 	类型的变量所指向的对象的地址
- 比如string 	date对equals进行了重写，比较的就是对象的内容

## #{}和${}的区别

 \#{}是预编译处理 是一个占位符 默认会加上单引号，${}字符串的替换 不会加上单引号

 \#{}是防止sql注入

 能少用${}就尽量少使用，但是表名作参数，或者order by 排序时用 ${}

 在mybatis中 #{}默认值是age0，age1 ${}默认值是param1、param2

 sql注入就是说传过来的参数2改变了原本的意思就是sql注入  

 比如说传一个 name="富贵 or name = 狗蛋"  

 如果使用${}那么就改变了意思，查询的就是名字是富贵或者狗蛋的，如果是#{}的话就没有改变意思，因为#{}是一个占位符

## String、StringBuilder和StringBuffer的区别

 String是不可变的，由String创建的对象需要更改的时候要重新在堆内存中进行分配，所以说消耗资源大，String是由final修饰的，不能被重写。

 StringBuilder和StringBuffer是可变的

 StringBuilder和StringBuffer的区别：StringBuilder的效率高，所以说是线程不安全的，而StringBuffer的效率低，因此是安全的，在一般情况下我们会去使用StringBuilder因为效率较高，但是如果要求要线程的话要使用StringBuffer。StringBuffer底层是通过锁来保证安全的。

### StringBuilder为什么是线程不安全的

 首先两个全部都继承了AbstractStringBuilder，如果创.0建的话变量是存在AbstractStringBuilder中的，有一个char和count，第一个不安全就是，他底层的append方法是没有加锁的，没有保证了原子性，如果说创建线程同时去执行的话，谁先获取到就谁先执行，很有可能出现两个人同时获取到，那么同时进行操作，就会出现所得结果小于真实结果，第二个就是在添加的时候会出现数组下标越界，每次添加的时候都回去判断下标和数组长度，如果长度够就可以添加，在这里又没有保证原子性，如果两个线程同时进来操作，其中一个因为cpu满了，有一个添加进去了，那么就会出现第二个添加的时候已经达到最大长度了，这时候就会出现下标越界

## switch case 语句语法格式

``` java
switch(expression){
    case value :
       //语句
       break; //可选
    case value :
       //语句
       break; //可选
    //你可以有任意数量的case语句
    default : //可选
       //语句
}
```



## 抽象类和接口的区别

- 抽象类要被子类继承，接口要被类实现。
- 接口只能做方法声明，抽象类中可以作方法声明，也可以做方法实现。
- 接口里定义的变量只能是公共的静态的常量，抽象类中的变量是普通变量。
- 抽象类和接口都是用来抽象具体对象的，但是接口的抽象级别最高
- 抽象类可以有具体的方法和属性，接口只能有抽象方法和不可变常量。
- 抽象类主要用来抽象类别，接口主要用来抽象功能。

## 栈和堆的区别  

 1、内存分配方式不同：

- 栈是由系统自动分配的，主要存储的是局部变量和函数的参数
- 堆是由程序员自己分配的，如果说有没有释放的程序 	，系统会自动在一定时间内通过OS进行回收

 2、申请方式不同：

- 栈是系统 	自动分配的
- 堆是程序员自己分配的

 3、申请后系统响应不同：

- 栈要保证剩余空间比申请空间大，将内存分配给程序，否则会造成栈溢出
- 堆系统自动是由链表的形式去分配内存的，当程序提交申请的时候，会循环链表，为了找出链表的内存大于申请空间，将程序分配在此节点上，使用的结点要从空闲链表中移除，正常情况下是没有办法保证链表内存刚好能分配申请空间的，所以说，要把使用链表的空闲内存，分布在空闲链表中

 4、申请的效率不同：

- 栈是由系统分配的，所以说栈的效率高
- 堆是由程序员自己分配的，效率低

 5、申请的大小限制不同:

- 栈是由低地址扩张的，有一片连续的内存，但是是由系统分配到的所以说分配空间较小。
- 堆是由高地址扩张的，因为是链表，所以没有连续的内存，分配的空间较大

 6、存储的内容不同：

- 栈保证的是先进后出的理念，先去存放的是局部变量，随后存放是的是函数参数
- 堆是由程序员自己决定存放内容的。

## equals和hashcode的区别

 在添加数据的时候，通常会采用对比equals和hashcode的方式去添加到链表中

- equals相同那么hashcode一定相同
- hashcode相同equals不一定相同

相同点

 equals和hashcode方法都是用来判断两个对象的值是否相同的，在这里仅仅判断的是两个对象的值并不是引用。

区别

- 他们判断对象相同的方式不一样
  - equals判断的是如果字符完全相同，那么值就相同了
  - hashcode是根据hash来计算对象实例的，返回值是一个hashcode，通过比较hashcode是否相等来判断两个对象是否相同的 		- 		jvm每创建一个object对象，都会将这个对象放入hash表中去，方便下次做对象比较或者取对象的时候使用，只要用就可以从hash表中拿出来，提高了对象的效率 		- 		jvm创建对象的时候，会根据hashcode放到对应的key上去，如果不同的对象产生了相同的hash值那么就产生了冲突，解决此冲突的方法是链地址法，此时就要在hash 		key上会产生单链表的形式，会将值放在单链表上 		- 		比较两个对象是否相同，首先要去做的是根据hashcode去hash表中查询他们的对象，如果相同则说名他们在hash表中的同一个key中，此时就需要用equals去做比较了。
  - 判断对象是否相同的准确率不一样

## cookie 和session的区别:

1.存储位置：cookie数据存放在客户的浏览器上，session数据放在服务器上。

2.安全性：cookie不是很安全，别人可以分析存放在本地的COOKIE并进行COOKIE欺骗,   考虑到安全应当使用session。  

3.性能：session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能考虑到减轻服务器性能方面，应当使用COOKIE。

4.限制：单个cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个cookie。  (超过  拆出一部分数据,把数据存在LocalStorage )

5.过期时间:

 cookie

​    cookie是没有过期的。

只是它的保存时间是一个会话周期(session), 临时性Cookie，不会被持久化，也就是当你关闭你的浏览器后，这个cookie就会消失。

 Session:

​    30分钟

## cookie 和localStorage 区别

 作用不同:

 localStorage是用于本地大容量存储数据(web storage的存储量大到5MB);   

 cookie是用于客户端和服务端间的信息传递；  

 过期时间:

 localStorage是持久化的本地存储，除非是通过js删除，或者清除浏览器缓存，否则数据是永远不会过期的。  

 Cookie 会话结束后就会过期

## 常用的设计模式:

 单例模式   观察者模式   装饰者模式   适配器模式  工厂模式   代理模式（proxy）

#### 单例模式

简单点说，就是一个应用程序中，某个类的实例对象只有一个，你没有办法去new，因为构造器是被private修饰的，一般通过getInstance()的方法来获取它们的实例。

getInstance()的返回值是一个对象的引用，并不是一个新的实例

 几种单例模式的写法  

 懒汉式（线程安全）  饿汉式   静态内部类  枚举

#### 观察者模式

 对象间一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新。

#### 装饰者模式

对已有的业务逻辑进一步的封装，使其增加额外的功能，如Java中的IO流就使用了装饰者模式，用户在使用的时候，可以任意组装，达到自己想要的效果。

#### 适配器模式

 将两种完全不同的事物联系到一起，就像现实生活中的变压器。

#### 工厂模式

 简单工厂模式：一个抽象的接口，多个抽象接口的实现类，一个工厂类，用来实例化抽象的接口

工厂方法模式：有四个角色，抽象工厂模式，具体工厂模式，抽象产品模式，具体产品模式。不再是由一个工厂类去实例化具体的产品，而是由抽象工厂的子类去实例化产品 
 抽象工厂模式：与工厂方法模式不同的是，工厂方法模式中的工厂只生产单一的产品，而抽象工厂模式中的工厂生产多个产品  

#### 代理模式（proxy）

 有两种，静态代理和动态代理

| java代码三大作用域                                       | jsp的四大作用域                    |
| -------------------------------------------------------- | ---------------------------------- |
| request                                                  | page(pageContext)                  |
| session                                                  | Request 			       session |
| ServletContext(上下文)(占用tomcat内存,一般使用redis代替) | application                        |

​		

## Git回退历史

```
使用git log命令，查看分支提交历史，确认需要回退的版本
使用git reset --hard commit_id命令，进行版本回退
使用git push origin命令，推送至远程分支
```

 快捷命令：

```
回退上个版本：git reset --hard HEAD^ 
```

 【注：HEAD是指向当前版本的指针，HEAD^表示上个版本,HEAD^^表示上上个版本】

 如果修改到的文件比较少，我们可以不通过命令回滚的方式，手动删除之前的修改，再进行提交。

撤销修改

 一些时候，为了验证Bug，我们可能会直接在测试服务器上打断点调试。如果忘记去掉调试内容，在执行git pull更新时，Git会提示你提交修改。

 此时，你可能已经不记得修改什么了，这个时候，我们可以用git checkout -- file命令，来清空工作区的修改。是的，git checkout命令不仅可以用来切换分支，还能撤销文件修改。

 如果想要撤销提交到暂存区后的文件内容怎么办呢(即执行git add之后)，我们可以使用git reset HEAD file命令撤销提交到暂存区的内容,再使用git checkout -- file命令来撤销工作区的修改，需要分两步进行操作。

reset还是revert?

 针对评论区提出的，回滚是使用reset还是revert的疑问，这边做下补充说明。

 reset和revert都可以用来回滚代码。但他们是有区别的，准确来说，reset是用来"回退"版本，而revert是用来"还原"某次或者某几次提交。

 听起来有点绕，怎么去理解他们呢？

 举个例子，比如在master分支，有以下提交历史:

```
42eae13 (HEAD -> master) 第四次修改
97ea0f9 第三次修改
e50b7c2 第二次修改
3a52650 第一次修改
```

 可以看到，master最新版本为第四次修改。

 如果发现，在第四次修改有错误，需要回滚到第三次修改，就可以用reset命令来回退。

 执行 git reset --hard 97ea0f9,这个时候，git的提交历史变为:

```
97ea0f9 (HEAD -> master) 第三次修改
e50b7c2 第二次修改
3a52650 第一次修改
```

 可以看到master当前指向97ea0f9这个版本，我们回到了第三次修改。

 使用reset命令，Git会把要回退版本之后提交的修改都删除掉。要从第四次修改回退到第一次修改，那么会删除第二、三、四次的修改。【注：这里并不是真正的物理删除】

 那如果发现第三次修改有错误，想要恢复第三次修改，却要保留第四次修改呢？

 这个时候就可以用revert命令：

```
git revert -n 97ea0f9
git commit -m "恢复第三次修改"
```

 Git提交历史会变成：

```
33b8b30 (HEAD -> master) Revert "恢复第三次修改"
42eae13 第四次修改
97ea0f9 第三次修改
e50b7c2 第二次修改
3a52650 第一次修改
```

 实际上，Git把第三次修改从提交中剔除(还原)了，还保留了第四次修改，并且产生了新的commit_id。

 在实际生产环境中，代码是基于master分支发布到线上的，会有多人进行提交。可能会碰到自己或团队其他成员开发的某个功能在上线之后有Bug,需要及时做代码回滚的操作。

 在确认要回滚的版本之后，如果别人没有最新提交，那么就可以直接用reset命令进行版本回退，否则，就可以考虑使用revert命令进行还原修改，不能影响到别人的提交。

 使用reset还是revert，需要考虑实际的适用场景，没有绝对化。

 上面提的并不是真正的物理删除，是因为Git会把分支的每次修改记录都会保留下来，比如有某次的commit,某次的reset等。而使用git reflog show命令,可以查看完整的提交历史，

 只要有commit_id，我们就能恢复任意版本的代码，在各版本之间来回穿梭。	

## Java 8种排序方式：

直接插入排序

希尔排序

简单选择排序

堆排序

冒泡排序

```java
public static void sort(int[] a) {

      // int a[] = {12, 23, 34, 45, 12, 23, 43, 56};

       int length = a.length;

        

       for (int i = 0; i < length - 1; i++) {

           for (int j = 0; j < length - 1 - i; j++) {

               if (a[j] > a[j+1]) {        // 相邻元素两两对比

                   int temp = a[j+1];        // 元素交换

                   a[j+1] = a[j];

                   a[j] = temp;

               }

           }

       }

       for (int i = 0; i <a.length ; i++) {

           System.out.println("-----"+a[i]);

       }

   }
```

快速排序

归还排序

基数排序

## http请求是长连接还是短连接？

 在HTTP/1.0中，默认使用的是短连接。也就是说，浏览器和服务器每进行一次HTTP操作，就建立一次连接，但任务结束就[中断](https://so.csdn.net/so/search?q=中断&spm=1001.2101.3001.7020)连接。如果客户端浏览器访问的某个HTML或其他类型的 Web页中包含有其他的Web资源，如[JavaScript](http://lib.csdn.net/base/javascript)文件、图像文件、CSS文件等；当浏览器每遇到这样一个Web资源，就会建立一个HTTP会话。

 但从 HTTP/1.1起，默认使用长连接，用以保持连接特性。

 HTTP协议的长连接和短连接，实质上是TCP协议的长连接和短连接。  

## 类之间转换

BeanUtils.copyProperties("转换前的类", "转换后的类");  
有几点我们需要注意： 
BeanUtils.copyProperties(a, b); 
b中的存在的属性，a中一定要有，但是a中可以有多余的属性；
a中与b中相同的属性都会被替换，不管是否有值；
a、 b中的属性要名字相同，才能被赋值，不然的话需要手动赋值；
Spring的BeanUtils的CopyProperties方法需要对应的属性有getter和setter方法；
如果存在属性完全相同的内部类，但是不是同一个内部类，即分别属于各自的内部类，则spring会认为属性不同，不会copy；
spring和apache的copy属性的方法源和目的参数的位置正好相反，所以导包和调用的时候都要注意一下。



## java类

### BigDecimal(包装类)

包名: java.math.BigDecimal

计算方式

```
BigDecimal num1 = new BigDecimal("0.005");
BigDecimal num2 = new BigDecimal("1000000");
BigDecimal num3 = new BigDecimal(-"1000000");

//尽量用字符串的形式初始化
BigDecimal num12 = new BigDecimal("0.005");
BigDecimal num22 = new BigDecimal("1000000");
BigDecimal num32 = new BigDecimal("-1000000");

//加法
BigDecimal result1 = num1.add(num2);
BigDecimal result12 = num12.add(num22);

//减法
BigDecimal result2 = num1.subtract(num2);
BigDecimal result22 = num12.subtract(num22);

//乘法
BigDecimal result3 = num1.multiply(num2);
BigDecimal result32 = num12.multiply(num22);

//绝对值
BigDecimal result4 = num3.abs();
BigDecimal result42 = num32.abs();

//除法
BigDecimal result5 = num2.divide(num1,"20",BigDecimal.ROUND_HALF_UP);
BigDecimal result52 = num22.divide(num12,"20",BigDecimal.ROUND_HALF_UP);

BigDecimal 多参自定义除法
public BigDecimal divide(BigDecimal divisor, int scale, int roundingMode)

    public static void main(String[] args){
        BigDecimal b1 = new BigDecimal(10.005);
        BigDecimal b2 = new BigDecimal(2);
        //参数1 为除数
        //scale 为计算所得商的位数
        //roundingMode 共8种0，1，2 ，3，4，5，6，7
        System.out.println(b1.divide(b2, 3, BigDecimal.ROUND_UNNECESSARY));
    }

其中，第三位参数为除法模式，分以下8种，可自传值，也可使用BigDecimal的枚举，都一样的，如下：
0 - ROUND_UP 远离0的方向
例：1.1->2 1.5->2 1.8->2 -1.1->-2 -1.5->-2 -1.8->-2
1 - ROUND_DOWN 向0的方向移动
例：1.1->1 1.5->1 1.8->1 -1.1->-1 -1.5->-1 -1.8>-1
2 - ROUND_CEILING 舍位时往正无穷方向移动
例：1.1->2 1.5->2 1.8->2 -1.1->-1 -1.5->-1 -1.8->-1
3 - ROUND_FLOOR 与CEILING相反，往负无穷
例：1.1->1 1.5->1 1.8->1 -1.1->-2 -1.5->-2 -1.8->-2
4 - ROUND_HALF_UP 最常见的四舍五入
5 - ROUND_HALF_DOWN 以5为分界线，或曰五舍六入
6 - ROUND_HALF_EVEN 同样以5为分界线，如果是5，则前一位变偶数1.15->1.2 1.16->1.2 1.25->1.2 1.26->1.3
7 - ROUND_UNNECESSARY 舍入模式可以断言所请求的操作具有精确的结果，因此不需要舍入。如果在产生不精确结果的操作上指定了这种舍入模式，则会抛出 {@code ArithmeticException}。

```

## 时间问题

### String类型转Date类型

```plain
DateUtil.getDate(req.getStartTime())
```

### 获取几个月以后的时间

```plain
DateUtil.getAfterMonths(DateUtil.getDate(req.getStartTime()), 3)
```

### 比较两个字符串的时间类型大小

```plain
String endTime;
String startTime;
//endTime - startTime;
int endCompare = req.getEndTime().compareTo(req.getStartTime());
int<0 : endTime小于startTime
```

## List集合去重的5种方式

### 1、双重for循环

```
for (int i = 0; i < list.size(); i++) { 
	for (int j = 0; j < list.size(); j++) { 
		if(i!=j&&list.get(i)==list.get(j)) { 
			list.remove(list.get(j)); 
 		} 
	} 
}
```



### 2、利用List集合的contains方法循环遍历，清空，重新添加

```
private static void removeDuplicate(List<String> list) {
    List<String> result = new ArrayList<String>(list.size());
    for (String str : list) {
        if (!result.contains(str)) {
            result.add(str);
        }
    }
    list.clear();
    list.addAll(result);
}
```



### 3、利用HashSet不能重复的特性，但由于HashSet不能保证顺序，所以只能判断条件保证顺序

```
private static void removeDuplicate(List<String> list) {
    HashSet<String> set = new HashSet<String>(list.size());
    List<String> result = new ArrayList<String>(list.size());
    for (String str : list) {
        if (set.add(str)) {
            result.add(str);
        }
    }
    list.clear();
    list.addAll(result);
}


```

### 4、使用java8特性的stream进行List去重

要从arraylist中删除重复项，我们也可以使用java 8 stream api。

使用steam的distinct()方法返回一个由不同数据组成的流，通过对象的equals（）方法进行比较。收集所有区域数据List使用Collectors.toList()。

```
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class ArrayListExample {
    public static void main(String[] args) {
        ArrayList<Integer> numbersList = new ArrayList<>(Arrays.asList(1, 1, 2, 3, 3, 3, 4, 5, 6, 6, 6, 7, 8));
        System.out.println(numbersList);
        List<Integer> listWithoutDuplicates = numbersList.stream().distinct().collect(Collectors.toList());
        System.out.println(listWithoutDuplicates);
    }
}
```



### 5、（最佳）使用LinkedHashSet删除ArrayList中的重复数据

LinkedHashSet是在一个ArrayList删除重复数据的最佳方法。

LinkedHashSet在内部完成两件事：

```
删除重复数据
保持添加到其中的数据的顺序
```

Java示例使用LinkedHashSet删除arraylist中的重复项。在给定的示例中，numbersList是包含整数的arraylist，其中一些是重复的数字。

```
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;

public class ArrayListExample {
    public static void main(String[] args) {
        ArrayList<Integer> numbersList = new ArrayList<>(Arrays.asList(1, 1, 2, 3, 3, 3, 4, 5, 6, 6, 6, 7, 8));
        System.out.println(numbersList);
        LinkedHashSet<Integer> hashSet = new LinkedHashSet<>(numbersList);
        ArrayList<Integer> listWithoutDuplicates = new ArrayList<>(hashSet);
        System.out.println(listWithoutDuplicates);
    }
}
```



## 

## 参考文章

CSDN博主「了迹奇有没」的原创文章：https://blog.csdn.net/w_monster/article/details/112008308