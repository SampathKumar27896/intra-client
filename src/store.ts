import { RefObject } from 'react';
import { create } from 'zustand'
import { Track } from './app/types';
export interface AudioStore {
  // State Values
  ref: RefObject<HTMLAudioElement> | null;
  currentTime: number;
  storeSongList: Track[] | [];
  currentTrack: Track | null;
  duration: number;
  isPlaying: boolean;
  currentSongIndex: number;
  // Callback Functions
  onLoadedMetadata: () => void;
  onTimeUpdate: () => void;
  handleAction: (track: Track) => Promise<boolean>;

  // Setter Actions
  setMetaDataFunction: (func: () => void) => void;
  setTimeupdateFunction: (func: () => void) => void;
  setAudioRef: (audioRef: Ref<HTMLAudioElement> | undefined) => void;
  setCurrentTime: (time: number) => void;
  setCurrentTrack: (track: Track | null) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (value: boolean) => void;
  setHandleAction: (func: (track: Track) => Promise<boolean>) => void;
  setCurrentSongIndex: (value: number) => void;
  setStoreSongList: (value: Track[] | []) => void;
}

const useAudioStore = create<AudioStore>((set) => ({
    onLoadedMetadata: () => {},
    onTimeUpdate: () => {},
    handleAction: () => Promise.resolve(true),
    ref: null,
    currentTime: 0,
    storeSongList:[],
    currentTrack: null,
    duration: 0,
    isPlaying: false,
    currentSongIndex: 0,
    setMetaDataFunction: (func) => set((state) => ({ ...state, onLoadedMetadata: func })),
    setTimeupdateFunction: (func) => set((state) => ({ ...state, onTimeUpdate: func })),
    setAudioRef: (audioRef) => set((state) => ({ ...state, ref: audioRef })),
    setCurrentTime: (time) => set((state) => ({ ...state, currentTime: time })),
    setCurrentTrack: (track) => set((state) => ({...state, currentTrack: track})),
    setDuration: (duration) => set((state) => ({...state, duration: duration})),
    setIsPlaying: (value) => set((state) => ({...state, isPlaying: value})),
    setHandleAction: (func) => set((state) => ({...state, handleAction: func})),
    setCurrentSongIndex: (value) => set((state) =>({...state, currentSongIndex: value})),
    setStoreSongList: (value) => set((state) => ({...state, storeSongList: value}))
}))

export default useAudioStore;