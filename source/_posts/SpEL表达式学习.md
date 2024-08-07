---
title: SpEL表达式学习
typora-root-url: SpEL表达式学习
abbrlink: 200e4d1e
date: 2023-10-08 21:24:50
keywords: 'SpEL'
tags: SpEL
categories: SpEL
photos:
description: SpEL表达式学习
---

SpEL表达式学习

<!--more-->

------



## SpEl

## 1 简介

Spring也有自己的EL，叫Spring Expression Language，简称SpEl。其可以在程序中单独使用，也可以在Spring应用中进行bean定义时使用。其核心是org.springframework.expression.Expression接口，Spring使用该接口来表示EL中的表达式。通过Expression接口的系列getValue()方法我们可以获取对应Expression在特定EvaluationContext下的值，也可以通过其系列setValue()方法来设值。对应的Expression通常不是由我们直接来new对应实现类的实例，而是通过Spring提供的org.springframework.expression.ExpressionParser接口的系列parseExpression()方法来将一个字符串类型的表达式解析为一个Expression。以下是一个简单的示例，在该示例中我们将字符串表达式“1+2”解析为一个Expression，然后进行计算得出其值为3。

```
@Testpublic void test() { String expressionStr = "1+2"; ExpressionParser parser = new SpelExpressionParser(); Expression expression = parser.parseExpression(expressionStr); Integer val = expression.getValue(Integer.class); System.out.println(expressionStr + "的结果是：" + val);}
```

Expression接口有一系列的getValue()方法，当其不接收任何参数时表示将会把Expression的计算结果当做一个Object进行返回，如果我们希望返回的是特定的类型，则可以传递对应的类型作为getValue()方法的参数，如上述示例中传递的Interger.class。我们也可以通过给Expression的getValue()方法传递EvaluationContext用以获取在特定环境下的计算结果，也可以传递一个Object作为Expression计算的rootObject。关于Expression接口的更多介绍请参考Spring的API文档。

## 2 示例

SpEl可以支持一般的算术运算，也可以支持逻辑运算，还可以支持对象的方法调用等。下面我们来看一些对应用法的示例。

### 2.1 算术运算

SpEl支持的算术运算可以是加、减、乘、除、求余、指数等。下面是一个对应的示例。

```
@Testpublic void test01() { ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("(1+2)*5 + 8-6/2").getValue().equals(20));//加减乘除 Assert.assertTrue(parser.parseExpression("8%3").getValue().equals(2));//求余 Assert.assertTrue(parser.parseExpression("2.0e3").getValue().equals(2000.0));//指数 Assert.assertTrue(parser.parseExpression("2^3").getValue().equals(8));//指数}
```

### 2.2 逻辑运算

逻辑运算就是我们熟悉的与、或、非，在SpEl中就对应“and”、“or”和“!”。

```
@Testpublic void test02() { ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("true and true").getValue(Boolean.class));//与 Assert.assertTrue(parser.parseExpression("true or false").getValue(Boolean.class));//与 Assert.assertTrue(parser.parseExpression("!false").getValue(Boolean.class));//非}
```

### 2.3 比较运算

比较运算就是我们熟悉的大于(>)、大于等于(>=)、小于(<)、小于等于(<=)、等于(==)和不等于(!=)。

```
@Testpublic void test03() { ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("5>3").getValue(Boolean.class)); Assert.assertTrue(parser.parseExpression("5<=8").getValue(Boolean.class)); Assert.assertTrue(parser.parseExpression("5==5").getValue(Boolean.class)); Assert.assertTrue(parser.parseExpression("5!=6").getValue(Boolean.class));}
```

### 2.4 字符串

SpEl允许我们在表达式中直接使用int、double、String等。我们的Expression可以通过对应的字符串进行解析，那么当我们的表达式就是需要表示一个字符串时应该如何表示呢？这个时候需要通过单引号“’”来进行包裹。而当我们的字符串中包含单引号时，那么对应的单引号需要使用一个单引号进行转义，即连续两个单引号。

