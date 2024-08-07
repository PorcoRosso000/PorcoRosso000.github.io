---
title: HashMap
typora-root-url: HashMap
abbrlink: 3d614825
date: 2022-11-26 14:22:54
keywords: 'HashMap'
tags: HashMap
categories: HashMap
photos:
description: HashMap
---

HashMap

<!--more-->

------



## HashMap

hashmap怎么保证有序  

LinkedHashMap是插入有序的Map，遍历LinkedHashMap时key-value的顺序与插入顺序相同。

 LinkedHashMap继承自HashMap，实现了Map接口。

 节点类型为Entry，是LinkedHashMap的静态内部类，继承自HashMap.Node。Entry除了继承了Node的next、hash、key、value等属性外，还有Entry类型的before、after，分别指向前一个插入的节点和后一个插入的节点，用于保证插入顺序。

HashMap怎么保证线程安全？

实现Collections 的 synchronizedMap 方法（底层使用了sychronizedMap的方法） 或直接使用 ConcurrentHashMap

### 回顾一下HashMap的底层数据结构

 HashMap底层实现JDK<=1.7数组+链表，JDK>=1.8数组+链表+红黑树；

 HashMap这一个类型底层涉及到3中数据类型，数组、链表、红黑树，其中查询速度最快的是数组，时间复杂度是O(1),链表数据量少的时候还行，数据量过大性能就一般了，它的时间复杂度是O(N)，红黑树在数据量大的时候性能会比链表要好，他的时间复杂度是O(logn),这里在链表和红黑树这里性能对比其实在HashMap的扩容时，已经体现出来了，Hash值产生碰撞后，链表长度>8，数组长度大于64 时会由链表转换为红黑树，而当红黑树的节点<6时，会由红黑树转换为链表，这就是二者的性能临界点。

#### 为什么设置链表长度大于8转红黑树？

如果 hashCode 分布良好，也就是 hash 计算的结果离散好的话，那么红黑树这种形式是很少会被用到的，因为各个值都均匀分布，很少出现链表很长的情况。在理想情况下，链表长度符合泊松分布，各个长度的命中概率依次递减，当长度为 8 的时候，概率仅为 0.00000006  

 链表长度超过 8 就转为红黑树的设计，更多的是为了防止用户自己实现了不好的哈希算法时导致链表过长，从而导致查询效率低，而此时转为红黑树更多的是一种保底策略，用来保证极端情况下查询的效率。  

#### 为什么小于6的时候就转化成链表？

 可以防止链表和树之间频繁的转换  

#### 为什么使用数组?

 速度:读、写，最快的是数组， 数组快是快，需要知道读、写的索引，时间复杂度是O(1),对于一般的插入、删除操作，但是涉及到数组元素的移动，平均时间复杂度这变为O(N),HashMap中数组的下标是通过KEY.hashCode()%数组长度得到的，但是这种方法会造成哈希碰撞，那么就有了链表这个玩意！

#### 为什么使用链表？

 这里就不过多解释了，简单说就是为了解决数据的KEY产生哈希碰撞后将原有的数组下标对应的值直接替换，那么这个时候为了解决这个问题就在产生哈希碰撞后，下标相同的KEY就会被串成链表结构，插是从头插，不是从尾，从头插时间复杂度为O(1),从尾插为O(N),这个链表是单向列表， 链表的新增，删除操作在查找到操作位置后，只需要处理节点间的引用即可，时间复杂度为O(1),但是查找操作则需要遍历链表中所有节点逐一比对，时间复杂度为O(N),这里的查询的时间复杂度为O(N)且遍历所有元素是原因数组变成链表是因为哈希碰撞的hashCode值都是一样的，那么对应的索引也是一样的，所有还要一个KEY取出来对比，所以也就有了遍历这么一说；这样的话链表过长性能会比较低，那么为了解决性能问题，JDK1.8后就引用了红黑树；

