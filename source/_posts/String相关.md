---
title: String相关
typora-root-url: String相关
abbrlink: 39230a67
date: 2022-11-30 16:04:14
keywords: ','
tags: String
categories: String
photos:
description: String
---

String相关

<!--more-->

------



### 子串:

串中任意个**连续的字符**组成的子序列称为该串的子串,

例如  "pwwkew" wke是子串 ,也是子序列,重点是连续,但是属于子序列的不一定是子串

### 子序列:

一个给定的序列的子序列是在该序列中删除若干元素后得到的序列。

### 子串和子序列的相同点:

当子序列连续取时，和子串定义方式类似。它们都是取原来数据的一部分来构成。
故子串一定是子序列，而子序列则不一定是子串。

### 子串和子序列的区别:

由前面定义可以看出，子串是子序列的特例。子序列是在更大的一个范围。
笔者在下面画一个简单的Venn图，以方便理解：

![在这里插入图片描述](/ee229128bb8345ceb02a54d6317ce08e.png)



## 算法题

### [找出无重复字符的最长子串]

示例 1:

输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
示例 2:

输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
示例 3:

输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。



答案:

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        // 记录字符上一次出现的位置
        int[] last = new int[128];
        for(int i = 0; i < 128; i++) {
            last[i] = -1;
        }
        int n = s.length();
        int res = 0;
        int start = 0; // 窗口开始位置
        for(int i = 0; i < n; i++) {
            //根据下表获取指定位置字符的ASCII码
            int index = s.charAt(i);
            //Math.max() 函数返回作为输入参数的最大数字，如果没有参数，则返回 -Infinity。参数里选一个最大的返回
            start = Math.max(start, last[index] + 1);
            res   = Math.max(res, i - start + 1);
            last[index] = i;
        }
        return res;
    }
}
```

思路:

以abcabcbb为例，当i等于3时，也就是指向了第二个a, 此时我就需要查之前有没有出现过a, 如果出现了是在哪一个位置出现的。然后通过last[index] 查到等于1, 也就是说，如果start 依然等于0的话，那么当前窗口就有两个a了，也就是字符串重复了，所以我们需要移动当前窗口的start指针，移动到什么地方呢？移动到什么地方，窗口内就没有重复元素了呢？ 对了，就是a上一次出现的位置的下一个位置，就是1 + 1 = 2。当start == 2, 当前窗口就没有了重复元素，那么以当前字符为结尾的最长无重复子串就是bca,然后再和之前的res取最大值。然后i指向后面的位置，按照同样思路计算。



### [最长回文子串]

给你一个字符串 s，找到 s 中最长的回文子串。

示例 1：

输入：s = "babad"
输出："bab"
解释："aba" 同样是符合题意的答案。
示例 2：

输入：s = "cbbd"
输出："bb"

```java
class Solution {
    public String longestPalindrome(String s) {
        if (s == null || s.length() == 0) {
            return "";
        }
//      保存起始位置，测试了用数组似乎能比全局变量稍快一点
        int[] range = new int[2];
        char[] str = s.toCharArray();
        for (int i = 0; i < s.length(); i++) {
//      把回文看成中间的部分全是同一字符，左右部分相对称
//      找到下一个与当前字符不同的字符
            i = findLongest(str, i, range);
        }
        return s.substring(range[0], range[1] + 1);
    }
    
