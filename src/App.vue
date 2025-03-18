<template>
  <div>
    <VProgressLinear v-if="$store.state.loading" indeterminate />
    <VApp v-else>
      <v-content>
        <router-view />
      </v-content>
    </VApp>
  </div>
</template>

<script>
import { initClick } from './click';
import { initMidi } from './midi';
import { initKeyEvents } from './key';

export default {
  components: {},
  async mounted() {
    await Promise.all([initMidi(), initClick()]);
    await this.$store.dispatch('initSettings');
    initKeyEvents(this.$store);

    this.$store.commit('setLoading', false);
  },
  watch: {
    '$store.state.controlEditMode'(value) {
      this.$vuetify.theme.dark = !!value;
    }
  }
};
</script>
