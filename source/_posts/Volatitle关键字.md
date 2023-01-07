---
title: Volatitle关键字
typora-root-url: Volatitle关键字
abbrlink: 5140f04
date: 2022-11-26 17:40:23
tags:
permalink:
---



## Volatitle 关键字 （并发编程相关）

一旦一个共享变量（类的成员变量、类的静态成员变量）被volatile修饰之后，那么就具备了两层语义：

1）保证了不同线程对这个变量进行操作时的可见性，即一个线程修改了某个变量的值，这新值对其他线程来说是立即可见的。

2）禁止进行指令重排序。

### 作用:

用volatile修饰之后就变得不一样了：

第一：使用volatile关键字会强制将修改的值立即写入主存；

第二：使用volatile关键字的话，当线程2进行修改时，会导致线程1的工作内存中缓存变量stop的缓存行无效（反映到硬件层的话，就是CPU的L1或者L2缓存中对应的缓存行无效）

第三：由于线程1的工作内存中缓存变量stop的缓存行无效，所以线程1再次读取变量stop的值时会去主存读取。

### 关于原子性:

volatile关键字能保证可见性没有错，但是上面的程序错在没能保证原子性。可见性只能保证每次读取的是最新的值，但是volatile没办法保证对变量的操作的原子性。

### 关于有序性:

volatile关键字能禁止指令重排序，所以volatile能在一定程度上保证有序性。

使用volatile必须具备以下2个条件：
 1）对变量的写操作不依赖于当前值
 2）该变量没有包含在具有其他变量的不变式中

有序性是指对于单线程的执行代码，执行是按顺序依次进行的。但在多线程环境中，则可能出现乱序现象，因为在编译过程会出现“指令重排”，重排后的指令与原指令的顺序未必一致。因此，前半句指的是线程内保证串行语义执行，后半句则指指“令重排现”象和“工作内存与主内存同步延迟”现象。

### 指令重排序

重排序分为编译重排序和运行重排序两种。下面主要记录编译重排序！

**编译期重排：** 编译源代码时，编译器依据对上下文的分析，对指令进行重排序，以之更适合于CPU的并行执行。

**运行期重排：** CPU在执行过程中，动态分析依赖部件的效能，对指令做重排序优化




#### 什么是指令重排序

JVM为了尽可能的使CPU得到最大的利用率，Java虚拟机在不影响单线程程序执行结果的前提下，尽可能的提高并行度，所以JVM会按照自己的一些规则将程序编写的顺序打乱，比如：写在后面的代码在时间顺序上可能先执行，写在前面的代码在时间顺序上可能会后执行。

举例说明：

double r = 2.1; //(1) 
double pi = 3.14;//(2) 
double area = pi*r*r;//(3)
1
2
3
在我们程序中编写了如下代码，代码中定义的执行顺序为(1)—>(2)—>(3)，在单线程环境中顺序(1)—>(2)—>(3)和顺序(2)—>(1)—>(3)对执行结果并无影响。(1)和（2）中并不存在着 **数据依赖关系。**所以JVM可能会对(1)、（2）两步打乱顺序执行来优化程序效率。

所以，编译时指令重排序可以理解为JVM为了提高程序效率而可能会将不存在数据依赖关系的代码进行执行顺序的调整的过程。

#### 什么情况可能会造成指令重排序呢

1、一个不是原子的操作，可能会给JVM留下重排序的可能。

2、不存在数据依赖关系的代码语句可能会给JVM留下重排序的可能。

#### 指令重排序带来的影响

指令重排序在单个线程中不会引发问题，但是到了多线程中由于指令重排序的原因可能就会引发一系列的异常。 在Java内存模型（JMM）中有这么一句话很好的描述了重排序的影响：如果在本线程内观察，所有操作都是有序的，如果在一个线程中观察另一个线程，所有操作都是无序的。




### volatile底层实现

volatile是如何来保证可见性的呢？让我们在X86处理器下通过工具获取JIT编译器生成的汇编指令来查看对volatile进行写操作时，CPU会做什么事情呢？

当有volatile变量修饰时会出现汇编指令lock addl $0×0,(%esp),Lock前缀的指令在多核处理器下会引发了两件事情

1）将当前处理器缓存行的数据写回到系统内存。
2）这个写回内存的操作会使在其他CPU里缓存了该内存地址的数据无效。

为了提高处理速度，处理器不直接和内存进行通信，而是先将系统内存的数据读到内部缓存（L1，L2或其他）后再进行操作，但操作完不知道何时会写到内存。如果对声明了volatile的变量进行写操作，JVM就会向处理器发送一条Lock前缀的指令，将这个变量所在缓存行的数据写回到系统内存。但是，就算写回到内存，如果其他处理器缓存的值还是旧的，再执行计算操作就会有问题。所以，在多处理器下，为了保证各个处理器的缓存是一致的，就会实现缓存一致性协议，每个处理器通过嗅探在总线上传播的数据来检查自己缓存的值是不是过期了，当处理器发现自己缓存行对应的内存地址被修改，就会将当前处理器的缓存行设置成无效状态，当处理器对这个数据进行修改操作的时候，会重新从系统内存中把数据读到处理器缓存里。


### volatile的优缺点

