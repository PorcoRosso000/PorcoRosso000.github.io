---
title: JavaScript语法笔记
typora-root-url: JavaScript语法笔记
abbrlink: 50c89042
date: 2023-06-03 21:15:48
keywords: 'JavaScript'
tags: JavaScript
categories: JavaScript
photos:
description: JavaScript语法笔记
---

JavaScript语法笔记

<!--more-->

------



### 校验：

```

车牌校验
var re = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
手机号校验
var reg = /^((\+?86)|(\(\+86\)))?(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
身份证校验
var reg = /^\d{15}(\d{2}(\d|[A-Z]))?$/;
必须为大于等于0的数字,且只能保留两位小数
theregex = /^(\d+)([.]\d{1,2})?$/;
去掉空格
value = value.replace(/(^\s*)|(\s*$)/g, '');  //去掉空格;
必须为数字,且只能保留两位小数
theregex = /^(-)?(\d+)([.]\d{1,2})?$/;

```

### 全选

```
/**
 * 全选
 */
function check_all(){
   var checked = $("#check_all").attr("checked");
   var items = $("input[name=check_item][type=checkbox]");
   $.each(items ,function(){
      this.checked = checked;
   });
}
```

### js数组循环

```
var arr = [1, 2, 3, 4, 5, 6];

    // 第一种   for循环遍历
    var newArr = [];
    for(var i = 0; i < arr.length; i++){
      newArr.push(arr[i])
      console.log(newArr)
    }

    // 第二种 es6语法  arr.forEach()遍历
    var newArr = [];
    arr.forEach((item) => {
      newArr.push(arr[item])
      console.log(newArr)
    })

    // 第三种   Object.keys()遍历
    // (个人推荐比较好用：枚举方法)   (返回一个数组,包括对象自身的(不含继承的)所有可枚举属性(不含Symbol属性).)
    var newArr = [];
    Object.keys(arr).forEach((item) => {
      newArr.push(arr[item])
      console.log(newArr)
    })


     // 第四种   arr.map(function callback(currentValue[, index[, array]]) 或者这样 array.map(item,index,arr) 
    // currentValue: callback一系列中正在处理的当前元素 index: callback一系列中正在处理的当前元素的索引。array:  map 调用方法的目录
    var newArr = []
    arr.map((item) => {
      newArr.push(arr[item])
      console.log(newArr)
    })

    // 第五种   for...in...遍历
    //  循环遍历对象自身的和继承的可枚举属性(循环遍历对象自身的和继承的可枚举属性(不含Symbol属性).).
    var newArr = []
    for(var i in arr ) {
      newArr.push(arr[i])
      console.log(newArr,'1111111')
    }

    // 第六种   for-of遍历
    //不仅支持数组,还支持大多数类数组对象,例如DOM NodeList对象.
    //也支持字符串遍历,它将字符串视为一系列的Unicode字符来进行遍历.
    var newArr = []
    for(var i of arr){
      newArr.push(arr[i])
      console.log(newArr)
    }

    // 第七种   Object.getOwnPropertyNames(obj) 遍历
    //  返回一个数组,包含对象自身的所有属性(不含Symbol属性,但是包括不可枚举属性).
    var newArr = [];
    Object.getOwnPropertyNames(arr).forEach((item) => {
      newArr.push(arr[item])
      console.log(newArr,'!!!!')
    })

    // 第八种   Reflect.ownKeys(obj)遍历  
    // 返回一个数组,包含对象自身的所有属性,不管属性名是Symbol或字符串,也不管是否可枚举.
    var newArr = [];
    Reflect.ownKeys(arr).forEach((item) => {
      newArr.push(arr[item])
      console.log(newArr) 
      //  数组可以全部打印出来特别！！！！
    })

```

### 模版引擎Velocity

#### [Velocity(1)——注释](https://www.cnblogs.com/yuepeng/archive/2010/11/22/1884840.html)

Velocity的单行注释，使用##

多行注释使用#* cooments *#

#### [Velocity(2)——引用](https://www.cnblogs.com/yuepeng/archive/2010/11/22/1884901.html)

在Velocity Template Language（VTL）中，有三种类型的引用：变量，属性，方法。所有的引用都被看作是字符串，如果某个引用是一个整型值，velocity会调用它的toString()方法，将它转换为String。

**变量：**

变量是由$和紧跟其后的VTL标识符组成的。而VTL标识符必须以字母开头，后面可以包含并且仅能包含字母、数字、下划线以及减号。像$2.4这样的字符串，是不会被识别为变量的，因为2.4不是一个VTL标识符。

**属性：**

