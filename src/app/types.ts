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

export type TypeLoginForm = {
  email: string
  password: string
}

export type TypeRegisterForm = {
  userName: string
  email: string
  password: string
  retypePassword: string
}
type BaseAPIResponse = {
  message: string
  status: boolean
  statusCode: number
}
export type TypeGetSongResponse = BaseAPIResponse & {
  data: {
    songUrl: string
  }
}
export type TypeLoginResponse = BaseAPIResponse & {
  data: {
    userName: string
    email: string
    token: string
  }
}