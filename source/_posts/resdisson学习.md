---
title: resdisson学习
typora-root-url: resdisson学习
abbrlink: 4eb3381c
date: 2022-11-26 15:18:08
keywords: 'resdisson'
tags: resdisson
categories: resdisson
photos:
description: resdisson学习
---

resdisson学习

<!--more-->

------



## Redisson

### redisson分布式锁

分布式锁实现的三个核心要素:加锁,解锁,锁超时

Redisson分布式锁产生的原因

一开始redis作为分布式锁用的是setnx(redis分布式锁)，再这基础上设置个定时过期时间

有什么问题

\1. 首先是原子性问题，setnx+过期时间这两个操作必须是原子性的，所以这可以用lua脚本解决

2.释放锁的时机该如何定？

不管我们定多少过期时间，都不能保证，在这段时间内锁住的代码执行完成了，所以这个时间定多少都不好；

如果不定时间，当执行完成后释放锁，问题就是如果执行到一半机器宕机，那这把锁就永远放不掉了

#### 分布式锁产生死锁怎么解决?

使用看门狗机制,然后给锁续期,设置一个超时时间超过这个时间就给锁释放掉

#### Redisson概念

1. 对它对setnx进行了精简的封装，使用简单，甚至不用主动设置过期时间
2. 设计了watch 	dog看门狗，每隔10秒会检查一下是否还持有锁，若持有锁，就给他更新过期时间30秒；这样可以让他在没有释放锁之前一直持有锁，哪怕宕机了，也能自动释放锁
3. 而不能获得锁的客户端则是不断循环尝试加锁
4. 通过记录锁的客户端id，可以把它设计成可重入锁

![img](lu152441l02jn_tmp_c71f2472bdfb0327.jpg) 

#### 底层有五种机制一个缺点

- 加锁机制

根据hash节点选择一台机器(只选择一台机器)这点很关键！紧接着，就会发送一段lua脚本到redis上

业务逻辑，可以通过封装在lua脚本中发送给redis，保证这段复杂业务逻辑执行的原子性。

为啥要用lua脚本呢？

 这个不用多说，主要是如果你的业务逻辑复杂的话，通过封装在lua脚本中发送给redis，而且redis是单线程的，这样就保证这段复杂业务逻辑执行的原子性。

- 锁互斥机制

 如果这个时候客户端B来尝试加锁，执行了同样的一段lua脚本。第一个if判断会执行“exists myLock”，发现myLock这个锁key已经存在。接着第二个if判断，判断myLock锁key的hash数据结构中，是否包含客户端B的ID，但明显没有，那么客户端B会获取到pttl myLock返回的一个数字，代表myLock这个锁key的剩余生存时间。此时客户端B会进入一个while循环，不听的尝试加锁。

- 看门狗自动延期机制

看门狗，他是一个后台线程，会每隔10秒检查一下，如果客户端1还持有锁key，那么就会不断的延长锁key的生存时间。

- 可重入锁机制

![img](lu152441l02jn_tmp_bc55b2785f9c2707.jpg) 

![img](lu152441l02jn_tmp_4ef61d3c00dd6b97.jpg) 

可重入锁的机制，它最大的优点就是相同线程不需要在等待锁，而是可以直接进行相应操作。

- 释放锁机制

缺点是:使用主从redis集群主节点宕机,从变成主,别的客户端来了直接在新的主节点上完成加锁,出现两个以上客户端对同一个分布式锁完成加锁,不能保证数据的原子性,产生大量脏数据, 在redis master实例宕机的时候，可能导致多个客户端同时完成加锁

- 缺点:

如果发送redis master宕机,主备切换，redis slave变为了redis master.

这就会导致客户端B来尝试加锁的时候，在新的redis master上完成了加锁，而客户端A也以为自己成功加了锁，此时就会导致多个客户端对一个分布式锁完成了加锁。这时就会导致各种脏数据的产生。

 所以这个就是redis cluster，或者是redis master-slave架构的主从异步复制导致

在redis master实例宕机的时候，可能导致多个客户端同时完成加锁。

