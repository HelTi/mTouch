function dispatch(targetNode,eventName,detail) {
  var event = document.createEvent('CustomEvent');
  if(event && event.initCustomEvent){
    event.initCustomEvent('on:' + eventName, true, true, detail);
  }else{
    event = document.createEvent('Event');
    event.initEvent('on:' + eventName, true, true)
    event.detail = detail;
  }
  return targetNode.dispatchEvent(event)
}