```
@Testpublic void test04() { ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("'abc'").getValue().equals("abc")); Assert.assertTrue(parser.parseExpression("'''abc'").getValue().equals("'abc"));}
```

### 2.5 访问方法

在SpEl表达式中我们也可以直接访问对象的方法。在下述示例中我们就直接在SpEl中访问了字符串的length()方法。

```
@Testpublic void test05() { ExpressionParser parser = new SpelExpressionParser(); //直接访问String的length()方法。 Assert.assertTrue(parser.parseExpression("'abc'.length()").getValue().equals(3));}
```

### 2.6 使用EvaluationContext

我们先来看一个例子，在下列示例中我们在表达式中直接写name和getName()，这个时候Expression是无法解析的，因为其不知道name和getName()对应什么意思。

```
@Testpublic void test06() { ExpressionParser parser = new SpelExpressionParser(); parser.parseExpression("name").getValue(); parser.parseExpression("getName()").getValue();}
```

通过指定EvaluationContext我们就可以让name和getName()变得有意义。指定了EvaluationContext之后，Expression将根据对应的EvaluationContext来进行解析。如下示例中我们构建了一个基于user对象的EvaluationContext，user对象将作为StandardEvaluationContext的rootObject，那么对应的Expression就将根据该rootObject对象来获取对应表达式的值。我们可以看到user对象定义了一个getName()方法，在解析name和getName()表达式时都将访问user对象的getName()方法，即它们的返回结果都为字符串“abc”。

```
@Testpublic void test06() { Object user = new Object() {  public String getName() {   return "abc";  } }; EvaluationContext context = new StandardEvaluationContext(user); ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("name").getValue(context, String.class).equals("abc")); Assert.assertTrue(parser.parseExpression("getName()").getValue(context, String.class).equals("abc"));}
```

上述示例中的表达式name表示对应EvaluationContext的rootObject的一个属性，在进行解析时，如果对应的get方法存在，则将直接访问对应的get方法，如上述示例中的getName()，否则将直接对其进行访问，这个时候就需要我们的属性是公有的，以便外部类可以访问。对于对象而言，我们可以访问其属性的属性或方法，中间以点进行连接。

### 2.7 使用rootObject

当我们的表达式是基于某一个对象的时，我们也可以把对应的对象作为一个rootObject传递给对应的Expression以进行取值。如上述示例我们也可以直接将user对象作为rootObject传递给对应的Expression以获取对应的值。

```
@Testpublic void test07() { Object user = new Object() {  public String getName() {   return "abc";  } }; ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("name").getValue(user, String.class).equals("abc")); Assert.assertTrue(parser.parseExpression("getName()").getValue(user, String.class).equals("abc"));}
```

### 2.8 List、Array、Map等元素的访问

在SpEl中我们可以通过索引的形式访问List或Array的某一个元素，对应的索引是从0开始的，以“list[index]”的形式出现。如下述示例中的test08_1和test08_2。

```
@Testpublic void test08_1() { Object user = new Object() {  public List<String> getInterests() {   List<String> interests = Arrays.asList(new String[] {"BasketBall", "FootBall"});   return interests;  } }; ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("interests[0]").getValue(user, String.class).equals("BasketBall")); Assert.assertTrue(parser.parseExpression("interests[1]").getValue(user, String.class).equals("FootBall"));} @Testpublic void test08_2() { Object user = new Object() {  public String[] getInterests() {   return new String[] {"BasketBall", "FootBall"};  } }; ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("interests[0]").getValue(user, String.class).equals("BasketBall")); Assert.assertTrue(parser.parseExpression("interests[1]").getValue(user, String.class).equals("FootBall"));}
```

而对于Map而言，则是通过类似于“map[key]”的形式访问对应的元素的。示例如下。

