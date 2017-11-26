/**
 * Created by 卢耀川 on 2017/11/17.
 */

window.curOffsetX = 0;
window.curOffsetY = 0;
window.isSelected = false;
window.currentWindow = null;


/**
 * option:
 *  0 默认 无操作
 *  1 选中
 *  2 缩放
 * @type {{currWin: {target: null, offsetX: number, offsetY: number, option: number}}}
 */
window.osx = {
  currWin: {
    target: null,
    offsetX: 0,
    offsetY: 0,
    option: 0
  }
};

$(document).ready(function () {
  dateTime();
  $('#safari').click(openSafari);
  let macScene = $('#mac-scene');
  macScene.mousemove(mouseMove);
  macScene.mouseup(unselectWindow);
});

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

/**
 * 打开一个窗口
 * @param info 窗口的信息
 */
function openWindow(info) {

  let html = $('#window-template').html();

  let osxWindow = $(html);
  let dom = osxWindow.get(0);

  //  如果有设置窗口的大小
  if(info['size'] !== undefined) {
    osxWindow.css({
      'width': info['size']['width']+'px',
      'height': info['size']['height']+'px'
    });
  }

  //  如果有设置窗口的位置
  if (info['positions'] !== undefined) {
    osxWindow.css({
      'left': info['positions']['x']+'px',
      'top': info['positions']['y']+'px'
    });
  }

  // 如果有设置窗口content
  if (info['content'] !== undefined) {

    $(dom.querySelector('.mac-window-content')).append(info['content']);
  }

  //  如果有设置窗口标题
  if (info['title'] !== undefined) {
    let span = dom.querySelector('.mac-window-header-title span');
    $(span).text(info['title']);
  }
  $('#mac-scene').append(osxWindow);

  //  添加各种事件
  $(dom.querySelector('.header-btn-close')).click(closeWindow);
  osxWindow.mousedown(selectWindow);

  window.osx.currWin.target = osxWindow;
}

/**
 * 关闭窗口
 * @param e
 */
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
function mouseMove(event) {

  moveWindow(event);
  scaleWindow(event);
}

/**
 * 移动窗口
 * @param event
 */
function moveWindow(event) {
  let currWin = window.osx.currWin;

  if (currWin.option === 1 && currWin.target !== null) {
    let x = event.clientX - currWin.offsetX;
    let y = event.clientY - currWin.offsetY;
    currWin.target.css({
      'left': x + 'px',
      'top': y + 'px'
    });
  }
}

/**
 * 缩放窗口
 * @param event
 */
function scaleWindow(event) {
  let currWin = window.osx.currWin;
  let option = currWin.option;
  let currTarget = currWin.target;

  if (currTarget !== null) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    let winX = currTarget.offset().left;
    let winY = currTarget.offset().top;
    let winW = currTarget.width();
    let winH = currTarget.height();
    //  判断鼠标在窗口的哪个位置
    if ( ( (mouseX <= winX + winW + 5) && (mouseX >= winX + winW - 5) )
      && ( (mouseY <= winY + 5) && (mouseY >= winY - 5) ) ) {
      currTarget.css('cursor', 'ne-resize');
    } else if ( ( (mouseX >= winX - 5) && (mouseX <= winX + 5) )
      && ( (mouseY <= winY + 5) && (mouseY >= winY) ) ) {
      currTarget.css('cursor', 'nw-resize');
    } else if ( ( (mouseX >= winX - 5) && (mouseX <= winX + 5) )
      && ( (mouseY <= winY + winH + 5) && (mouseY >= winY + winH - 5) ) ) {
      currTarget.css('cursor', 'sw-resize')
    } else if ( ( (mouseX <= winX + winW + 5) && (mouseX >= winX + winW - 5) )
      && ( (mouseY <= winY + winH + 5 ) && (mouseY >= winY + winH - 5) ) ) {
      currTarget.css('cursor', 'se-resize')
    } else if ( (mouseX >= winX) && (mouseX <= winX + 5) ) {
      currTarget.css('cursor', 'w-resize');
    } else if ( (mouseX <= winX + winW + 5) && (mouseX >= winX + winW - 5)) {
      currTarget.css('cursor', 'w-resize');
    } else if ( (mouseY <= winY + 5) && (mouseY >= winY - 5) ) {
      currTarget.css('cursor', 's-resize');
    } else if ( (mouseY <= winY + winH + 5 ) && (mouseY >= winY + winH - 5)) {
      currTarget.css('cursor', 's-resize');
    } else {
      currTarget.css('cursor', 'default');
    }
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

    let currWin = window.osx.currWin;
    if (( x < clientX && x + w > clientX) && ( y < clientY && y + h > clientY )) {
      currWin.offsetX = clientX - _this.offset().left;
      currWin.offsetY = clientY - _this.offset().top;
      currWin.target = _this;
      currWin.option = 1;
      window.osx.currWin = currWin;
    }
}

/**
 * 鼠标松开
 */
function unselectWindow() {
  let currWin = window.osx.currWin;
  currWin.offsetX = 0;
  currWin.offsetY = 0;
  currWin.option = 0;
  window.osx.currWin = currWin;
}

/**
 * 打开浏览器
 */
function openSafari() {
  let scene = $('#mac-scene');
  openWindow({
    title: 'Safari',
    size: {
      width: 900,
      height: 500
    },
    positions: {
      x: scene.width() / 2 - 450,
      y: scene.height() / 2 - 250
    }
    // content: '<iframe src="https://www.hao123.com" style="width: 99%; height: 99%; border: none;"></iframe>>'
  });
}