---
title: ThreadLocal学习笔记
typora-root-url: ThreadLocal学习笔记
tags: ThreadLocal
categories: ThreadLocal
abbrlink: cb80add6
date: 2023-11-04 11:07:37
permalink:
---

## 概念:

ThreadLocal叫做本地线程变量，意思是说，ThreadLocal中填充的的是当前线程的变量，该变量对其他线程而言是封闭且隔离的，线程内新建了一个“局部变量”，之所以加引号是因为，这个局部变量实际上可以是本线程内的全局变量。

## 特点:

线程并发:在多线程并发的场景下使用

传递数据:可以通过threadlocal在同一个线程，不同组件传递公共变量

线程隔离:每个线程变量都是独立的，不会互相影响

## 使用方法:

```java
ThreadLocal<String> threadLocalOld = new ThreadLocal<String>(){
  @Override
  protected String initialValue() {
    return new String("dsadsa");
  }
};
Thread thread = new Thread(()->{
  String s = threadLocalOld.get();//每个线程调度get函数获取本线程的副本。
  // do sth
  threadLocalOld.set("dsad");// set函数set的值，只会设置本线程的值，不会对其他线程有任何影响。
});
Thread thread1 = new Thread(()->{
  String s = new String("dsadsa");//ThreadLocal效果定义local variable类似。
  // do sth
});
```

## ThreadLocal的作用即是：

 在每个线程中存储一个变量的副本，这样在每个线程对该变量进行使用的使用，使用的即是该线程的局部变量，从而保证了线程的安全性以及高效性。

## ThreadLocal的使用场景：

> 在并发编程中时常有这样一种需求：每条线程都需要存取一个同名变量，但每条线程中该变量的值均不相同。

## ThreadLocal的实现原理：

 ThreadLocal的使用主要牵涉到三个方法：set(T t)，get(T t)，remove()，以下是三个方法的源码：

```java
    public T get() {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null) {
            ThreadLocalMap.Entry e = map.getEntry(this);
            if (e != null) {
                @SuppressWarnings("unchecked")
                T result = (T)e.value;
                return result;
            }
        }
        return setInitialValue();
    }

    private T setInitialValue() {
        T value = initialValue();
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null)
            map.set(this, value);
        else
            createMap(t, value);
        return value;
    }

    public void set(T value) {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null)
            map.set(this, value);
        else
            createMap(t, value);
    }

    public void remove() {
         ThreadLocalMap m = getMap(Thread.currentThread());
         if (m != null)
             m.remove(this);
     }

    ThreadLocalMap getMap(Thread t) {
        return t.threadLocals;
    }
```



ThreadLocal类中包含了以上的三个主要的操作方法，其中定义了ThreadLocalMap这一内部类，顾名思义，这是一个类似HashMap的表结构，内部存储的确实也是(key,value)键值对，但内部只有数组，而没有链表，key是ThreadLocal对象，value是我们要操作的数。

虽说ThreadLocalMap定义在ThreadLocal类中，但是其维护实际是在Thread类中实现的，Thread类中有着ThreadLocal.ThreadLocalMap这样的属性，在调用set和get方法的时候，会首先获取该线程内的ThreadLocal.ThreadLocalMap对象，然后将ThreadLocal对象作为key存储进去（自己调用方法，然后把自己作为key存进去，interesting ：） ），之所以要把ThreadLocal.ThreadLocalMap.Entry定义为数组，是因为每个线程中可能会创建多个ThreadLocal对象，所以用数组进行存储。

这样每个线程在使用目标数的时候，就可以从每个线程的Map中调出该value，因为每个线程中的Map是不同的Map，所以无关线程安全性的讨论。

## ThreadLocal内存泄露：

ThreadLocal.ThreadLocalMap.Entry中的key是弱引用的，也即是当某个ThreadLocal对象不存在强引用时，就会被GC回收，但是value是基于强引用的，所以当key被回收，但是value还存在其他强引用时，就会出现内存的泄露情况，在最新的ThreadLocal中已经做出了修改，即在调用set、get、remove方法时，会清除key为null的Entry，但是如果不调用这些方法，仍然还是会出现内存泄漏 ：），所以要养成用完ThreadLocal对象之后及时remove的习惯。

### 为什么要将key设置为弱引用?

假设我们将threadlocal的key设置为强引用。如果引用threadlocal的对象被回收了。那么threadlocalMap里面还有threadlocal的强引用。如果不手动删除，threadlocal不会被回收，发生内存泄漏。而key为弱引用的话，引用threadlocal的对象被回收了。即使我们没有手动删除，threadlocal也会自动被回收。

## ThreadLocal源码

