import 'babel-polyfill';
import Vue from 'vue';
import Bulletter from './Bulletter';

window.bulletter = function (id, options) {
  const video = document.getElementById(id);
  const { src } = options;
  new Vue({
    el: video,
    data: {
      video,
      src
    },
    template: `<Bulletter :src="src || video.src"/>`,
    components: { Bulletter },
  });
}