属性是由四部分组成，依次是$, 紧跟其后的VTL标识符，小数点，紧跟其后的VTL标识符。比如$Foo.bar。实际上，这个属性有两个含义，它可以表示在Foo标记的hashtable中寻找并返回bar这个key对应的value，也可以表示$Foo.getbar()这个方法(此方法在java中定义)。

**方法：**

方法是由四部分组成，依次是$,紧随其后的VTL标识符，小数点，紧随其后的函数调用。这里的函数调用是可以带参数的。比如$Foo.getBar("test")。

很显然，属性有时是方法的一种简写，$Foo.bar和$Foo.getbar()是等价的，这种情况下，尽量使用属性的形式。但是方法有参数的话，就没有和它等价的属性了。

**属性的搜索规则：**

属性可以表示为调用方法，也可表示从hashtable中找值，对于$Foo.bar来说，Velocity会按照以下顺序解析：

$Foo.getbar(), $Foo.getBar(), $Foo.get("bar"), $Foo.isBar()

而对于$Foo.Bar来说，Velocity会按照以下顺序解析：

$Foo.getBar(), $Foo.getbar(), $Foo.get("Bar"), $Foo.isBar()

所以，前两个是寻找方法，第三个是在hashtable中找值，第四个是一个is判断。

另外需要注意的是，属性不会被解析为对象的实例变量。$Foo.bar可以表示$Foo.getbar()或者$Foo.get("bar")，但是它不表示Foo这个java对象的bar属性。

**规范的引用写法：**

$Foo是一个简化后的写法，规范的写法应该是${Foo}。大部分情况下，简化写法是可以的，但是当一个引用后面紧跟一个VTL标识符时，规范写法就是必要的了。比如$Footic和${Foo}tic就是两种不同的含义。所以，尽量还是使用规范写法，它永远不会有错。属性和方法的规范写法是${Foo.bar}以及${Foo.bar()}。

**Quiet Reference Notation(不知道该怎么翻译):**

如果一个引用(不管哪种类型)没有被定义，那么在使用时，它就没有值。Velocity默认的做法是，将这个引用作为普通字符串对待。比如，在<input type="text" name="email" value="$email" />中，如果$email并没有定义，那么这个文本框的value就是"$email"这个字符串。如果用$!email替代$email，那么输出将会是空字符串，而不是"$email"。对应的规范写法是$!{email}。

#### [Velocity(3)——字面值和转义](https://www.cnblogs.com/yuepeng/archive/2010/11/23/1885072.html)

**货币符号：**

$是美元的符号，在文本中出现的"$2.5"这样的字符串，是不会被Velocity解释为一个变量或者一个属性的，因为2.5或者2或者5都不是一个VTL标识符。

**转义：**

假如需要在文本中最后显示"$foo"这四个字符组成的字符串本身，而非变量$foo的值，可以使用转义字符(\)。假定$foo已经定义过了，那么：

```
#set($foo="bar")
$foo                            输出             bar
\$foo                           输出             $foo
\\$foo                          输出             \bar
\\\$foo                         输出             \$foo
```

假如$foo没有定义，那么：

```
$foo                            输出              $foo
\$foo                           输出              \$foo
\\$foo                          输出              \\$foo
\\\$foo                         输出              \\\$foo
```

#### [Velocity(4)——大小写](https://www.cnblogs.com/yuepeng/archive/2010/11/23/1885159.html)

