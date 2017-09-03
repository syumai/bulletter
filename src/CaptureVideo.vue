<template>
  <video :src="src" @seeked="onSeeked" :style="styleObject"/>
</template>

<script>
const captureVideoFrame = (video, width, height) => {
  return new Promise((fulfill, reject) => {
    const videoCanvas = document.createElement('canvas');
    videoCanvas.width = width;
    videoCanvas.height = height;

    const videoContext = videoCanvas.getContext('2d');
    videoContext.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);

    fulfill(videoCanvas);
  });
};

export default {
  props: ['src', 'time', 'index', 'width', 'height'],
  computed: {
    styleObject() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    }
  },
  methods: {
    pushImage() {
      const video = this.$el;
      captureVideoFrame(video, this.width, this.height)
        .then((canvas) => {
          this.$parent.pushImage({
            index: this.index,
            url: canvas.toDataURL('image/jpeg', 1)
          })
        });
    },
    onSeeked() {
      console.log(`Seeked: (${this.index}, ${this.time})`)
      this.pushImage();
    }
  },
  mounted() {
    this.$el.currentTime = this.time;
  }
}
</script>

<style lang="scss" scoped>
video {
  display: none;
}
</style>