#### 为什么使用红黑树？

 这里也不过多解释了，简单说就是为了解决链表过长性能低的问题，红黑树是一种接近于平衡二叉树，但不是绝对平衡，逻辑上是个树形结构，是一个有序的结构，在每个节点上增加一个存储位，表示节点的颜色，可以是Red或者Black，通过对任何一条从根到叶子的路径上各个节点着色方式的限制，红黑树确保没有一条路径会比其他路径长出两倍，而是接近平衡的，支持查找，插入，删除，其平均时间复杂度最坏为O(logn)；这里解释一下(红黑树确保没有任何一条路径会比其他路径长出两倍)![img](lu152441l02jn_tmp_aa78b1aae4f96ff2.png) 
 这里比如13–>17–>25–>27这条链路不会比13–>8–>1、13–>8–>11、13–>8–>1–>6、13–>17–>15、13–>17–>25–>22这些链路的路径长出两倍，因为他会自动平衡，也就是当任何一条链路的路径高出其他链路2倍是，这条链路就会自动平衡，但是如果put比较频繁，且会经常打破平衡的话，那么这条链路就会自动平衡，这时的性能就会很低，低于链表；这里平衡有两种方式，左旋、右旋
 左旋：
 ![img](lu152441l02jn_tmp_b49e48306e0a0a9e.png) 
 以这个为模拟数据，现在我们来添加一个数据来打破平衡(红黑树确保没有任何一条路径会比其他路径长出两倍)，现在最短的链路是50–>60,最长的是50–>40–>45–>47,现在这条最长的刚好是最短的两倍，那么这时要是再来一个49，这里49比50小，比40大，比45大，比47大，那么会挂在50–>40–>45–>47这条链路上，刚挂上去的结构是这样的，

 ![img](lu152441l02jn_tmp_a175be2b7814d863.png) 
 嘿嘿，这个平衡就打破了，那么就会自动平衡，那么这种数据模型位移叫做左旋，左旋后的红黑树结构！
 ![img](lu152441l02jn_tmp_f43f76db76b301d2.png) 
 右旋则刚好相反！！！
 这是一个可视化HashMap操作的工具

##### 红黑 树有6个性质；

1. 每个节点要么是红的要么是黑的
2. 根节点是黑的
3. 每个叶节点（叶节点指树尾端NL指针或NULL节点）都是黑的
4. 如果一个节点是红的，那么他的两个子节点都是黑的
5. 对于任何而言，其到节点树尾端NL指针的每条路径都包含相同数目的黑节点
6. 所有的左节点都<=父节点，所有的右节点都>父节点

### 为什么不使用二叉树？

1.二叉排序树

由于二叉排序树左子树所有节点的值均小于根节点的特点，如果我们添加的元素都比根节点小，会导致左子树线性增长，这样就失去了用树型结构替换链表的初衷，导致查询时间增长。所以这是不用二叉排序树的原因。  

2.平衡二叉树  

①红黑树不追求"完全平衡"，即不像AVL那样要求节点的 |balFact| <= 1，它只要求部分达到平衡，但是提出了为节点增加颜色，红黑是用非严格的平衡来换取增删节点时候旋转次数的降低，任何不平衡都会在三次旋转之内解决，而AVL是严格平衡树，因此在增加或者删除节点的时候，根据不同情况，旋转的次数比红黑树要多。  

② AVL更平衡，结构上更加直观，时间效能针对读取而言更高；维护稍慢，空间开销较大。 ③ 红黑树，读取略逊于AVL，维护强于AVL，空间开销与AVL类似，内容极多时略优于AVL，维护优于AVL。  

### hashMap1.7不安全的原因：

环形链表数据丢失

#### hashmap1.7下的导致的循环链表的原因?

 这个是hashmap扩容时使用的transfer方法

```
/
  Transfers all entries from current table to newTable.
 /
void transfer(Entry[] newTable, boolean rehash) {
  int newCapacity = newTable.length;
  for (Entry<K,V> e : table) {//遍历同桶数组中的每一个桶
    while(null != e) {//顺序遍历某个桶的外挂链表
      Entry<K,V> next = e.next;//引用next
      if (rehash) {
        e.hash = null == e.key ? 0 : hash(e.key);
       }
      int i = indexFor(e.hash, newCapacity);//找到新表的桶位置;原桶数组中的某个桶上的同一链表中的Entry此刻可能被分散到不同的桶中去了，有效的缓解了哈希冲突。
      e.next = newTable[i];//头插法插入新表中
      newTable[i] = e;
      e = next;
     }
   }
}
```

 头插法单线程情况下扩容没有任何问题

 多线程情况下如果使用了头插法,两个线程第一个线程完成了插入 e-->3 next-->2 所以从3开始形成链表后从2-->3 2的next现在是3 但是线程2醒来后他睡之前的e2-->3 next2-->2 这样就有问题了 再进行扩容 3先插入 3 变成newTable[i] 2变成e e.next就是3 把e就是2变成newTable[i] next也就是3 变成e 这个时候 e.next-(指向)->newTable[i]这个元素 也就是3-->newTable[i]的2 这个时候链表循环问题就产生了