每个Thread类维护了它自己的ThreadLocalMap的对象，并且Thread类只支持维护一个ThreadLocalMap对象，ThreadLocal用于对ThreadLocalMap的操作。**对于其hash值，使用的是黄金分割数逐级增加，提高了hash碰撞的次数**。ThreadLocalMap扩容的阀值是数组的长度乘以2/3。
可以创建自己ThreadLocal，不会和框架的ThreadLocal冲突，因为每次创建的threadLocalHashCode都在变化。
因为只服务于一个线程，所以不会有同步的问题。

threadLocalHashCode 每次增加 0x61c88647，这个数是非常符合**斐波那契**散列规则，用它来实现的hash表，碰撞冲突比其他的散列规则要小。

### ThreadLocalMap的Entry类

```java
//这是一个hash表中单个元素，当gc时，ThreadLocal会被回收。
static class Entry extends WeakReference<ThreadLocal<?>> {
    /** The value associated with this ThreadLocal. */
    Object value;
    Entry(ThreadLocal<?> k, Object v) {
        super(k);
        value = v;
    }
}
```
ThreadLocalMap类


```java
static class ThreadLocalMap {
    /**
     * The initial capacity -- MUST be a power of two.
     */
    private static final int INITIAL_CAPACITY = 16;
    /**
     * The table, resized as necessary.
     * table.length MUST always be a power of two.
     */
    private Entry[] table;
    /**
     * The number of entries in the table.
     */
    private int size = 0;
    /**
     * The next size value at which to resize.
     */
    private int threshold; // Default to 0
}
```

### 新增数据

若有ThreadLocalMap对象，则设置值。否则，新建立一个ThreadLocalMap对象，并存入其中。

```java
public void set(T value) {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        map.set(this, value);
    } else {
        createMap(t, value);
    }
}
```


从Thread里面获取ThreadLocalMap对象。

```java
ThreadLocalMap getMap(Thread t) {
    return t.threadLocals;
}
```

createMap

```java
void createMap(Thread t, T firstValue) {
    t.threadLocals = new ThreadLocalMap(this, firstValue);
}
```

#### 流程：

对ThreadLocalMap进行增加数据时候，使用了set方法，如下。流程是：
1、根据ThreadLocal拿到hash值，取模。
2、取模得到的值去table中拿到对应的Entry对象，若对象为null，跳转步骤3，若对象不为null，跳转步骤3。
3、判断从table中取到的值中对应的ThreadLocal是否等于参数的key。

若等于key，覆盖原先的value值，结束流程。
若等于null，调用replaceStaleEntry，插入或者更新新值，结束流程。
4、若索引i对应的Entry为null，创建Entry对象并指向该下标的数组。
5、调用cleanSomeSlots清空无效数据，若没有可清空的数据且sz大于阀值，则rehash，否则结束流程。



```java
private void set(ThreadLocal<?> key, Object value) {
    // We don't use a fast path as with get() because it is at
    // least as common to use set() to create new entries as
    // it is to replace existing ones, in which case, a fast
    // path would fail more often than not.
    Entry[] tab = table;
    int len = tab.length;
    int i = key.threadLocalHashCode & (len-1);

    for (Entry e = tab[i];
         e != null;
         e = tab[i = nextIndex(i, len)]) {
        ThreadLocal<?> k = e.get();

        if (k == key) {
            e.value = value;
            return;
        }

        if (k == null) {
            replaceStaleEntry(key, value, i);
            return;
        }
    }

    tab[i] = new Entry(key, value);
    int sz = ++size;
    if (!cleanSomeSlots(i, sz) && sz >= threshold)
        rehash();
    }
```
replaceStaleEntry方法

进入此方法的前提：table数组中对应索引上Entry对象的ThreadLocal为null。调用此方法的只有set方法。
作用：根据i，把key和value组成Entry插入ThreadLocalMap中去。
流程：
1、往索引为0的前面找到Entry等于null为止，记录ThreadLocal为null的索引下标。
2、往索引为len的后面找到Entry等于null为止。

若Entry等于key，更新索引为i的value值，把索引为i的引用复制给索引为staleSlot。调用expungeStaleEntry方法清空重复数据，移动有效数据的位置。cleanSomeSlots清空无效数据。结束流程。
若Entry不等于key，若满足Entry为null且slotToExpunge等于staleSlot，更新slotToExpunge为当前索引值。
3、staleSlot索引没有值，放心插入一个新的Entry，由key和value组成。
4、若slotToExpunge不等于staleSlot，调用expungeStaleEntry方法清空重复数据，移动有效数据的位置。cleanSomeSlots清空无效数据。结束流程。

