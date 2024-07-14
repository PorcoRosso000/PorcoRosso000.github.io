---
title: maven学习
typora-root-url: maven学习
abbrlink: e5dd7f0f
date: 2023-10-08 19:20:45
keywords: 'maven'
tags: maven
categories: maven
photos:
description: maven学习
---

maven学习

<!--more-->

------



### maven各版本下载

https://archive.apache.org/dist/maven/maven-3/

下载  binaries/  文件夹中的文件
Linux 下载gz 结尾的文件
windows 下载zip 结尾的文件



### maven配置环境变量

系统变量 MAVEN_HOME  D:\softwore\maven\apache-maven-3.5.4
path 下加   %MAVEN_HOME%\bin

### maven 打包命令 

mvn clean install
打包是jar包还是war包由pom.xml中决定

### 包

#### 什么是jar包

jar包就是 Java Archive File，是 Java 的一种文档格式，是一种与平台无关的文件格式，可将多个文件合成一个文件。jar 包与 zip 包非常相似——准确地说，它就是 zip 包，所以叫它文件包。jar 与 zip 唯一的区别就是在 jar 文件的内容中，包含了一个 META-INF/MANIFEST.MF 文件，该文件是在生成 jar 文件的时候自动创建的，作为jar里面的"详情单"，包含了该Jar包的版本、创建人和类搜索路径Class-Path等信息，当然如果是可执行Jar包，会包含Main-Class属性，表明Main方法入口，尤其是较为重要的Class-Path和Main-Class。

因为jar包主要是对class文件进行打包，而java编译生成的class文件是和平台无关的，这就意味着jar包是跨平台的，所以不必关心涉及具体平台的问题。说到jar里面的文件，咱们来看看最普通的一个带有静态页面的springboot项目jar里面的内容，就会发现解压出来的jar并不简单，为了贴近实际咱们未做任何删减，可以看到有很多东西
只需要运行如下指令，就能看到jar里面的内容（调用jar指令的前提是已经配置了jdk的环境变量）

```
jar -tf springbootdemo-0.0.1-SNAPSHOT.jar
--其中-tf 后接的jar就是我们要查看的jar
```

大致看看里面的东西我们可以发现，除了.MF以及.class文件之外，jar还能打包静态资源文件如.html、.css以及.js等项目所需的一切，这也就意味着咱们能将自己的项目打成jar，即不管是web应用还是底层框架，都能打成jar包。

有的jar包是可以直接通过 java -jar 指令来执行的。我们都知道，有的类之所以能够执行，是因为它用你有main函数，该函数是程序的入口，同理，可执行的jar包中肯定是有某个.class文件提供了main函数才使得其可执行。那么问题来了，一个jar里面可能存在多个.class文件都有main函数的情况，我怎么知道该执行哪个？其实答案非常简单，就是看前面说的MANIFEST.MF里面的Main-Class属性，它会指定函数入口

#### 为什么要打jar包

讲讲为什么要打jar包。主要从我们自身的需求出发，不难发现，当我们开发了一个程序以后，程序中有很多的类，如果需要提供给别人使用,发给对方一大堆源文件是非常不好的，因此通常需要把这些类以及相关的资源文件打包成一个 jar 包,把这个 jar 包提供给别人使用,同时提供给使用者清晰的文档。这样他人在拿到我们提供的jar之后，就能方便地进行调用，具体如何调用后面会进行讲解。
因此，建议大家在平时写代码搬砖的时候，注意把自己代码的通用部分抽离出来，主键积累一些通用的util类，将其逐渐模块化，最后打成jar包供自己在别的项目或者模块中使用，同时不断打磨jar里面的内容，将其做得越来越容易理解和通用，这样的好处是除了会对你的代码重构能力以及模块抽象能力有很好的帮助之外，更是一种从长期解放你的重复工作量，让你有更多的精力去做其他事情的方式，甚至当你抽象出业内足够通用的jar之后，jar包还能为你带来意想不到的利润（当然公司里该保密的东西还是得保密的）。这也是java发展得如此之好的原因，无论出于盈利或者非盈利的目的，将自己的通用工具或者框架抽取出来，打成jar包供他人调用，使得整个java生态圈变得越来越强大–几乎很多业务场景都能找到对应的jar包。

