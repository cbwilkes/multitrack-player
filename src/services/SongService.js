// TODO(cbwilkes): Replace with api data
const songs = [
  {
    id: 'a7b8c9d0-e1f2-4356-7890-1234567890ab',
    name: 'Dummy song 1'
  },
  {
    id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef01',
    name: 'Dummy song 2'
  },
  {
    id: 'd5e6f7a8-b9c0-1234-5678-90abcdef1234',
    name: 'Dummy song 3'
  }
];

class SongService {
  async getSongs() {
    // TODO(cbwilkes): fetch from api
    return songs;
  }

  async getSongById(id) {
    // TODO(cbwilkes): fetch from api
    return songs.find(song => song.id === id);
  }
}

export default SongService;
