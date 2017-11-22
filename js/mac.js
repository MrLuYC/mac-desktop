/**
 * Created by 卢耀川 on 2017/11/17.
 */

window.curOffsetX = 0;
window.curOffsetY = 0;
window.isSelected = false;
window.currentWindow = null;

//  设置时间显示的定时器
function dateTime() {
  setInterval(() => {
    $('#mac-topmenu').find('#date').text(getDateTimeStr());
  }, 1000);
}

/**
 * 获取时间的当前时间的字符串, 格式为00:
 * @returns {string}
 */
function getDateTimeStr() {
  let date = new Date();
  let h = (date.getHours().toString().length > 1) ? date.getHours() : '0' + date.getHours();
  let m = (date.getMinutes().toString().length > 1) ? date.getMinutes() : '0' + date.getMinutes();
  let s = (date.getSeconds().toString().length > 1) ? date.getSeconds() : '0' + date.getSeconds();
  return h + ':' + m + ':' + s;
}

$(document).ready(function () {
  dateTime();
  $('#safari').click(openSafari);
  let macScene = $('#mac-scene');
  macScene.mousemove(moveWindow);
  macScene.mouseup(unselectWindow);
});

/**
 * 打开一个窗口
 * @param info 窗口的信息
 */
function openWindow(info) {

  let html = $('#window-template').html();

  let window = $(html);
  let dom = window.get(0);

  if(info['size'] !== undefined) {
    window.css({
      'width': info['size']['width']+'px',
      'height': info['size']['height']+'px'
    });
  }

  if (info['positions'] !== undefined) {
    window.css({
      'left': info['positions']['x']+'px',
      'top': info['positions']['y']+'px'
    });
  }

  if (info['content'] !== undefined) {

    $(dom.querySelector('.mac-window-content')).append(info['content']);
  }

  if (info['title'] !== undefined) {
    let span = dom.querySelector('.mac-window-header-title span');
    $(span).text(info['title']);
  }
  $('#mac-scene').append(window);

  //  添加各种事件
  $(dom.querySelector('.header-btn-close')).click(closeWindow);
  window.mousedown(selectWindow);
}

function closeWindow(e) {
  let arr = $(this).parents();
  for (i = 0; i < arr.length; i ++) {
    if ($(arr[i]).attr('class') === 'mac-window') {
      $(arr[i]).remove();
      break;
    }
  }
}

/**
 * 鼠标移动
 * @param event 事件
 */
function moveWindow(event) {

  let isSelected = window.isSelected;
  let current = window.currentWindow;

  if (isSelected && current !== null) {
    let x = event.clientX - curOffsetX;
    let y = event.clientY - curOffsetY;
    current.css({
      'left': x + 'px',
      'top': y + 'px'
    });
  }

}

/**
 * 鼠标按下
 * @param event 事件
 */
function selectWindow(event) {

    let _this = $(this);

    let windowHeader = $(this.querySelector('.mac-window-header'));



    let x = windowHeader.offset().left;
    let y = windowHeader.offset().top;
    let w = windowHeader.width();
    let h = windowHeader.height();

    let clientX = event.clientX;
    let clientY = event.clientY;

    if (( x < clientX && x + w > clientX) && ( y < clientY && y + h > clientY )) {
      window.curOffsetX = clientX - _this.offset().left;
      window.curOffsetY = clientY - _this.offset().top;
      window.currentWindow = _this;
      window.isSelected = true;
    }
}

/**
 * 鼠标松开
 */
function unselectWindow() {
  window.curOffsetX = 0;
  window.curOffsetY = 0;
  window.currentWindow = null;
  window.isSelected = false;
}

/**
 * 打开浏览器
 */
function openSafari() {
  openWindow({
    title: 'Safari',
    size: {
      width: 900,
      height: 500
    },
    positions: {
      x: $('#mac-scene').width() / 2 - 450,
      y: $('#mac-scene').height() / 2 - 250
    },
    content: '<iframe src="https://www.baidu.com" style="width: 99%; height: 99%; border: none;"></iframe>>'
  });
}