<template>
  <video class="bulletter" :src="url"
    @touchstart="onTouchStart"
    @mousedown="onMouseDown"
    @touchmove.prevent="onTouchMove"
    @mousemove="onMouseMove"
    @touchend="onTouchEnd"
    @mouseup="onMouseUp"
    @loadedmetadata="onLoadedMetaData"/>
</template>

<script>
const App = {
  props: ['src'],
  data() {
    return {
      url: null,
      dragging: false,
      originX: 0,
      originY: 0,
      originTime: 0,
      time: 0,
      duration: 0,
      loaded: false
    };
  },
  computed: {
    percent() {
      return this.time / this.duration * 100;
    }
  },
  methods: {
    onTouchStart(e) {
      const event = e.changedTouches[0];
      this.onMouseDown(event);
    },
    onMouseDown(e) {
      this.dragging = true;
      this.originX = e.pageX - e.target.offsetLeft;
      this.originY = e.pageY - e.target.offsetTop;
      this.originTime = this.time;
    },
    onTouchMove(e) {
      const event = e.changedTouches[0];
      this.onMouseMove(event);
    },
    onMouseMove(e) {
      const { target } = e;
      if (this.dragging) {
        const containerWidth = target.clientWidth;
        const percent = (e.pageX - this.originX) / containerWidth * 100;
        const time = this.originTime + (percent / 100) * this.duration;
        if (time < this.duration && this.duration > 0) {
          target.currentTime = time;
          this.time = time;
        }
      }
    },
    onTouchEnd(e) {
      const event = e.changedTouches[0];
      this.onMouseUp(event);
    },
    onMouseUp() {
      this.dragging = false;
    },
    onLoadedMetaData(e) {
      console.log(e);
      this.duration = e.target.duration;
      console.log(this.duration);
    },
  },
  mounted() {
    if (typeof this.src === 'string') {
      const req = new XMLHttpRequest();
      req.open('GET', this.src, true);
      req.responseType = 'blob';

      req.onload = () => {
        console.log(req.status);
        if (req.status === 200) {
          const blob = req.response;
          console.log(blob);
          const url = URL.createObjectURL(blob);
          this.loaded = true;
          this.url = url;
        }
      }

      req.send();
    } else if (this.src instanceof File) {
      const url = URL.createObjectURL(this.src);
      this.loaded = true;
      this.url = url;
    }
  }
};

export default App;
</script>
