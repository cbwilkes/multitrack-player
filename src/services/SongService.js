class SongService {
  constructor() {
    this.cachedSongs = null;
    this.cacheExpiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  async loadSongsFromApi() {
    try {
      const response = await fetch('/songs.json', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const songsData = await response.json();
      this.cachedSongs = {
        data: songsData.songs,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to fetch songs:', error);
      throw new Error('Failed to initialize song data');
    }
  }

  retainCaching() {
    if (
      !this.cachedSongs ||
      Date.now() > this.cachedSongs.timestamp + this.cacheExpiration
    ) {
      return this.loadSongsFromApi();
    }
    return Promise.resolve(this.cachedSongs.data);
  }

  async getSongs() {
    if (!this.cachedSongs) {
      await this.loadSongsFromApi();
    }
    return [...this.cachedSongs.data]; // Return shallow copy to prevent external modification
  }

  async getSongById(id) {
    if (!this.cachedSongs) {
      await this.loadSongsFromApi();
    }
    return this.cachedSongs.data.find(song => song.id === id);
  }
}

export default SongService;
