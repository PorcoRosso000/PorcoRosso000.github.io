---
title: CAS
typora-root-url: CAS
date: 2022-11-26 17:01:46
tags:
permalink:
---



### CAS

乐观锁：乐观锁在操作数据时非常乐观，认为别人不会同时修改数据。因此乐观锁不会上锁，只是在执行更新的时候判断一下在此期间别人是否修改了数据：如果别人修改了数据则放弃操作，否则执行操作。

乐观锁的实现方式有两种：CAS机制和版本号机制

CAS是乐观锁的一种实现，CAS全称是比较和替换，CAS的操作主要由以下几个步骤组成：

​         1.先查询原始值

 2.操作时比较原始值是否修改

3.如果修改，则操作失败，禁止更新操作，如果没有发生修改，则更新为新值

上述三个步骤是一个原子性操作，不可以被拆分执行。

#### CAS的优势

CAS是一种无锁操作，不需要加锁，避免了线程切换的开销。

#### CAS的缺点

CAS虽然在低并发量的情况下可以减少系统的开销，但是CAS也有一些问题：

- CPU开销过大问题 	 	
- ABA问题 	 	
- 只能针对一个共享变量 	 	

#### aba问题 常见的一些解决办法:

 使用版本号(判断版本号一致值相同再经行设置新值操作)

 使用定长数组，这样就可以提前分配好内存，就不涉及内存分配，避免aba出现。（这是一个非常巧妙的思路 很多项目都用到了这招）

保证了原子性:CAS是由CPU支持的原子操作，其原子性是在硬件层面进行保证的。

#### 版本号机制

版本号机制也可以用来实现乐观锁。版本号机制的主要思想是在数据中增加一个字段version，表示该数据的版本号，每当数据被修改时，同时读取版本号version的值，若刚才读取到的version值为当前数据库中的version值相等时才更新，则版本号加1；否则重试更新操作，直到更新成功。当某个线程查询数据时，将该数据的版本号一起查出来；当该线程更新数据时，判断当前版本号与之前读取的版本号是否一致，如果一致才进行操作。

#### 乐观锁加锁吗？

（1）乐观锁本身是不加锁的，只是在更新数据的时候会判断一下数据是否被其他线程已经更新过了

（2）有时乐观锁可能与加锁操作两者同时使用

 假设有两个线程——线程1和线程2，两个线程按照顺序进行以下操作

 (1)线程1读取内存中数据为A；

 (2)线程2将该数据修改为B；

 (3)线程2将该数据修改为A；

 (4)线程1对数据进行CAS操作

 在第(4)步中，由于内存中数据仍然为A，因此CAS操作成功，但实际上该数据已经被线程2修改过了。这就是ABA问题。

 在AtomicInteger的例子中，ABA似乎没有什么危害。但是在某些场景下，ABA却会带来隐患，例如栈顶问题：一个栈的栈顶经过两次(或多次)变化又恢复了原值，但是栈可能已发生了变化。

 对于ABA问题，比较有效的方案是引入版本号，内存中的值每发生一次变化，版本号都+1；在进行CAS操作时，不仅比较内存中的值，也会比较版本号，只有当二者都没有变化时，CAS才能执行成功。

   CAS
 什么是CAS？CAS的本质是把compare-and-swap封装为一个原子操作。

 是一条CPU并发原语，用于判断内存中某个位置的值是否为预期值，如果是则更改为新的值，这个过程是原子的。

#### java中哪些类使用了cas

CAS 在 jdk 中主要应用在 J.U.C 相关包下的 Atomic 相关类中，主要有 AtomicInteger、AtomicLong、AtomicBoolean、AtomicDouble、AtomicReference、AtomicReferenceFieldUpdater 等。

以 AtomicInteger 类下的 getAndUpdate 为例 ：

```java
/**
  * Atomically updates the current value with the results of
  * applying the given function, returning the previous value. The
  * function should be side-effect-free, since it may be re-applied
  * when attempted updates fail due to contention among threads.
  *
  * @param updateFunction a side-effect-free function
  * @return the previous value
  * @since 1.8
  */
public final int getAndUpdate(IntUnaryOperator updateFunction) {
    int prev, next;
    do {
        prev = get();
        next = updateFunction.applyAsInt(prev);
    } while (!compareAndSet(prev, next));
    return prev;
}

/**
  * Gets the current value.
  *
  * @return the current value
  */
public final int get() {
    return value;
}
```

第一步：首先通过 get () 方法获取到当前对象的 value。

第二步：updateFunction 为函数引用，不过他的操作也是为了赋值，并返回预期结果。

第三步：进行 CAS 操作，传入第一步 get () 获取到的值和目前对象中的值进行比较，如果一样就修改为 next, 不一样就继续循环，直到 CAS 操作返回 true 为止。

第四步：返回当前获取到的值 prev。