```
@Testpublic void test08_3() { Object user = new Object() {  public Map<String, String> getInterests() {   Map<String, String> interests = new HashMap<String, String>();   interests.put("key1", "BasketBall");   interests.put("key2", "FootBall");   return interests;  } }; ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("interests['key1']").getValue(user, String.class).equals("BasketBall")); Assert.assertTrue(parser.parseExpression("interests['key2']").getValue(user, String.class).equals("FootBall"));}
```

### 2.9 构造List

在SpEl中可以使用“{e1,e2,e3}”的形式来构造一个List，如下示例中我们就构造了一个List。

```
@Testpublic void test09() { ExpressionParser parser = new SpelExpressionParser(); List<Integer> intList = (List<Integer>)parser.parseExpression("{1,2,3,4,5,6}").getValue(); int index = 0; for (Integer i : intList) {  Assert.assertTrue(i == ++index); }}
```

如果我们希望构造的List的元素还是一个List，则可以将构造的List的元素定义为”{e1,e2,e3}”这样的形式，如`{ {1,2},{3,4,5},{6,7,8,9} }`。

```
@Testpublic void test09_1() { ExpressionParser parser = new SpelExpressionParser(); List<List<Integer>> list = (List<List<Integer>>)parser.parseExpression("{ {1,2},{3,4,5},{6,7,8,9}}").getValue(); int index = 0; for (List<Integer> intList : list) {  for (Integer i : intList) {   Assert.assertTrue(i == ++index);  } }}
```

如果需要构造一个空的List，则直接将对应的表达式字符串定义为“{}”即可。

### 2.10 构造Map

我们知道Map是可以key-value的形式存在的，在SpEl中如果我们需要构造一个Map则可以使用“{key1:value1,key2:value2}”这样的形式进行定义，即使用大括号包起来，然后key和value之间以冒号“:”分隔构成一个Entry，多个Entry之间以逗号分隔。如下示例中我们就构建了一个key为String，value为Long类型的Map。

```
@Testpublic void test10() { ExpressionParser parser = new SpelExpressionParser(); Map<String, Long> map = (Map<String, Long>)parser.parseExpression("{'key1':1L,'key2':2L}").getValue(); Assert.assertTrue(map.get("key1").equals(1L)); Assert.assertTrue(map.get("key2").equals(2L));}
```

如果需要构造一个空的Map，则只需指定对应的表达式为“{:}”即可。

```
@Testpublic void test10_1() { ExpressionParser parser = new SpelExpressionParser(); Map<String, Long> map = (Map<String, Long>)parser.parseExpression("{:}").getValue(); Assert.assertTrue(map.isEmpty());}
```

### 2.11 构造数组

对于数组的构造就比较简单了，我们可以在表达式中使用Java代码中new的语法来构造一个数组。

```
@Testpublic void test11() { ExpressionParser parser = new SpelExpressionParser(); int[] nums = (int[])parser.parseExpression("new int[]{1,2,3}").getValue(); Assert.assertTrue(nums.length==3);}
```

如果需要构造一个空数组，则可以直接new一个空的数组。多维数组也是支持的，但是多维数组只支持定义一个空的数组，对于需要初始化指定数组元素的定义暂时在SpEl中是不支持的。

```
@Testpublic void test11_1() { ExpressionParser parser = new SpelExpressionParser(); int[][] nums = (int[][])parser.parseExpression("new int[2][3]").getValue();//正确 int[][] nums2 = (int[][])parser.parseExpression("new int[2][3]{ {1,2,3},{4,5,6}}").getValue();//错误}
```

### 2.12 集合选择

SpEl允许我们将集合中的某些元素选出组成一个新的集合进行返回，这就是所谓的集合。打个比方，我们有一个List，其包含1-9共9个数字，通过集合选择的功能我们可以选出其中的奇数组成一个新的List进行返回，即1、3、5、7、9。集合的选择使用的语法是“collection.?[condition]”，condition中直接使用的属性、方法等都是针对于集合中的元素来的。如下示例中我们的user对象的getInterests()方法返回包含三个元素的List，然后我们通过endsWith(‘Ball’)筛选出以Ball结尾的元素组成一个新的List。

