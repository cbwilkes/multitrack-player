<template>
  <div>
    <VAppBar height="60px" class="app-bar">
      <v-toolbar-title class="headline d-none d-md-flex">
        <router-link class="no-link-styling" to="/"
          >Multitrack Player</router-link
        >
      </v-toolbar-title>
    </VAppBar>

    <VContainer>
      <h2>Song List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="song in songs" :key="song.id">
            <td>
              <router-link :to="'song/' + song.id">{{ song.name }}</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </VContainer>
  </div>
</template>

<script>
import SongService from '../services/SongService';

export default {
  data() {
    return {
      songs: []
    };
  },
  mounted() {
    this.loadSongs();
  },
  methods: {
    async loadSongs() {
      try {
        const songService = new SongService();
        this.songs = await songService.getSongs();
      } catch (error) {
        console.error('Error loading songs:', error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.app-bar {
  flex-grow: 0;
  min-height: 50px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
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
