<template>
  <div>
    <VAppBar height="60px" class="app-bar">
      <v-toolbar-title class="headline d-none d-md-flex">
        <router-link class="no-link-styling" to="/"
          >Multitrack Player</router-link
        >
      </v-toolbar-title>
      <Controls />
    </VAppBar>

    <VContainer>
      <SettingsDialog />
      <AboutDialog />
      <TrackManager />
    </VContainer>
  </div>
</template>

<script>
import TrackManager from '@/components/TrackManager';
import SettingsDialog from '@/components/SettingsDialog';
import AboutDialog from '@/components/AboutDialog';
import Controls from '@/components/Controls';

export default {
  components: {
    TrackManager,
    SettingsDialog,
    AboutDialog,
    Controls
  },
  name: 'home',
  data() {
    return {
      publicPath: process.env.BASE_URL
    };
  }
};
</script>

<style lang="scss" scoped>
.app-bar {
  flex-grow: 0;
}

// TODO(cbwilkes): Move to common component
.no-link-styling {
  color: inherit;
  text-decoration: none;
}

.no-link-styling:hover,
.no-link-styling:focus,
.no-link-styling:active {
  color: inherit;
  outline: none;
}
</style>