```
@Testpublic void test12_1() { Object user = new Object() {  public List<String> getInterests() {   List<String> interests = new ArrayList<String>();   interests.add("BasketBall");   interests.add("FootBall");   interests.add("Movie");   return interests;  } }; ExpressionParser parser = new SpelExpressionParser(); List<String> interests = (List<String>)parser.parseExpression("interests.?[endsWith('Ball')]").getValue(user); Assert.assertTrue(interests.size() == 2); Assert.assertTrue(interests.get(0).equals("BasketBall")); Assert.assertTrue(interests.get(1).equals("FootBall"));}
```

对于Map的选择而言，其中的condition中直接使用的属性和方法针对的主体都是Map的Entry。如下示例中我们通过条件value.endsWith(‘Ball’)选出Map中value以Ball结尾的Entry组成一个新的Map进行返回，对应的条件相当于Entry.getValue().endsWith(“Ball”)。

```
@Testpublic void test12_2() { Object user = new Object() {  public Map<String, String> getInterests() {   Map<String, String> interests = new HashMap<String, String>();   interests.put("key1", "BasketBall");   interests.put("key2", "FootBall");   interests.put("key3", "Movie");   return interests;  } }; ExpressionParser parser = new SpelExpressionParser(); Map<String, String> interests = (Map<String, String>)parser.parseExpression("interests.?[value.endsWith('Ball')]").getValue(user); Assert.assertTrue(interests.size() == 2); Assert.assertTrue(interests.get("key1").equals("BasketBall")); Assert.assertTrue(interests.get("key2").equals("FootBall"));}
```

### 2.13 集合投影

集合投影的意思是将集合中每个元素的某部分内容的组成一个新的集合进行返回。集合投影的语法是“collection.![projectionExpression]”，其中projectionExpression中直接使用的属性和方法都是针对于collection中的每个元素而言的，对于List而言其就表示List中的每个元素，对于Map而言，其就表示Map中的每个Entry。在如下示例中我们就将List中的每一个元素调用endsWith()方法后的结果组成一个新的List进行返回。

```
@Testpublic void test13_1() { Object user = new Object() {  public List<String> getInterests() {   List<String> interests = new ArrayList<String>();   interests.add("BasketBall");   interests.add("FootBall");   interests.add("Movie");   return interests;  } }; ExpressionParser parser = new SpelExpressionParser(); List<Boolean> interests = (List<Boolean>)parser.parseExpression("interests.![endsWith('Ball')]").getValue(user); Assert.assertTrue(interests.size() == 3); Assert.assertTrue(interests.get(0).equals(true)); Assert.assertTrue(interests.get(1).equals(true)); Assert.assertTrue(interests.get(2).equals(false));}
```

Map进行投影的结果是一个List。如下示例中我们就将一个Map的value投影为一个List，对应List中元素的顺序是不定的。

```
@Testpublic void test13_2() { Object user = new Object() {  public Map<String, String> getInterests() {   Map<String, String> interests = new HashMap<String, String>();   interests.put("key1", "BasketBall");   interests.put("key2", "FootBall");   interests.put("key3", "Movie");   return interests;  } }; ExpressionParser parser = new SpelExpressionParser(); List<String> interests = (List<String>)parser.parseExpression("interests.![value]").getValue(user); Assert.assertTrue(interests.size() == 3); for (String interest : interests) {  Assert.assertTrue(interest.equals("BasketBall") || interest.equals("FootBall") || interest.equals("Movie")); }}
```

### 2.14 设置变量

