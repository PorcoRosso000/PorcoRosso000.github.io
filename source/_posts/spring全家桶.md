---
title: spring全家桶
typora-root-url: spring全家桶
abbrlink: e29f6286
date: 2022-11-26 15:22:45
tags:
permalink:
---



## spring全家桶

1springmvc运行原理  ，spring ioc，di，aop

​       2 Springbean 生命周期 (东西步骤太多，记住核心的几个就可以)

​       3Springboot 启动原理 ，启动过程。

4 Springcloud（或者阿里巴巴）：5大组件

 控制反转：ioc是一种理论思想，在原来，对象由使用者来进行控制，而有了spring之后，可以把整个对象交给spring来帮我们进行管理，这就叫做控制反转。

 DI：依赖注入，把对应的属性值注入到具体的对象中，@Autowired ，populateBean（破劈，乐，D 嗯）完成属性值的注入

 容器：存储对象，使用map结构来存储，在spring中一般使用三级缓存，singletonObjects存放完整的bean对象。

 整个bean的生命周期，从创建到使用到销毁的过程全部都是由容器来进行管理（bean的生命周期）

 反射：通过反射获取属性的值

### SpringAOP

 AOP全称：Aspect-Oriented Programming，面向切面编程。

​      AOP，面向切面编程，就是把可重用的功能提取出来，然后将这些通用功能在合适的时候织入到应用程序中，比如事务管理、权限控制、日志记录、性能统计等。

​     AOP并没有帮助我们解决任何新的问题，它只是提供了一种更好的办法，能够用更少的工作量来解决现有的一些问题，使得系统更加健壮，可维护性更好。

 使用@Aspect注解将一个java类定义为切面类
 使用@Pointcut定义一个切入点，可以是一个规则表达式，比如下例中某个package下的所有函数，也可以是一个注解等。根据需要在切入点不同位置的切入内容
 同一个方法被多个Aspect类拦截时，可以使用@Order注解指定顺序。
 Authentication权限 ->实现使用环绕通知
 Caching ->缓存->环绕通知

 场景

 Authentication 权限  

 Caching 缓存

 Error handling 错误处理

 Debugging 调试	

 Performance optimization 性能优化

 Resource pooling 资源池

 Synchronization 同步

 Transactions 事务

 Logging 日志

 aop五种通知类型

 //前置通知：在方法执行前通知

 @Before(value = “”)

 //返回通知：在方法正常执行完成进行通知，可以访问到方法的返回值的。

 @AfterReturning(value = “”)

 //环绕通知：可以将要执行的方法（point.proceed()）进行包裹执行，可以在前后添加需要执行的操作

 @Around(value = “”)

 //异常通知：在方法出现异常时进行通知,可以访问到异常对象，且可以指定在出现特定异常时在执行通知。

 @AfterThrowing(value = “”)

 //方法执行后通知： 在目标方法执行后无论是否发生异常，执行通知,不能访问目标方法的执行的结果。

 @After(value = “”)

 使用@Aspect注解将一个java类定义为切面类

 使用@Pointcut定义一个切入点，可以是一个规则表达式，比如下例中某个package下的所有函数，也可以是一个注解等。根据需要在切入点不同位置的切入内容

 同一个方法被多个Aspect类拦截时，可以使用@Order注解指定顺序。

 Authentication 权限 实现使用环绕通知

 Caching 缓存   环绕通知

 Error handling 错误处理  前置 后置 环绕

 Logging 日志   后置通知

 Performance optimization 性能优化   环绕通知

 Debugging 调试  前置通知

 Resource pooling 资源池  环绕通知

 Synchronization 同步  前置通知

 Transactions 事务   前置  后置  环绕

#### SpringAOP的含义是面向切面编程:

​	

​	AOP 的全称是“Aspect Oriented Programming”，即面向切面编程，它将业务逻辑的各个部分进行隔离，使开发人员在编写业务逻辑时可以专心于核心业务，从而提高了开发效率。

Spring AOP 是基于 AOP 编程模式的一个框架，它的使用有效减少了系统间的重复代码，达到了模块间的松耦合目的。

AOP 采取横向抽取机制，取代了传统纵向继承体系的重复性代码，其应用主要体现在事务处理、日志管理、权限控制、异常处理等方面。

aop是基于动态代理实现的

JDK动态代理：利用反射机制生成一个实现代理接口的匿名类，在调用具体方法前调用InvokeHandler来处理。
 CGlib动态代理：利用ASM（开源的Java字节码编辑库，操作字节码）开源包，将代理对象类的class文件加载进来，通过修改其字节码生成子类来处理。

 两种动态代理的区别：

JDK动态代理只能对实现了接口的类生成代理，而不能针对类。

CGLIB是针对类实现代理，主要是对指定的类生成一个子类，覆盖其中的方法。

正向代理的过程，隐藏了真实的客户端。客户端请求的服务都被代理服务器代替来请求  

位于客户端和目标服务器之间

反向代理的过程，隐藏真实的服务端 。

位于用户与目标服务器之间  

正向代理是目标地址服务器不知道访问的用户是谁；而方向代理服务器用户不知道访问的服务器是那个。  

IoC和DI有什么关系呢？

IoC和DI有什么关系呢？其实它们是同一个概念的不同角度描述，

依赖注入是从应用程序的角度在描述：应用程序依赖容器创建并注入它所需要的外部资源；

而控制反转是从容器的角度在描述：容器控制应用程序，由容器反向的向应用程序注入应用程序所需要的外部资源。  

### SpringDI

依赖注入（Dependency Injection），即组件之间的依赖关系由容器在应用系统运行期来决定，也就是由容器动态地将某种依赖关系的目标对象实例注入到应用系统中的各个关联的组件之中。组件不做定位查询，只提供普通的Java方法让容器去决定依赖关系。

#### 依赖注入的三种注入方式

 构造方法注入

 如果只有一个有参数的构造方法并且参数类型与注入的bean的类型匹配，那就会注入到该构造方法中。

 Setter注入

 在XML中写入，然后在set方法中注入。

 基于注解的注入

 @Autowired（自动注入）修饰符有三个属性：Constructor，byType，byName。默认按照byType注入。

#### 依赖注入的基本原则：

应用组件不应该负责查找资源或者其他依赖的协作对象。配置对象的工作应该由IoC容器负责，“查找资源”的逻辑应该从应用组件的代码中抽取出来，交给IoC容器负责。容器全权负责组件的装配，它会把符合依赖关系的对象通过属性（JavaBean中的setter）或者是构造器传递给需要的对象。

#### 依赖注入的优势：

查找定位操作与应用代码完全无关。

不依赖于容器的API，可以很容易地在任何容器以外使用应用对象。

不需要特殊的接口，绝大多数对象可以做到完全不必依赖容器。

### SpringIOC

 IOC容器是spring用来管理bean对象的一个容器。

 用的数据结构是一个map，key是beanName，value是代理对象。

 其本质就是通过JDK动态代理或Cglib动态代理生成一个代理对象，由这个代理对象去完成方法的调用。IoC对编程带来的最大改变不是从代码上，而是从思想上，发生了“主从换位”的变化。

 应用程序原本是老大，要获取什么资源都是主动出击，但是在IoC/DI思想中，应用程序就变成被动的了，被动的等待IOC容器来创建并注入它所需要的资源了。

控制反转即IoC (Inversion of Control)，它把传统上由程序代码直接操控的对象的调用权交给容器，通过容器来实现对象组件的装配和管理。

Spring IOC 负责创建对象，管理对象（通过依赖注入（DI），装配对象，配置对象，并且管理这些对象的整个生命周期。

容器:

BeanFactory

BeanFactory 就是一个管理 Bean 的工厂，它主要负责初始化各种 Bean，并调用它们的生命周期方法。

ApplicationContext

不仅提供了 BeanFactory 的所有功能，还添加了对 i18n（国际化）、资源访问、事件传播等方面的良好支持。

主要区别，

如果 Bean 的某一个属性没有注入，则使用 BeanFacotry 加载后，在第一次调用 getBean() 方法时会抛出异常，而 ApplicationContext 则在初始化时自检，这样有利于检查所依赖的属性是否注入。

使用:

在实际开发中，通常都选择使用 ApplicationContext，而只有在系统资源较少时，才考虑使用 BeanFactory。

#### 控制反转(IoC)有什么作用

管理对象的创建和依赖关系的维护。

解耦，由容器去维护具体的对象

托管了类的产生过程，比如代理，程序可以把这部分处理交给容器，应用程序则无需去关心类是如何完成代理的

#### IOC的优点是什么？

IOC 或 依赖注入把应用的代码量降到最低。

它使应用容易测试，单元测试不再需要单例和JNDI查找机制。

最小的代价和最小的侵入性使松散耦合得以实现。

IOC容器支持加载服务时的饿汉式初始化和懒加载。

Spring IoC 的实现机制

Spring 中的 IoC 的实现原理就是工厂模式加反射机制。

Spring 的 IoC 设计支持以下功能：

依赖注入

依赖检查

自动装配

支持集合

指定初始化方法和销毁方法

支持回调某些方法（但是需要实现 Spring 接口，略有侵入）

### Spring bean

#### springbean的生命周期

![img](lu152441l02jn_tmp_8511b2d0b9cf9f1a.jpg) 