```java
private void replaceStaleEntry(ThreadLocal<?> key, Object value,
                               int staleSlot) {
    Entry[] tab = table;
    int len = tab.length;
    Entry e;
// Back up to check for prior stale entry in current run.
// We clean out whole runs at a time to avoid continual
// incremental rehashing due to garbage collector freeing
// up refs in bunches (i.e., whenever the collector runs).
int slotToExpunge = staleSlot;
for (int i = prevIndex(staleSlot, len);
     (e = tab[i]) != null;
     i = prevIndex(i, len))
    if (e.get() == null)
        slotToExpunge = i;

// Find either the key or trailing null slot of run, whichever
// occurs first
for (int i = nextIndex(staleSlot, len);
     (e = tab[i]) != null;
     i = nextIndex(i, len)) {
    ThreadLocal<?> k = e.get();

    // If we find key, then we need to swap it
    // with the stale entry to maintain hash table order.
    // The newly stale slot, or any other stale slot
    // encountered above it, can then be sent to expungeStaleEntry
    // to remove or rehash all of the other entries in run.
    if (k == key) {
        e.value = value;

        tab[i] = tab[staleSlot];
        tab[staleSlot] = e;
        // Start expunge at preceding stale entry if it exists
        if (slotToExpunge == staleSlot)
            slotToExpunge = i;
        cleanSomeSlots(expungeStaleEntry(slotToExpunge), len);
        return;
    }

    // If we didn't find stale entry on backward scan, the
    // first stale entry seen while scanning for key is the
    // first still present in the run.
    if (k == null && slotToExpunge == staleSlot)
        slotToExpunge = i;
}

// If key not found, put new entry in stale slot
tab[staleSlot].value = null;
tab[staleSlot] = new Entry(key, value);

// If there are any other stale entries in run, expunge them
if (slotToExpunge != staleSlot)
    cleanSomeSlots(expungeStaleEntry(slotToExpunge), len);
    }
```


expungeStaleEntry方法

作用：查询连续的数据在table数组中，清空 无效，重复的值以及调整数据间的位置。

1、把table数组中索引为staleSlot清空，size减一。
2、遍历所有table数组。

若当前table[I]数组为null，结束流程。为什么？因为使用了hash碰撞的开放地址法，按照线性探测再散列的规则，为null，说明没有hash冲突了。
若每条数据的ThreadLocal为null则清空，size减一。
否则，把ThreadLocal对象的hash值取模得到h，检查h是否等一当前遍历的索引，若等于不处理；若不等于，则把table[i]清空，若table[h]不为null，按照线性探测再散列找到新的h，把新值赋给table[h]；若table[h]为null，把新值赋给table[h]。

```java
private int expungeStaleEntry(int staleSlot) {
    Entry[] tab = table;
    int len = tab.length;
tab[staleSlot].value = null;
tab[staleSlot] = null;
size--;

Entry e;
int i;
for (i = nextIndex(staleSlot, len);
     (e = tab[i]) != null;
     i = nextIndex(i, len)) {
    ThreadLocal<?> k = e.get();
    if (k == null) {
        e.value = null;
        tab[i] = null;
        size--;
    } else {
        int h = k.threadLocalHashCode & (len - 1);
        if (h != i) {
            tab[i] = null;

            // Unlike Knuth 6.4 Algorithm R, we must scan until
            // null because multiple entries could have been stale.
            while (tab[h] != null)
                h = nextIndex(h, len);
            tab[h] = e;
        }
    }
}
return i;
}
```

cleanSomeSlots方法
作用：清除table数组中，Entry对象为null或者其Entry对象中ThreadLocal为null的数据。每次循环找log2(n)次，若没有找到就结束执行；找到了就进行数据清空。

```java
private boolean cleanSomeSlots(int i, int n) {
    boolean removed = false;
    Entry[] tab = table;
    int len = tab.length;
    do {
        i = nextIndex(i, len);
        Entry e = tab[i];
        if (e != null && e.get() == null) {
            n = len;
            removed = true;
            i = expungeStaleEntry(i);
        }
    } while ( (n >>>= 1) != 0);
    return removed;
}
```


rehash方法
作用：先调用expungeStaleEntries方法，若有效值还是大于3/4倍threshold，则扩容。



```java
private void rehash() {
    expungeStaleEntries();
    // Use lower threshold for doubling to avoid hysteresis
    if (size >= threshold - threshold / 4)
        resize();
    }
```

resize方法
作用：扩大两倍数组，把原数组的每个Entry重新hash，放入新数组中。对于hahs冲突，则采用线性探测再散列的规则，放入一个为null的索引中。设置新的阀值。



```java
private void resize() {
    Entry[] oldTab = table;
    int oldLen = oldTab.length;
    int newLen = oldLen * 2;
    Entry[] newTab = new Entry[newLen];
    int count = 0;
    for (Entry e : oldTab) {
        if (e != null) {
            ThreadLocal<?> k = e.get();
            if (k == null) {
                e.value = null; // Help the GC
            } else {
                int h = k.threadLocalHashCode & (newLen - 1);
                while (newTab[h] != null)
                    h = nextIndex(h, newLen);
                newTab[h] = e;
                count++;
            }
        }
    }

    setThreshold(newLen);
    size = count;
    table = newTab;
}
```

