import { useRef, useEffect, useCallback } from 'react';
import useAudioStore from '../../store';
import { Track } from '../../app/types';

function useAudioElement() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const setAudioRef = useAudioStore((state) => state.setAudioRef);
    const setIsPlaying = useAudioStore((state) => state.setIsPlaying);
    const isPlaying = useAudioStore((state) => state.isPlaying);
    const setHandleAction = useAudioStore((state) => state.setHandleAction);
  
    useEffect(() => {
        setAudioRef(audioRef);
    }, [audioRef])

    const handleAction = useCallback(async (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
        // Toggle play/pause if the track is already loaded
        if (audio.src === track.fileUrl) {
            if (!audio.paused) {
                console.log("coming here don't know why")
                audio.pause();
                setIsPlaying(false);
            } else {
                if(audio.paused) {
                     await audio.play();
                    setIsPlaying(true);
                }
            }
        } else {
            // Load and play a new track
                console.log("coming here second top if")

            audio.src = track.fileUrl;
            await audio.play();
            setIsPlaying(true);
        }
        return true;
    } catch (error) {
        console.error("Playback error:", error);

        if (
            error instanceof DOMException &&
            error.name === "NotSupportedError"
        ) {
            // Toggle state safely using functional update
            setIsPlaying(!isPlaying);
            return false;
        }
    }
    return true;
}, [setIsPlaying])
    useEffect(() => {
        setHandleAction(handleAction);
    },[handleAction]);
    return {
        audioRef
    }

}

export default useAudioElement;