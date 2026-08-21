'use client'

import React, { useCallback } from 'react';
import useAudioStore from '../../store';
import useSWRMutation from "swr/mutation";
import {  TypeGetSongResponse } from "@/app/types";
import { toast } from 'sonner';
import fetcher from "@/app/api/fetcher";
function AudioElement() {
    const audioRef = useAudioStore((state) => state.ref);
    const setDuration = useAudioStore((state) => state.setDuration);
    const updateCurrentTime = useAudioStore((state)  => state.setCurrentTime);
    const currentSongIndex = useAudioStore((state) => state.currentSongIndex);
    const setCurrentSongIndex = useAudioStore((state) => state.setCurrentSongIndex);
    const setCurrentTrack = useAudioStore((state) => state.setCurrentTrack);
    const setIsPlaying = useAudioStore((state) => state.setIsPlaying);
    const handleAction = useAudioStore((state) => state.handleAction);
    const storeSongList = useAudioStore((state) => state.storeSongList);
      const { trigger } = useSWRMutation<
        TypeGetSongResponse,
        unknown,
        string,
        { songId: string }
  >("audio/getSong", fetcher);
    //const isPlaying = useAudioStore((state) => state.isPlaying);

    async function handleAudioEnd() {
        const newIndex = (currentSongIndex + 1) % storeSongList.length;
        const chosenTrack = storeSongList[newIndex];
        const result = await handleAction(chosenTrack);
        if(!result) {
          await trigger({ songId: chosenTrack._id });
          toast("Something went wrong while playing the song, refreshing the playlist");
          window.location.reload();
        }
        setCurrentSongIndex(newIndex);
        //setIsPlaying(false)
        setCurrentTrack(chosenTrack)
    }
    function handleLoadMetadata() {
        if (audioRef?.current) {
            const audio = audioRef.current;
            setDuration(audio.duration);
        }
    }

    function handleTimeUpdate() {
        if (audioRef?.current) {
            updateCurrentTime(audioRef.current.currentTime);
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