expungeStaleEntries方法
作用：对每个Entry不为null且ThreadLocal为null的索引，调用expungeStaleEntry方法清空重复数据，移动有效数据的位置。

```java
private void expungeStaleEntries() {
    Entry[] tab = table;
    int len = tab.length;
    for (int j = 0; j < len; j++) {
        Entry e = tab[j];
        if (e != null && e.get() == null)
            expungeStaleEntry(j);
    }
}
```

### 获取数据

根据当前ThreadLocal的实例对象，获取值并返回。若没有，则初始化值。

```java
public T get() {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            @SuppressWarnings("unchecked")
            T result = (T)e.value;
            return result;
        }
    }
    return setInitialValue();
}
```


setInitialValue方法，其中initialValue方法默认返回null，可以继承实现。也可以用withInitial实现，该方法内部创建了一个类。

```java
private T setInitialValue() {
    T value = initialValue();
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        map.set(this, value);
    } else {
        createMap(t, value);
    }
    if (this instanceof TerminatingThreadLocal) {
        TerminatingThreadLocal.register((TerminatingThreadLocal<?>) this);
    }
    return value;
}

public static <S> ThreadLocal<S> withInitial(Supplier<? extends S> supplier) {
    return new SuppliedThreadLocal<>(supplier);
}

static final class SuppliedThreadLocal<T> extends ThreadLocal<T> {
    private final Supplier<? extends T> supplier;
    SuppliedThreadLocal(Supplier<? extends T> supplier) {
        this.supplier = Objects.requireNonNull(supplier);
    }

    @Override
    protected T initialValue() {
        return supplier.get();
    }
}
```

getEntry方法
作用：根据当前线程拿到对应的ThreadLocalMap对象，从当前ThreadLocal对象获取对应的Entry，若Entry不为null且等于当前ThreadLocal对象，则返回；否则说明该索引下的值是其他ThreadLocal的值，所以需要调用getEntryAfterMiss方法，找到真正的值并返回。

```java
private Entry getEntry(ThreadLocal<?> key) {
    int i = key.threadLocalHashCode & (table.length - 1);
    Entry e = table[i];
    if (e != null && e.get() == key)
        return e;
    else
        return getEntryAfterMiss(key, i, e);
}

```

getEntryAfterMiss方法
作用：找到真正等于key的值，并返回Entry的value值。

#### 流程：

1、如果key和k相等，返回e结束流程。
2、如果k为nul，调用expungeStaleEntry清空索引i附近的无效值和移动数据位置。
3、如果k不为null，则数组下一位的值赋值给e，跳转步骤1。



```JAVA

private Entry getEntryAfterMiss(ThreadLocal<?> key, int i, Entry e) {
    Entry[] tab = table;
    int len = tab.length;while (e != null) {
    ThreadLocal<?> k = e.get();
    if (k == key)
        return e;
    if (k == null)
        expungeStaleEntry(i);
    else
        i = nextIndex(i, len);
    e = tab[i];
}
return null;
}
```
### 删除数据

调用ThreadLocal类的remove方法。

```java
public void remove() {
    ThreadLocalMap m = getMap(Thread.currentThread());
    if (m != null) {
        m.remove(this);
    }
}
```


再接着调用ThreadLocalMap方法。

```java
private void remove(ThreadLocal<?> key) {
    Entry[] tab = table;
    int len = tab.length;
    int i = key.threadLocalHashCode & (len-1);
    for (Entry e = tab[i];
         e != null;
         e = tab[i = nextIndex(i, len)]) {
        if (e.get() == key) {
            e.clear();
            //ThreadLocal底层调用的是这个方法来进行删除  查询连续的数据在table数组中，清空 无效，重复的值以及调整数据间的位置
            expungeStaleEntry(i);
            return;
        }
    }
}
```


案例

```java
package vip.wulang.test.threadLocal;

public class TestThreadLocal {
    public static void main(String[] args) {
        ThreadLocal<Integer> tl1 = ThreadLocal.withInitial(() -> 500);
        ThreadLocal<Integer> tl2 = ThreadLocal.withInitial(() -> 500);
        tl1.set(100);
        System.out.println("tl1:" + tl1.get());
        tl1.remove();
        System.out.println("tl1:" + tl1.get());
        System.out.println("tl2:" + tl2.get());
    }
}
```

## 参考文章:

CSDN博主「Autumn Of Coolerwu」的原创文章：https://blog.csdn.net/qq_35542218/article/details/106307148

简书[Bre_eze](https://www.jianshu.com/u/5281c7111324)的文章:https://www.jianshu.com/p/1ff73d2d7520