在前面我们已经介绍了EvaluationContext和rootObject的用法，貌似使用EvaluationContext时直接使用rootObject更简单一些。那是不是所有使用EvaluationContext的地方都可以改成使用rootObject呢？答案是否定的。EvaluationContext的功能相比rootObject而言还是要丰富很多的，如其可以设置变量、方法等供表达式使用。对于变量而言，我们可以通过EvaluationContext的setVariable()方法进行设置，然后在表达式中使用时通过“#varName”的形式进行使用。如下示例中我们就给EvaluationContext设置了一个名为“user”的变量，然后在表达式中通过“#user”来使用该变量。

```
@Testpublic void test14() { Object user = new Object() {  public String getName() {   return "abc";  } }; EvaluationContext context = new StandardEvaluationContext(); //1、设置变量 context.setVariable("user", user); ExpressionParser parser = new SpelExpressionParser(); //2、表达式中以#varName的形式使用变量 Expression expression = parser.parseExpression("#user.name"); //3、在获取表达式对应的值时传入包含对应变量定义的EvaluationContext String userName = expression.getValue(context, String.class); //表达式中使用变量，并在获取值时传递包含对应变量定义的EvaluationContext。 Assert.assertTrue(userName.equals("abc"));}
```

#### #root

\#root在表达式中永远都指向对应EvaluationContext的rootObject对象。在如下示例中#root就指向了对应的user对象。

```
@Testpublic void test14_1() { Object user = new Object() {  public String getName() {   return "abc";  } }; EvaluationContext context = new StandardEvaluationContext(user); ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("#root.name").getValue(context).equals("abc"));}
```

#### #this

\#this永远指向当前对象，其通常用于集合类型，表示集合中的一个元素。如下示例中我们就使用了#this表示当前元素以选出奇数作为一个新的List进行返回。

```
@Testpublic void test14_2() { ExpressionParser parser = new SpelExpressionParser(); List<Integer> intList = (List<Integer>)parser.parseExpression("{1,2,3,4,5,6}").getValue(); EvaluationContext context = new StandardEvaluationContext(intList); //从List中选出为奇数的元素作为一个List进行返回，1、3、5。 List<Integer> oddList = (List<Integer>)parser.parseExpression("#root.?[#this%2==1]").getValue(context); for (Integer odd : oddList) {  Assert.assertTrue(odd%2 == 1); }}
```

### 2.15 注册方法

StandardEvaluationContext允许我们在其中注册方法，然后在表达式中使用对应的方法。注册的方法必须是一个static类型的公有方法。注册方法是通过StandardEvaluationContext的registerFunction(funName,method)方法进行，其中第一个参数表示需要在表达式中使用的方法名称，第二个参数表示需要注册的java.lang.reflect.Method。在表达式中我们可以使用类似于“#funName(params…)”的形式来使用对应的方法。如下示例中我们就通过StandardEvaluationContext注册了一个名叫plusTen的方法。

```
 static class MathUtils {  public static int plusTen(int i) {   return i+10;  } }  @Test public void test15() throws NoSuchMethodException, SecurityException {  ExpressionParser parser = new SpelExpressionParser();  //1、获取需要设置的java.lang.reflect.Method，需是static类型  Method plusTen = MathUtils.class.getDeclaredMethod("plusTen", int.class);  StandardEvaluationContext context = new StandardEvaluationContext();  //2、注册方法到StandardEvaluationContext，第一个参数对应表达式中需要使用的方法名  context.registerFunction("plusTen", plusTen);  //3、表达式中使用注册的方法  Expression expression = parser.parseExpression("#plusTen(10)");  //4、传递包含对应方法注册的StandardEvaluationContext给Expression以获取对应的值  int result = expression.getValue(context, int.class);  Assert.assertTrue(result == 20); }
```

### 2.16 new对象

SpEl支持我们直接在表达式中使用Java中new对象的语法来new一个对象，在new对象的时候需要我们指定对应类的包名，java.lang包除外。如下示例中我们就在表达式中new了一个java.util.Date对象，然后调用了其toLocaleString()方法。

```
 @Test public void test16() {  ExpressionParser parser = new SpelExpressionParser();  String currentTime = (String)parser.parseExpression("new java.util.Date().toLocaleString()").getValue();  System.out.println(currentTime); }
```

