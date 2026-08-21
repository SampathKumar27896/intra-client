import { Ref } from 'react';
import { create } from 'zustand'
import { Track } from './app/types';
export interface AudioStore {
  // State Values
  ref: Ref<HTMLAudioElement> | null;
  currentTime: number;
  currentTrack: Track | null;
  duration: number;
  isPlaying: boolean;

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
}

const useAudioStore = create<AudioStore>((set) => ({
    onLoadedMetadata: () => {},
    onTimeUpdate: () => {},
    handleAction: () => Promise.resolve(true),
    ref: null,
    currentTime: 0,
    currentTrack: null,
    duration: 0,
    isPlaying: false,
    setMetaDataFunction: (func) => set((state) => ({ ...state, onLoadedMetadata: func })),
    setTimeupdateFunction: (func) => set((state) => ({ ...state, onTimeUpdate: func })),
    setAudioRef: (audioRef) => set((state) => ({ ...state, ref: audioRef })),
    setCurrentTime: (time) => set((state) => ({ ...state, currentTime: time })),
    setCurrentTrack: (track) => set((state) => ({...state, currentTrack: track})),
    setDuration: (duration) => set((state) => ({...state, duration: duration})),
    setIsPlaying: (value) => set((state) => ({...state, isPlaying: value})),
    setHandleAction: (func) => set((state) => ({...state, handleAction: func}))
}))

export default useAudioStore;