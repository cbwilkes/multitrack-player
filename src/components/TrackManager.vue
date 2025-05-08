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
    <!-- Track control buttons -->
    <div class="track-controls mb-4" v-if="$store.state.tracks.length">
      <!-- Solo section -->
      <div class="control-section mb-2">
        <VRow no-gutters align="center">
          <VCol cols="auto" class="mr-4">
            <div class="section-label">Solo</div>
          </VCol>
          <VCol>
            <VRow no-gutters>
              <VCol
                v-for="track in $store.state.tracks"
                :key="'solo-' + track.id"
                cols="auto"
                class="mr-2"
              >
                <VBtn
                  :outlined="!isSolo(track)"
                  color="primary"
                  small
                  class="fixed-width-btn"
                  @click="toggleSolo(track)"
                >
                  {{ truncateTitle(track.name) }}
                </VBtn>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </div>
      <!-- Mute section -->
      <div class="control-section">
        <VRow no-gutters align="center">
          <VCol cols="auto" class="mr-4">
            <div class="section-label">Mute</div>
          </VCol>
          <VCol>
            <VRow no-gutters>
              <VCol
                v-for="track in $store.state.tracks"
                :key="'mute-' + track.id"
                cols="auto"
                class="mr-2"
              >
                <VBtn
                  :outlined="track.active"
                  :color="track.active ? 'grey' : 'error'"
                  small
                  class="fixed-width-btn"
                  @click="toggleActive(track)"
                >
                  {{ truncateTitle(track.name) }}
                </VBtn>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </div>
    </div>
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
    truncateTitle(title) {
      return title.length > 10 ? title.substring(0, 8) + '...' : title;
    },
    toggleSolo(track) {
      // When soloing a track, ensure it's unmuted
      this.$store.state.tracks.forEach(t => {
        if (!t.active) {
          this.$store.dispatch('setTrackActive', { track: t, value: true });
        }
      });
      this.$store.dispatch(
        'setSoloTrack',
        track === this.$store.state.soloTrack ? null : track
      );
    },
    toggleActive(track) {
      // When muting/unmuting, clear any solo and activate all other tracks
      this.$store.dispatch('setSoloTrack', null);
      // Toggle the clicked track
      const newValue = !track.active;
      this.$store.dispatch('setTrackActive', { track, value: newValue });
      // If we're muting this track, unmute all others
      if (!newValue) {
        this.$store.state.tracks.forEach(t => {
          if (t !== track && !t.active) {
            this.$store.dispatch('setTrackActive', { track: t, value: true });
          }
        });
      }
    },
    isSolo(track) {
      return this.$store.state.soloTrack === track;
    },
    ...mapActions(['getSong', 'clearTracks'])
  },
  beforeUnmount() {
    // Clear tracks when component is unmounted (page refresh/navigation)
    this.clearTracks();
  },
  watch: {
    songId: {
      immediate: true, // This ensures it runs on component creation
      handler(newVal) {
        // Watch for changes in songId
        if (newVal) {
          this.isLoading = true; // Set loading to true before fetching
          // Clear existing tracks before loading new ones
          this.clearTracks();
          this.getSong(newVal)
            .then(() => {
              this.isLoading = false; // Reset loading after successful fetch
              // Load tracks if song has tracks
              if (this.song && this.song.tracks) {
                const loadTracks = async () => {
                  for (let track of this.song.tracks) {
                    const trackAudio = await fetch(`${track.uri}`);
                    const trackArrayBuffer = await trackAudio.arrayBuffer();
                    this.$store.dispatch('addTrack', {
                      name: track.name,
                      arrayBuffer: trackArrayBuffer
                    });
                  }
                };
                loadTracks();
              }
            })
            .catch(() => {
              this.isLoading = false; // Reset loading on error as well
            });
        } else {
          this.song = null; // Clear the song if no ID is present
          // Clear existing tracks when song changes
          this.clearTracks();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.fixed-width-btn {
  min-width: 80px !important;
  width: 80px !important;
}

.section-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.0892857143em;
  white-space: nowrap;
}

.control-section {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 8px 12px;
}
</style>