### 2.17 赋值

SpEl也支持给表达式赋值，其是通过Expression的setValue()方法进行的，在赋值时需要指定rootObject或对应的EvaluationContext。示例如下。

```
@Testpublic void test17_1() { ExpressionParser parser = new SpelExpressionParser(); Date d = new java.util.Date(); //设日期为1号 parser.parseExpression("date").setValue(d, 1); int date = (Integer)parser.parseExpression("date").getValue(d); Assert.assertTrue(date == 1);}

```

其也支持List、Map等的赋值。对于List和Array而言，在进行赋值时是通过元素的索引进行的，且对应的索引必须是存在的。如下示例中我们就将list的第一个元素由0设置为了1。

```
@Testpublic void test17_2() { ExpressionParser parser = new SpelExpressionParser(); List<Integer> list = new ArrayList<Integer>(1); list.add(0);//添加一个元素0 EvaluationContext context = new StandardEvaluationContext(); //添加变量以方便表达式访问 context.setVariable("list", list); //设置第一个元素的值为1 parser.parseExpression("#list[0]").setValue(context, 1); int first = (Integer)parser.parseExpression("#list[0]").getValue(context); Assert.assertTrue(first == 1);}
```

而对于Map的赋值而言是通过key进行的，对应的key在Map中可以先不存在。如下示例就是对Map的赋值。

```
@Testpublic void test17_3() { ExpressionParser parser = new SpelExpressionParser(); Map<String, Integer> map = new HashMap<String, Integer>(); EvaluationContext context = new StandardEvaluationContext(); //添加变量以方便表达式访问 context.setVariable("map", map); //设置第一个元素的值为1 parser.parseExpression("#map['key1']").setValue(context, 1); int first = (Integer)parser.parseExpression("#map['key1']").getValue(context); Assert.assertTrue(first == 1);}

```

### 2.18 访问静态方法或属性

SpEl也支持访问类的静态方法或属性，其在进行访问的时候需要使用“T(type)”的形式来表示对应的静态类，其中type表示对应类的全限定名，即包括对应的包名。如下示例中就在表达式中访问了java.util.Calendar的静态属性DATE。

```
@Testpublic void test18() { ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("T(java.util.Calendar).DATE").getValue(int.class) == 5);}

```

### 2.19 使用字符代替符号

SpEl也允许我们使用某些字符来代替对应的符号，如ge(>=)、gt(>)、lt(<)、le(<=)、eq(==)、ne(!=)、div(/)、mod(%)、not(!)，而且它们都是大小写不敏感的。使用时中间要以空格分开，示例如下。

```
@Testpublic void test19() { ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("1 lt 2").getValue(boolean.class));//1<2 Assert.assertTrue(parser.parseExpression("1 le 2").getValue(boolean.class));//1<=2 Assert.assertTrue(parser.parseExpression("2 gt 1").getValue(boolean.class));//2>1 Assert.assertTrue(parser.parseExpression("2 ge 1").getValue(boolean.class));//2>=1 Assert.assertTrue(parser.parseExpression("1 ne 2").getValue(boolean.class));//1!=2 Assert.assertTrue(parser.parseExpression("not false").getValue(boolean.class));//!false}

```

### 2.20 使用正则表达式

SpEl也支持使用正则表达式，其中对应的关键字为match。如下示例中即在表达式中使用了正则表达式，表示123是否匹配正则表达式“\d{3}”。

```
@Testpublic void test20 () { ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("123 matches '\\d{3}'").getValue(Boolean.class));//正则匹配三位数字}

```

### 2.21 使用instanceof

SpEl也支持在表达式中使用instanceof关键字，以检测对象是否是特定类型的示例。

```
@Testpublic void test21 () { ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("'123' instanceof T(String)").getValue(Boolean.class));//检测字符串是否是String的实例。}

```

### 2.22 三目运算（if..else..）