Spring启动，查找并加载需要被Spring管理的bean，进行Bean的实例化

 1.Bean实例化后对将Bean的引入和值注入到Bean的属性中

 2.如果Bean实现了BeanNameAware接口的话，Spring将Bean的Id传递给setBeanName()方法

 3.如果Bean实现了BeanFactoryAware接口的话，Spring将调用setBeanFactory()方法，将BeanFactory容器实例传入

 4.如果Bean实现了ApplicationContextAware接口的话，Spring将调用Bean的setApplicationContext()方法，将bean所在应用上下文引用传入进来

 5.如果Bean实现了BeanPostProcessor接口，Spring就将调用他们的postProcessBeforeInitialization()方法。

 6.如果Bean 实现了InitializingBean接口，Spring将调用他们的afterPropertiesSet()方法。类似的，如果bean使用init-method声明了初始化方法，该方法也会被调用

 7.如果Bean 实现了BeanPostProcessor接口，Spring就将调用他们的postProcessAfterInitialization()方法。

 8.此时，Bean已经准备就绪，可以被应用程序使用了。他们将一直驻留在应用上下文中，直到应用上下文被销毁。

9.如果bean实现了DisposableBean接口，Spring将调用它的destory()接口方法，同样，如果bean使用了destory-method 声明销毁方法，该方法也会被调用。

#### FactoryBean 和 BeanFactory有什么区别？

 BeanFactory 是 Bean 的工厂， ApplicationContext 的父类，IOC 容器的核心，负责生产和管理 Bean 对象。

 FactoryBean 是 Bean，可以通过实现 FactoryBean 接口定制实例化 Bean 的逻辑，通过代理一个Bean对象，对方法前后做一些操作。

#### SpringBean的六种作用域:

singleton：单例作用域（默认作用域）

 prototype  / proʊtətaɪp// ：原型作用域（多例作用域）

 request：请求作用域

 session：回话作用域   

 application：全局作用域

 websocket：HTTP WebSocket 作用域

#### Bean的自动装配

由容器负责把对象引用赋值给各个对象。Autowire配置自动装配

No 不进行装配

Byname 根据bean的名字进行装配

Bytype 根据类型装配

Constructor 利用构造函数装配 构造函数通过bytype装配

 Autodetect 自动探测，有构造使用构造，否则使用类型

 springBean的四种注入方式：

 set方法注入

 构造器注入

 静态工厂注入

 实例工厂注入

#### Spring的事务

事务分为

编程式事务

​	是通过代码编写的。TransactionTemplate或TransactionManager手动管理事务。没怎么用过

 声明式事务: 是基于注解的事务。通过AOP实现。

 Spring的事务管理机制实现的原理，就是通过这样一个动态代理对所有需要事务管理的Bean进行加载，并根据配置在invoke方法中对当前调用的 方法名进行判定，并在method.invoke方法前后为其加上合适的事务管理代码，这样就实现了Spring式的事务管理。  

@Transactional事务实现的原理是基于AOP来实现的，AOP的实现原理：动态代理+拦截链，由此可以大概推测出@Transactional的实现逻辑：Spring有一个针对@Transactional的增强器（拦截器）Interceptor，在bean实例初始化的最后一步会调用带该拦截器的拦截器链增强@Transactional注解的方法，并且生成代理类

![img](lu152441l02jn_tmp_db46e48ddf693c96.png) 

Servlet的生命周期   init() 初始化 service()服务 destroy()销毁   

### Spring

Spring 特指 Spring Framework是一种开源的框架，是为了解决企业应用开发的复杂性而创建的，它的用途不仅限于服务店的开发，而是任何应用都可以从Spring中受益。其中最主要的思想就是面向切面编程以及控制权反转，分别被缩写为AOP与IOC。使用最通俗外行的话讲，Spring就是一个写代码的模式，这个模式里边不光是一些规则与约定，还提供一些便利工具，这些便利工具实现了控制权反转(也就是通过Spring容器创建对象)与面向切面编程。使用Spring框架，让我们在开发大规模的Java项目时实现高程度的解耦，进而可以灵活地对我们的项目进行维护。

Spring 有两个核心部分： IoC 和 AOP

Spring 是一种基于 Bean 的编程技术

 服务器端应用程序通常采用三层体系架构，分别为表现层（web）、业务逻辑层（service）、持久层（dao）。

 Spring 致力于 Java EE 应用各层的解决方案，对每一层都提供了技术支持。

- 在表现层提供了对 	Spring 	MVC、Struts2 	等框架的整合；
- 在业务逻辑层提供了管理事务和记录日志的功能；
- 在持久层还可以整合 	MyBatis、Hibernate 	和 	JdbcTemplate 	等技术，对数据库进行访问。

####  Spring容器的启动流程

 1、初始化Spring容器，注册内置的BeanPostProcessor的BeanDefinition到容器中
 2、将配置类的BeanDefinition注册到容器中
 3、调用refresh()方法刷新容器

#### Spring支持的隔离级别

 隔离级别	描述
 DEFAULT	使用数据库本身使用的隔离级别
 ORACLE（读已提交） MySQL（可重复读）
 READ_UNCOMITTED	读未提交（脏读）最低的隔离级别，一切皆有可能。
 READ_COMMITED	读已提交，ORACLE默认隔离级别，有幻读以及不可重复读风险。
 REPEATABLE_READ	可重复读，解决不可重复读的隔离级别，但还是有幻读风险。
 SERLALIZABLE	串行化，最高的事务隔离级别，不管多少事务，挨个运行完一个事务的所有子事务之后才可以执行另外一个事务里面的所有子事务，这样就解决了脏读、不可重复读和幻读的问题了

#### Spring核心的组件只有三个：Core、Context 和 Bean  

1.Bean组件在Spring的 org.springframework.beans 包下，在这个包下的所有类主要解决了3件事：Bean的定义、Bean的创建及对Bean的解析。  

2.Context 在 Spring的 org.springframework.context 包下，给 Spring提供一个运行时的环境，用于保存各个对象的状态。  

3.Core 组件作为 Spring的核心组件，其中包含了很多关键类，例如：定义了资源的访问方式。这种将所有资源都抽象成一个接口的方式很值得以后的设计中拿来学习。  

#### 为什么使用Spring ?

