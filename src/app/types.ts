export type Track = {
  _id: string
  movieName: string
  title: string
  fileName: string
  albumArt: string
  fileUrl: string
  createdAt: string
  updatedAt: string
}
export type AudioPlayerProps = {
  songList?: Track[]
  upadateSongList: (songId: string, fileUrl: string) => void;
}