SpEl也支持在表达式中使用三目运算符，形式为“exp?trueVal:falseVal”，即如果exp的值为true则返回trueVal，否则返回falseVal。

```
@Testpublic void test22 () { ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("1>2 ? 1 : 2").getValue(int.class) == 2);//1跟2之间的较大者为2。 Assert.assertTrue(parser.parseExpression("1<2 ? 2 : 1").getValue(int.class) == 2);//1跟2之间的较大者为2。}

```

### 2.23 表达式模板

SpEL还支持在解析表达式时将其当做一个字符串模板进行解析，即可以在表达式中混合普通的文本和特定的表达式块，然后在解析的时候将解析将对其中的表达式块进行计算，以实现模板功能。此功能需要我们在解析表达式时传入一个特定的ParserContext，其可以影响SpEl表达式的解析，对应的模板功能应该传递一个TemplateParserContext。这样Spring在解析对应的SpEl表达式时将会把其当做一个模板，然后对其中“#{exp}”形式的表达式进行计算。如下示例就是表达式模板的一个简单用法，其中使用#{}包起来的表达式会被当做一个普通的SpEl表达式进行计算以得出当前的年份，再进行替换，所以所得结果将是“the year is 2014”。

```
@Testpublic void test23 () { //the year is 2014 String expressionStr = "the year is #{T(java.util.Calendar).getInstance().get(T(java.util.Calendar).YEAR)}"; ExpressionParser parser = new SpelExpressionParser(); Expression expression = parser.parseExpression(expressionStr, new TemplateParserContext()); Assert.assertTrue(expression.getValue().equals("the year is 2014"));}

```

### 2.24 设置默认值

SpEl表达式中支持“a?:b”这样的语法来设置默认值。其表示如果a不为null时其结果为a，否则就为b。

```
@Testpublic void test24 () { ExpressionParser parser = new SpelExpressionParser(); Assert.assertTrue(parser.parseExpression("#abc?:123").getValue().equals(123));//变量abc不存在 Assert.assertTrue(parser.parseExpression("1?:123").getValue().equals(1));//数字1不为null}

```

### 2.25 安全导航

我们可能经常会使用类似于“a.b.c”这样的用法，表示a的b属性的c属性，但如果a为null或者a的b属性为null时都会出现空指针。为了避免此种情况发生，我们可以在SpEl表达式中使用安全导航，这样当a为null或a的b属性为null时将直接返回null，而不抛出空指针异常。SpEl表达式中安全导航的语法是将点“.”替换为“?.”，即不使用“a.b.c”，而是使用“a?.b?.c”。

```
@Testpublic void test25 () { ExpressionParser parser = new SpelExpressionParser(); Assert.assertNull(parser.parseExpression("null?.abc").getValue()); Assert.assertNull(parser.parseExpression("T(System)?.getProperty('abc')?.length()").getValue());//数字1不为null}

```

### 2.26 获取bean对象

在SpEL表达式里面也可以直接访问bean对象，前提是指定了一个BeanResolver。BeanResolver是一个接口，其只定义了一个方法resolve，用以通过beanName解析为对应的bean对象并返回，具体定义如下。

```
public interface BeanResolver { Object resolve(EvaluationContext context, String beanName) throws AccessException;}

```

如果要在SpEL表达式中访问bean对象，我们需要通过StandardEvaluationContext来设置对应的BeanResolver，同时我们需要在SpEL表达式中以“@beanName”的方式来访问对应的bean对象。如下是一段示例代码，我们在表达式中获取到了名称为hello的bean对象，并访问了其getKey()方法。

```
@Testpublic void test26() { ExpressionParser parser = new SpelExpressionParser(); StandardEvaluationContext context = new StandardEvaluationContext(); context.setBeanResolver(new MyBeanResolver()); //访问bean名称为hello的bean对象的getKey()方法。 Object obj = parser.parseExpression("@hello.key").getValue(context); System.out.println(obj);}private static class MyBeanResolver implements BeanResolver { private static ApplicationContext appContext = new ClassPathXmlApplicationContext("applicationContext.xml");  public Object resolve(EvaluationContext context, String beanName)   throws AccessException {  return appContext.getBean(beanName); } }

```