    public static int findLongest(char[] str, int low, int[] range) {
//      查找中间部分
        int high = low;
        while (high < str.length - 1 && str[high + 1] == str[low]) {
            high++;
        }
//      定位中间部分的最后一个字符
        int ans = high;
//      从中间向左右扩散
        while (low > 0 && high < str.length - 1 && str[low - 1] == str[high + 1]) {
            low--;
            high++;
        }
//      记录最大长度
        if (high - low > range[1] - range[0]) {
            range[0] = low;
            range[1] = high;
        }
        return ans;
    }
}
```

## 如何判断一个字符串中某个字符出现的次数？

```
//1.使用循环
public static void main(String[] args) {
    String str = "ABC123ABC";
    char searchChar = 'B';

    int count = 0;
    char[] charArray = str.toCharArray();
    for (char item : charArray) {
        if (item == searchChar) {
            count++;
        }
    }

    System.out.println("字符" + searchChar + "出现的次数为：" + count);
}
//2.不使用循环
public static void main(String[] args) {
    String str = "ABC123ABC";
    String searchChar = "B";
    int count = 0;

    int origialLength = str.length();
    str = str.replace(searchChar, "");
    int newLength = str.length();

    count = origialLength - newLength;

    System.out.println("字符" + searchChar + "出现的次数为：" + count);
}
```

## 如何反转一个字符串？

```
//1.使用 stringBuilder的reverse()方法
public static void main(String[] args) {
    String str = "ABC123ABC";

    StringBuilder stringBuilder = new StringBuilder(str);
    stringBuilder.reverse();

    String newStr = stringBuilder.toString();

    System.out.println("反转前：" + str);
    System.out.println("反转后：" + newStr);
}
//2.利用入栈出站,先进后出的特性 即入栈顺序是：A B C 1 2 3 A B C  而出栈顺序是：C B A 3 2 1 C B A
public static void main(String[] args) {
    String str = "ABC123ABC";

    char[] charArray = str.toCharArray();
    Stack<Character> stack = new Stack<>();
    StringBuilder newStr = new StringBuilder();

    for (char item : charArray) {
        stack.push(item);
    }

    for (int i = 0; i < charArray.length; i++) {
        newStr.append(stack.pop());
    }

    System.out.println("反转前：" + str);
    System.out.println("反转后：" + newStr.toString());
}
```

## 一串[字符串](https://so.csdn.net/so/search?q=字符串&spm=1001.2101.3001.7020)中出现次数最多的字符以及出现的次数?

通过Map 类实现，通过键值对的方式，可以将输入的字符串的每一个字符，作为键，每个字符出现的次数作为值，如下：

```

    public static void main(String[] args) {
        System.out.println("请输入字符串：");
        //获取键盘上输入的字符串；
        String scan = new Scanner(System.in).nextLine();
        //新建一个HashMap对象；
        Map<Character, Integer> map = new HashMap<>();
        //通过for循环，把String的键值存放到map
        for (int i = 0; i < scan.length(); i++) {
            //通过循环，找到字符串的每一位字符并存入到temp中；
            char temp = scan.charAt(i);
            //如果map里面有temp这个字符,把temp的值加1
            if (map.containsKey(temp)) {
                map.put(temp, map.get(temp) + 1);
            } else {
                //如果map里面没有temp这个字符，把temp的值设为1
                map.put(temp, 1);
            }
        }

        //调用Collections类的max方法，获取map的值的集合；并找出最大的那个值；
        int maxNum = Collections.max(map.values());
        //建立一个set对象
        Set<Character> set = new HashSet<>();
        //通过集合的循环，把map的值放到entry1里，通过entry1找到值最大的maxNum的key;
        for (Map.Entry<Character, Integer> entry : map.entrySet()) {
            if (entry.getValue() == maxNum) {
                set.add(entry.getKey());
            }
        }
        System.out.println("出现次数最多的字母为：" + set + " 最多出现次数为" + maxNum);
    }

```

## Java求[字符串](https://so.csdn.net/so/search?q=字符串&spm=1001.2101.3001.7020)中出现次数最多的字符?

Java求字符串中出现次数最多的字符，如String Str = "aaabbcddddee";那么输出：d 4 ;若String Str = "aaabbcddddeexxxxxx";那么输出：x 6
    【 思路 】：首先将字符串拆分为字符数组，然后转存到HashMap集合中，该集合的key为字符串中出现的字符，value对应该字符出现的次数。最后只需要在HashMap集合中找到Value值最大的key即可。

```
//1.
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
 
public class JavaTest {
	public static void main(String[] args) throws Exception {
		String Str = "AAbbcccaaaa";
		char[] StrArr = Str.toCharArray();// 把字符串转为字符数组toCharArray
 
		Map<Character, Integer> map = MapFunction(StrArr);
		char ch = FindMapMaxValue(map);
	}
 
