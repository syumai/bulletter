<template>
  <canvas :style="styleObject"
    :width="width"
    :height="height"
    @touchstart="onTouchStart"
    @mousedown="onMouseDown"
    @touchmove.prevent="onTouchMove"
    @mousemove="onMouseMove"
    @touchend="onTouchEnd"
    @mouseup="onMouseUp"/>
</template>

<script>
export default {
  props: ['width', 'height', 'speed', 'imageObjects'],
  data() {
    return {
      dragging: false,
      originX: 0,
      originY: 0,
      index: 0,
      originIndex: 0
    }
  },
  computed: {
    styleObject() {
      return {
        cursor: this.dragging ? ['grabbing', '-webkit-grabbing'] : ['grab', '-webkit-grab'],
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    }
  },
  methods: {
    seek(index) {
      this.index = index;
      const context = this.$el.getContext('2d');
      const image = new Image();
      image.addEventListener('load', () => {
        context.drawImage(image, 0, 0);
      });
      const foundImage = this.imageObjects.find(({ index }) => index === this.index);
      if (foundImage) {
        image.src = foundImage.url;
      }
    },
    onTouchStart(e) {
      const event = e.changedTouches[0];
      this.onMouseDown(event);
    },
    onMouseDown(e) {
      this.dragging = true;
      this.originX = e.pageX - e.target.offsetLeft;
      this.originY = e.pageY - e.target.offsetTop;
      this.originIndex = this.index;
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
        const index = Math.round(this.originIndex + (percent / 100) * this.$parent.frames * this.speed);
        if (index < this.$parent.frames && index >= 0) {
          this.seek(index);
        }
      }
    },
    onTouchEnd(e) {
      const event = e.changedTouches[0];
      this.onMouseUp(event);
    },
    onMouseUp() {
      this.dragging = false;
    }
  }
}
</script>