Velocity是大小写敏感的。但是为了减少使用者的错误，某些地方存在特殊情况。比如$foo.bar，首先会被检查是否能匹配$foo.getbar()，再被检查是否能匹配$foo.getBar()。而$foo.Bar，首先会被检查是否能匹配$foo.getBar()，再被检查是否能匹配$foo.getbar()。正如在《[Velocity(2)——引用](http://www.cnblogs.com/yuepeng/archive/2010/11/22/1884901.html)》所提到的那样，属性不会被解析为对象的实例变量，即$foo.bar不表示foo这个java对象的bar属性。

#### [Velocity(5)——#set指令](https://www.cnblogs.com/yuepeng/archive/2010/11/23/1885257.html)

引用可以让模板设计者生成动态内容，而指令允许设计者真正的负责页面的展现和内容。

指令是以#开头，后面紧跟一个关键字，比如if，else，foreach等。而这个关键字，是可以被放在{}中间的。这是规范的写法，但是可能不好看。

**#set**

\#set指令用于向一个变量或者属性赋值。其格式为 #set($foo="bar")或者#set($foo.bar=$test) 。

LHS必须是一个变量或者属性，RHS必须是以下7种类型之一：变量、属性、字符串字面值、数字字面值、方法、ArrayList、Map。比如：

```
#set( $test = $test2 + 3)
#set( $test.a = "abc")
#set( $test.b = 1)
#set( $test.c = $test.a)
#set( $test.d = $test.calc("1+1"))
#set( $test.e = ["123", "abc", $test.c])          访问时使用$test.e.get(0)就可以获得值"123"
#set( $test.f = {"name":"car", "color":"red"})   访问时使用$test.f.get("color")就可以获得值"red"
```

默认情况下，RHS是null的话，将不会对LHS进行赋值，LHS会保持原来的值。所以一个引用一旦被创建，一般是无法移除的。但是可以修改Velocity的某个配置，改变这一现象。在#foreach里进行判断时，要特别注意。

在使用#set时，字符串的字面值如果放在双引号里，将会被解析。比如#set( $test.a = "abc"), 那么$test.a的值就是abc。而#set( $test.b = "$test.a")等价于#set( $test.b=$test.a )。但是#set( $test.b = '$test.a') 的结果却是把$test.a这个字符串字面值赋值给$test.b。

当遇到需要输出大量的字符串字面值，而不是输出它们的实际值的情况时，可以使用#literal() ... #end来包围VTL Code。

#### [Velocity(6)——#if指令](https://www.cnblogs.com/yuepeng/archive/2010/11/23/1885282.html)

下面是#If指令的一个简单而完整的示例：

```
#if ($foo < 10)    Go North#elseif ($foo == 10)    Go East#else    Go West#end                   不能漏掉
```

\#if指令用于判断某个条件是否为true。以上面的代码为例，当$foo < 10为true时，将会显示"Go North"。

有时会看到这样一种写法：#if($foo) ... #end。这里充当判断条件的是一个变量$foo，它在两种情况下是true:一是$foo作为布尔值(Boolean)并且其值为true，二是$foo是一个非布尔值并且值不为null。

**关系运算**

Velocity的关系运算中有一个==。它和Java中的==不太一样。java中==严格判断两个对象是否是同一个对象(内存地址是否是同一个，是否是同一个类的对象)，而不是判断它们的值是否相同(两个String的字面值是否相同要使用equals()方法)。而Velocity中的==可以直接比较数值，字符串以及其他对象，如果==两侧的对象是不同的类的对象，在比较前会用toString()转换后再比较。

**逻辑运算**

Velocity的逻辑运算有AND、OR、NOT三个。表现在语法上是&&、||、!这三个符号。下面是几个示例：

```
#if($foo && $bar<10)...#end#if($foo || $bar)...#end#if(! $foo )...#end
```

需要注意的是，&&和||是有短路效应的。一旦前一个就可以判断真假，后面的条件不再进行判断。另外，要特别注意$!foo和!$foo的区别。

#### [Velocity(7)——#foreach指令](https://www.cnblogs.com/yuepeng/archive/2010/11/23/1885524.html)

首先是#foreach的简单示例：

```
#foreach( $elem in $allElems)    $elem</br>#end
```

上面这个例子中，$allElems可以是一个Vector，一个HashTable，一个数组。

在Velocity中，有一个变量$velocityCount用作循环计数，初始值是1。这个变量的名字和初始值是在velocity.properties文件里配置的。

下面是更多的几个例子：

```
#set($nums=[-2 .. 2])
#foreach($i in $nums)    
$i
#end
```



```
#foreach($key in $allElems.keySet())    
Key:$key ---> Value:$allElems.get($key)<br>
#end
其中，allElems是一个HashTable
```

 

#### [Velocity(8)——引入指令和#Stop指令](https://www.cnblogs.com/yuepeng/archive/2010/11/23/1885622.html)

\#Include和#Parse都是用于将本地文件引入当前文件的指令，而且被引入的文件必须位于TEMPLATE_ROOT。这两者之间有一些区别。

**#Include**

被#Include引入的文件，其内容不会被Velocity引擎解析，所以这些文件应该是静态模板，即不含有VTL的模板。使用#Include()指令时，参数是被双引号括起来的文件名或者是表示文件名的变量。如果有多个文件，以逗号隔开即可。比如#Include("a.gif", "b.html", $file)。

**#Parse**

\#Parse用来在当前模板中引入并执行另一个(本地的)模板——可以是静态的，也可以是动态的——并把结果嵌入到当前位置。#Parse()指令的参数，可以是一个双引号括起来的文件名，也可以是一个变量，但是它不能接受多个参数。

被#Parse引入的文件仍然可以使用#Parse指令。在velocity.properties文件中有一个属性directive.parse.max.depth，默认值是10，它指定了#Parse嵌套的最大层次。既然#Parse嵌套是允许的，#Parse递归也是允许的。

假如a.vm #Parse b.vm，那么a.vm中定义的变量$v，在b.vm中可以随便使用。如果b.vm也定义了$v，那么b.vm中用到的将会是自己的$v，而不是a.vm中的$v。

**#Stop**

\#Stop指令会停止模板引擎的执行，并返回。这在debug中比较有用。

#### [Velocity(9)——宏](https://www.cnblogs.com/yuepeng/archive/2010/11/23/1885700.html)

**定义宏和使用宏**

\#macro指令用于定义一个VTL模板的重复代码块——宏。下面是一个简单的定义宏的例子：

```
#macro( d )
<tr><td></td><tr>
#end
```

这段代码定义了一个宏，名字为d，没有参数。下面是使用这个宏的代码：

```
#d()
```

Velocity在遇到#d()的时候，会用"<tr><td></td></tr>"替代上面的#d()这一行。

**宏的参数：**

宏也可以带参数，而且是任意多个参数。不过，宏定义时有几个参数，宏调用时就要提供同样数目的参数。

```
#macro( d $name)    
<tr><td>$name</td></tr>
#end
```

 

```
#d("name1")
```

宏的参数可以是以下VTL元素中的任意一种：引用、字符串字面值、数值字面值、整数范围(比如[1 .. 10]、[$start .. $end])、数组、布尔值true或者false。

宏的参数可以是方法，那么下面这个例子，需要特别注意：

```
#macro(test $a)    
$a $a $a
#end
#test($foo.bar())
```

上面这个例子中，$foo.bar()将会被调用3次，而不是一次。

 

**内联的宏**

当宏是在一个Velocity模板中定义时，这个宏(是inline的)只能被该模板使用，同一个网站下的其他模板是不能用的。如果是在一个Velocity宏模板库中定义的宏，就可以被任何同一网站下的模板使用。

**和宏有关的一些Velocity属性**

velocimacro.library——用逗号分隔的一组文件名，是Velocity宏模板库。默认值是VM_global_library.vm

velocimacro.permissions.allow.inline——宏是否可以在一个普通模板中定义。默认值是false。

velocimacro.permissions.allow.inline.to.replace.global——是否允许模板中的宏覆盖library中的宏。默认值是false。

velocimacro.permissions.allow.inline.local.scope——一个在普通模板中定义的宏，是否允许其他模板使用。默认是false。

velocimacro.context.localscope——在一个宏里通过#set()修改了context，此修改是否仅仅对这个宏自身，而不是永久性修改了context。默认值是false。

velocimacro.library.autoreload——Velocity宏模板库修改之后，是否自动重新加载。默认值是false。debug时可以设置为true，发布时设置为false。

**其他一些注意点**

宏必须在第一次使用它之前定义。当#Parse()一个模板文件时，尤其要注意这一点。

#### [Velocity(10)——指令的转义](https://www.cnblogs.com/yuepeng/archive/2010/11/23/1885861.html)

引用的转义使用"\",指令的转义也是使用"\"。但是，指令的转义要比引用的转义复杂很多。例如：

```
#if($foo)    
Go!
#end
$foo为true,输出Go!；否则不输出任何内容。
```

使用转义：

```
\#if( $foo )    
Go!\
#end此时，"\"和"#"结合，从而破坏了原本的#if()，而$foo作为判断条件，也不会被解析。所以上面这段代码，无论$foo是true还是false，结果都是
#if( $foo )    
Go!
#end这类似于使用了#literal() ... #end指令。
```

 如果使用两个"\"：

```
\\#if( $foo )   
Go!\\
#end首先，#if前面的两个假定$foo是true，那么会输出"Go!"，并且是紧跟在刚才的"\"后面(因为没有换号符)。#if($foo)和#end之间的内容，都会输出，包括#end前面的两个"\"，它们会被解析为一个"\"。如果$foo是false，仅仅输出一个"\"，而"Go!"以及后面下一行的"\"不会输出。"\"结合，变为一个"\"输出。然后#if($foo)正常处理。
```

还有一种情况需要说明：

```
\\\#if($foo)    
Go!\\
#end
前两个"\"被解析为"\"，第三个"\"和后面的"#"解析为"#"，#if()被破坏。所以输出就是 \#if($foo)   Go!\......注意最后那里，有一个合法的#end，但是它是多余的，所以这一段代码是会报错的。
```



 

参考文献:

博客园  [月光疾风]:https://www.cnblogs.com/yuepeng/category/271243.html