	/**
	 * MapFunction:实现将字符数组转存到Map中， 其中，Map中的key为出现的字符，value对应该字符出现的次数
	 * @param StrArr  StrArr字符数组，输入前必须先将字符串转为字符数组
	 * @return map 集合中，key为出现的字符（Character），value对应该字符出现的次数（Integer）
	 */
	public static Map<Character, Integer> MapFunction(char[] StrArr) {
		Map<Character, Integer> map = new HashMap<Character, Integer>();
		if (!(StrArr == null || StrArr.length == 0))// 先判断字符数组是否为空
			for (int i = 0; i < StrArr.length; i++)
				if (null != map.get(StrArr[i]))
					// 若不为空，说明已经存在相同字符，则Value值在原来的基础上加1
					map.put(StrArr[i], map.get(StrArr[i]) + 1);
				else
					map.put(StrArr[i], 1);
 
		return map;
	}
 
	/**
	 * FindMapMaxValue 差找map中Value的最大值maxValue，类似于选择排序寻找最大值的过程：
	 * 先任取一个Value值定义为最大值，然后与之比较
	 * @param map 输入Map集合，该集合key为出现的字符（Character），value对应该字符出现的次数（Integer）
	 * @return maxKey 返回出现次数最多的字符
	 */
	public static Character FindMapMaxValue(Map<Character, Integer> map) {
		Set<Character> keys = map.keySet();// 获得所有key值
		Iterator keys_Itera = keys.iterator();// 实例化Iterator
		// keys_Itera.next():依次获得key值
		// map.get(key):获得对应的value值
		Character maxKey = (Character) keys_Itera.next();// 定义第一个为最大value和对应的key
		int maxValue = map.get(maxKey);
 
		while (keys_Itera.hasNext()) {
			Character temp = (Character) keys_Itera.next();
			if (maxValue < map.get(temp)) {
				maxKey = temp;
				maxValue = map.get(temp);
			}
		}
		System.out.println("出现次数最多的字符：" + maxKey + " 出现次数：" + maxValue);
		return maxKey;
	}
}
```

上面的FindMapMaxValue方法，还可以使用Map.Entry提高效率，进一步优化为：

```
	public static char FindMapMaxValue(Map<Character, Integer> map) {
 
		Iterator iter = map.entrySet().iterator();
		Map.Entry entry = (Map.Entry) iter.next();// 将第一个entry定义为最大次数的
		char maxKey = (char) entry.getKey();// 获得K
		int maxValue = (int) entry.getValue();// 获得V
		while (iter.hasNext()) {
			entry = (Map.Entry) iter.next();// 第二个entry
			char tempK = (char) entry.getKey();
			int tempV = (int) entry.getValue();
			if (maxValue < tempV) {
				maxKey = tempK;
				maxValue = tempV;
			}
		}
 
		System.out.println("出现次数最多的字符：" + maxKey + " 出现次数：" + maxValue);
		return maxKey;
	}
```



```
//2.
import java.util.HashMap;
import java.util.Map;
public class JavaTest {
	public static void main(String[] args) throws Exception {
		String Str = "aaabbcddddee";
		char[] StrArr = Str.toCharArray();// 把字符串转为字符数组toCharArray
 
		Map<Character, Integer> map = new HashMap<Character, Integer>();
		if (!(StrArr == null || StrArr.length == 0))// 先判断字符数组是否为空
			for (int i = 0; i < StrArr.length; i++) 
				if (null != map.get(StrArr[i]))
		// 若不为空，说明已经存在相同字符，则Value值在原来的基础上加1
					map.put(StrArr[i], map.get(StrArr[i]) + 1);
				else
					map.put(StrArr[i], 1);
 
		// 找map中Value的最大值maxValue，类似于选择排序，寻找最大值的过程：
		// 先任取一个Value值定义为最大值，然后与之比较
		int maxValue = map.get(StrArr[0]);
		char ch = ' ';
		for (int j = 0; j < StrArr.length; j++)
			if (maxValue < map.get(StrArr[j])) {
				maxValue = map.get(StrArr[j]);
				ch = StrArr[j];
			}
 
		System.out.println("现次数最多的字符：" + ch + " 出现次数：" + maxValue);
	}
}
```

————————————————
版权声明：本文为CSDN博主「AI吃大瓜」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/guyuealian/article/details/51933611