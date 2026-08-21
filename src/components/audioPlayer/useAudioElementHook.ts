import { useState, useRef, useEffect } from 'react';
import useAudioStore from '../../store';

function useAudioElement() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const setMetaDataFunction = useAudioStore((state) => state.setMetaDataFunction);
    const setTimeupdateFunction = useAudioStore((state) => state.setTimeupdateFunction);
    const setAudioRef = useAudioStore((state) => state.setAudioRef);
    const updateCurrentTime = useAudioStore((state)  => state.setCurrentTime);
    const setDuration = useAudioStore((state) => state.setDuration);
    const setIsPlaying = useAudioStore((state) => state.setIsPlaying);
    const isPlaying = useAudioStore((state) => state.isPlaying);
    const setHandleAction = useAudioStore((state) => state.setHandleAction);



    useEffect(() => {
        setMetaDataFunction(onLoadMetaData);
    }, [onLoadMetaData])
    useEffect(() => {
        setTimeupdateFunction(handleTimeUpdate);
    }, [handleTimeUpdate])
    useEffect(() => {
        setAudioRef(audioRef);
    }, [audioRef])

    function onLoadMetaData() {
        const audio = audioRef.current;
        if (!audio) return;
        setDuration(audio.duration);
    }

    function handleTimeUpdate() {
        const audio = audioRef.current;
        if (!audio) return;
        //if (isSeeking) return;
        updateCurrentTime(audio.currentTime);
    }

    const handleAction = async (track) => {

        if (audioRef.current) {
            try {
                if (audioRef.current.src === track.fileUrl) {
                    if (!audioRef.current.paused) {
                        audioRef.current.pause();
                        setIsPlaying(false);
                    } else {
                        await audioRef.current.play();
                        setIsPlaying(true);
                    }
                }
                if (audioRef.current.src !== track.fileUrl) {
                    audioRef.current.src = track.fileUrl;
                    await audioRef.current.play();
                    setIsPlaying(true);
                }
                return true;
            } catch (error) {
                console.log(error);
                if (
                    error instanceof DOMException &&
                    error.name === "NotSupportedError"
                ) {
                    setIsPlaying(!isPlaying);
                    return false;
                }
            }
            return true;
        }
    }
    useEffect(() => {
        setHandleAction(handleAction);
    },[]);
    return {
        audioRef
    }

}

export default useAudioElement;