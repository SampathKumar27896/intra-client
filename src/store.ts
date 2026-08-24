import { RefObject } from 'react';
import { create } from 'zustand'
import { Track } from './app/types';

export interface AudioStore {
  // State Values
  currentTime: number;
  modifiedTime: number;
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
  setAudioRef: (audioRef: RefObject<HTMLAudioElement | null>) => void;
  setCurrentTime: (time: number) => void;
  setModifiedTime: (time: number) => void;
  setCurrentTrack: (track: Track | null) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (value: boolean) => void;
  setCurrentSongIndex: (value: number) => void;
  setStoreSongList: (value: Track[] | []) => void;
}

const useAudioStore = create<AudioStore>((set, get) => ({
    onLoadedMetadata: () => {},
    onTimeUpdate: () => {},
    currentTime: 0,
    modifiedTime: 0,
    storeSongList:[],
    currentTrack: null,
    duration: 0,
    isPlaying: false,
    currentSongIndex: 0,
    setMetaDataFunction: (func) => set((state) => ({ ...state, onLoadedMetadata: func })),
    setTimeupdateFunction: (func) => set((state) => ({ ...state, onTimeUpdate: func })),
    setAudioRef: (audioRef) => set((state) => ({ ...state, ref: audioRef })),
    setCurrentTime: (time) => set((state) => ({ ...state, currentTime: time })),
    setModifiedTime: (modifiedTime) => {
      set((state) => ({ ...state, modifiedTime: modifiedTime }));
    },
    setCurrentTrack: (track) => set((state) => ({...state, currentTrack: track})),
    setDuration: (duration) => set((state) => ({...state, duration: duration})),
    setIsPlaying: (value) => set((state) => ({...state, isPlaying: value})),
    setCurrentSongIndex: (value) => {
        const {
            setCurrentTrack,
            storeSongList,
            
        } = get();
       setCurrentTrack(storeSongList[value]);
       set(() => ({ currentSongIndex: value}));
    },
    setStoreSongList: (value) => set((state) => ({...state, storeSongList: value})),
    handleAction: async(track)  => {
       const {
        currentTrack,
        setCurrentTrack,
        isPlaying,
        setIsPlaying
      } = get();
        try {
            // Toggle play/pause if the track is already loaded
            if (currentTrack && currentTrack.fileUrl === track.fileUrl) {
                if (isPlaying) {
                    setIsPlaying(false);
                } else {
                  console.log("coming here automatically")
                    if(!isPlaying) {
                        setIsPlaying(true);
                    }
                }
                return true
            } else {
                // Load and play a new track
                console.log("coming here second top if", isPlaying)
                
                setCurrentTrack(track)
                return true;
            }
        } catch (error) {
            console.error("Playback error:", error);
            if (
                error instanceof DOMException &&
                error.name === "NotSupportedError"
            ) {
                // Toggle state safely using functional update
                setIsPlaying(!isPlaying);
            }
            return false;
        }
    }
}))

export default useAudioStore;