### HashMap1.7和1.8头插入与尾插入的原因

头插法是操作速度最快的，找到数组位置就直接找到插入位置了
 jdk8之前hashmap这种插入方法在并发场景下如果多个线程同时扩容会出现循环列表（死链）。
 jdk8开始hashmap链表在节点长度达到8之后会变成红黑树，这样一来在数组上节点长度不断增加时，遍历一次的次数就会少很多很多（否则每次要遍历所有），相比头插法
 而言，尾插法操作额外的遍历消耗已经小很多了，也可以避免之前的循环列表问题。
 （同时如果变成红黑树，也不可能做头插法了）

### 浅析HashMap的put()方法执行流程

 ![img](lu152441l02jn_tmp_9e4559e12065df5a.png) 

 HashMap的数据结构在jdk1.8之前是数组+链表，为了解决数据量过大、链表过长是查询效率会降低的问题变成了数组+链表+红黑树的结构，利用的是红黑树自平衡的特点。

 链表的平均查找时间复杂度是O(n)，红黑树是O(log(n))。

### hashmap的get方法

 1.首先根据 hash 方法获取到 key 的 hash 值(hashcode是怎么来的 他的内存地址是16进制的，转化成10进制你会发现值刚好等于hashcode )
 2.然后通过 hash & (length - 1) 的方式获取到 key 所对应的Node数组下标 ( length对应数组长度 )
 3.首先判断此结点是否为空，是否就是要找的值，是则返回空，否则进入第二个结点。
 4.接着判断第二个结点是否为空，是则返回空，不是则判断此时数据结构是链表还是红黑树
 5.链表结构进行顺序遍历查找操作，每次用 == 符号 和 equals( ) 方法来判断 key 是否相同，满足条件则直接返回该结点。链表遍历完都没有找到则返回空。
 6.红黑树结构执行相应的 getTreeNode( ) 查找操作。

### HashMap中的put方法执行过程大体如下：

 1、判断键值对数组table[i]是否为空（null）或者length=0，或者>阈值 的话就执行resize()方法进行扩容。

 2、不是就根据键值key计算hash值得到插入的数组索引i。

 3、判断table[i]==null，如果是true，直接新建节点进行添加，如果是false，判断table[i]的首个元素是否和key一样，一样就直接覆盖。

 4、判断table[i]是否为treenode，即判断是否是红黑树，如果是红黑树，直接在树中插入键值对。

 5、如果不是treenode，开始遍历链表，判断链表长度是否大于8，数组长度大于64。 如果是就转成红黑树，在树中执行插入操作，如果不是大于8，就在链表中执行插入；在遍历过程中判断key是否存在，存在就直接覆盖对应的value值。

 6、插入成功后，就需要判断实际存在的键值对数量size是否超过了最大容量threshold，如果超过了，执行resize方法进行扩容。

头插法是操作速度最快的，找到数组位置就直接找到插入位置了，但是课程里演示过，jdk8之前hashmap这种插入方法在并发场景下如果多个线程同时扩容会出现循环列表。jdk8开始hashmap链表在节点长度达到8之后会变成红黑树，这样一来在数组后节点长度不断增加时，遍历一次的次数就会少很多很多（否则每次要遍历所有），相比头插法而言，尾插法操作额外的遍历消耗已经小很多了，也可以避免之前的循环列表问题。（同时如果变成红黑树，也不可能做头插法了）

### Hashmap扩容机制

- capacity 	即容量，默认16。
- loadFactor 	加载因子，默认是0.75
- threshold 	阈值。阈值=容量加载因子。默认12。当元素数量超过阈值时便会触发扩容。

 ![img](lu152441l02jn_tmp_968091efce50ef84.jpg) 

#### hashmap为什么选择0.75

 如果负载因子过高，比如1的情况下，虽然空间开销减少了，提高了空间利用率但是时间成本增加了

 如果负载因子过低，例如0.5虽然可以减少时间的成本，但是空间利率用低