#### jar包和war包的区别

war是一个可以直接运行的web模块，通常应用于web项目中，将其打成war包部署到Tomcat等容器中。以大家熟悉的Tomcat举例，将war包放置在tomcat根目录的webapps目录下，如果Tomcat成功启动，这个包就会自动解压，就相当于发布了。

除了目录结构外，jar里有的war里也都有。war包是Sun提出的一种web应用程序格式，与jar类似，是很多文件的压缩包。war包中的文件按照一定目录结构来组织。根据其根目录下包含有html和jsp文件，或者包含有这两种文件的目录，另外还有WEB-INF目录。通常在WEB-INF目录下含有一个web.xml文件和一个classes目录，web.xml是这个应用的配置文件，而classes目录下则包含编译好的servlet类和jsp，或者servlet所依赖的其他类（如JavaBean）。通常这些所依赖的类也可以打包成jar包放在WEB-INF下的lib目录下。这也就意味着，war能打包的内容，jar也都可以。有的同学会问了，那既然是这样，直接用jar来替代war不就可以了？诚然，对于现今的应用来讲，主流都是用jar来替代war了。因为war仅服务于Web应用，而jar的涵盖范围更广。目前，war相较于jar的唯一优势在于，就拿tomcat来讲，当tomcat的进程启动之后，将符合规范的war包放在tomcat的webapps目录下的时候，tomcat会自动将war包解压并对外提供web服务，而jar包则不行。

过去由于并未通过微服务将机器资源进行隔离，因此提倡的是一个tomcat实例管理多个java web项目，因此对于java web项目，都提倡将其打成war包然后放置于同一个tomcat的webapps下进行管理，便于资源的统一利用。而随着微服务成为主流，同一台机器上的多个web服务可以通过docker等容器进行隔离，因此我们可以让每个容器都单独运行一个tomcat实例，每个tomcat实例独立运行一个web服务，换句话说，我们可以像springboot一样，将tomcat和web项目打成jar放在一起，以内嵌的方式来启动web服务，使得所有服务的启动方式更优雅和统一，不管是Web服务还是后台服务，均使用java -jar指令来启动。

#### 如何打jar包&&jar的依赖如何处理&如何调用

**讲讲应对主流需求的打包方式**

##### 含有多个类的jar，类之间存在调用关系

新建一个Welcome类和一个Teacher类

```
Welcome.java
package com.imooc.jardemo1;

import com.imooc.jardemo1.impl.Teacher;

public class Welcome {
    public static void main(String[] args) {
        Teacher.greeting();
    }
}

Teacher.java
package com.imooc.jardemo1.impl;

public class Teacher {
    public static void greeting(){
        System.out.printf("Welcome!");
    }
}

```

编写完成后，在命令行里，去到项目的src路径下，执行javac指令

```shell
javac com/imooc/jardemo1/Welcome.java
```

此时就会生成与这两个类相对应的.class字节码文件

由于jvm实际解析的是.class字节码文件而非.java文件，且jar中最好不要包含代码源文件，我们来将.class文件打个jar包，在src根目录下执行如下指令

```shell
jar -cvf welcome.jar com/imooc/jardemo1/Welcome.class com/imooc/jardemo1/impl/Teacher.class
预览
```

c表示要创建一个新的jar包，v表示创建的过程中在控制台输出创建过程的一些信息，f表示给生成的jar包命名

接下来便是如何执行上面的welcome.jar了，非常简单，只需要执行如下指令

```shell
java -jar welcome.jar
```

```
报错了：）
welcome.jar中没有主属性清单
```

通过异常信息我们不难看出，这是和先前咱们说过的MANIFEST.Mf这个主清单属性相关的，此时我们查看一下welcome.jar里面的内容，通过指令