应用场景: 抢购, 抢票等高并发的场景

redisson 信号量 项目中的应用，有什么优势



#### 基于set命令的分布式锁

1.加锁:使用setnx经行加锁,当该指令返回1 时,说明成功获取锁

2.解锁: 当得到锁的线程执行完任务之后,使用del命令释放锁,以便其他线程可以继续setnx命令来获取锁

(1)存在的问题: 假设线程获取了锁之后,在执行任务的过程中挂掉,来不及执行del命令释放锁,那么竞争该锁的线程都会执行布隆,产生死锁的情况

(2) 解决方案: 设置锁超时时间

3.设置超时时间:setnx 必须设置一个超时时间,以保证即使没有显示的释放,也要在一定时间后自动释放,可以使用expire命令设置锁超时时间

大批量动作需要执行使用分布式锁(自旋)

单个操作使用信号量

死锁:服务器宕机  发生异常

​	解决:在try{}finally{}中释放锁

锁过期:三十秒的默认过期时间 时间到了还没执行完 就释放锁

​	加守护线程

#### 分布式锁和分布式事务区别:  

锁问题的关键在于进程操作的互斥关系，例如多个进程同时修改账户的余额，如果没有互斥关系则会导致该账户的余额不正确。

而事务问题的关键则在于事务涉及的一系列操作需要满足ACID特性，例如要满足原子性操作则需要这些操作要么都执行，要么都不执行。

cpu飘高  导致  内存泄漏



### redisssonReadLock:

   Redis中针对此种情况，引入了红锁的概念。红锁采用主节点过半机制，即获取锁或者释放锁成功的标志为：在过半的节点上操作成功。

原理

​        在Redis的分布式环境中，我们假设有N个Redis master。这些节点完全互相独立，不存在主从复制或者其他集群协调机制。之前我们已经描述了在Redis单实例下怎么安全地获取和释放锁。我们确保将在每（N）个实例上使用此方法获取和释放锁。在这个样例中，我们假设有5个Redis master节点，这是一个比较合理的设置，所以我们需要在5台机器上面或者5台虚拟机上面运行这些实例，这样保证他们不会同时都宕掉。

```java
public class RedissonRedLockDemo {

   public static void main(String[] args) {

       RedissonClient redissonClient = RedissonClientUtil.getClient("");

       RLock rLock1 = redissonClient.getLock("lock1");

       RLock rLock2 = redissonClient.getLock("lock2");

       RLock rLock3 = redissonClient.getLock("lock3");

       RedissonRedLock redLock = new RedissonRedLock(rLock1, rLock2, rLock3);

       redLock.lock();

       redLock.unlock();

       int result1 = CRC16.crc16("lock1".getBytes()) % 16384;

       int result2 = CRC16.crc16("lock2".getBytes()) % 16384;

       int result3 = CRC16.crc16("lock3".getBytes()) % 16384;

       System.out.println("========测试一=========");

       System.out.println(result1);

       System.out.println(result2);

       System.out.println(result3);

       int result11 = CRC16.crc16("lockone".getBytes()) % 16384;

       int result21 = CRC16.crc16("locktwo".getBytes()) % 16384;

       int result31 = CRC16.crc16("lockthree".getBytes()) % 16384;

       System.out.println("========测试二=========");

       System.out.println(result11);

       System.out.println(result21);

       System.out.println(result31);

       System.out.println("redis cluster 三个节点，平均 slot:"+16384/3);

   }

}
```

RedissonRedLock 不愧是基于 RedissonMultiLock 做的简单扩展，确实连使用都是基本一致的；只需要配置好 N 个锁，一般数量就是对应集群中主节点的数量，然后创建一个 RedissonRedLock 对象，接着就是调用获取锁和释放锁的方法即可。

使用 RedissonRedLock 时需要注意 key 的使用

那下面的那些计算slot是怎么回事？

在 RedLock 算法中提到的是，获取锁其实就是在所有 Redis 实例节点使用同一个 key 进行加锁操作。