#### hashmap什么时候触发扩容？

 一般情况下，当元素数量超过阈值时便会触发扩容。每次扩容的容量都是之前容量的2倍。

 HashMap的容量是有上限的，必须小于1<<30，即1073741824。如果容量超出了这个数，则不再增长，且阈值会被设置为Integer.MAX_VALUE（””，即永远不会超出阈值了）。

JDK1.7 是先扩容,在添加。具体put是否扩容需要两个条件：

 1、 存放新值的时候当前已有元素的个数必须大于等于阈值
 2、 存放新值的时候当前存放数据发生hash碰撞（当前key计算的hash值换算出来的数组下标位置已经存在值）

Java1.8是先添加,在扩容  扩容只需要满足一个条件：

当前存放新值（注意不是替换已有元素位置时）的时候已有元素的个数大于等于阈值（已有元素等于阈值，下一个存放后必然触发扩容机制）

### 研究ConcurrentHashMap

jdk7 中主要采用 `Segment` 分段锁的思想，`Segment` 继承自`ReentrantLock` 类，依次来保证线程安全。  

jdk8 中的 ConcurrentHashMap 数据结构同 jdk8 中的 HashMap 数据结构一样，都是 数组+链表+红黑树。摒弃了 jdk7 中的分段锁设计，使用了 `Node` + `CAS` + `Synchronized` 来保证线程安全。  

 我们都知道HashMap是线程不安全的。Hashtable是线程安全的。看过Hashtable源码的我们都知道Hashtable的线程安全是采用在每个方法来添加了synchronized关键字来修饰，即Hashtable是针对整个table的锁定，这样就导致HashTable容器在竞争激烈的并发环境下表现出效率低下。

 效率低下的原因说的更详细点：是因为所有访问HashTable的线程都必须竞争同一把锁。当一个线程访问HashTable的同步方法时，其他线程访问HashTable的同步方法时，可能会进入阻塞或轮询状态。如线程1使用put进行添加元素，线程2不但不能使用put方法添加元素，并且也不能使用get方法来获取元素，所以竞争越激烈效率越低。

 基于Hashtable的缺点，人们就开始思考，假如容器里有多把锁，每一把锁用于锁容器其中一部分数据，那么当多线程访问容器里不同数据段的数据时，线程间就不会存在锁竞争，从而可以有效的提高并发访问效率呢？？这就是我们的“锁分离”技术，这也是ConcurrentHashMap实现的基础。

 ConcurrentHashMap使用的就是锁分段技术，ConcurrentHashMap由多个Segment组成(Segment下包含很多Node，也就是我们的键值对了)，每个Segment都有把锁来实现线程安全，当一个线程占用锁访问其中一个段数据的时候，其他段的数据也能被其他线程访问。

 1、JDK1.8的ConcurrentHashMap中Segment虽保留，但已经简化属性，仅仅是为了兼容旧版本。

 2、ConcurrentHashMap的底层与Java1.8的HashMap有相通之处，底层依然由“数组”+链表+红黑树来实现的，底层结构存放的是TreeBin对象，而不是TreeNode对象；   

 TreeBin 包装TreeNode（存放键值对）继承自node

 3、ConcurrentHashMap实现中借用了较多的CAS算法，unsafe.compareAndSwapInt(this, valueOffset, expect, update); CAS(Compare And Swap)，意思是如果valueOffset位置包含的值与expect值相同，则更新valueOffset位置的值为update，并返回true，否则不更新，返回false。

 ConcurrentHashMap既然借助了CAS来实现非阻塞的无锁实现线程安全，那么是不是就没有用锁了呢？？答案：还是使用了synchronized关键字进行同步了的，在哪里使用了呢？在操作hash值相同的链表的头结点还是会synchronized上锁，这样才能保证线程安全。

 看完ConcurrentHashMap整个类的源码,  有修改操作时借助了synchronized来对table[i]进行锁定保证了线程安全以及使用了CAS来保证原子性操作，其它的基本一致，例如：

#### ConcurrentHashMap的get(int key)方法的实现思路为：

 1.通过key计算hash值
 2.如果通过hash值判断key对应的节点是否在Node数组中，如果在则返回对应的值。此处分为3种情况：
 	1.如果恰好是数组元素，也只有一个节点，返回改节点的值；
 	2.如果是红黑树，则通过树的遍历方式去获取，然后返回值；
 	3.如果是普通链表，则通过链表的方式去获取。
 3.如果通过hash值计算定位到的桶位置上没有元素，则返回null。

