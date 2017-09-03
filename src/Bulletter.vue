<template>
  <div class="bulletter">
    <bullet-video :src="url"/>
    <bullet-canvas
      :width="width"
      :height="height"
      :speed="speed"
      :image-objects="sortedImageObjects"
      ref="bulletCanvas"/>
    <div v-if="!loadedAll">
      <capture-video v-for="(time, index) in times"
        :src="url"
        :time="time"
        :index="index"
        :width="width"
        :height="height"
        :key="`bullet-${index}`"/>
    </div>
    <div v-if="false">
      <img v-for="({ index, url }) in sortedImageObjects" :src="url" :key="`image-${index}`"/>
    </div>
  </div>
</template>

<script>
import BulletVideo from './BulletVideo';
import BulletCanvas from './BulletCanvas';
import CaptureVideo from './CaptureVideo';

const App = {
  props: {
    src: null, 
    frames: {
      type: Number,
      default: 30
    },
    speed: {
      type: Number,
      default: 1
    }
  },
  components: { BulletVideo, BulletCanvas, CaptureVideo },
  data() {
    return {
      url: null,
      duration: 0,
      loaded: false,
      width: 0,
      height: 0,
      times: [],
      imageObjects: []
    };
  },
  computed: {
    percent() {
      return this.time / this.duration * 100;
    },
    sortedImageObjects() {
      return this.imageObjects
        .sort((a, b) => a.index - b.index);
    },
    loadedCount() {
      return this.imageObjects.length + 1;
    },
    progress() {
      return Math.round((this.loadedCount / this.frames) * 100);
    },
    loadedAll() {
      return this.progress === 100;
    }
  },
  methods: {
    pushImage(imageObject) {
      this.imageObjects.push(imageObject);
      this.$emit('progress', { 
        frames: this.frames,
        loaded: this.loadedCount,
        progress: this.progress
      });
      if (imageObject.index === Math.round(this.frames / 2)) {
        this.$refs.bulletCanvas.seek(imageObject.index);
      }
    }
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