```shell
jar -tf welcome.jar
```

就会发现我们之前打jar的时候，会生成一个META-INF的目录，里面有MANIFEST.MF这个清单列表

将welcome.jar拷贝到新建的文件夹myjar下面，用解压缩软件或者unzip指令解压，并打开MANIFEST.MF，就会发现文件里有如下内容

```shell
Manifest-Version: 1.0
Created-By: 11 (Oracle Corporation)
```

我们发现，缺少咱们先前说的Main-Class属性，导致jar被执行的时候，不知道执行哪个main函数。因此我们需要加上Main-Class，后接main函数所在类的全路径名（注意冒号之后一定要跟英文的空格，整个文件最后有一行空行）

```shell
 Manifest-Version: 1.0
 Created-By: 11 (Oracle Corporation)
 Main-Class: com.imooc.jardemo1.Welcome
```

添加完成后，重新执行指令打包，这次咱们在打包指令里多加一个参数，即多传入修改完成后的MANIFEST.MF文件

```shell
jar -cvfm welcome.jar META-INF/MANIFEST.MF  com/imooc/jardemo1/Welcome.class com/imooc/jardemo1/impl/Teacher.class
```

其中多了一个参数m，表示要定义MANIFEST文件。之后再重新执行

```shell
java -jar welcome.jar
```

就会发现jar已成功执行

有的同学会说有没有更简便点的方式，因为每次打jar的时候都要指定所有class文件。确实是有的，大家可以尝试一下，直接在src根目录下执行

```shell
javac com/imooc/jardemo1/Welcome.java -d target
```

该命令表示，将所有编译后的.class文件，都放到src/target文件夹下

再将先前修改好的META-INF文件夹整体复制或者移动到target/下，去到target目录，直接执行

```java
jar -cvfm welcome.jar META-INF/MANIFEST.MF * 
```

即可完成打包，注意最后一个位置变成了*，表示把当前目录下所有文件都打在jar包里。
此外，还有一种更简单的也更灵活的方式，不需要修改META-INF/MANIFEST.MF，即不需要指定main函数，而通过如下指令来动态指定

```
java -cp welcome.jar com.imooc.jardemo1.Welcome
```

其中cp表示classpath，后面接上全限的main函数所在的类即可

此种方式虽然灵活，但是由于不需要在MANIFEST.MF里面标注执行函数以及后面要将的Class-Path，需要调用方充分熟悉jar及其内部构造，否则需要在MANIFEST.MF以及相关的使用说明文档里描述清楚。

##### 读取jar内的资源文件

这种情况就是在普通的java项目内部创建一个资源文件并读取，由于实际和资源文件都打包在了一块，可以直接调用。像这里，如果在根目录下执行jar包的main函数时，main函数有如下指令

```java
InputStream is = Welcome.getClass().getResourceAsStream("static/text.txt");
```

则便能获取到项目根目录static/下面的text.txt的信息。

##### 读取jar外的资源文件

这种情况更简单，指明需要去读取的路径即可。像这里，如果在根目录下执行jar包的main函数时，main函数有如下指令

```java
InputStream is = new FileInputStream("/home/work/outside/text.txt");
```

则便能获取到/home/work/outside/text.txt绝对路径下的text.txt内容。

##### 读取外部jar包里的资源文件

结合前面的第2，3种情况，咱们可以先指定MANIFEST.MF里的Class-Path为所要读取的jar包所在的路径，之后和第3种情况一样访问目标jar中的资源文件即可。

##### 双亲委派机制

执行jar其实也就是执行里面的class，而class之所以能够被执行，前提提交是被classloader加载到内存当中，而目前如何加载内部jar的问题也就简化到了如何让classloader加载这些存在于内部jar里的class。

classloader的加载机制，主要是研究其双亲委派机制，大致讲解一下jar的运行过程。jar 运行过程和类加载机制有关，而类加载机制又和我们自定义的类加载器有关，现在我们先来了解一下双亲委派模式。