#### ConcurrentHashMap的put方法的实现思路为：

 ConCurrentHashMap的put操作主要由putVal()方法实现，该方法中对value的插入，采用了CAS操作和synchronized的操作，从而保证了并发环境下的安全性。  

1.判断key和value是否为null，如果是的话抛出NullPointerException并结束（ConCurrentHashMap不允许存放null型的key和value，这点和HashMap也不同）
 2.通过key计算得到hashcode
 3.判断是否需要进行初始化（初始化的时候没有插入key和value，而是在CAS第2次自旋的时候插入的）（采用了延迟初始化的策略Lazy table initialization minimizes footprint until first use）
 4.利用hash值定位Node，如果当前位置没有Node，则依据CAS机制尝试插入。如果插入失败，则通过自旋保证插入成功
 5.判断是否正在进行扩容，如果需要进行扩容，则执行helpTransfer方法（如果头节点是ForwardingNode类型，则表明正在扩容）
 6.如果是在无需进行初始化，hash值计算得到的位置存在Node，并且无需扩容的情况下，则利用synchronized锁来写入数据（这个过程又会分为在普通链表中put和在红黑树中put）
 6.上述操作后，如果当前数量超过了TREEIFY_THRESHOLD（8，跟HashMap中的值大小相同），则转化为红黑树结构。

### 底层实现:    

和HashMap相比，这里的TreeNode相当简洁；ConcurrentHashMap链表转树时，并不会直接转，
 正如注释（Nodes for use in TreeBins）所说，只是把这些节点包装成TreeNode放到TreeBin中，
 再由TreeBin来转化红黑树。

TreeBin用于封装维护TreeNode，包含putTreeVal、lookRoot、UNlookRoot、remove、balanceInsetion、balanceDeletion等方法，当链表转树时，用于封装TreeNode，也就是说，ConcurrentHashMap的红黑树存放的时TreeBin，而不是treeNode。

 1、第一步根据给定的key的hash值找到其在table中的位置index。

 2、找到位置index后，存储进行就好了。

 只是这里的存储有三种情况罢了，第一种：table[index]中没有任何其他元素，即此元素没有发生碰撞，这种情况直接存储就好了哈。第二种，table[i]存储的是一个链表，如果链表不存在key则直接加入到链表尾部即可，如果存在key则更新其对应的value。第三种，table[i]存储的是一个树，则按照树添加节点的方法添加就好。

### 解决hash冲突的方法:

#### 1.再hash法

​	Hi=RH1（key） i=1，2，…，k

 当哈希地址Hi=RH1（key）发生冲突时，再计算Hi=RH2（key）……，直到冲突不再产生。这种方法不易产生聚集，但增加了计算时间。

#### 2.开放定址法

​	当关键字key的哈希地址p=H（key……………...）出现冲突时，以p为基础，产生另一个哈希地址p1，如果p1仍然冲突，再以p为基础，产生另一个哈希地址p2，…，直到找出一个不冲突的哈希地址pi ，将相应元素存入其中。 		

#### 3.链地址法

​	将所有哈希地址为i的元素构成一个称为同义词链的单链表，并将单链表的头指针存在哈希表的第i个单元中，因而查找、插入和删除主要在同义词链中进行。链地址法适用于经常进行插入和删除的情况。  

#### 4.建立公共溢出区

​	将哈希表分为基本表和溢出表两部分，凡是和基本表发生冲突的元素，一律填入溢出表。  

### ConcurrentHashMap 和Hashtable的区别?

1.底层数据结构

​	jdk1.7的ConcurrentHashMap底层采用:Segments数组+hashEntry数组 +链表

​	jdk1.8的ConcurrentHashMap底层采用:Node数据+链表+红黑树

​    Hashtable底层数据结构采用:数组+链表

2.实现线程安全的方式

​	在JDK1.7中ConcurrentHashMap采用的是分段锁实现线程安全

​	在JDK1.8中ConcurrentHashMap采用syschronized和CAS来实现线程安全

​	Hashtable采用syschronized来实现线程安全,方法上加syschronized同步锁

ConcurrentHashMap 1.7的底层的数据结构  Segments数组+HashEntry数组(使用CAS机制)+链表，采用分段锁保证安全性  

