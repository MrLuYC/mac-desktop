/**
 * 窗口缩放的反向
 * @type {{top: number, down: number, left: number, right: number, topLeft: number, topRight: number, downLeft: number, downRight: number}}
 */
let Direction = {
  'normal': -1,
  'top': 0,
  'down': 1,
  'left': 2,
  'right': 4,
  'topLeft': 8,
  'topRight': 16,
  'downLeft': 32,
  'downRight': 64
};

/**
 * 封装了对窗口的一些操作
 * @param target 操作的对象
 * @constructor
 */
function OSXWindow(target) {

  this.target = target;

  /**
   * 获取窗口最右的位置
   * @returns {*}
   */
  this.getMaxX = function () {
    return this.getPositionX() + this.getWidth();
  };

  /**
   * 获取窗口最下的位置
   * @returns {*}
   */
  this.getMaxY = function () {
    return this.getPositionY() + this.getHeight();
  };

  /**
   * 设置窗口的X轴位置
   * @param x
   */
  this.setPositionX = function (x) {
    this.target.css('left', x);
  };

  /**
   * 设置窗口的Y轴位置
   * @param y
   */
  this.setPositionY = function (y) {
    this.target.css('top', y);
  };

  /**
   * 获取窗口的X轴位置
   * @returns {number|*}
   */
  this.getPositionX = function () {
    return this.target.offset().left;
  };

  /**
   * 获取窗口的Y轴位置
   * @returns {number|*}
   */
  this.getPositionY = function () {
    return this.target.offset().top;
  };

  /**
   * 设置窗口的宽度
   * @param width
   */
  this.setWidth = function (width) {
    this.target.width(width);
  };

  /**
   * 获取窗口的宽度
   */
  this.getWidth = function () {
    return this.target.width();
  };

  /**
   * 设置窗口的高度
   * @param height
   */
  this.setHeight = function (height) {
    this.target.height(height);
  };

  /**
   * 获取窗口的高度
   */
  this.getHeight = function () {
    return this.target.height();
  };

  /**
   * 设置窗口的标题
   * @param title
   */
  this.setWindowTitle = function (title) {
    let dom = this.target.get(0);
    let span = dom.querySelector('.mac-window-header-title span');
    $(span).text(title);
  };

  this.getWindowTitle = function () {
    let dom = this.target.get(0);
    let span = dom.querySelector('.mac-window-header-title span');
    return $(span).text();
  };

  this.addChild = function (child) {
    let dom = this.target.get(0);
    $(dom.querySelector('.mac-window-content')).append(child);
  };
  
  this.close = function (callback) {
    let dom = this.target.get(0);
    $(dom.querySelector('.header-btn-close')).click(callback);
  };

  this.mouseDown = function (callback) {
    this.target.mousedown(callback);
  };

  this.remove= function () {
    this.target.remove();
  };
}

