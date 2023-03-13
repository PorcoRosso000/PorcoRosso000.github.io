---
title: List集合
typora-root-url: List集合
tags: List
abbrlink: cf90fc03
date: 2023-03-10 07:56:58
categories:
permalink:
---



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

    删除重复数据
    保持添加到其中的数据的顺序

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

## 原文链接：

————————————————
版权声明：本文为CSDN博主「Jie975」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/Jie975/article/details/109851875