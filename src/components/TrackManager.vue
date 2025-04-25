<template>
  <div>
    <div v-if="song">
      <h2>Song Details</h2>
      <p>Name: {{ song.name }}</p>
    </div>
    <VFileInput
      label="Tracks"
      @change="addTracks"
      :value="files"
      multiple
      placeholder="Add audio files"
      accept="audio/*"
    />
    <Track
      v-for="(track, index) in $store.state.tracks"
      :track="track"
      :number="index + 1"
      :key="track.id"
    />
  </div>
</template>

<script>
import Track from './Track';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    Track
  },
  data() {
    return {
      files: []
    };
  },
  computed: {
    songId() {
      const route = this.$route;
      if (route && route.params && route.params.id) {
        return route.params.id;
      }
      return undefined;
    },
    ...mapState(['song'])
  },
  mounted() {
    if (this.songId) {
      this.getSong(this.songId);

      console.log(this.songId);

      const f = async () => {
        for (let track of this.song.tracks) {
          const trackAudio = await fetch(`${track.uri}`);
          const trackArrayBuffer = await trackAudio.arrayBuffer();
          this.$store.dispatch('addTrack', {
            name: track.name,
            arrayBuffer: trackArrayBuffer
          });
        }
      };

      f();
    }
  },
  methods: {
    addTracks(files) {
      if (!files.length) {
        return;
      }

      files.forEach(file => {
        const name = file.name.substring(0, file.name.lastIndexOf('.'));
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.addEventListener('load', () => {
          this.$store.dispatch('addTrack', {
            name,
            arrayBuffer: fileReader.result
          });
        });
      });
      this.files = [];
    },
    ...mapActions(['getSong', 'clearTracks'])
  },
  beforeUnmount() {
    // Clear tracks when component is unmounted (page refresh/navigation)
    this.clearTracks();
  },
  watch: {
    songId(newVal) {
      // Watch for changes in songId
      if (newVal) {
        this.isLoading = true; // Set loading to true before fetching
        this.getSong(newVal)
          .then(() => {
            this.isLoading = false; // Reset loading after successful fetch
          })
          .catch(() => {
            this.isLoading = false; // Reset loading on error as well
          });
      } else {
        this.song = null; // Clear the song if no ID is present
      }
    }
  }
};
</script>