​     1). 方便[解耦](https://so.csdn.net/so/search?q=解耦&spm=1001.2101.3001.7020)，简化开发

​          通过Spring提供的[IoC](https://so.csdn.net/so/search?q=IoC&spm=1001.2101.3001.7020)容器，可以将对象之间的依赖关系交由Spring进行控制，避免硬编码所造成的过度程序耦合。

​     2). [AOP](https://so.csdn.net/so/search?q=AOP&spm=1001.2101.3001.7020)编程的支持

​          通过Spring提供的AOP功能，方便进行面向切面的编程，如性能监测、事务管理、日志记录等。

​     3). 声明式事务的支持

​     4). 方便集成各种优秀[框架](https://so.csdn.net/so/search?q=框架&spm=1001.2101.3001.7020)

​     5). 降低Java EE [API](https://so.csdn.net/so/search?q=API&spm=1001.2101.3001.7020)的使用难度

​          如对JDBC，JavaMail，远程调用等提供了简便封装

#### Spring框架支持以下五种bean的作用域：

​     singleton : 默认值，bean在每个Spring ioc 容器中只有一个实例。

​     prototype：一个bean的定义可以有多个实例。

​     request：每次http请求都会创建一个bean，该作用域仅在基于web的Spring ApplicationContext情形下有效。 

​     session：在一个HTTP Session中，一个bean定义对应一个实例。该作用域仅在基于web的Spring ApplicationContext情形下有效。

​     global-session：在一个全局的HTTP Session中，一个bean定义对应一个实例。该作用域仅在基于web的Spring ApplicationContext情形下有效。

#### Spring是如何简化Java开发的

为了降低Java开发的复杂性，Spring采用了以下4种关键策略：

1、基于POJO的轻量级和最小侵入性编程；

2、通过依赖注入（DI）和面向接口实现松耦合；

3、基于切面（AOP）和惯例进行声明式编程；

4、通过切面和模版减少样式代码；

Spring事务类型:

声明式事务

编程式事务

①编程式事务管理使用TransactionTemplate， 通过@Transaction 交给spring管理

②声明式事务管理建立在AOP之上的。其本质是通过AOP功能，对方法前后进行拦截，将事务处理的功能编织到拦截的方法中，也就是在目标方法开始之前加入一个事务，在执行完目标方法之后根据执行情况提交或者回滚事务。

声明式事务最大的优点就是不需要在业务逻辑代码中掺杂事务管理的代码，只需在配置文件中做相关的事务规则声明或通过@Transactional注解的方式，便可以将事务规则应用到业务逻辑中。

声明式事务管理要优于编程式事务管理，这正是spring倡导的非侵入式的开发方式，使业务代码不受污染，只要加上注解就可以获得完全的事务支持。

唯一不足地方是，最细粒度只能作用到方法级别，无法做到像编程式事务那样可以作用到代码块级别。

   Spring中也有自己的事务管理机制，一般是使用TransactionMananger进行管理，可以通过Spring的注入来完成此功能。

#### Spring事务传播行为:

REQUIRED、SUPPORTS、MANDATORY、REQUIRES_NEW、NOT_SUPPORTED、NEVER、NESTED

##### REQUIRED(Spring默认的事务传播类型)

 如果当前没有事务，则自己新建一个事务，如果当前存在事务，则加入这个事务

##### SUPPORTS

 当前存在事务，则加入当前事务，如果当前没有事务，就以非事务方法执行

##### MANDATORY

 当前存在事务，则加入当前事务，如果当前事务不存在，则抛出异常。

##### REQUIRES_NEW

 创建一个新事务，如果存在当前事务，则挂起该事务。

##### NOT_SUPPORTED

始终以非事务方式执行,如果当前存在事务，则挂起当前事务

##### NEVER

 不使用事务，如果当前事务存在，则抛出异常

##### NESTED

如果当前事务存在，则在嵌套事务中执行，否则REQUIRED的操作一样（开启一个事务）

#### @Transactional注解事务失效的七种原因分析

1、异常被捕获后没有抛出
 当异常被捕获后，并且没有再抛出，那么deleteUserA是不会回滚的。

```java
@Transactional

public void deleteUser() {

   userMapper.deleteUserA();

   try {

       int i = 1 / 0;

       userMapper.deleteUserB();

   } catch (Exception e) {

       e.printStackTrace();

   }

}
```

 2、抛出非运行时异常
 异步虽然抛出了，但是抛出的是非RuntimeException类型的异常，依旧不会生效。

 2、抛出非运行时异常
 异步虽然抛出了，但是抛出的是非RuntimeException类型的异常，依旧不会生效。

```java
 @Transactional

public void deleteUser() throws MyException{

   userMapper.deleteUserA();

   try {

       int i = 1 / 0;

       userMapper.deleteUserB();

   } catch (Exception e) {

       throw new MyException();

   }

}
```

 如果指定了回滚异常类型为Exception，那么就可以回滚非RuntimeException类型异常了。
 @Transactional(rollbackFor = Exception.class)
 3、方法内部直接调用
 如果先调用deleteUser()，那么deleteUserA()是不会回滚的，其原因就是@Transactional根本没生成代理，如果直接调用deleteUser2()那么没问题，deleteUserA()会回滚。

 如果指定了回滚异常类型为Exception，那么就可以回滚非RuntimeException类型异常了。
 @Transactional(rollbackFor = Exception.class)
 3、方法内部直接调用
 如果先调用deleteUser()，那么deleteUserA()是不会回滚的，其原因就是@Transactional根本没生成代理，如果直接调用deleteUser2()那么没问题，deleteUserA()会回滚。

```java
public void deleteUser() throws MyException{

   deleteUser2();

}

@Transactional

public void deleteUser2() throws MyException{

   userMapper.deleteUserA();

   int i = 1 / 0;

   userMapper.deleteUserB();

}
 修改方式，把当前类自己注入一下调用即可。
 @Service

public class UserService {

   @Autowired

   private UserMapper userMapper;

	//自己注入自己

   @Autowired

   UserService userService;

	public void deleteUser() throws MyException{

	    userService.deleteUser2();

	}

	@Transactional

	public void deleteUser2() throws MyException{

	    userMapper.deleteUserA();

	    int i = 1 / 0;

	    userMapper.deleteUserB();

	}

}
```

 4、新开启一个线程
 如下的方式deleteUserA()也不会回滚，因为spring实现事务的原理是通过ThreadLocal把数据库连接绑定到当前线程中，新开启一个线程获取到的连接就不是同一个了。

```java
 @Transactional

public void deleteUser() throws MyException{

   userMapper.deleteUserA();

	try {

		//休眠1秒，保证deleteUserA先执行

       Thread.sleep(1000);

   } catch (InterruptedException e) {

       e.printStackTrace();

   }

   new Thread(() -> {

       int i = 1/0;

       userMapper.deleteUserB();

   }).start();     

}
```

 5、注解到private方法上
 idea直接会给出提示Methods annotated with ‘@Transactional’ must be overridable ，原理很简单，private修饰的方式，spring无法生成动态代理。

 5、注解到private方法上
 idea直接会给出提示Methods annotated with ‘@Transactional’ must be overridable ，原理很简单，private修饰的方式，spring无法生成动态代理。

 6、数据库本身不支持
 mysql数据库，必须设置数据库引擎为InnoDB。

 7、事务传播属性设置错误
 注意传播属性的设置，比如设置了：PROPAGATION_NOT_SUPPORIED（以非事务的方式执行，如果当前有事务则把当前事务挂起）。

#### spring设计模式

工厂设计模式: Spring使用工厂模式通过BeanFactory、ApplicationContext创建 bean 对象。

 代理设计模式: Spring AOP 功能的实现。

 单例设计模式: Spring 中的 Bean 默认都是单例的。

 模板方法模式: Spring 中jdbcTemplate、hibernateTemplate等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。

 装饰者模式: 我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源。

 观察者模式:Spring 事件驱动模型就是观察者模式很经典的一个应用。

 适配器模式:Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配Controller。

#### Spring 的核心容器有两种：

 1、BeanFactory（宾，发特瑞）：IOC 容器基本实现，是 Spring 内部的使用接口，不提供开发人员进行使用加载配置文件时候不会创建对象，在获取对象（使用）才去创建对象

 2、ApplicationContext(这个接口经常使用)：BeanFactory (bin 烦特锐)接口的子接口，提供更多更强大的功能，一般由开发人员进行使用，加载配置文件时候就会把在配置文件对象进行创建。所以我们着重了解下这个接口。

#### 什么是Spring的MVC框架？

​     Spring 配备构建Web 应用的全功能MVC框架。Spring可以很便捷地和其他MVC框架集成，如Struts，Spring 的MVC框架用控制反转把业务对象和控制逻辑清晰地隔离。它也允许以声明的方式把请求参数和业务对象绑定。

​     spring mvc是一个基于mvc的web框架。spring mvc是spring框架的一个模块，[springmvc](https://so.csdn.net/so/search?q=springmvc&spm=1001.2101.3001.7020)和spring无需通过中间整合层进行整合。

 简述spring中用到的设计模式

| 设计模式   | 应用场景                                                     |
| ---------- | ------------------------------------------------------------ |
| 单例模式   | spring 			bean默认都是单例的                        |
| 工厂模式   | beanFactory，proxyFactory; 			 			spring中的BeanFactory就是简单工厂模式的体现，传入一个唯一的标识来获取bean对象 |
| 原型模式   | 指定作用域为prototype                                        |
| 模板方法   | postProceesorBeanFactory，onRefresh，initPropertyValue 			 			   			 			 			spring启动流程有个onRefresh()方法是空方法，留给子类来重写，在springboot中来内嵌tomcat。 |
| 策略模式   | XmlBeanDefinitionReader，PropertiesBeanDefinitionReader 			 			策略模式作为一种软件[设计模式](https://so.csdn.net/so/search?q=设计模式&spm=1001.2101.3001.7020)，指对象有某个行为，但是在不同的场景中，该行为有不同的实现算法，可以替代代码中大量的 			if-else。 |
| 观察者模式 | listner（监听器），event（监听事件），multicast（广播器） 			 			spring的事件驱动模型使用的是 			观察者模式，listener的实现 |
| 适配器模式 | AdvisorAdapter，AfterReturningAdviceAdapter，MethodBeforeAdviceAdapter 			 			   			 			 			首先，将所有的适配器放到一个集合中，当要使用适配器的时候，遍历集合找出相对应的适配器，将该适配器返回给用户，用户执行适配器中的方法传入需要适配的类型，返回需要的类型 			 			每一个通知都对应一个拦截器，Spring需要将具体的通知封装成拦截器，返回给容器，这里对advice的转换就用到了适配器模式 |
| 装饰者模式 | BeanWrapper 			 			Spring中用到的包装器模式在类名上有两种表现：一种是类名中含有Wrapper，另一种是类名中含有 			Decorator。 |
| 责任链模式 | 使用aop在进行通知调用的时候成一个拦截器链                    |
| 代理模式   | 动态代理 			 			切面在应用运行的时刻被织入。 			 			一般情况下，在织入切面时，AOP容器会为目标对象创建动态的创建一个代理 			对象。 			 			SpringAOP就是以这种方式织入切面的。 |
| 构建者模式 | BeanDefinitionBuilder                                        |
| 委托者模式 | BeanDefinitionParserDelegate                                 |
| 访问者模式 | BeanDefinitionVisitor                                        |

 描述一下bean的生命周期

其定义为：从对象的创建到销毁的过程。

而Spring中的一个Bean从开始到结束经历很多过程，但总体可以分为六个阶段

Bean定义、实例化、属性赋值、初始化、生存期、销毁。

 形成闭环的原因：

 此时，A对象是存在的，只不过A对象实例化但是没有完成初始化，是一个半成品的bean，如果在程序的调用过程中，拥有了某个对象的引用，能够在后期给它完成赋值，可以优先把非完整的对象有限赋值，等待后续操作来完成赋值，相当于提前暴露了某个不完整的对象的引用

 此时容器中存在两种状态，

 ①完成实例化但未完成初始化

 ②完整状态，因为都在容器，所以要不同的map结构存储，所以就有了一级和二级缓存

 为什么需要三级缓存？

 三级缓存的value类型是一个ObjectFactory，是一个函数式接口，存在的意义是保证在整个容器的运行过程中同名的bean对象只能有一个

 如果一个对象需要被代理，或者说需要生成代理对象，那个需要优先生成一个普通对象，用代理对象覆盖掉之前的普通对象。在实际的调用过程中，没有办法确定什么时候对象被使用，所以要求当某个对象被调用的时候，优先判断此对象是否需要被代理，类似于一种回调机制的实现，因此传入lambda表达式的时候，可以通过lambda表达式来执行对象的覆盖过程

 因此，所有的bean对象在创建的时候都要优先放入三级缓存中，在后续的使用过程中，如果需要被代理则返回代理对象，不需要则直接返回普通对象

 1.三级缓存中分别存放的是什么？

 一级缓存：可以直接使用的完整对象；

 二级缓存：完成实例化而未初始化的对象；

 三级缓存：lambda表达式v (”->{}”)

 2.如果只有一级缓存行不行？

 不行，因为完整的对象会和未初始化的对象放到一起，在进行获取的时候有可能会获取到为初始化的对象，这样的对象是无法使用的；

 3.如果只有二级缓存行不行？

 只要有二级缓存可以解决循环依赖问题，但是添加aop的实现之后，会报错。

 4.三级缓存到底做了什么事情？

 在三级缓存中完成了代理对象替换非代理对象的工作。

 三级缓存是为了解决在aop代理过程中产生的循环依赖问题，如果没有aop的话，二级缓存可以解决循环依赖问题。

### Spring MVC

是一种专注于Java Web的框架，我们可以使用一种通俗的想法来理解，就是：使用了Spring框架的基于MVC模式的前端开发框架，我们知道在开发前端的时候也不光是写前端页面，在控制层肯定是得写Java代码，我们在写这些Java代码的时候，Spring MVC这个框架也会为我们提供很多方便的工具，让我们写起来又快又舒服，里边的很多功能实现都是基于Spring的，同时开发者还基于Spring实现了一些针对WEB开发的特殊功能，让我们在书写起跳转，业务处理等逻辑时更加舒服方便，但是这些功能的实现，都是通过原有的Spring的功能实现的。也就是说Spring MVC是一个基于Spring框架创建的，在WEB开发中别有所长的一个子框架，是通过Spring框架实现的，专注于WEB开发的框架。

 Spring的MVC框架主要由DispatcherServlet(前端控制器)、处理器映射、处理器(控制器)、视图解析器、视图组成。

#### SpringMvc 运行原理

![img](lu152441l02jn_tmp_b3781caa85750131.jpg) 

SpringMVC运行原理

\1. 客户端请求提交到DispatcherServlet

2.由DispatcherServlet控制器查询一个或多个HandlerMapping，找到处理请求的Controller

\3. DispatcherServlet将请求提交到Controller

\4. Controller调用业务逻辑处理后，返回ModelAndView

\5. DispatcherServlet查询一个或多个ViewResoler视图解析器，找到ModelAndView指定的视图

\6. 视图负责将结果显示到客户端

DispatcherServlet接口：

Spring提供的前端控制器，所有的请求都有经过它来统一分发。在DispatcherServlet将请求分发给Spring Controller之前，需要借助于Spring提供的HandlerMapping定位到具体的Controller。

HandlerMapping接口：

能够完成客户请求到Controller映射。

Controller接口：

需要为并发用户处理上述请求，因此实现Controller接口时，必须保证线程安全并且可重用。

Controller将处理用户请求，这和Struts Action扮演的角色是一致的。一旦Controller处理完用户请求，则返回ModelAndView对象给DispatcherServlet前端控制器，ModelAndView中包含了模型（Model）和视图（View）。

从宏观角度考虑，DispatcherServlet是整个Web应用的控制器；从微观考虑，Controller是单个Http请求处理过程中的控制器，而ModelAndView是Http请求过程中返回的模型（Model）和视图（View）。

ViewResolver接口：

Spring提供的视图解析器（ViewResolver）在Web应用中查找View对象，从而将相应结果渲染给客户。

DispatcherServlet是整个Spring MVC的核心。它负责接收HTTP请求组织协调Spring MVC的各个组成部分。其主要工作有以下三项：

1截获符合特定格式的URL请求。

2初始化DispatcherServlet上下文对应的WebApplicationContext，并将其与业务层、持久化层的WebApplicationContext建立关联。

3初始化Spring MVC的各个组成组件，并装配到DispatcherServlet中。

#### 什么是SpringMVC

 SpringMVC就是一个Spring内置的MVC框架。

 MVC框架，它解决WEB开发中常见的问题(参数接收、文件上传、表单验证、国际化等等)，而且使用简单，与Spring无缝集成。支持 RESTful风格的URL请求。

 采用了松散耦合可插拔组件结构，比其他 MVC 框架更具扩展性和灵活性。

#### SpringMVC的作用

 MVC模式(Model-View-Controller)：解决页面代码和后台代码的分离。

#### SpringMVC原理

 在没有使用SpringMVC之前我们都是使用Servlet在做Web开发。但是使用Servlet开发在接收请求参数，数据共享，页面跳转等操作相对比较复杂。

 servlet是java进行web开发的标准，既然springMVC是对servlet的封装，那么很显然SpringMVC底层就是Servlet，SpringMVC就是对Servlet进行深层次的封装。

#### 回顾MVC模式

 --什么是mvc模式？

 MVC分别是：模型model(javabean)、视图view(jsp/img)、控制器Controller(Action/servlet)。

 C存在的目的就是为了保证M和V的一致性，当M发生改变时，C可以把M中的新内容更新到V中。

 PS：目前web应用中，99%的项目都会使用mvc模式开发。

 --涉及组件分析：

 1、前端控制器DispatcherServlet（不需要程序员开发）由框架提供，在web.xml中配置。

 作用：接收请求，响应结果，相当于转发器，中央处理器。

 2、处理器映射器HandlerMapping（不需要程序员开发）由框架提供。

 作用：根据请求的url查找Handler（处理器/Controller），可以通过XML和注解方式来映射。

 3、处理器适配器HandlerAdapter（不需要程序员开发）由框架提供。

 作用：按照特定规则（HandlerAdapter要求的规则）去执行Handler中的方法。

 4、处理器Handler（也称之为Controller，需要程序员开发）

 注意：编写Handler时按照HandlerAdapter的要求去做，这样适配器才可以去正确执行Handler。

 作用：接受用户请求信息，调用业务方法处理请求，也称之为后端控制器。

 5、视图解析器ViewResolver（不需要程序员开发）由框架提供。

 作用：进行视图解析，把逻辑视图解析成真正的物理视图。  

 SpringMVC框架支持多种View视图技术，包括：jstlView、freemarkerView、ThymeleafView等。

 6、视图View（需要工程师开发）

 作用：把数据展现给用户的页面

 View是一个接口，实现类支持不同的View技术（jsp、freemarker、pdf等）

 SpringMVC需要程序员完成的工作有三个：

 【1】配置前端控制器DispatcherServlet。

 【2】开发后端控制器Handler/Controller。

 【3】开发视图View。

### Spring和springmvc的区别

Spring是Spring MVC的爹， Spring MVC是基于Spring实现的，被加入了一些针对MVC模式的WEB开发的框架，Spring则是原生的，更为基础的框架，Spring MVC被特化成了专注于开发WEB页面

### SpringBoot的启动原理 启动过程

#### @SpringBootApplication包含的三个注解及其含义

第一个：@SpringBootConfiguration（在这个类的源码中又有一个Configuration的注解）

@Configuration这个注解的作用就是声明当前类是一个配置类，然后Spring会自动扫描到添加了@Configuration的类，读取其中的配置信息，而@SpringBootConfiguration是来声明当前类是SpringBoot应用的配置类，项目中只能有一个。所以一般我们无需自己添加。

第二个：@EnableAutoConfiguration

开启自动配置，告诉SpringBoot基于所添加的依赖，去“猜测”你想要如何配置Spring。比如我们引入了spring-boot-starter-web，而这个启动器中帮我们添加了tomcat、SpringMVC的依赖，此时自动配置就知道你是要开发一个web应用，所以就帮你完成了web及SpringMVC的默认配置了！我们使用SpringBoot构建一个项目，只需要引入所需框架的依赖，配置就可以交给SpringBoot处理了。

第三个：@ComponentScan

配置组件扫描的指令

提供了类似与<context:component-scan>标签的作用

通过basePackageClasses或者basePackages属性来指定要扫描的包。

如果没有指定这些属性，那么将从声明这个注解的类所在的包开始，扫描包及子包

而我们的@SpringBootApplication注解声明的类就是main函数所在的启动类，

因此扫描的包是该类所在包及其子包。因此，一般启动类会放在一个比较前的包目录

### Springboot的启动流程

 SpringBoot整个启动流程分为两个步骤：初始化一个SpringApplication对象、执行该对象的run方法。

启动流程

 1.通过SpringFactoriesLoader查找并加载所有的SpringApplicationRunListeners，通过调用starting()方法通知所有的SpringApplicationRunListeners：应用开始启动了。

 2.创建并配置当前应用将要使用的Environment，Environment用于描述应用程序当前的运行环境，其抽象了两个方面的内容：配置文件(profile)和属性(properties)，不同的环境(eg：生产环境、预发布环境)可以使用不同的配置文件，而属性则可以从配置文件、环境变量、命令行参数等来源获取。因此，当Environment准备好后，在整个应用的任何时候，都可以从Environment中获取资源。

 3.打印banner（可以自定义）
 4.根据是否是web项目，来创建不同的ApplicationContext容器
 5.创建一系列FailureAnalyzer，创建流程依然是通过SpringFactoriesLoader获取到所有实现FailureAnalyzer接口的class，然后在创建对应的实例。FailureAnalyzer用于分析故障并提供相关诊断信息。
 6.初始化ApplicationContext

 将准备好的Environment设置给ApplicationContext

 遍历调用所有的ApplicationContextInitializer的initialize()方法来对已经创建好的ApplicationContext进行进一步的处理

 调用SpringApplicationRunListener的contextPrepared()方法，通知所有的监听者：ApplicationContext已经准备完毕

 将所有的bean加载到容器中

 调用SpringApplicationRunListener的contextLoaded()方法，通知所有的监听者：ApplicationContext已经装载完毕

 7.调用ApplicationContext的refresh()方法,刷新容器

 这里的刷新和spring中刷新原理类似，这里重点关注invokeBeanFactoryPostProcessors(beanFactory);方法，主要完成获取到所有的BeanFactoryPostProcessor来对容器做一些额外的操作，通过源可以进入到PostProcessorRegistrationDelegate类
 的invokeBeanFactoryPostProcessors()方法，会获取类型为BeanDefinitionRegistryPostProcessor的beanorg.springframework.context.annotation.internalConfigurationAnnotationProcessor，对应的Class为ConfigurationClassPostProcessor。ConfigurationClassPostProcessor用于解析处理各种注解，包括：@Configuration、@ComponentScan、@Import、@PropertySource、@ImportResource、@Bean。当处理@import注解的时候，就会调用<自动配置>这一小节中的EnableAutoConfigurationImportSelector.selectImports()来完成自动配置功能

 8.查找当前context中是否注册有CommandLineRunner和ApplicationRunner，如果有则遍历执行它们。

### SpringBoot四大核心组件

#### 1.Spring Boot Starter

Starter 帮我们封装好了所有需要的依赖,避免我们自己添加导致的一些Jar包冲突或者缺少包的情况；  

#### 2.Spring Boot Autoconfigure

autoconfigure内容是配置Bean实例到Spring容器的实际代码实现包，然后提供给starter依赖。  

#### 3.Spring Boot CLI

 Spring Boot CLI是一个命令行使用Spring Boot的客户端工具；主要功能如下：

- 运行groovy脚本 	 	
- 打包groovy文件到jar 	 	
- 初始化Spring 	Boot项目 	 	

#### 4.Spring Boot actuator

actuator是Spring Boot的监控插件，本身提供了很多接口可以获取当前项目的各项运行状态指标。  

### SSM

SSM框架是spring、spring MVC 、和mybatis框架的整合，是标准的MVC模式。标准的SSM框架有四层，分别是dao层（mapper），service层，controller层和View层。

#### 1）持久层：dao层（mapper）层

作用：主要是做数据持久层的工作，负责与数据库进行联络的一些任务都封装在此。

Dao层首先设计的是接口，然后再Spring的配置文件中定义接口的实现类。

然后可以在模块中进行接口的调用来进行数据业务的处理。（不在关心接口的实现类是哪个类）

数据源的配置以及有关数据库连接的参数都在Spring的配置文件中进行配置。

2）业务层：Service层

作用：Service层主要负责业务模块的逻辑应用设计。

#### Mybatis （核心是SqlSession）

mybatis是对jdbc的封装，它让数据库底层操作变的透明。mybatis的操作都是围绕一个sqlSessionFactory实例展开的。mybatis通过配置文件关联到各实体类的Mapper文件，Mapper文件中配置了每个类对数据库所需进行的sql语句映射。在每次与数据库交互时，通过sqlSessionFactory拿到一个sqlSession，再执行sql命令。

（1）成本低：Spring框架是企业型开发使用的成熟的开源框架，节省成本。

（2）节省开发时间，典型的三层结构MVC（模型，视图模型，视图和控制），允许开发人员降低重新开发的复杂的问题，及时更改解决方案。对于敏捷开发的新需求，减少开发时间和成本。

（3）良好的扩展性：SSM主流技术有强大的用户社区来支持它，所以这个框架是非常具有扩展性的，可根据特殊应用具有良好的可插入性

（4）良好的可维护性：系统可能需要进行重构问题，SSM框架重构的成功率比其他框架要高得多。

先设计接口然后再设计实类，然后再在Spring的配置文件中配置其实现的关联。（业务逻辑层的实现具体要调用到自己已经定义好的Dao的接口上）这样就可以在应用中调用Service接口来进行业务处理。

建立好Dao之后再建立service层，service层又要在controller层之下，因为既要调用Dao层的接口又要提供接口给controller层。每个模型都有一个service接口，每个接口分别封装各自的业务处理的方法。

#### 3）表现层：Controller层（Handler层）

作用：负责具体的业务模块流程的控制。

配置也同样是在Spring的配置文件里面进行，

调用Service层提供的接口来控制业务流程。

业务流程的不同会有不同的控制器，在具体的开发中可以将我们的流程进行抽象的归纳，设计出可以重复利用的子单元流程模块。

#### 4）View层

作用：主要和控制层紧密结合，主要负责前台jsp页面的表示。

### Springboot

Spring Boot 的设计是为了让你尽可能快的跑起来 Spring 应用程序并且尽可能减少你的配置文件。SpringBoot默认配置了很多框架的使用方式

1.SpringBoot：是一个快速开发框架，通过用MAVEN依赖的继承方式，帮助我们快速整合第三方常用框架，完全采用注解化（使用注解 方式启动SpringMVC），简化XML配置，内置HTTP服务器（Tomcat，Jetty），最终以Java应用程序进行执行。

#### SpringBoot是微服务框架吗？

1、SpringBoot只是一个快速开发框架，算不上微服务框架。

1. SpringCloud+SpringBoot 	实现微服务开发。

具体的来说是，SpringCloud具备微服务开发的核心技术：

RPC远程调用技术；

SpringBoot的web组件默认集成了SpringMVC，可以实现HTTP+JSON的轻量级传输，编写微服务接口，所以SpringCloud依赖SpringBoot框架实现微服务开发。

#### SpringBoot四个主要特性

1、SpringBoot Starter：他将常用的依赖分组进行了整合，将其合并到一个依赖中，这样就可以一次性添加到项目的Maven或Gradle构建中；

2、自动配置：SpringBoot的自动配置特性利用了Spring4对条件化配置的支持，合理地推测应用所需的bean并自动化配置；

3、命令行接口：（Command-line-interface, CLI）：SpringBoot的CLI发挥了Groovy编程语言的优势，并结合自动配置进一步简化Spring应用的开发；

4、Actuatir：它为SpringBoot应用的所有特性构建一个小型的应用程序。但首先，我们快速了解每项特性，更好的体验他们如何简化Spring编程模型。

SpringBoot是在Spring的基础上面搭设的框架，目的是为了简化Spring项目的搭设和开发过程。不存在冲突的问题。

它提供了如下特性如果有需求则可以引入

自动配置 Spring-boot-starter 开箱即用依赖模块

简化统一配置文件

监控管理actuator

内嵌了如Tomcat，Jetty,所有的依赖都打到一个jar包里面，可以直接java -jar 运行

### ssm和springboot的区别

 谈SpringBoot之前，先说一下传统的SSM开发，使用过SSM开发的人都会发现，传统的SSM框架项目会有大量的配置文件，需要手动的区整合三个框架，也就是SpringMVC、Spring、MyBatis，并且需要注意各种配置和兼容，后期的维护难度也很大。

 现在快速开发的一个网站的方式层出不穷，像Node.js，PHP。脚本语言也越来越流行，比如Python，Scala，Ruby等，这时候Spring的开发模型就显得相对笨重了。在这种情况下，由Pivotal团队开发了一个工具集，叫SpringBoot。其实本质还是Spring Framework。底层代码也还是Springmvc和Spring的整合。不过不需要手动的区配置，只需要导入相应的依赖，SpringBoot会自动配置。

 SpringBoot帮我们做什么什么事情呢?
 1、SpringBoot使用了特定的配置方式，开发人员不需要再定义样板化的配置，简化项目的初始构建。
 2、SpringBoot提供了更多的组合式注解，简化开发过程。
 3、SpringBoot可以"零配置"整合很多第三方工具。
 4、SpringBoot提供了内置的容器，部署也变得异常简单。
 5、SpringBoot应对监控也提供了相应的方案。

 SpringBoot和SSM不冲突，SpringBoot只是简化了配置，实际开发 没什么区别。SSM就好像开手动挡的汽车，需要踩离合，挂档，给油车才能开动。而SpringBoot就好像自动挡的汽车，给油就走，踩刹车就停。

 在开发中的区别还是存在的，虽然SpringBoot简化了配置，但并不代表不需要编写配置文件，还是需要在自带的application.yml文件中去编写一些内容。只不过编写的方式变得简单了，虽然简单了，但是和SSM整合的方式还有些区别。

 在使用SSM开发的时候，多数会选择Jsp作为视图，但是SpringBoot不推荐使用Jsp，主推的是thymeleaf和freemarker等模板引擎，也造成了使用SSM开发到SpringBoot开发也需要一定得学习成本。不过如果掌握了SSM的话，学习SpringBoot也是水到渠成，异常的简单。

 更推荐使用SpringBoot开发，一是SpringBoot工具集的简化配置等操作，可以让程序员把精力主要放在代码的业务逻辑上，二是想学习Springcloud微服务组件的话，SpringBoot是基础。

### SpringBoot和SpringCloud的区别

1、SpringBoot只是一个快速开发框架，使用注解简化了xml配置，内置了Servlet容器，以Java应用程序进行执行。

1. SpringCloud是一系列框架的集合，可以包含SpringBoot。
2. Spring 	boot是Spring的一套快速配置脚手架，可以基于Spring 	Boot快速开发单个微服务；Spring 	Cloud是一个基于Spring 	Boot实现的云应用开发工具
3. Spring 	Boot专注于快速、方便集成的单个个体,Spring 	Cloud是关注全局的服务治理框架；
4. Spring 	boot使用了默认大于配置的理念，很多集成方案已经帮你选择好了，能不配置就不配置，Spring 	Cloud很大的一部分是基于Spring 	Boot来实现。
5. Spring 	Boot可以离开Spring 	Cloud独立使用开发项目，但是Spring 	Cloud离不开Spring 	Boot,属于依赖的关系。

SpringCloud： 是一套目前完整的微服务框架，它 是一系列框架的有序集合。

它只是将目前各家公司开发的比较成熟、经得起实际考验的服务框架组合起来，通过SpringBoot风格进行再封装屏蔽掉了复杂的配置和实现原理，最终给开发者留出了一套简单易懂、易部署和易维护的分布式系统开发工具包。

 它利用Spring Boot的开发便利性巧妙地简化了分布式系统基础设施的开发，如服务发现注册、配置中心、消息总线、负载均衡、断路器、数据监控等，都可以用SpringBoot的开发风格做到一键启动和部署。

区别:
  1、cloud更方便未来搭建应用服务器集群
  2、方便feign调用，不需要做反序列化
  3、方便服务统一被网关管理
  4、方便统一限流降级
  5、方便使用分布式事务
  6、方便使用链路追踪

 7、cloud具有负载均衡

 8  基于服务名调用

 \9.  cloud返回数据不需要再使用json处理

 SpringBoot是一套基于Spring的快速配置脚手架，而SpringCloud是一系列框架的集合
 SpringBoot可以离开SpringCloud独立开发项目，而SpringCloud离不开SpringBoot

 SpringCloud是一系列框架的集合，可以包含SpringBoot。

 1、Spring Boot是build anything，而Spring Cloud是coordinate anything，Spring Cloud的每一个微服务解决方案都是基于Spring Boot构建的。Spring boot使用了默认大于配置的理念，很多集成方案已经帮你选择好了，能不配置就不配置，Spring Cloud很大的一部分是基于Spring Boot来实现。Spring Boot可以离开Spring Cloud独立使用开发项目，但是Spring Cloud离不开Spring Boot,属于依赖的关系。

 ![img](lu152441l02jn_tmp_f9e405a9625db7a.png) 

 2、Spring Cloud事实上是一整套基于Spring Boot的微服务解决方案。它为开发者提供了很多工具，用于快速构建分布式系统的一些通用模式，例如：配置管理、注册中心、服务发现、限流、网关、链路追踪等。

 ![img](lu152441l02jn_tmp_5cda50741813c831.png) 

 3、springcloud利用Spring Boot的开发便利性巧妙地简化了分布式系统基础设施的开发，如服务发现注册、配置中心、消息总线、负载均衡、断路器、数据监控等，都可以用SpringBoot的开发风格做到一键启动和部署。

 ![img](lu152441l02jn_tmp_22316ac312a11767.png) 

### SpringCloud和SpringCloudAlibaba的区别

 SpringCloudAlibaba实际上对我们的SpringCloud2.x和1.x实现拓展组件功能。

 nacos是分布式配置中心+分布式注册中心=Eureka+config。

 研发SpringCloudAlibaba目的是为了推广阿里的产品，如果使用了SpringCloudAlibaba,最好使用alibaba整个体系产品。

#### @FeignClient:

 @FeignClient标签的常用属性如下：

- name：指定FeignClient的名称，如果项目使用了Ribbon，name属性会作为微服务的名称，用于服务发现
- url: 	url一般用于调试，可以手动指定@FeignClient调用的地址
- decode404:当发生http 	404错误时，如果该字段位true，会调用decoder进行解码，否则抛出FeignException
- configuration: 	Feign配置类，可以自定义Feign的Encoder、Decoder、LogLevel、Contract
- fallback: 	定义容错的处理类，当调用远程接口失败或超时时，会调用对应接口的容错逻辑，fallback指定的类必须实现@FeignClient标记的接口
- fallbackFactory: 	工厂类，用于生成fallback类示例，通过这个属性我们可以实现每个接口通用的容错逻辑，减少重复的代码
- path: 	定义当前FeignClient的统一前缀

 关于调用目前有两种：

 1、接口提供方在注册中心。

 如果服务提供方已经注册到注册中心了，那么name或者value的值为：服务提供方的服务名称。必须为所有客户端指定一个name或者value
 @FeignClient(value="run-product",fallback = ProductClientServiceFallBack.class)

 2、单独的一个http接口，接口提供方没有注册到注册中心。
 @FeignClient(name="runClient11111",url="localhost:8001")
 此处name的值为:调用客户端的名称。

### 

 SpringCloudAlibaba   核心组件有：

 Nacos：主要的功能有注册中心和配置中心，可以代替 Eureka 和 Apollo 两个组件；

 Sentinel：可实现流量控制、熔断降级、系统负载保护等，比Hystrix功能更加丰富；

 Dubbo：高性能的RPC通信框架；

 Seata：提供高性能和简单易用的分布式事务服务；

 Spring Cloud Gateway：高性能异步非阻塞网关；

 RocketMQ：高性能、高可靠的消息中间件

 Eureka：

 服务启动的时候，服务上的Eureka客户端会把自身注册到Eureka服务端，并且可以通过Eureka服务端知道其他注册的服务

 Ribbon：

 服务间发起请求的时候，服务消费者方基于Ribbon服务做到负载均衡，从服务提供者存储的多台机器中选择一台，如果一个服务只在一台机器上面，那就用不到Ribbon选择机器了，如果有多台机器，那就需要使用Ribbon选择之后再去使用

 Feign：

 Feign使用的时候会集成Ribbon，Ribbon去Eureka服务端中找到服务提供者的所在的服务器信息，然后根据随机策略选择一个，拼接Url地址后发起请求

 Hystrix：

 发起的请求是通过Hystrix的线程池去访问服务，不同的服务通过不同的线程池，实现了不同的服务调度隔离，如果服务出现故障，通过服务熔断，避免服务雪崩的问题 ，并且通过服务降级，保证可以手动实现服务正常功能

 Zuul：

 如果前端调用后台系统，统一走zull网关进入，通过zull网关转发请求给对应的服务

 负载均衡？

 负载均衡是用于解决一台机器(一个进程)无法解决所有请求而产生的一种算法。

 当集群里的1台或者多台服务器down的时候，剩余的没有down的服务器可以保证服务的继续使用。

 使用了更多的机器保证了机器的良性使用，不会由于某一高峰时刻导致系统cpu急剧上升。

 负载均衡有好几种实现策略，常见的有：

 随机 (Random)

 轮询 (RoundRobin)(默认)

 一致性哈希 (ConsistentHash)

 哈希 (Hash)

 加权（Weighted）(如果服务器性能不一致考虑使用加权,让性能高的多干活)

 熔断降级？  

  当微服务系统的一个服务出现故障时，故障会沿着服务的调用链路在系统中疯狂蔓延，最终导致整个微服务系统的瘫痪，这就是“雪崩效应”。为了防止此类事件的发生，微服务架构引入了“熔断器”的一系列服务容错和保护机制。

 在微服务系统中，Hystrix 能够帮助我们实现以下目标：

 保护线程资源：防止单个服务的故障耗尽系统中的所有线程资源。

 快速失败机制：当某个服务发生了故障，不让服务调用方一直等待，而是直接返回请求失败。

 提供降级（FallBack）方案：在请求失败后，提供一个设计好的降级方案，通常是一个兜底方法，当请求失败后即调用该方法。

 防止故障扩散：使用熔断机制，防止故障扩散到其他服务。

 监控功能：提供熔断器故障监控组件 Hystrix Dashboard，随时监控熔断器的状态。

### SpringCloud Alibaba与Spring Cloud搭配方案

 Spring Cloud Alibaba致力于提供微服务开发一站式解决方案。此项目包括开发分布式应用微服务的必需组件，方便开发者通过 Spring Cloud 编程模型轻松使用这些组件来开发分布式应用服务。

 依托 Spring Cloud Alibaba，你只需要添加一些注解和少量配置，就可以将 Spring Cloud 应用接入阿里微服务解决方案，通过阿里云中间件来迅速搭建分布式应用系统。

### 开源地址

 https://github.com/alibaba/spring-cloud-alibaba/

### SpringCloud 五大组件

 服务中心eureka   

 服务调用 feign   

 负载均衡 Ribbon  

 熔断器 Hystrix   

 网关Zuul(停止更新 现在大多用gateway)

####  Eureka和Zookeeper

心跳保护机制：

注意：  

 **EMERGENCY! EUREKA MAY BE INCORRECTLY CLAIMING INSTANCES ARE UP WHEN THEY'RE NOT. RENEWALS ARE LESSER THAN THRESHOLD AND HENCE THE INSTANCES ARE NOT BEING EXPIRED JUST TO BE SAFE.**  

分析：是由于 Eureka 进入了保护模式。  

 在保护模式下，Eureka Server 将会尝试保护其服务注册表中的信息，暂时不会注销服务注册表中的服务。  

 心跳保护机制，对于某些服务，网络不稳定，一会能够检查到，一会检查不到，就会启动心跳保护机制，保护这个服务不会被删除掉（剔除）

//-------------------------------------------------



##### Eureka集群选举机制:
  

Eureka集群中的各节点之间不存在主从关系。Eureka集群中的节点的关系是对等的，其他3种集群则都存在主从关系，这是Eureka集群的一个特色。

 Eureka集群的各个server之间通过相互注册的方式来实现集群的高可用性。数据同步的方式是增量备份，这样可以保证每个server都是最新最全的数据。从而保证集群的高可用性。这样即使某个server挂了，集群还可以对外提供服务。

 Eureka有一个配置项：eureka.client.fetch-register，是否从Eureka server获取注册信息。如果我们是Eureka集群，那么该项配置为true。这样Eureka server直接就可以相互注册。



#####  **eureka****和** **Zookeeper** **的对比**  

#### 分布式系统的 CAP 理论：   

一致性（C）：所有的节点上的数据时刻保持同步。  

可用性（A）：每个请求都能接受到一个响应，无论响应成功或失败。  

分区容错性（P）：系统应该能持续提供服务，即使系统内部有消息丢失（分区）。  


  

 由于分区容错性在是分布式系统中必须要保证的，因此我们只能在 A 和C 之间进行权衡。在此 Zookeeper 保证的是CP, 而 Eureka 则是 AP。  

  

 **Zookeeper****保证****CP**  

 ZooKeeper 是个 CP 的，即任何时刻对 ZooKeeper 的访问请求能得到一致的数据结果，同时系统

对网络分割具备容错性、但是它不能保证每次服务请求的可用性(注：也就是在极端环境下，

ZooKeeper 可能会丢弃一些请求，消费者程序需要重新请求才能获得结果)。  

 例如：当 master 节点因为网络故障与其他节点失去联系时，剩余节点会重新进行 leader 选举。问题在于，选举 leader 的时间太长，30 ~ 120s, 且选举期间整个 zk 集群都是不可用的，这就导致在选举期间注册服务瘫痪。  

  

####        Eureka 保证 AP  

 Eureka 看明白了这一点，因此在设计时就优先保证可用性。我们可以容忍注册中心返回的是几分钟以前的注册信息，但不能接受服务直接 down 掉不可用。也这个 Eureka 节点会退出“自我保护模式”。Eureka 的哲学是，同时保留“好数据”与“坏数据”总比丢掉任何数据要更好。  

  

Nacos 默认和dubbo一样cp，但是也可以修改为 ap

#### 总结  

 Eureka 作为单纯的服务注册中心来说要比 zookeeper 更加“专业”，因为注册服务更重要的是可用性，我们可以接受短期内达不到一致性的状况。  

 当然，这也要看具体的使用场景。 就是说，服务注册功能对可用性的要求要高于一致性。  

如果 Eureka 服务节点在短时间里丢失了大量的心跳连接(注：可能发生了网络故障)，那么这个 每30秒检测一次心跳  90秒未检测到心跳,表示任务服务宕机

 Eureka 节点会进入“自我保护模式”，同时保留那些“心跳死亡”的服务注册信息不过期。此时，这个 Eureka 节点对于新的服务还能提供注册服务，对于“死亡”的仍然保留，以防还有客户端向其发起请求。当网络故障恢复后，


  

####  服务端和客户端之间的数据同步

 EurekaServer在启动的时候可以同步其他集群节点的注册信息，那么必须开启客户端配置。

 1、eureka.client.register-with-eureka= true //是否作为一个EurekaClient 注册到EurekaServer上去 2、eureka.client.fetch-registry= true //是否需要从EurekaServer上拉取注册信息到本地。  

 只有开启了上面两个配置，那么集群节点在启动的时候，会初始化Eureka Client端的配置，会从其他EurekaServer拉取注册信息到本地，同时在初始化 Eureka Server 的时候，会从本地内存里面读取注册信息，自动注册到本身的服务上。

####  宕机数据同步

 如果某台 Eureka Server 宕机，Eureka Client 的请求会自动切换到新的 Eureka Server 节点。当宕机的服务器重新恢复后，Eureka 会再次将其纳入到服务器集群管理之中。当节点开始接受客户端请求时，所有的操作都会进行节点间复制，将请求复制到其它 Eureka Server 当前所知的所有节点中。

 每个 Eureka Server 也是 Eureka Client，多个 Eureka Server 之间通过 P2P 的方式完成服务注册表的同步。

 Eureka Server 各个节点都是平等的，几个节点挂掉不会影响正常节点的工作，剩余的节点依然可以提供注册和查询服务。而 Eureka Client 在向某个 Eureka 注册时，如果发现连接失败，则会自动切换至其它节点。只要有一台 Eureka Server 还在，就能保证注册服务可用(保证可用性)，只不过查到的信息可能不是最新的(不保证强一致性)。


  


  

//------------------------------------

Eureka 高可用（服务端集群）搭建：

**注册中心互相注册（解决了单点故障）**，就可以实现。

例：


  

eureka.instance.hostname=javaeestudy1     

eureka.client.serviceUrl.defaultZone=http://javaeestudy:123456@javaeestudy2:8762/eureka/,http://javaeestudy:123456@javaeestudy3:8763/eureka/


  

eureka.instance.hostname=javaeestudy2

eureka.client.serviceUrl.defaultZone=http://javaeestudy:123456@javaeestudy1:8761/eureka/,http://javaeestudy:123456@javaeestudy3:8763/eureka/

​    

   //--------------------------------------------------


  


  

  客户端集群（应用服务器的集群，举例订单服务器集群，秒杀服务集群）：端口或ip不一样，**服务名称****（应用名称，上下文名称**）**一样**，集群就搭建好了，默认使用的负载均衡策略为轮询机制

例如:


  

\# server

server.port=7780

\# spring

spring.application.name=spring-cloud-provider

\# server

server.port=7779

\# spring

spring.application.name=spring-cloud-provider

\# server

server.port=7778

\# spring

spring.application.name=spring-cloud-provider

//------------------------------

负载均衡策略配置：

Sprringcloud默认给我们实现了8种 负载均衡策略，默认的为轮询

\#设置策略  

spring-cloud-provider.ribbon.NFLoadBalancerRuleClassName=com.netflix.loadbalancer.RoundRobinRule

spring-cloud-provider2.ribbon.NFLoadBalancerRuleClassName=com.netflix.loadbalancer.RandomRule

也可以自定义策略对象。

//---------------------------------


  

#### feign:

 指定的服务建立连接、构造请求、发起靕求、获取响应、解析响应，等等。Feign是如何做到的呢?其实Feign的一个机制就是使用了动态代理,

 首先，如果你对某个接口定义了@FeignClient注解，Feign就会针对这个接口创建一个动态代理 接着你要是调用那个接口，本质就是会调用 Feign创建的动态代理，这是核心中的核心 Feign的动态代理会根据你在接口上的@RequestMapping等注解，来动态构造出你要请求的服务的地址 最后针对这个地址，发起请求、解析响应

#### Ribbon:

 robbon的作用是负载均衡,会帮你在每一次请求的时候选择一台机器,均匀的把请求发送到各个机器上 ,Ribbon的负载均衡默认的使用RoundRobin轮询算法,什么是轮询算法?如果订单服务对库存发起十次请求,那就先让你请求第一台机器,然后是第二台机器,第三台机器,.......接着循环到第十台机器

##### ribbon负载均衡实现原理:

 Ribbon通过ILoadBalancer接口提供负载均衡服务，其实现原理为：

- ILoadBalancer依赖ServerList通过DiscoveryClient从Eureka 	Client处获取Server列表并缓存这些Server列表。  	
- IPing接口定时对ILoadBalancer缓存的Server列表进行检测，判断其是否可用。 		
- IRule接口是负载均衡策略的抽象，ILoadBalancer通过IRule选出一个Server。 		

当使用RestTemplate+@LoadBalanced的方式进行服务调用时，LoadBalancerInterceptor和RibbonLoadBalancerClient作为桥梁结合Ribbon提供负载均衡服务。

当使用Feign接口调用服务时，LoadBalancerFeignClient和FeignLoadBalancer作为调用Ribbon的入口为Feign接口提供负载均衡服务。


 
  

#### Hystrix:

   

为了解决服务瘫痪(服务雪崩)这样的问题，因此产生了断路器的概念。  

 在分布式架构中，断路器的作用是当某个服务单元发生故障之后，通过断路器的故障监控，向调用方返回一个错误响应，而不是长时间的等待。这样就不会使得线程因调用故障服务被长时间占用不释放， 避免了故障在分布式系统中的蔓延。  

  

Hystrix 就是具备有以上功能的应用。  


  

//-----------------

熔断器：默认时间是900毫秒，我们一般需要修改默认值，为2秒左右，时间太短，永久熔断，

太长，相当于没有熔断作用

\# 一般设置2-3秒就可以了  

hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds=3000


  

##### Hystrix能解决什么问题?

###### 服务降级

在高并发情况下，防止用户一直等待（返回一个友好的提示，直接给客户端，不会去处理请求，调用fallBack本地方法），目的是为了用户体验。 秒杀----当前请求人数过多，请稍后重试

###### 服务熔断

熔断机制目的为了保护服务，在高并发的情况下，如果请求达到一定极限(可以自己设置阔值)如果流量超出了设置阈值，让后直接拒绝访问，保护当前服务。使用服务降级方式返回一个友好提示，服务熔断和服务降级一起使用

###### 服务隔离机制

因为默认情况下，只有一个线程池会维护所有的服务接口，如果大量的请求访问同一个接口，达到tomcat
 线程池默认极限，可能会导致其他服务无法访问。 解决服务雪崩效应:使用服务隔离机制(线程池方式和信号量)，使用线程池方式实現

隔离的原理:

相当于每个接口(服务)都有自己独立的线程池，因为每个线程池互不影响，这样的话就可以解决服务雪崩效应。

1. - 线程池隔离:每个服务接口，都有自己独立的线程池，每个线程池互不影响。 				
   - 信号量隔离:使用一个原子计数器（或信号量）来记录当前有多少个线程在运行，当请求进来时先判断计数器的数值，若超过设置的最大线程个数则拒绝该请求，若不超过则通行，这时候计数器+1，请求返
      回成功后计数器-1。 				

###### 限流

高并发的流量涌入进来，比如说突然间一秒钟100万QPS，废掉了，10万QPS进入系统，其他90万QPS被拒绝了

###### 运维监控

监控+报警+优化，各种异常的情况，有问题就及时报警，优化一些系统的配置和参数，或者代码


 
 
  

##### hystrix熔断原理:

熔断器工作的详细过程如下：

**第一步**，调用allowRequest()判断是否允许将请求提交到线程池

1. 如果熔断器强制打开，circuitBreaker.forceOpen为true，不允许放行，返回。 		
2. 如果熔断器强制关闭，circuitBreaker.forceClosed为true，运行放行。此外不必关注熔断器实际状态，也就是说熔断器仍然会维护统计数据和开关状态，只是不生效而已。 		

**第二步**，调用isOpen()判断熔断器开关是否打开

1. 如果熔断器开关打开，进入第三步，否则继续； 		
2. 如果一个周期内总的请求数小于circuitBreaker.requestVolumeThreshold的值，允许请求放行，否则继续； 		
3. 如果一个周期内错误率小于circuitBreaker.errorThresholdPercentage的值，允许请求放行。否则，打开熔断器开关，进入第三步。 		

**第三步**，调用allowSingleTest()判断是否允许单个请求通行，检查依赖服务是否恢复

1. 如果熔断器打开，且距离熔断器打开的时间或上一次试探请求放行的时间超过circuitBreaker.sleepWindowInMilliseconds的值时，熔断器器进入半开状态，允许放行一个试探请求；否则，不允许放行。

此外，为了提供决策依据，每个熔断器默认维护了10个bucket，每秒一个bucket，当新的bucket被创建时，最旧的bucket会被抛弃。其中每个blucket维护了请求成功、失败、超时、拒绝的计数器，Hystrix负责收集并统计这些计数器。 
 
  


  

//----------------------

#### Zuul:

 Zuul 一个基于JVM 路由和服务端的负载均衡器，在云平台上提供动态**路由**，监控，弹性，**安全等 边缘服务 的框架**。   

路由功能：相当于 nginx 的反向代理功能

​         帮我们统一访问地址，没有严格意义的生产者和消费者。

  zuulFilter  重写里面的方法，可以做接口限流，接口验证(token)，黑白名单，登录，等等

 zuul的实现原理:

 Zuul Servlet 通过 RequestContext 通关着由许多 Filter 组成的核心组件，所有操作都与 Filter 息息相关。请求、ZuulServlet、Filter 共同构建器 Zuul 的运行时声明周期

Zuul 的请求来自于 DispatcherServlet，然后交给 ZuulHandlerMapping 处理初始化得来的路由定位器`RouteLocator`，为后续的请求分发做好准备，同时整合了基于事件从服务中心拉取服务列表的机制；


 进入ZuulController，主要职责是初始化 ZuulServlet 以及集成 ServletWrappingController，通过重写 handleRequest 方法来将 ZuulServlet 引入声明周期，之后所有的请求都会经过 ZuulServlet；


 当请求进入 ZuulServlet 之后，第一次调用会初始化 ZuulRunner，非第一次调用就按照 Filter 链的 order 顺序执行；
 ZuulRunner 中将请求和响应初始化为 RequestContext，包装成 FilterProcessor 转换为为调用 preRoute、route、postRoute、error 方法；


 最后再 Filter 链中经过种种变换，得到预期结果。


 
  

### SpringCloud几大痛点

 SpringCloud 部分组件停止维护和更新，给开发者带来不便。

 SpringCloud 部分环境搭建复杂，没有完善的可视化界面，我们需要大量的二次开发和定制。

 SpringCloud配置复杂，难以上手，部分配置差别难以区分和合理应用。

### SpringCloudAlibaba 的优势

 阿里使用过的组件经历了考验，性能强悍，设计合理，现在开源出来给大家用。

 成套产品搭配完善的可视化界面给开发运维带来了极大的便利。

 搭建简单，学习曲线低。

#### SpringCloud Alibaba 和 Spring Cloud 搭配方案		

 1.SpringCoud Alibaba-Nacos：注册中心（服务发现/注册）

 2.SpringCoud Alibaba-Nacos：配置中心（动态配置管理）

 3.SpringCoud Alibaba-Sentinel：服务容错（限流、降级、熔断）

 4.SpringCoud Alibaba-Seata：原 Fescar，即分布式解决方案

 5.SpringCoud-Ribbon：负载均衡

 6.SpringCoud-Feign：声明式HTTP客户端（调用远程服务）

 7.SpringCoud-Gateway：API网关（webflux编程模式）

 8.SpringCoud-Sleuth：调用链监控

#### Spring Cloud Alibaba的依赖

 

```java
<dependencyManagement>

    <dependencies>

        <dependency>

            <groupId>com.alibaba.cloud</groupId>

            <artifactId>spring-cloud-alibaba-dependencies</artifactId>

            <version>2.1.0.RELEASE</version>

            <type>pom</type>

            <scope>import</scope>

        </dependency>

    </dependencies>

 </dependencyManagement>
```



#### 注册中心、配置中心、网关的架构图

 ![img](lu152441l02jn_tmp_bbdf83293a7c1d06.jpg) 

### ribbon的负载均衡策略

8种负载均衡策略

随机 (Random)

 轮询 (RoundRobin)(默认)

 加权（Weighted）   

 ribbon:

 NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule #随机

 com.netflix.loadbalancer.RoundRobinRule ：以轮询的方式进行负载均衡。

 com.netflix.loadbalancer.RandomRule ：随机策略

 com.netflix.loadbalancer.RetryRule ：重试策略。

 com.netflix.loadbalancer.WeightedResponseTimeRule ：权重策略。会计算每个服务的权重，越高的被调用的可能性越大。

 com.netflix.loadbalancer.BestAvailableRule ：最佳策略。遍历所有的服务实例，过滤掉故障实例，并返回请求数最小的实例返回。

 com.netflix.loadbalancer.AvailabilityFilteringRule ：可用过滤策略。过滤掉故障和请求数超过阈值的服务实例，再从剩下的实力中轮询调用。

 设置方法：

 spring-cloud-provider.ribbon.NFLoadBalancerRuleClassName=com.netflix.loadbalancer.RoundRobinRule

### nginx的作用

动静分离

负载均衡

 反向代理

### Ribbon 和nginx区别

​	服务器端负载均衡 Nginx

 	nginx 是客户端所有请求统一交给 nginx，由 nginx 进行实现负载均衡请求转发，属于服务器端负载均衡。
 	即请求由 nginx 服务器端进行转发。

 	客户端负载均衡 Ribbon

 	Ribbon 是从 eureka 注册中心服务器端上获取服务注册信息列表，缓存到本地，然后在本地实现轮询负载均衡策略。
 	即在客户端实现负载均衡。

  应用场景的区别：

 	Nginx 适合于服务器端实现负载均衡 比如 Tomcat  

​	Ribbon 适合与在微服务中 RPC 远程调用实现本地服务负载均衡，比如 Dubbo、SpringCloud 中都是采用本地负载均衡。

### Tomcat和Nginx的区别

 1、从应用方面

 tomcat一般是做动态解析才会用得到，支持jsp的解析，运行java代码。

 nginx，则一般是做静态，比如视频，照片，音频，还可以做动静分离这些等

 2、在性能方面

 tomcat一般支持并发并不高500个差不多了；nginx在静态方面支持并发轻松达5万。

3.Tomcat (web应用服务器)  ,

nginx/apache（web服务器）,为文件服务器nginx是tomcat的10倍以上

​	

### nacos和eureka的区别

1：在提供者和注册中心之间。
     （1）Eureka中会定时向注册中心发送心跳，如果在短期内没有发送心跳，则就会直接剔除。
     （2）Nacos也会向注册中心发送心跳，但是它的频率要比Eureka快。在Nacos中又分为临时实例和非临时实例。如果是临时实例的话，短期内没有发送心跳，则会直接剔除。但是如果是非临时实例长时间宕机，不会直接剔除，并且注册中心会直接主动询问并且等待非临时实例。

 2：在消费者和注册中心之间。
      （1）Eureka会定时向注册中心定时拉去服务，如果不主动拉去服务，注册中心不会主动推送。
      （2）Nacos中注册中心会定时向消费者主动推送信息  ，这样就会保持数据的准时性。

3：Nacos集群默认采用AP方式，当集群中存在非临时实例时，采用CP模式；[Eureka](https://so.csdn.net/so/search?q=Eureka&spm=1001.2101.3001.7020)采用AP方式  

nacos默认是ap，cp  

### nacos命名空间是做什么的？

实现数据隔离   nacos集群服务之间互相注册导致数据混乱

### springboot 和 springmvc区别

本质上没有啥区别     springboot  工具集  在后期开发的时候可以更方便去进行一个应用解耦，方便开发

### RPC是什么?

   RPC是指远程过程调用，也就是说两台服务器A，B，一个应用部署在A服务器上，想要调用B服务器上应用提供的函数/方法，由于不在一个内存空间，不能直接调用，需要通过网络来表达  调用的语义  和传达  调用的数据。

### 拦截器和过滤器的区别

​	拦截器只拦截controller的方法路径

​	过滤器还会拦截所有的请求 比如js css  

### break  continue return  的区别

 return的功能是结束一个方法。 一旦在循环体内执行到一个return语句，return语句将会结束该方法，循环自然也随之结束。  

 continue的功能和break有点类似，区别是continue只是中止本次循环，接着开始下一次循环。而break则是完全中止循环。  

 break用于完全结束一个循环，跳出循环体。不管是哪种循环，一旦在循环体中遇到break，系统将完全结束循环，开始执行循环之后的代码。 break不仅可以结束其所在的循环，还可结束其外层循环。此时需要在break后紧跟一个标签，这个标签用于标识一个外层循环。Java中的标签就是一个紧跟着英文冒号（:）的标识符。且它必须放在循环语句之前才有作用。  

```java
public class BreakTest

{

　　public static void main(String[] args){

　　　　// 外层循环，outer作为标识符

　　　　outer:

　　　　for (int i = 0 ; i < 5 ; i++ ){

　　　　　　// 内层循环

　　　　　　for (int j = 0; j < 3 ; j++ ){

　　　　　　　　System.out.println("i的值为:" + i + " j的值为:" + j);

　　　　　　　　if (j == 1){

　　　　　　　　　　// 跳出outer标签所标识的循环。

　　　　　　　　　　　break outer;

　　　　　　　　}

　　　　　　}

　　　　}

　　}

}
```



### RT

响应时间:

执行一个请求从开始到最后收到响应数据所花费的总体时间,

即从客户端发起请求到收到服务器响应结果的时间.

接口RT时间长优化思路:

接口响应时间过长,代表整个链路某些地方出现性能问题

1.对于分布式微服务架构,需要结合链路追踪进行排查哪个环节出现性能瓶颈

2.针对出现性能瓶颈的服务进行排查

3.代码逻辑优化,减少数据查询次数

4.sql优化,索引覆盖

5.JVM调优

