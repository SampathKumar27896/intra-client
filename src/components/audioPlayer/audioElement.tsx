'use client'

import React, { useRef, useEffect } from 'react';
import useAudioStore from '../../store';


function AudioElement() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const setDuration = useAudioStore((state) => state.setDuration);
    const currentTime = useAudioStore((state) => state.currentTime);
    const setCurrentTime = useAudioStore((state) => state.setCurrentTime);
    const modifiedTime = useAudioStore((state)  => state.modifiedTime);
    const currentTrack = useAudioStore((state) => state.currentTrack);
    const isPlaying = useAudioStore((state) => state.isPlaying);
 
    //const isPlaying = useAudioStore((state) => state.isPlaying);
    useEffect(() => {
        console.log("coming here first", currentTrack?.fileUrl, isPlaying)
        if(audioRef?.current && currentTrack?.fileUrl) {
           audioRef.current.src = currentTrack?.fileUrl
           if(useAudioStore.getState().isPlaying)
                audioRef?.current.play();
           
        }
    },[currentTrack, isPlaying])
    useEffect(() => {
        
        if(audioRef?.current) {
            if(isPlaying) {
                console.log("coming here second", isPlaying)
                audioRef?.current.play();
            } else {
                console.log("coming here second", isPlaying)
                audioRef?.current.pause();
            }
        }
        
    },[isPlaying])
    
    useEffect(() => {
        if(audioRef?.current) {
            audioRef.current.currentTime = modifiedTime
        }
    }, [modifiedTime])
    console.log(modifiedTime, currentTime)
    
    async function handleAudioEnd() {
        // const newIndex = (currentSongIndex + 1) % storeSongList.length;
        // const chosenTrack = storeSongList[newIndex];
        // const result = await handleAction(chosenTrack);
        // if(!result) {
        //   await trigger({ songId: chosenTrack._id });
        //   toast("Something went wrong while playing the song, refreshing the playlist");
        //   window.location.reload();
        // }
        // setCurrentSongIndex(newIndex);
        // //setIsPlaying(false)
        // setCurrentTrack(chosenTrack)
    }
    function handleLoadMetadata() {
        if (audioRef?.current) {
            const audio = audioRef.current;
            setDuration(audio.duration);
        }
    }

    function handleTimeUpdate() {
        if (audioRef?.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };
   
    return (
        <div>
            <audio
                ref={audioRef}
                onLoadedMetadata={handleLoadMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleAudioEnd}
                preload="metadata"
            />
      </div>
    )
}

export default AudioElement;