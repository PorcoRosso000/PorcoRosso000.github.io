---
title: Python自动填写问卷
typora-root-url: Python自动填写问卷
abbrlink: c3247e92
date: 2023-07-07 06:49:00
tags:
categories:
permalink:
---



### 一、配置环境

#### 1.1安装依赖

①这里我们需要用到python的库函数——selenium库，这是帮助我们去爬取网页信息和处理网页的重要工具。也是我们本次实现程序所用到的库，直接在选择好的环境下执行
pip install selenium。
②我们还需要用到pyautogui库函数去模拟人手点击或拖拽来进行智能验证，也是在对应的环境执行
pip install pyautogui。

```
pip install selenium
pip install pyautogui
```

#### 1.2安装驱动

执行本次程序是在谷歌浏览器下完成的，所以在此之前请下载谷歌浏览器（[谷歌浏览器下载地址](https://www.google.cn/intl/zh-CN/chrome/)）。
下好浏览器就可以去下载驱动了，在这之前我们还需做一步，打开已经安装好的谷歌浏览器，查看自己的浏览器版本。

![967aa8cb1c10417b9114328e318b6a99](./967aa8cb1c10417b9114328e318b6a99.png)

到这里我们就可以下载谷歌驱动了（[Chrome驱动链接](http://chromedriver.storage.googleapis.com/index.html)），点击进去找到对应的版本号，如果没有对应的版本号下载接近的一个即可，如下版本里面没有我的111.0.5563.65的版本，我们下载111.0.0.5563.64的即可（Ps:如果发现在后面打不开驱动出现错误，换一个驱动再试一下，因为这里有些人是要小一点的版本可以，有些人是大一点的版本可以）。

![24d390faecff477895908f0373936815](./24d390faecff477895908f0373936815.png)

下载好是一个压缩吧，解压完成后是一个.exe文件，可以放在任意的一个文件夹，只要能找到即可，我这里选择的是放在安装好的谷歌浏览器文件夹下。

![b2b8cdc20ae14c33894232704bc6f4a4](./b2b8cdc20ae14c33894232704bc6f4a4.png)

### 二、实战处理

#### 2.1、引入库函数

这里我们引入所要用到的库函数及对应的包

```
from selenium.webdriver.common.by import By  # 没有selenium库的(请在所用的环境下pip install selenium)
from selenium import webdriver  #selenium库
import random  # 用于产生随机数
import time  # 用于延时
import pyautogui  # 用于模拟人手
```

#### 2.2、程序所需函数详解

##### （1）自定义单选函数

当问卷中有单选就可以直接查询到问卷中的所有单选进行自动答题。

```python
def danxuan(driver):

# 找到所有标签（定位问题）这里是单选

    dan = driver.find_elements_by_css_selector('#div1 > div.ui-controlgroup.column1')
    for answer in dan:
        ans = answer.find_elements_by_css_selector('.ui-radio')#对应的绝对子标签
        random.choice(ans).click()  # 找到标签并点击
        time.sleep(random.randint(0, 1))
```

##### （2）自定义多选函数

寻找问卷中第几题是多选，就可自动去答多选中的题。

```python
def duoxuan(driver):
    #这里是多选题,找到所有多选的标签
    duo = driver.find_elements_by_css_selector('#div2 > div.ui-controlgroup.column1')
    for answer in duo:
        ans = answer.find_elements_by_css_selector('.ui-checkbox')#对应的绝对子标签
        #随机填几次
        for i in range(1, 7):#这里的7可以改成5，10，12
            random.choice(ans).click()#找到标签并点击
        time.sleep(random.randint(0, 1))
```

##### （3）自定义填空函数

需要自己去定义第几题是填空并填上自己想要填写的内容。
如果要修改可这样改，例子：index里的数量一定要对应answer里的数量，index的名字可以跟answer不一样

index = [“1”, “2”, “B”, “D”]
answer = {“1”: “python真的好用！”, “2”: “这个测试很成功！”, “B”: “填空题随机填写文本”,“D”: “随便填写！”}

```python
def tiankong(driver, num):
    #填空函数
    #这里是所需要问题的标签汇总，例如有四个要答的问题，下面的answer的ABC数量需要跟index里面的数量相等
    index = ["A", "B", "C"]

# 自定义要回答的答案

    answer = {"A": "python真的好用！", "B": "这个测试很成功！", "C": "填空题随机填写文本"}
    driver.find_element(by=By.CSS_SELECTOR, value=f'#q{num}')\
        .send_keys(answer.get(index[random.randint(0, len(index)-1)]))
```

##### （4）自定义智能验证函数

当出现智能验证的时候，用自定义的这个函数可以帮我们解决。

```python
def renzheng(driver):

# 智能验证,找到智能认证的标签

    bth = driver.find_element_by_css_selector(
        '#layui-layer1 > div.layui-layer-btn.layui-layer-btn- > a.layui-layer-btn0')
    bth.click()#点击
    time.sleep(1)
    rectBottom = driver.find_element_by_css_selector('#rectBottom') #提交按钮
    rectBottom.click() #点击
    time.sleep(5)
```

##### （5）自定义滑块验证函数

当填写问卷次数过多，这时智能验证之后还会出现滑块验证，这时候就需要滑块验证函数帮我们解决。

```python
def huakuai():
    # 当次数多了的时候就会出现滑块，这里是模拟人手解决滑块拖动
    pyautogui.moveTo(random.randint(494, 496), 791, 0.2)#控制鼠标移动到x,y处，耗时0.2秒
    time.sleep(1)
    pyautogui.dragTo(random.randint(888, 890), 791, 1)#让鼠标点击并拖拽到x,y处，耗时1秒
    time.sleep(1)
    pyautogui.click(random.randint(652, 667), random.randint(793, 795))#让鼠标点击x,y处
    time.sleep(1)
    pyautogui.moveTo(random.randint(494, 496), 791, 0.2)#控制鼠标移动到x,y处，耗时0.2秒
    time.sleep(1)
    pyautogui.dragTo(random.randint(888, 890), 791, 1)#让鼠标点击并拖拽到x,y处，耗时1秒
```



##### （6）自定义屏幕滚动函数

当问卷中的题数量多的时候，由于答题过快，屏幕没有滑动，这时会被检测出是机器人，就会提交失败，所以我们还需要一个自定义屏幕滑动函数来帮我们解决屏幕滚动问题。

```python
def gundong(driver, distance): #用于屏幕滚动
	#测算出最大的距离根据电脑屏幕分辨率而异，一般填写400到800,800是最大滑动距离
    js = "var q=document.documentElement.scrollTop=" + str(distance)    
    driver.execute_script(js)
    time.sleep(0.5)
```

##### （7）主函数

```python
def zonghe(times):
for i in range(0, times):

	#初始配置，地址

    url_survey = 'https://www.wjx.cn/vm/hiQpVeR.aspx'
    option = webdriver.ChromeOptions()
    option.add_experimental_option('excludeSwitches', ['enable-automation'])
    option.add_experimental_option('useAutomationExtension', False)

	#本地下载的谷歌浏览器地址

    option.binary_location = r'D:\Goole_Local\Google\Chrome\Application\chrome.exe'

	#下载好的Chrome驱动的地址

    driver = webdriver.Chrome(r"D:\Goole_Local\Google\Chrome\Application\chromedriver.exe", options=option)
    driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument',
                           {'source': 'Object.defineProperty(navigator, "webdriver", {get: () => undefined})'})

	#启动要填写的地址

    driver.get(url_survey)
    danxuan(driver) #调用单选函数
    duoxuan(driver) #调用多选函数
    gundong(driver, 600)#调用滚动屏幕函数，如果不需要则注释掉
    #调用填空题函数，这个3代表的意思是第三题是填空题，如果有其他填空题需要去完成再调用tiankong(driver, num)即可
    #举例:第八题也是填空题，这时我们加上tiankong(driver, 8)
    tiankong(driver, 3)

	#最后交卷点击提交

#time.slee()函数是表示延时的意思，里面可以放固定值也可以放随机数，这里我放的是随机数。
time.sleep(random.randint(0, 1))
driver.find_element_by_css_selector('#ctlNext').click()#找到提交的css并点击
time.sleep(4)

renzheng(driver)#智能认证函数调用
huakuai()#滑块函数调用
print('已经提交了{}次问卷'.format(int(i) + int(1)))
time.sleep(4)
driver.quit()#停止
```



三、项目整体代码

```python
from selenium.webdriver.common.by import By  # 没有selenium库的(请在所用的环境下pip install selenium)
from selenium import webdriver  #selenium库
import random  # 用于产生随机数
import time  # 用于延时
import pyautogui  # 用于模拟人手

def gundong(driver, distance): #延时+屏幕滚动
    js = "var q=document.documentElement.scrollTop=" + str(distance)    #下拉像素(800是基于最顶端测算的距离)
    driver.execute_script(js)
    time.sleep(0.5)

def danxuan(driver):
    # 找到所有标签（定位问题）这里是单选
    dan = driver.find_elements_by_css_selector('#div1 > div.ui-controlgroup.column1')
    for answer in dan:
        ans = answer.find_elements_by_css_selector('.ui-radio')#对应的绝对子标签
        random.choice(ans).click()  # 找到标签并点击
        time.sleep(random.randint(0, 1))

def duoxuan(driver):
    #这里是多选题,找到所有多选的标签
    duo = driver.find_elements_by_css_selector('#div2 > div.ui-controlgroup.column1')
    for answer in duo:
        ans = answer.find_elements_by_css_selector('.ui-checkbox')#对应的绝对子标签
        #随机填几次
        for i in range(1, 7):#这里的7可以改成5，10，12
            random.choice(ans).click()#找到标签并点击
        time.sleep(random.randint(0, 1))

def tiankong(driver, num):
    #填空函数
    #这里是所需要问题的标签汇总，例如有四个要答的问题，下面的answer的ABC数量需要跟index里面的数量相等
    index = ["A", "B", "C"]
    # 自定义要回答的答案
    answer = {"A": "python真的好用！", "B": "这个测试很成功！", "C": "填空题随机填写文本"}
    driver.find_element(by=By.CSS_SELECTOR, value=f'#q{num}')\
        .send_keys(answer.get(index[random.randint(0, len(index)-1)]))

def renzheng(driver):
    # 智能验证,找到智能认证的标签
    bth = driver.find_element_by_css_selector(
        '#layui-layer1 > div.layui-layer-btn.layui-layer-btn- > a.layui-layer-btn0')
    bth.click()#点击
    time.sleep(1)
    rectBottom = driver.find_element_by_css_selector('#rectBottom') #提交按钮
    rectBottom.click() #点击
    time.sleep(5)

def huakuai():
    # 当次数多了的时候就会出现滑块，这里是模拟人手解决滑块拖动
    pyautogui.moveTo(random.randint(494, 496), 791, 0.2)#控制鼠标移动到x,y处，耗时0.2秒
    time.sleep(1)
    pyautogui.dragTo(random.randint(888, 890), 791, 1)#让鼠标点击并拖拽到x,y处，耗时1秒
    time.sleep(1)
    pyautogui.click(random.randint(652, 667), random.randint(793, 795))#让鼠标点击x,y处
    time.sleep(1)
    pyautogui.moveTo(random.randint(494, 496), 791, 0.2)#控制鼠标移动到x,y处，耗时0.2秒
    time.sleep(1)
    pyautogui.dragTo(random.randint(888, 890), 791, 1)#让鼠标点击并拖拽到x,y处，耗时1秒

def zonghe(times):
    for i in range(0, times):
        # 初始配置，地址
        url_survey = 'https://www.wjx.cn/vm/hiQpVeR.aspx'
        option = webdriver.ChromeOptions()
        option.add_experimental_option('excludeSwitches', ['enable-automation'])
        option.add_experimental_option('useAutomationExtension', False)
        # 本地下载的谷歌浏览器地址
        option.binary_location = r'D:\Goole_Local\Google\Chrome\Application\chrome.exe'
        # 下载好的Chrome驱动的地址
        driver = webdriver.Chrome(r"D:\Goole_Local\Google\Chrome\Application\chromedriver.exe", options=option)
        driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument',
                               {'source': 'Object.defineProperty(navigator, "webdriver", {get: () => undefined})'})
        # 启动要填写的地址
        driver.get(url_survey)
        danxuan(driver) #调用单选函数
        duoxuan(driver) #调用多选函数
        gundong(driver, 600)#调用滚动屏幕函数，如果不需要则注释掉
        tiankong(driver, 3)#调用填空题函数
   # 最后交卷点击提交
    time.sleep(random.randint(0, 1))
    driver.find_element_by_css_selector('#ctlNext').click()#找到提交的css并点击
    time.sleep(4)

    renzheng(driver)#智能认证函数调用
    huakuai()#滑块函数调用
    print('已经提交了{}次问卷'.format(int(i) + int(1)))
    time.sleep(4)
    driver.quit()#停止
if __name__ == "__main__":
    zonghe(2)#里面填写的数是表示要提交多少次问卷
    
    # bth = driver.find_element_by_css_selector(
	# '#layui-layer1 > div.layui-layer-btn.layui-layer-btn- > a.layui-layer-btn0')
	# bth.click()#点击
	# time.sleep(1)
	# rectBottom = driver.find_element_by_css_selector('#rectBottom') #提交按钮
	# rectBottom.click() #点击
```



### 四、项目修改及扩展

如果上面的代码发现跟自己问卷星对不上且无法打开怎么办，别慌！这里教你怎么修改代码
①这里我们用谷歌浏览器打开所需要填写的问卷星地址，然后用电脑上的F12打开开发者模式

![005431bb29ae4c7f865679b6123dfcd7](./005431bb29ae4c7f865679b6123dfcd7.png)

②这里我们可以选用快捷键CTRL+SHIFT+C启动元素检查或者点击我下图标注的地方来进行选择到题号

![701872b488634f43ab83cae33c2aeada](./701872b488634f43ab83cae33c2aeada.png)

③然后我们再查看选择题项的位置在哪里，然后我们就可以知道地方，再选择复制CSS地址就可以得到要修改的地方了

![d2852e97eb3d4382bb4b623fd14c6ecb](./d2852e97eb3d4382bb4b623fd14c6ecb.png)

![cbf7c0b1220d49a0b1055e85752e2723](./cbf7c0b1220d49a0b1055e85752e2723.png)

④复制完之后我们可以看到得到的是什么，这里得到的就是单选题的大标签

```
#div1 > div.ui-controlgroup.column1
```

再接着我们就可以看到各个小标签

![67d22049966c4593a325ca18e5e65211](./67d22049966c4593a325ca18e5e65211.png)

⑤然后我们就可以修改我们的代码了

```python
def danxuan(driver):
	'''
    找到所有标签（定位问题）这里是单选，注意我们使用的是find.elements_by_CSS_selector()
    这样得到的是一个列表，里面包含了所有的选择题，将我们得到的大标签填入如下
    再修改我们所需要选择的小标签，注意小标签填写的时候前面要加 .(点，如：.ui-radio)
    这是代表选择题的绝对路径，这样选择单选的时候就不会错误。
    '''
    dan = driver.find_elements_by_css_selector('#div1 > div.ui-controlgroup.column1')
    for answer in dan:
        ans = answer.find_elements_by_css_selector('.ui-radio')#对应的绝对子标签
        random.choice(ans).click()  # 找到标签并点击
        time.sleep(random.randint(0, 1))
```


多选题和填空题也是一样，看代码相信大家一定能看懂，这里就不过多展示了

多选题和填空题也是一样，看代码相信大家一定能看懂，这里就不过多展示了

这里用的是CSS的方式，其实在项目中可以选择ID查找，XPATH路径去查找都可以，博客里面也有很多资料，都万变不离其宗，找到对应的标签即可。

```python
 driver.find_element_by_xpath('//*[@id="div1"]/div[2]/div[1]') #这是用XPATH得到的
 #简单解释一下里面的值含义吧
 //*[@id="div1"]/div[2]/div[1]
 #第一个div1表示的是第一题，第二个div[2]表示的是第二大部分是选择题，第三个div[1]表示的是选择第一个。
 #那么你一定能看懂这个XPATH是什么意思  
    //*[@id="div2"]/div[2]/div[2]
 #这里表示的是第二题选择题第二个。
```



### 五、总结

python的selenium库是个很重要的网页处理函数库，在处理动态网页上扮演者很重要的角色，一般我们所看到的网页都可以用里面对应方法来完成，只要理解到标签的含义，其实做这类的题是很简单的

### 版权声明:

版权声明：本文为CSDN博主「不当王多鱼不改名」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/m0_68174024/article/details/129598729