优点： volatile是轻量级同步机制。在访问volatile变量时不会执行加锁操作，因此也就不会使执行线程阻塞，是一种比synchronized关键字更轻量级的同步机制。
缺点：volatile只能保证变量的可见性，无法保证原子性。除此之外，由于volatile屏蔽掉了VM中必要的代码优化，所以在效率上会稍微低点。这是两个缺点。volatile禁止了JVM底层的指令重排序优化，造成了一定的性能损耗，但是在多线程环境中提高了安全性。


### 案例:

```java
public class SingleTon {

	private static SingleTon singleTon;

	private SingleTon() {}

	public SingleTon getInstance() {

		if (singleTon == null) {
			synchronized (SingleTon.class) {
				if (singleTon == null) {
					//非原子操作
					singleTon = new SingleTon();
				}
			}
		}
		return singleTon;
	}
}

```

上面是一个双重检查的单例模式，由于使用了双重检查保证了整个上下文环境中只有一个 SingleTon对象，但是在多线程环境中，由于 singleTon = new SingleTon();不是一个原子操作，所以经过JVM的指令重排序以后仍然会引发问题。

singleTon = new SingleTon();语句分为三步：

(1)、在堆内存开辟一块空间

(2)、SingleTon对象初始化

(3)、栈中的 singleTon指向刚刚分配的内存地址

在上面三步中（2）依赖于（1），但是（3）不依赖于（2），所以JVM就可以将这三个步骤进行重排序。假如经过JVM一番重排序后，上面的顺序变成了（1）—>（3）—>（2）。此时有两个线程，线程A和线程B需要获取该单例对象， A线程抢到锁执行同步块中的语句，A线程正在执行（1）—>（3）—>（2）中的（3），此时B线程开始执行了，B线程在锁外面开始做第一次判断 if (singleTon == null)，判断结果为false，然后直接返回singleTon进行使用，但是这时候singleTon还没有初始化，导致出错。

解决办法：
如果使用volatile关键字修饰singleTon变量，禁止JVM进行重排序，使得singleTon在读、写操作前后都会插入内存屏障，避免重排序。

总结:

1.当使用了volatile关键字修饰共享变量以后。每一个线程对共享变量做的更改操作都会被重新刷写到主存中，并且当主存中共享变量的值改变以后，其他线程中的共享变量副本就失效了，需重新从主存中读取值。
2.用volatile关键字的变量的值只要一经改变就会自动刷写到主存中，而不会等待改变该值的线程执行完毕再刷写。
3.当要访问的变量已在synchronized代码块中，或者为常量时，没必要使用volatile；



### 不保证原子性的例子

public class Test {
    public static volatile int data = 0;

    public static void main(String[] args) throws InterruptedException {
        Thread thread1 = new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                Test.data++;
                System.out.println(data);
            }
        });
        Thread thread2 = new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                Test.data++;
                System.out.println(data);
            }
        });
        thread1.start();
        thread2.start();
        thread1.join();
        thread2.join();
        System.out.println("最终的data为：" + Test.data);
    }
}
...
9
10
11
7
12
13
14
15
16
17
18
19
20
最终的data为：20


多线程同时工作去修改一个被volatile关键字修饰的共享变量的时候，比如两个线程对同一个变量volatile int i;进行i++操作，可能会导致运行结果跟预期不一致。这是因为volatile只能保证可见性和有序性，而不能保证原子性。

### 为什么不能保证原子性

首先看一下上面这张图，分析是这样子的：

![Java内存模型](/../Volatitle关键字/20200715115622174-1669457548712.png)

1、每个线程都有自己的一块工作内存，将主存里的数据缓存到自己的工作内存中。
此时，Threa1跟Thread2都通过read+load将 data = 0 缓存到自己的工作内存中去了。
2、cpu切换到Thread1时，Thread1就会将data = 0 use 进cpu里面计算data++的操作，但是没来得及将计算结果data = 1, assign回Thread1的工作内存中。cpu此时切换到了Thread2，然后在Thread2线程也做了同样的操作（将data = 0 use进cpu并执行data++），继续assign回Thread2的工作内存，并store+write将data = 1写回主存。
因为data是用volatile修饰的，根据缓存一致性协议，其他的线程（这里指的是Thread1）就会立即知道自己工作内存中的数据（data = 0）已经失效了。然而，并没有用！因为Thread1之前已经将data = 0 use 进cpu进行计算去了，cpu切换回Thread1时，Thread1将之前计算好的data = 1 assign 到自己的工作内存中，并store+write写回主存。通过以上的执行顺序，两个线程分别对data做了一次data++操作之后，得到的data = 1 而不是我们预期中的data = 2。
3、总结：多线程同时修改一个被volatile修饰的共享变量时，不能保证原子性，只能保证可见性和顺序性。

### 如何保证原子性

就是用synchronized…只有加了锁，让别的线程连读的机会都没有，才能够安安心心的搞完 read-load-use-assign-store-write全套而不被中途打扰。

```java
public class Test {
    public static volatile int data = 0;
public static void main(String[] args) throws InterruptedException {
    Thread thread1 = new Thread(() -> {
        for (int i = 0; i < 10; i++) {
            synchronized (Test.class) {
                Test.data++;
                System.out.println(data);
            }
        }
    });
    Thread thread2 = new Thread(() -> {
        for (int i = 0; i < 10; i++) {
            synchronized (Test.class) {
                Test.data++;
                System.out.println(data);
            }
        }
    });
    thread1.start();
    thread2.start();
    thread1.join();
    thread2.join();
    System.out.println("最终的data为：" + Test.data);
}
}
```

原子类的原子性是通过 volatile +cas 实现的