但在 Redisson 中，执行lua脚本前是需要根据 Key 来定位 slot 的，然后 slot 能对应一个 Redis 节点。那么，如果我们在使用 RedissonRedLock 时，如果所有 RLock 都指定同一个key，都等同于当前客户端在重复获取同一把锁，那么最终就达不到 RedLock 算法的效果了。

### redisson信号量

#### Semaphore概念

Semaphore也叫信号量，在JDK1.5被引入，可以用来控制同时访问特定资源的线程数量，通过协调各个线程，以保证合理的使用资源。Semaphore内部主要通过AQS（AbstractQueuedSynchronizer）实现线程的管理。Semaphore有两个构造函数，参数permits表示许可数，它最后传递给了AQS的state值。线程在运行时首先获取许可，如果成功，许可数就减1，线程运行，当线程运行结束就释放许可，许可数就加1。如果许可数为0，则获取失败，线程位于AQS的等待队列中，它会被其它释放许可的线程唤醒。在创建Semaphore对象的时候还可以指定它的公平性。一般常用非公平的信号量，非公平信号量是指在获取许可时先尝试获取许可，而不必关心是否已有需要获取许可的线程位于等待队列中，如果获取失败，才会入列。而公平的信号量在获取许可时首先要查看等待队列中是否已有线程，如果有则入列。

Semaphore可以用来做流量分流，特别是对公共资源有限的场景，比如数据库连接。假设有这个的需求，读取几万个文件的数据到数据库中，由于文件读取是IO密集型任务，可以启动几十个线程并发读取，但是数据库连接数只有10个，这时就必须控制最多只有10个线程能够拿到数据库连接进行操作。这个时候，就可以使用Semaphore做流量控制。

单个信号量的Semaphore对象可以实现互斥锁的功能，这时这个信号量就类似一个锁，并且可以是由一个线程获得了“锁”，再由另一个线程释放“锁”，这可应用于死锁恢复的一些场合（锁只能被本线程释放，不能被其他线程释放）

#### 信号量常用接口

