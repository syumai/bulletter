import 'babel-polyfill';
import Vue from 'vue';
import Bulletter from './Bulletter';

window.bulletter = function (id, options = {}) {
  const video = document.getElementById(id);
  let { src, frames, speed } = options;
  if (!src) {
    src = video.src;
  }
  return new Vue({
    el: video,
    data: {
      src,
      frames,
      speed
    },
    template: `<Bulletter :src="src" :frames="frames" :speed="speed" @progress="onProgress"/>`,
    components: { Bulletter },
    methods: {
      onProgress(e) {
        this.$emit('progress', e);
      }
    }
  });
}

