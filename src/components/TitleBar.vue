<template>
  <v-app-bar height="auto" class="app-bar">
    <v-toolbar-title class="headline d-none d-md-flex">
      Multitrack Player
    </v-toolbar-title>
    <slot name="controls"></slot>
    <!-- Use a named slot for controls -->
    <Controls />
  </v-app-bar>
</template>

<script>
import Controls from './Controls.vue';
export default {
  components: {
    Controls
  },
  name: 'VAppBar' // Optional, but good practice
};
</script>

<style lang="scss" scoped>
.app-bar {
  flex-grow: 0;
}
</style>