java 中类加载器分为三个：

1. BootstrapClassLoader 负责加载 ${JAVA_HOME}/jre/lib 部分 jar 包
2. ExtClassLoader 加载 ${JAVA_HOME}/jre/lib/ext 下面的 jar 包
3. AppClassLoader 加载用户自定义 -classpath 或者 Jar 包的 Class-Path 定义的第三方包

类的生命周期为：加载（Loading）、验证（Verification）、准备(Preparation)、解析(Resolution)、初始化(Initialization)、使用(Using) 和 卸载(Unloading)七个阶段。

当我们执行 java -jar 的时候 jar 文件以二进制流的形式被读取到内存，但不会加载到 jvm 中，类会在一个合适的时机加载到虚拟机中。类加载的时机：

1. 遇到 new、getstatic、putstatic 或 invokestatic 这四条字节码指令时，如果类没有进行过初始化，则需要先对其进行初始化。这四条指令的最常见的 Java 代码场景是使用 new 关键字实例化对象的时候，读取或设置一个类的静态字段调用一个类的静态方法的时候。
2. 使用 java.lang.reflect 包的方法对类进行反射调用的时候，如果类没有进行过初始化，则需要先触发其初始化。
3. 当初始化一个类的时候，如果发现其父类还没有进行过初始化，则需要先触发其父类的初始化。
4. 当虚拟机启动时，用户需要指定一个要执行的主类（包含 main() 方法的那个类），虚拟机会先初始化这个主类。

当触发类加载的时候，类加载器也不是直接加载这个类。首先交给 AppClassLoader ，它会查看自己有没有加载过这个类，如果有直接拿出来，无须再次加载，如果没有就将加载任务传递给 ExtClassLoader ，而 ExtClassLoader 也会先检查自己有没有加载过，没有又会将任务传递给 BootstrapClassLoader ，最后 BootstrapClassLoader 会检查自己有没有加载过这个类，如果没有就会去自己要寻找的区域去寻找这个类，如果找不到又将任务传递给 ExtClassLoader ，以此类推最后才是 AppClassLoader 加载我们的类。这样做是确保类只会被加载一次。通常我们的类加载器只识别 classpath （这里的 classpath 指项目根路径，也就是 jar 包内的位置）下 .class 文件。jar 中其他的文件包括 jar 包被当做了资源文件，而不会去读取里面的 .class 文件。但实际上我们可以通过自定义类加载器来实现一些特别的操作。

学到这里，我们便大致明白，之前咱们这样的做法是使用AppClassloader来加载相关jar里面的class的，而在加了-jar参数之后，AppClassloader就只关注welcome.jar范围内的class了，注意这里说的是class，并不包含内部的jar，其内部的jar此时相当于是前面说的内部资源文件，是以二进制流的形式存在的，因此，此时是访问不到内部jar文件的。那该如何是好？其实，这里的线索已经很充足了，我们其实就是用自定义的classloader来发现并获取其内部jar里的class即可。自定义ClassLoader需要继承ClassLoader抽象类，重写findClass方法，这个方法定义了ClassLoader查找class的方式。前面提到，Java 本身支持访问Jar包里面的资源， 他们以 Stream 的形式存在（他们本就处于Jar包之中），而Jar文件被描述为JarFile， 里面的资源文件被描述为JarEntry，可以通过判断JarEntry的Jar属性使得直接访问Jar包内部的Jar包，这里给出一些关键的程序语句以及思路。
首先我们可以以前面静态访问jar内部资源文件的方式访问jar

```java
 InputStream stream = ClassLoader.getSystemResourceAsStream(name); 
```

其中name可以通过遍历jar里面的内容获取到，并且能够过滤出以.jar结尾的文件名并读取
获取到InputStream之后，可以将其转换为File（网上很多教程），而后转换成JarFile

```java
 JarFile jarFile = new JarFile(file); 
```