ConcurrentHashMap 1.8 Synchronized + CAS +Node +红黑树  

![img](lu152441l02jn_tmp_ecdbd35aa2d749dd.jpg) 

上图是我们在使用CAS的一个基本操作流程。

1. CPU开销过大

在我们使用CAS时，如果并发量过大，我们的程序有可能会一直自旋，长时间占用CPU资源。

2. ABA问题

假设有个共享变量J，原始值为1。

1. 线程A读取变量J，值为1
2. 线程B读取变量J，值为1
3. 线程A变量J+1，CAS成功从1修改为2
4. 线程C读取变量J，值为2
5. 线程C将变量J-1，CAS成功从2修改为1
6. 线程A通过CAS比较和替换，依然可以改为自己想修改的值

上述过程，线程B和C已经将变量J的值已经改变了，但是线程A无法发现，依然可以修改共享变量，这就产生了ABA问题。

3.共享变量单一

CAS操作单个共享变量的时候可以保证原子的操作，无法操作多个变量。但是在JDK5之后，AtomicReference可以用来保证对象之间的原子性，我们可以把多个对象放入CAS中操作。

如何防止CAS的ABA

四个字：加标志位（version）。

 至于标志位可以是自增的数字，也可以是时间戳。通过标志位我们可以精确的知道每次修改。

## Collection和Collections区别？

 java.util.Collection 是一个集合接口。它提供了对集合对象进行基本操作的通用接口方法。Collection接口在Java 类库中有很多具体的实现。Collection接口的意义是为各种具体的集合提供了最大化的统一操作方式。

Collections则是集合类的一个工具类/帮助类，其中提供了一系列静态方法，用于对集合中元素进行排序、搜索以及线程安全等各种操作

## HashMap和HashTable的区别？ 

 (1) HashMap是非线程安全的，并且可以储存NULL。HashTbale是线程安全(即synchronized)，但不能存储NULL。    (2) HashMap利用HashCode重新计算Hash值，HashTbale直接使用key的HashCode()，再取模算下标。    (3) 内部实现使用的数组初始化和扩容方式不同。HashTable在不指定容量的情况下的默认容量为11，而HashMap为16，Hashtable不要求底层数组的容量一定要为2的整数次幂，而HashMap则要求一定为2的整数次幂。Hashtable扩容时，将容量变为原来的2倍加1，而HashMap扩容时，将容量变为原来的2倍。

##  hashmap源码:

 在插入数据的时候 计算存储位置 : (n-1) & hash  使用这种位运算 的底层二进制运算执行效率很高   100000 的数据 循环执行  位运算是1700ms 模运算 25000ms

##  HashMap插入时，使用头插法还是尾插法？

 答：在插入时采用尾插法（1.7是头插法），在并发场景下导致链表成环的问题。而在jdk1.8中采用尾插入法，在扩容时会保持链表元素原本的顺序，就不会出现链表成环的问题了。

## hashmap怎么保证安全？

可以用 Collections 的 synchronizedMap 方法使 HashMap 具有线程安全的能力，或者使用 ConcurrentHashMap。我们用下面这张图来介绍 HashMap 的结构  

## hashMap键一样值不一样怎么获取值

可以重写hashcode 的方法 这样就可以获取

## hashset如何实现去重

 1.Java中HashSet是用散列表实现的，散列表的大小默认为16，加载因子为0.75.

 2.去重原理：当hashset add一个元素A的时候，首先获取这个元素的散列码（hashcode的方法），即获取元素的哈希值。

 情况一：如果计算出的元素的存储位置目前没有任何元素存储，那么该元素可以直接存储在该位置上。

 情况二：如果算出该元素的存储位置目前已经存在有其他元素了，那么会调用该元素的equals方法与该位置的元素再比较一次，如果equals返回的值是true，那么该元素与这个位置上的元素就视为重复元素，不允许添加，如果equals方法返回的是false，那么该元素允许添加.

## 使用单链表插入数据

单链表的两种建立方式
单链表的建立有头插法、尾插法两种方法。

单链表是用户不断申请存储单元和改变链接关系而得到的一种特殊数据结构，将链表的左边称为链头，右边称为链尾。

头插法：右端固定，向左延伸，最先得到的是尾结点

尾插法：左端固定，向右延伸，最先得到的是头结点

画个图简单示意下两个的区别

实现思路分析单链表的两种建立方式

