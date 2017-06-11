## a touch js library for mobile like jquery
>最近在做移动端的项目，jQuery这个库过于庞大，而且没有移动端的触摸事件。有些jQuery的api用不到，所以就想分离一些方法，但是需要理解jquery的设计模式。所以又仔细了看了下源码，也借鉴了很多别人的关于jquery的分析，总算是理解了

### 使用方法和juqery一样
```javascript

 mTouch("selector").css()
 mTouch.each(obj,function(){})
 mTouch.each('selector',function(i,j) {
   console.log(mTouch(this))
 })
```
### 感谢以下项目
[you dont need jquery](https://github.com/oneuijs/You-Dont-Need-jQuery)