提供了[异步（Async）](https://link.juejin.cn/?target=http%3A%2F%2Fstatic.javadoc.io%2Forg.redisson%2Fredisson%2F3.10.0%2Forg%2Fredisson%2Fapi%2FRSemaphoreAsync.html)、[反射式（Reactive）](https://link.juejin.cn/?target=http%3A%2F%2Fstatic.javadoc.io%2Forg.redisson%2Fredisson%2F3.10.0%2Forg%2Fredisson%2Fapi%2FRSemaphoreReactive.html)和[RxJava2标准](https://link.juejin.cn/?target=http%3A%2F%2Fstatic.javadoc.io%2Forg.redisson%2Fredisson%2F3.10.0%2Forg%2Fredisson%2Fapi%2FRSemaphoreRx.html)的接口

```java
Config config=new Config();
config.useSingleServer().setAddress("redis://192.168.xxx.xxx:6379").setPassword("xxx").setDatabase(0);;
RedissonClient redissonClient= Redisson.create(config);
RSemaphore semaphore_text = redissonClient.getSemaphore("semaphore_text");

//获取到一个信号量去执行任务 信号量-1
semaphore_text.acquire();

//异步获取到30个信号量去执行任务 信号量-30
semaphore_text.acquireAsync(30);

//有返回值的信号量扣减参数是几就扣减几个信号量
boolean b = semaphore_text.tryAcquire(2);

//有返回值的信号量异步扣减参数是几就扣减几个信号量
semaphore_text.tryAcquireAsync(2);

//只有在给定的等待时间内所有许可都可用且当前线程未被中断时，才获取给定的许可数。(没有第一个参数就只获取一个许可) 扣减信号量
semaphore_text.tryAcquire(2,23, TimeUnit.SECONDS);

//只有在给定的等候时间内所有许可证都可用时，才异步获得给定数量的许可证。(没有第一个参数就只获取一个许可)扣减信号量
semaphore_text.tryAcquireAsync(2,23, TimeUnit.SECONDS);

//释放给定数量的许可，并将它们返回给信号量,信号量加10
semaphore_text.release(10);

//释放一个信号量 信号量加一
semaphore_text.release();

//异步释放一个信号量 信号量加一
semaphore_text.releaseAsync();

//把所有的信号量获取掉 信号量置0
semaphore_text.drainPermits();

```



### Resisson桶示例

**作用：**

桶存储单个对象，提供了原子替换功能，可在高并发场景下进行更新操作

#### RBucket(桶)相关接口

```java
public interface RBucket<V> extends RExpirable, RBucketAsync<V> {
void set(V var1);                                  //设置桶存储的对象
void set(V var1, long var2, TimeUnit var4);        //设置桶存储的对象，设置操作的超时时间var2
 
boolean trySet(V var1);                            //尝试设置桶的新值
boolean trySet(V var1, long var2, TimeUnit var4);  //尝试设置桶的新值，设置超时时间var2
 
boolean compareAndSet(V var1, V var2);             //原子替换桶的新值为var2
 
long size();                                       //桶存储对象的大小
 
V get();                                           //返回桶存储的对象
V getAndDelete();                                  //返回并删除桶存储的对象
 
V getAndSet(V var1);                               //返回桶的旧值，设置新值
V getAndSet(V var1, long var2, TimeUnit var4);     //返回桶的旧值，设置新值，设置操作的超时时间var2
}
```



```java
测试方法1:
public static void main(String[] args){

        //配置redis连接 redisson 注意:此时redis 必须要设置密码 没有密码 会报密码错误
        Config config=new Config();
        config.useSingleServer().setAddress("redis://192.168.xxx.xxx:6379").setPassword("xxx").setDatabase(0);;
        RedissonClient client= Redisson.create(config);

        //redisson闭锁 CountDownLatch 允许一个或多个线程一直等待，直到其他线程执行完后再执行
        RCountDownLatch countDownLatch=client.getCountDownLatch("countDownLatch");

        //添加记数器 计数器
        countDownLatch.trySetCount(20);

        //获取桶
        RBucket<String> bucket=client.getBucket("bucket8");

        //给桶对象赋值
        bucket.set("瓜田李下 "+1);
        //获取同对象的值
        String oldValue=bucket.get();
        System.out.println("更新之前的桶对象是:"+oldValue);
        //创建线程
        ExecutorService executorService= Executors.newFixedThreadPool(10);
        for (int i=0;i<20;i++){
            //启动线程
            executorService.submit(()->{
                //线程中使用cas达到线程安全的目的,获取内存中的值和oldValue的值进行比较相同就更新值为 "瓜田李下 "+2
                if (bucket.compareAndSet(oldValue,"瓜田李下 "+2)){
                    System.out.println("线程"+Thread.currentThread().getId()+"更新了bucket的值");
                }
                //计数减一
                countDownLatch.countDown();
            });
        }

        try {
            //计数不是零就会一直等待
            countDownLatch.await();
        }catch (Exception e){
            e.printStackTrace();
        }

        //获取当前桶中的计数
        long count = countDownLatch.getCount();

        System.out.println("计数目前值是:"+count);
        System.out.println("更新后的桶对象为："+bucket.get());
    	//说明：有20个线程更新桶对象，只有一个执行了更新操作
    }

简单的测试方法:
 @Test
    public void zou(){
        Config config=new Config();
        config.useSingleServer().setAddress("redis://192.168.xxx.xxx:6379").setPassword("xxx").setDatabase(0);;
        RedissonClient redissonClient= Redisson.create(config);
        //获得锁
        RCountDownLatch door = redissonClient.getCountDownLatch("door");
        //添加记数器
        door.trySetCount(5);
        int j=0;
        for (int i = 0; i < 5; i++) {
            door.countDown();
            int k=++j;
            System.out.println("走了:"+ k);
        }
        //等待
        try {
            door.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("走完了....");
    }
```

## 参考文章:

CSDN博主「o_瓜田李下_o」的原创文章：https://blog.csdn.net/weixin_43931625/article/details/103250648