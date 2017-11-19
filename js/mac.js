/**
 * Created by 卢耀川 on 2017/11/17.
 */

Vue.component('mac-window',{
  template: '<div class="mac-window" v-bind:style="item.style" v-on:mousedown="mousedown"> <div class="mac-window-header"> <div class="mac-widnow-header-btns"> <button class="header-btn header-btn-close"></button> <button class="header-btn header-btn-min"></button> <button class="header-btn header-btn-max"></button> </div> <div class="mac-window-header-title"> <a href="#">{{ item.title }}</a> </div> </div> </div>',
  props: ['item'],
  methods:{
    mousedown: function (e) {
      this.item.selected = true;
    }
  }
});

new Vue({
  el: '#mac',
  data: {
    dateStr: '00:00:00',
    winList: [
      {
        title: 'Safari',
        offsetX: 0,
        offsetY: 0,
        w: 400,
        h: 300,
        style: {
          width: '400px',
          height: '300px',
          left: '550px',
          top: '200px'
        },
        selected: false
      }
    ]
  },
  mounted: function () {
    setInterval(() => {
      var date = new Date();
      var h = (date.getHours().toString().length > 1) ? date.getHours() : '0' + date.getHours();
      var m = (date.getMinutes().toString().length > 1) ? date.getMinutes() : '0' + date.getMinutes();
      var s = (date.getSeconds().toString().length > 1) ? date.getSeconds() : '0' + date.getSeconds();
      this.dateStr = h + ':' + m + ':' + s;
    });
  },
  methods: {

    mousemove: function (e) {

      // var list = this.winList;

      // for (i = 0 ; i < list.length; i ++) {
      //   if (list[i].selected) {
      //     list[i].offsetX = e.pageX - list[i].offsetX;
      //     list[i].offsetY = e.pageY - list[i].offsetY;
      //     list[i].style.top = list[i].offsetY + 'px';
      //     list[i].style.left = list[i].offsetX + 'px';
      //   }
      // }
    },

    mouseup: function (e) {
      // var list = this.winList;
      //
      // for (i = 0 ; i < list.length; i ++) {
      //   if (list[i].selected) {
      //     list[i].selected = false;
      //   }
      // }
    }
  }
});