### a touch js library for mobile like jquery
>最近在做移动端的项目，jQuery这个库过于庞大，而且没有移动端的触摸事件。有些jQuery的api用不到，所以就想分离一些方法，但是需要理解jquery的设计模式。所以又仔细了看了下源码，也借鉴了很多别人的关于jquery的分析，总算是理解了

###使用方法和juqery一样
`

 mTouch("selector").css()
 mTouch.each(obj,function(){})

`
###关于触摸，由于是使用了别人的库，所以我直接把etuch赋给了mTouch

`

//实例
  var k=0;
    mTouch.touch("#mtouch",function(e,touch) {
        console.log(this);
        k++;
        console.log(k)
    })
  mTouch.touch("#mtouch",function(e,touch) {
      console.log(this);
      k++;
      console.log(k)
  }).on('swiper',function(e,touch) {
      console.log('实时获取');
  }).on('up',function(e,touch) {
      console.log('上滑回调');
  }).on('down',function(e,touch) {
      console.log('下滑回调');
  }).on('left',function(e,touch) {
      console.log('左滑回调');
  }).on('right',function(e,touch) {
      console.log('右滑回调');
  });

`
