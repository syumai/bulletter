<template>
  <video v-show="visible"
    :src="src"
    @touchstart="onTouchStart"
    @mousedown="onMouseDown"
    @touchmove.prevent="onTouchMove"
    @mousemove="onMouseMove"
    @touchend="onTouchEnd"
    @mouseup="onMouseUp"
    @loadedmetadata="onLoadedMetaData"/>
</template>

<script>
export default {
  props: ['src'],
  data() {
    return {
      dragging: false,
      originX: 0,
      originY: 0,
      originTime: 0,
      time: 0,
      visible: true,
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
        const time = this.originTime + (percent / 100) * this.$parent.duration;
        if (time < this.$parent.duration && this.$parent.duration > 0) {
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
      this.$parent.duration = e.target.duration;
      console.log(this.$parent.duration);

      this.$parent.width = e.target.clientWidth;
      this.$parent.height = e.target.clientHeight;
      this.visible = false;

      const times = [];
      for (let i = 0; i < this.$parent.frames; i++) {
        const time = (i / this.$parent.frames) * this.$parent.duration;
        times.push(time);
      }
      this.$parent.times = times;
    }
  }
}
</script>
