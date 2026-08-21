import { create } from 'zustand'

const useAudioStore = create((set) => ({
    onLoadedMetadata: () => {},
    onTimeUpdate: () => {},
    handleAction: () => {},
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