window.osx = {

  WinInfo: {
    window: null,
    offsetX: 0,
    offsetY: 0,
    /**
     * option:
     *  0 默认 无操作
     *  1 选中
     *  2 缩放
     */
    option: 0,
    /**
     * 窗口缩放的方向
     */
    direction: Direction.normal
  },
  /**
   * 初始化
   */
  init: function () {
    this.dateTime();
    $('#safari').click(this.openSafari);
    let macScene = $('#mac-scene');
    macScene.mousemove(this.mouseMove);
    macScene.mouseup(this.unselectWindow);
  },

  /**
   * 设置菜单栏上所显示的时间
   */
  dateTime: function () {
    setInterval(() => {
      $('#mac-topmenu').find('#date').text(this.getDateTimeStr());
    }, 1000);
  },
  getDateTimeStr: function () {
    let date = new Date();
    let h = (date.getHours().toString().length > 1) ? date.getHours() : '0' + date.getHours();
    let m = (date.getMinutes().toString().length > 1) ? date.getMinutes() : '0' + date.getMinutes();
    let s = (date.getSeconds().toString().length > 1) ? date.getSeconds() : '0' + date.getSeconds();
    return h + ':' + m + ':' + s;
  },

  /**
   * 根据指定的数据创建窗口
   * @param info 窗口的信息
   */
  openWindow: function (info) {

    let html = $('#window-template').html();

    let osxWindow = new OSXWindow($(html));

    //  如果有设置窗口的大小
    if (info['size'] !== undefined) {
      // osxWindow.css({
      //   'width': info['size']['width'] + 'px',
      //   'height': info['size']['height'] + 'px'
      // });

      osxWindow.setWidth(info['size']['width']);
      osxWindow.setHeight(info['size']['height']);
    }

    //  如果有设置窗口的位置
    if (info['positions'] !== undefined) {

      osxWindow.setPositionX(info['positions']['x']);
      osxWindow.setPositionY(info['positions']['y']);
    }

    // 如果有设置窗口content
    if (info['content'] !== undefined) {

      osxWindow.addChild(info['content']);
    }

    //  如果有设置窗口标题
    if (info['title'] !== undefined) {
      osxWindow.setWindowTitle(info['title']);
    }
    $('#mac-scene').append(osxWindow.target);

    //  添加各种事件
    osxWindow.close(this.closeWindow);
    osxWindow.mouseDown(this.selectWindow);

    osx.WinInfo.window = osxWindow;
  },

  /**
   * 点击窗口的关闭按钮时，触发这个事件关闭窗口
   * @param e
   */
  closeWindow: function (e) {
    let arr = $(this).parents();
    for (i = 0; i < arr.length; i++) {
      if ($(arr[i]).attr('class') === 'mac-window') {
        $(arr[i]).remove();
        break;
      }
    }
  },

  /**
   * 当鼠标移动时，这个方法会被调用
   * @param event
   */
  mouseMove: function (event) {

    switch (osx.WinInfo.option) {
      case 1:
        osx.moveWindow(event);
        break;
      case 2:
        osx.scaleWindow(event);
        break;
      case 0:
        osx.mouseIcon(event);
        break;
    }
  },

  /**
   *  移动窗口
   * @param event
   */
  moveWindow: function (event) {
    let winInfo = osx.WinInfo;
    if (winInfo.window !== null && winInfo.direction) {
      let x = event.clientX - winInfo.offsetX;
      let y = event.clientY - winInfo.offsetY;
      if (y < 36) {
        y = 37;
      }

      winInfo.window.setPositionX(x);
      winInfo.window.setPositionY(y);
    }
  },

  scaleWindow: function (event) {
    let winInfo = osx.WinInfo;

    if (winInfo.window !== null) {
      switch (winInfo.direction) {
        case Direction.topRight:
          this.topRightScale(event);
          break;
        case Direction.topLeft:
          this.topLeftScale(event);
          break;
        case Direction.downLeft:
          this.downLeftScale(event);
          break;
        case Direction.downRight:
          this.downRightScale(event);
          break;
      }
    }
  },

  topRightScale: function (event) {
    let window = osx.WinInfo.window;

    let winX = window.getPositionX();
    let winY = window.getPositionY();
    let winW = window.getWidth();
    let winH = window.getHeight();

    let maxY = window.getMaxY();
    let width = 0;
    let height = 0;
    let top = 0;  //  移动时因为底部的位置不变，需要计算窗口的Y的位置

    if ((winX + winW) - event.clientX > 0) {
      width = winW + (event.clientX - (winX + winW));
    } else {
      width = winW - ((winX + winW) - event.clientX);
    }

    if (winY - event.clientY > 0) {
      height = winH + (winY - event.clientY);
      top = maxY - height;

    } else {
      height = winH - (event.clientY - winY);
      top = maxY - height;
    }

    if (top > 36) {
      window.setPositionY(top);
    }

    if (width > 300 && height > 300) {
      window.setWidth(width);
      window.setHeight(height);
    }
  },

  topLeftScale: function (event) {
    let window = osx.WinInfo.window;
    let winX = window.getPositionX();
    let winY = window.getPositionY();
    let winW = window.getWidth();
    let winH = window.getHeight();

    let maxX = window.getMaxX();
    let maxY = window.getMaxY();
    let width = 0;
    let height = 0;
    let top = 0;  //  移动时因为底部的位置不变，需要计算窗口的Y的位置
    let left = 0;

    if (winY - event.clientY > 0) {
      height = winH + (winY - event.clientY);
    } else {
      height = winH - (event.clientY - winY);
    }

    if (winX - event.clientX > 0) {
      width = winW + (winX - event.clientX);
    } else {
      width = winW - (event.clientX - winX);
    }

    left = maxX - width;
    top = maxY - height;
    if (top > 36) {
      window.setPositionX(left);
      window.setPositionY(top);
    }
    if (width > 300 && height > 300) {
      window.setWidth(width);
      window.setHeight(height);
    }
  },

  downLeftScale: function (event) {
    let window = osx.WinInfo.window;
    let winX = window.getPositionX();
    let winY = window.getPositionY();
    let winW = window.getWidth();
    let winH = window.getHeight();

    let maxX = window.getMaxX();
    let width = 0;
    let height = 0;
    let left = 0;

    if (winX - event.clientX > 0) {
      width = winW + (winX - event.clientX);
    } else {
      width = winW - (event.clientX - winX);
    }

    if ((winY + winH) - event.clientY > 0) {
      height = winH - ((winY + winH) - event.clientY);
    } else {
      height = winH + (event.clientY - (winY + winH));
    }
    left = maxX - width;
    window.setPositionX(left);

    if (width > 300 && height > 300) {
      window.setWidth(width);
      window.setHeight(height);
    }
  },

  downRightScale: function (event) {
    let window = osx.WinInfo.window;
    let winX = window.getPositionX();
    let winY = window.getPositionY();
    let winW = window.getWidth();
    let winH = window.getHeight();

    let width = 0;
    let height = 0;

    if ((winX + winW) - event.clientX > 0) {
      width = winW + (event.clientX - (winX + winW));
    } else {
      width = winW - ((winX + winW) - event.clientX);
    }

    if ((winY + winH) - event.clientY > 0) {
      height = winH - ((winY + winH) - event.clientY);
    } else {
      height = winH + (event.clientY - (winY + winH));
    }

    if (width > 300 && height > 300) {
      window.setWidth(width);
      window.setHeight(height);
    }
  },

  mouseIcon: function (event) {
    let winInfo = osx.WinInfo;
    let osxWin = winInfo.window;

    if (osxWin !== null) {
      let mouseX = event.clientX;
      let mouseY = event.clientY;
      let winX = osxWin.getPositionX();
      let winY = osxWin.getPositionY();
      let winW = osxWin.getWidth();
      let winH = osxWin.getHeight();

      //  判断鼠标在窗口的哪个位置
      if (( (mouseX <= winX + winW + 5) && (mouseX >= winX + winW - 5) )
        && ( (mouseY <= winY + 5) && (mouseY >= winY - 5) )) {
        //  右上角
        osx.WinInfo.direction = Direction.topRight;
        osxWin.target.css('cursor', 'ne-resize');
      } else if (( (mouseX >= winX - 5) && (mouseX <= winX + 5) )
        && ( (mouseY <= winY + 5) && (mouseY >= winY) )) {
        //  左上角
        osx.WinInfo.direction = Direction.topLeft;
        osxWin.target.css('cursor', 'nw-resize');
      } else if (( (mouseX >= winX - 5) && (mouseX <= winX + 5) )
        && ( (mouseY <= winY + winH + 5) && (mouseY >= winY + winH - 5) )) {
        //  左下角
        osx.WinInfo.direction = Direction.downLeft;
        osxWin.target.css('cursor', 'sw-resize')
      } else if (( (mouseX <= winX + winW + 5) && (mouseX >= winX + winW - 5) )
        && ( (mouseY <= winY + winH + 5 ) && (mouseY >= winY + winH - 5) )) {
        //  右下角
        osx.WinInfo.direction = Direction.downRight;
        osxWin.target.css('cursor', 'se-resize')
      } else if ((mouseX >= winX) && (mouseX <= winX + 5)) {
        osx.WinInfo.direction = Direction.left;
        osxWin.target.css('cursor', 'w-resize');
      } else if ((mouseX <= winX + winW + 5) && (mouseX >= winX + winW - 5)) {
        osx.WinInfo.direction = Direction.right;
        osxWin.target.css('cursor', 'w-resize');
      } else if ((mouseY <= winY + 5) && (mouseY >= winY - 5)) {
        osx.WinInfo.direction = Direction.top;
        osxWin.target.css('cursor', 's-resize');
      } else if ((mouseY <= winY + winH + 5 ) && (mouseY >= winY + winH - 5)) {
        osx.WinInfo.direction = Direction.down;
        osxWin.target.css('cursor', 's-resize');
      } else {
        osx.WinInfo.direction = Direction.normal;
        osxWin.target.css('cursor', 'default');
      }
    }
  },

  selectWindow: function (event) {

    let _this = $(this);

    let windowHeader = $(this.querySelector('.mac-window-header'));

    let x = windowHeader.offset().left;
    let y = windowHeader.offset().top;
    let w = windowHeader.width();
    let h = windowHeader.height();

    let clientX = event.clientX;
    let clientY = event.clientY;

    let winInfo = osx.WinInfo;

    if (osx.WinInfo.direction !== Direction.normal) {
      osx.WinInfo.offsetX = clientX - _this.offset().left;
      osx.WinInfo.offsetY = clientY - _this.offset().top;
      osx.WinInfo.window = new OSXWindow(_this);
      osx.WinInfo.option = 2;
    } else {
      if (( x < clientX && x + w > clientX) && ( y < clientY && y + h > clientY )) {
        osx.WinInfo.offsetX = clientX - _this.offset().left;
        osx.WinInfo.offsetY = clientY - _this.offset().top;
        osx.WinInfo.window = new OSXWindow(_this);
        osx.WinInfo.option = 1;
      }
    }
  },

  unselectWindow: function () {
    let winInfo = osx.WinInfo;
    winInfo.offsetX = 0;
    winInfo.offsetY = 0;
    winInfo.option = 0;
    winInfo.direction = Direction.normal;
    osx.WinInfo = winInfo;
  },

  openSafari: function () {
    let scene = $('#mac-scene');
    osx.openWindow({
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
};

$(document).ready(function () {
  osx.init();
});