- 单链表的建立有头插法、尾插法两种方法。
- 单链表是用户不断申请存储单元和改变链接关系而得到的一种特殊数据结构，将链表的左边称为链头，右边称为链尾。
- **头插法**：右端固定，向左延伸，最先得到的是尾结点
- **尾插法**：左端固定，向右延伸，最先得到的是头结点
- 画个图简单示意下两个的区别
  ![20200914143526670](20200914143526670.png)
- 实现思路分析

头插法

![2020091414594076](2020091414594076.png)

尾插法

![20200914151350888](20200914151350888.png)

代码实现

```java
public class SingleLinkedListDemo {
    public static void main(String[] args) {
        PersonNode person1 = new PersonNode(1, "Mary", "董事长");
        PersonNode person2 = new PersonNode(2, "Bob", "总经理");
        PersonNode person3 = new PersonNode(3, "Tom", "架构师");
        PersonNode person4 = new PersonNode(4, "Jenny", "工程师");
        SingleLinkedList singleLinkedList = new SingleLinkedList();
//        System.out.println("头插法测试");
//        singleLinkedList.headInsert(person1);
//        singleLinkedList.headInsert(person2);
//        singleLinkedList.headInsert(person3);
//        singleLinkedList.headInsert(person4);
//        singleLinkedList.list();
        System.out.println("尾插法测试");
        singleLinkedList.tailInsert(person1);
        singleLinkedList.tailInsert(person2);
        singleLinkedList.tailInsert(person3);
        singleLinkedList.tailInsert(person4);
        singleLinkedList.list();
    }
}

/**
 * 链表
 */
class SingleLinkedList {
    // 定义一个头结点，不存储结点数据，只是用来指向链表的第一个元素
    private PersonNode head = new PersonNode(0, "", "");

    /**
     * 头插法
     *
     * @param node 待插入结点
     */
    public void headInsert(PersonNode node) {
        // 判断链表是否为空，如果为空，则将head.next指向node
        if (head.next == null) {
            head.next = node;
            return;
        }
        // 如果链表不为空，找到head.next，将node插入head和head.next之间
        PersonNode temp = head.next;
        head.next = node;  // head.next指向node
        node.next = temp;  // node.next指向之前的head.next
    }

    /**
     * 尾插法
     *
     * @param node 待插入结点
     */
    public void tailInsert(PersonNode node) {
        // 如果链表为空，直接head.next = node
        if (head.next == null) {
            head.next = node;
            return;
        }
        // 如果链表不为空，遍历查找最后一个结点
        PersonNode temp = head.next;
        while (true) {
            // 这里的条件注意下，使用temp.next==null，不要用temp==null, 两者的区别体会一下，我自己在写的时候就写成后者了
            if (temp.next == null) {
                break;
            }
            temp = temp.next;
        }
        // 跳出循环后，temp即为我们要找的链表的最后一个结点，直接temp.next=node
        temp.next = node;
    }

    /**
     * 遍历打印链表结点数据
     */
    public void list() {
        // 如果链表为空，返回
        if (head.next == null) {
            System.out.println("链表为空。");
            return;
        }
        // 如果链表不为空，遍历
        // head标识链表的头部，不要动，定义一个临时引用，用来遍历链表
        PersonNode temp = head.next;
        while (true) {
            // 如果temp为空，说明链表已经到达尾部，跳出循环
            if (temp == null) {
                // 此时temp表示last.next = temp，即最后一个结点指向它
                break;
            }
            // 如果temp不为空，打印temp
            System.out.println(temp);
            // temp后移，继续遍历
            temp = temp.next;
        }
    }
}

/**
 * 结点
 */
class PersonNode {
    int no;
    String name;
    String job;
    PersonNode next;

    public PersonNode(int no, String name, String job) {
        this.no = no;
        this.name = name;
        this.job = job;
    }

    public PersonNode() {
    }

    public int getNo() {
        return no;
    }

    public void setNo(int no) {
        this.no = no;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getJob() {
        return job;
    }

    public void setJob(String job) {
        this.job = job;
    }

    public PersonNode getNext() {
        return next;
    }

    public void setNext(PersonNode next) {
        this.next = next;
    }

    @Override
    public String toString() {
        return "PersonNode{" +
                "no=" + no +
                ", name='" + name + '\'' +
                ", job='" + job +
                '}';
    }
}

```