## 3 SpelParserConfiguration

在构建SpelExpressionParser时我们可以给其传递一个SpelParserConfiguration对象以对SpelExpressionParser进行配置。其可以用于指定在遇到List或Array为null时是否自动new一个对应的实例，对应SpelParserConfiguration的第一个构造参数；也可以指定在List或Array中对应索引超出了当前索引的最大值时是否自动进行扩充，对应SpelParserConfiguration的第二个构造参数，更多信息请参考Spring的API文档。如下示例中我们就使用了SpelParserConfiguration对象，指定了在对应的List或Array为null时自动new一个对应的对象，并且在对应的索引超出了List或Array当前的最大索引时自动对其进行扩充。所以如下示例中在我们第一次访问User的interests时其为null，之后第二次访问时，由于指定了将自动new对应的对象并且在索引超出时自动进行扩充，所以将new一个List的实例，对应ArrayList，且在索引5不存在时将自动扩充并进行填值，填值时将对List的元素类型String new 6次。所以对于这种情况我们需要保证List或Array中存放的元素类型存在无参构造方法。

```
class User { public List<String> interests;}@Testpublic void test() { User user = new User(); SpelParserConfiguration parserConfig = new SpelParserConfiguration(true, true); ExpressionParser parser = new SpelExpressionParser(parserConfig); //第一次为null Assert.assertNull(parser.parseExpression("interests").getValue(user)); //自动new一个List的实例，对应ArrayList,并自动new String()添加6次。 Assert.assertTrue(parser.parseExpression("interests[5]").getValue(user).equals("")); //size为6 Assert.assertTrue(parser.parseExpression("interests.size()").getValue(user).equals(6));}

```

## 4 在bean定义中使用SpEl

在bean定义中使用SpEl表达式的语法是“#{exp}”。exp就是对应的表达式。如下示例中我们定义了一个名为hello的bean，在指定其userDir时我们使用了表达式。

```
<bean id="hello" class="com.app.Hello"> <property name="userDir" value="#{T(System).getProperty('user.dir')}"/></bean>

```

对于系统属性而言，在bean定义中使用时有一个内置的变量可以使用叫systemProperties，而且在使用时不需要加“#”，即不需要以“#systemProperties”的形式出现。所以上述示例也可以是如下这样。

```
<bean id="hello" class="com.elim.learn.spring.bean.Hello"> <property name="userDir" value="#{systemProperties['user.dir']}"/></bean>

```

### 4.1 引用其它bean的属性

在进行bean定义时，我们也可以通过表达式引用其它bean定义的属性。如下示例中我们就在定义id为world的bean的key属性时通过表达式引用了名为hello的bean的key属性，即world的key属性也将被赋予值“abc”。

```
<bean id="hello" class="com.app.Hello"> <property name="key" value="abc"/></bean><bean id="world" class="com.app.World"> <property name="key" value="#{hello.key}"/></bean>

```

### 4.2 基于注解配置的使用

在基于注解配置的bean定义中我们也可以使用SpEl表达式进行某些定义。在基于注解配置bean定义时我们可以使用@Value注解定义在方法或属性上来指定对应的值。此时我们就可以使用对应的表达式，当然不使用表达式也是可以的。如下示例中我们就通过@Value指定了userDir和key的值。其中userDir的值的定义使用了SpEl表达式，而key的值的定义是直接定义的。

```
public class Hello { @Value("#{systemProperties['user.dir']}") private String userDir; @Value("abc") private String key; public String getUserDir() {  return userDir; } public void setUserDir(String userDir) {  this.userDir = userDir; } public String getKey() {  return key; } public void setKey(String key) {  this.key = key; }}

```

（注：本文是基于Spring4.1.0所写）