获取到了jarFile之后，便能获取到jar里面的信息并进行后续的操作了，

```java
 Enumeration enum = jarFile.entries(); 
　　 while (enum.hasMoreElements()) { 
　　　 process(enum.nextElement()); 
　　 } 
```

后续的操作无非就是获取到class二进制流并传递给classloader defineClass去定义并做后续加载（能实现的前提是你了解自定义类加载器的工作原理）
上述过程比较复杂，如果希望直接在自己的类里面访问引用在 Jar包中的Jar包， 可以使用Spring Boot打包插件。强烈推荐该方案， 适用于所有的jar项目，主要通过maven打包
pom.xml

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <executions>
        <execution>
            <goals>
                <goal>repackage</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

具体过程就靠大家去研究了。这里大致讲解下Springboot的Jar包内的类加载原理。咱们可以尝试打包一个最简单的springboot jar包，查看META-INF/MANIFEST.MF中的Main-Class，就会发现是Spring Boot的自定义类org.springframework.boot.loader.JarLauncher。

其加载原理则是通过自定义类加载器LaunchedURLClassLoader实现类加载。 流程图如下：





![5d77ecd7000114cb12941252](./5d77ecd7000114cb12941252.png)






### maven问题处理

**问题一：**

经常遇到公司私服或者中央仓库没有的jar包，然后通过各种渠道找到了解决问题的jar包，但是发现没有pom文件，maven项目引入之后，还有maven在本地仓库找不到对应jar包的pom文件，打包的时候会在私服下载对应jar包的pom文件而抛出异常，通过maven就可以解决这个问题。前提是你安装了maven，然后在命令行执行命令就OK了！！！

```
mvn install:install-file -DgroupId=novaplanet.net -DartifactId=commons-lang -Dversion=2.5 -Dfile=F:/commons-lang-2.5.jar -Dpackaging=jar -DgeneratePom=true
```

DgroupId：项目组织唯一的标识符，自己随便起名
DartifactId：项目唯一的标识符，自己可以随便起
Dversion：项目版本
Dfile：jar包路径（绝对路径）
DgeneratePom：是否生成pom文件，ture:生成，false：不生成

**问题二：**

自己本地的jar包，公司私服上没有，如何引用？先在项目的resource目录下新建lib文件夹，然后将你本地的jar包copy过去（这种最好上传至公司私服）

假如缺失的包是javapns-jdk16-163-1.2.jar

在maven的配置如下：

```
<dependencies>
		<dependency>
			<groupId>novaplanet.net</groupId>
			<artifactId>javapns-jdk16-163</artifactId>
			<version>1.2</version>
			<scope>system</scope>				    
			<systemPath>${project.basedir}/src/main/resources/lib/javapns-jdk16-163-1.2.jar</systemPath>
		</dependency>
	</dependencies>
```


build插入下面配置：

```
<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
				    <includeSystemScope>true</includeSystemScope>
				</configuration>
			</plugin>
		</plugins>
	</build>
```


引入之后，编译项目，编译成功不一定代表引入成功了，接着打包，看jar包中的classes下的lib中有没有你需要引入的jar包

**问题三：**

本地maven仓库有很多.lastUpdated结尾的文件，这是为什么？
1、可能是jar的坐标有问题，即groupId、artifactId、version拼写有问题；

2、jar包压根就不存在；

3、私服镜像地址有问题；

4、网络问题，比如本地无法使用ipv6网络，需要强制指定ipv4

由于以上问题，导致jar包无法下载，会在对于的路径下，生成.lastUpdated文件，所以我们需要删除本地仓库.lastUpdated重新下载，要不然会影响再次下载和后续的编译运行。

linux、macos环境下，批量删除

```
find 私服路径 -name "*lastUpdated*" | xargs rm -rf
```





### 参考文献:

作者：翔仔链接：https://www.imooc.com/article/292350

CSDN博主「燕少༒江湖」的原创文章：https://blog.csdn.net/qq_31289187/article/details/81117478