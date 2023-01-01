---
title: String相关
typora-root-url: String相关
date: 2022-11-30 16:04:14
tags:
permalink:
---

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