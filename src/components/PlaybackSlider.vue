<template>
  <div class="playback-slider d-flex flex-column justify-center">
    <div class="d-flex align-center">
      <VSlider
        v-model="sliderPosition"
        :min="0"
        :max="duration"
        :step="0.01"
        hide-details
        class="mx-2"
        @start="onSliderStart"
        @end="onSliderEnd"
        :disabled="!$store.state.tracks.length"
      >
        <template v-slot:prepend>
          <div class="text-caption">{{ formatTime(sliderPosition) }}</div>
        </template>
        <template v-slot:append>
          <div class="text-caption">{{ formatTime(duration) }}</div>
        </template>
      </VSlider>
    </div>

    <div class="d-flex align-center mt-2" v-if="duration">
      <VBtn
        icon
        small
        :color="$store.state.loopRegion.active ? 'primary' : ''"
        @click="toggleLoopRegion"
        class="mr-2"
      >
        <VIcon>{{ mdiRepeatVariant }}</VIcon>
      </VBtn>

      <!-- <VSlider
        v-model="loopRange"
        :min="0"
        :max="duration"
        :step="0.01"
        hide-details
        class="mx-2"
        range
        :disabled="$store.state.loopRegion.active"
      >
        <template v-slot:prepend>
          <div class="text-caption">{{ formatTime(loopRange[0]) }}</div>
        </template>
        <template v-slot:append>
          <div class="text-caption">{{ formatTime(loopRange[1]) }}</div>
        </template>
      </VSlider> -->
    </div>
  </div>
</template>

<script>
import { mdiRepeatVariant } from '@mdi/js';

export default {
  data() {
    return {
      mdiRepeatVariant,
      isDragging: false,
      loopRange: [0, 0]
    };
  },
  computed: {
    duration() {
      if (!this.$store.state.tracks.length) return 1; // Return a small positive value instead of 0 to prevent disabling
      const durations = this.$store.state.tracks
        .map(track => track.audioBuffer?.duration || 0)
        .filter(duration => duration > 0);
      return durations.length ? Math.max(...durations) : 1; // Default to 1 if no valid durations found
    },
    sliderPosition: {
      get() {
        return this.$store.state.playPosition;
      },
      set(value) {
        if (this.isDragging) {
          this.$store.commit('setPlayPosition', value);
          // If we're playing, jump to the new position
          if (this.$store.state.playState === 'playing') {
            this.$store.dispatch('playAt', value);
          }
        }
      }
    }
  },
  watch: {
    duration: {
      immediate: true,
      handler(newVal) {
        if (newVal > 0 && this.loopRange[1] === 0) {
          this.loopRange = [0, newVal];
        }
      }
    },
    loopRange: {
      deep: true,
      handler(newVal) {
        if (this.$store.state.loopRegion.active) {
          this.$store.dispatch('setLoopRegion', {
            active: true,
            start: newVal[0],
            end: newVal[1]
          });
        }
      }
    }
  },
  methods: {
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    onSliderStart() {
      this.isDragging = true;
      // If we're playing, pause first
      if (this.$store.state.playState === 'playing') {
        this.$store.dispatch('stop');
      }
    },
    onSliderEnd() {
      this.isDragging = false;
      this.$store.dispatch('playAt', this.sliderPosition);
    },
    toggleLoopRegion() {
      const newActive = !this.$store.state.loopRegion.active;
      this.$store.dispatch('setLoopRegion', {
        active: newActive,
        start: this.loopRange[0],
        end: this.loopRange[1]
      });
    }
  }
};
</script>

<style scoped>
.playback-slider {
  width: 100%;
  max-width: 800px;
  height: 100%;
  flex: 1;
}
</style>
