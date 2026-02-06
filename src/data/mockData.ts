export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: string;
  badge?: 'NEW' | 'HOT';
}

export interface Playlist {
  id: string;
  name: string;
  songCount: number;
  coverArt: string;
  color: string;
}

export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'Pixel Dreams',
    album: 'Arcade Memories',
    albumArt: 'https://picsum.photos/seed/song1/200',
    duration: '3:42',
    badge: 'HOT',
  },
  {
    id: '2',
    title: 'Digital Sunset',
    artist: 'RetroWave',
    album: 'Synthwave Collection',
    albumArt: 'https://picsum.photos/seed/song2/200',
    duration: '4:15',
    badge: 'NEW',
  },
  {
    id: '3',
    title: 'Midnight Drive',
    artist: 'CyberPunk',
    album: 'Night City',
    albumArt: 'https://picsum.photos/seed/song3/200',
    duration: '3:58',
  },
  {
    id: '4',
    title: '8-Bit Hearts',
    artist: 'Chiptune Master',
    album: 'Game Over',
    albumArt: 'https://picsum.photos/seed/song4/200',
    duration: '2:45',
    badge: 'NEW',
  },
  {
    id: '5',
    title: 'Electric Dreams',
    artist: 'Synth Lords',
    album: 'Future Past',
    albumArt: 'https://picsum.photos/seed/song5/200',
    duration: '5:02',
  },
  {
    id: '6',
    title: 'Arcade Fire',
    artist: 'Pixel Storm',
    album: 'Insert Coin',
    albumArt: 'https://picsum.photos/seed/song6/200',
    duration: '3:33',
    badge: 'HOT',
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'SYNTHWAVE MIX',
    songCount: 24,
    coverArt: 'https://picsum.photos/seed/pl1/200',
    color: 'from-primary to-blood',
  },
  {
    id: '2',
    name: 'RETRO GAMING',
    songCount: 18,
    coverArt: 'https://picsum.photos/seed/pl2/200',
    color: 'from-blood to-blood-dark',
  },
  {
    id: '3',
    name: 'NIGHT DRIVE',
    songCount: 32,
    coverArt: 'https://picsum.photos/seed/pl3/200',
    color: 'from-primary to-accent',
  },
  {
    id: '4',
    name: 'CHIPTUNE HITS',
    songCount: 15,
    coverArt: 'https://picsum.photos/seed/pl4/200',
    color: 'from-accent to-primary',
  },
  {
    id: '5',
    name: 'ARCADE CLASSICS',
    songCount: 42,
    coverArt: 'https://picsum.photos/seed/pl5/200',
    color: 'from-blood-dark to-primary',
  },
];

export const currentSong: Song = mockSongs[0];
