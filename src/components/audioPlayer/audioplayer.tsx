import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Music,
  SkipForward,
  SkipBack,
} from "lucide-react";

import { Track, AudioPlayerProps, TypeGetSongResponse } from "@/app/types";
import Image from "next/image";
import { toast } from 'sonner';

import useSWRMutation from "swr/mutation";
import useAudioElement from './useAudioElementHook'
import fetcher from "@/app/api/fetcher";
import useAudioStore from '../../store';
import AudioSlider from './audioSlider';
import AudioPlaylist from './audioPlaylist'
import { useRouter } from 'next/navigation'

export default function AudioPlayer() {
  const currentTime = useAudioStore((state) => state.currentTime);
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const setCurrentTrack = useAudioStore((state) => state.setCurrentTrack);
  const duration = useAudioStore((state) => state.duration);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const handleAction = useAudioStore((state) => state.handleAction);
  const currentSongIndex = useAudioStore((state) => state.currentSongIndex);
  const setCurrentSongIndex = useAudioStore((state) => state.setCurrentSongIndex);
  const songList = useAudioStore((state) => state.storeSongList);
  const playButton = <Play  fill="#fff" className="size-8"/>;
  const pauseButton = <Pause  size={28} fill="#fff" className="size-8"/>;
  const skipForwardButton = <SkipForward size={28}  fill="#000" className="size-8"/>;
  const skipBackButton =  <SkipBack size={28} fill="#000" className="size-8" />
  const [button, setButton] = useState(!isPlaying ? playButton: pauseButton);
  console.log("songl  list",songList)
  const { trigger } = useSWRMutation<
    TypeGetSongResponse,
    unknown,
    string,
    { songId: string }
  >("audio/getSong", fetcher);
  
  const {
   
    audioRef
  } = useAudioElement(); 
   

 const handleNext = () => {
    if (!songList || songList.length === 0) return;
    const newIndex = ((currentSongIndex + 1) % songList.length);
    setCurrentSongIndex(newIndex);
  };

  // Play Previous Song (loops to end if at the start)
  const handlePrev = () => {
    if (!songList || songList.length === 0) return;
    const newIndex =  currentSongIndex === 0 ? songList.length - 1 : currentSongIndex - 1
    setCurrentSongIndex(
      newIndex
    );
  };
  
  async function updateTrack(index: number) {
       const newIndex =  ((index) % songList.length)
       const chosenTrack = songList[newIndex];
      if(chosenTrack) {
         if (chosenTrack !== currentTrack) setCurrentTrack(chosenTrack);
        const result = await handleAction(chosenTrack);
        if(!result) {
          await trigger({ songId: chosenTrack._id });
          toast("Something went wrong while playing the song, refreshing the playlist");
          window.location.reload();
        }
    }
  }

  useEffect(() => {
    console.log("currentSongIndex testing",currentSongIndex)
    updateTrack(currentSongIndex)
  },[currentSongIndex])
  useEffect(() => {
    if(currentTrack)
      updateButton(currentTrack)
  },[isPlaying])

  function updateButton(track: Track) {
    let currentButton;
    if (currentTrack && currentTrack._id === track._id) {
      currentButton = isPlaying ? (
        pauseButton
      ) : (
        playButton
      );
    } else {
      currentButton = pauseButton;
    };
    setButton(currentButton);
  }
  function formatTime(time: number) {
    if (!time) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
  return (
    <div
      className={`h-screen bg-cover bg-center bg-white flex flex-col gap-2`}
    >
      <div>
        <Card className={`border-none h-full flex flex-col gap-1`}>
          <CardHeader>
            <CardTitle className="text-lg  text-center tracking-widest uppercase text-xl">
              Now Playing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-5 flex flex-col justify-end">
              
                <Image
                  src={currentTrack && currentTrack.albumArt || "/bg.png"}
                  alt="album-art"
                  width={300}
                  height={300}
                  className="self-center rounded-xl mb-5"
                />
              
              <p className="text-md font-semibold mb-1 text-2xl">
                {currentTrack &&  currentTrack.title}
              </p>
              <p className="text-sm mb-10">{}</p>
              <div className="mb-5 flex flex-row justify-between">
                <p className="text-lg font-medium">{formatTime(currentTime)}</p>
                <p className="text-lg font-medium">{formatTime(duration)}</p>
              </div>
              <AudioSlider 
                duration={duration}
                audioRef={audioRef}
                currentTime={currentTime}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-row justify-around w-full">
              <Button
                className="size-[5rem] rounded-full"
                variant="ghost"
                onClick={() => handlePrev()}
              >
             {skipBackButton}
              </Button>
              <Button
                className="size-[5rem] rounded-full"
                
                onClick={() => updateTrack(currentSongIndex)}
              >
                {button}
              </Button>
              <Button
                className="size-[5rem] rounded-full"
                variant="ghost"
                onClick={() => handleNext()}
              >
              {skipForwardButton}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
     <AudioPlaylist 
     songList={songList}
     currentTrack={currentTrack}
     button={button}
     playButton={playButton}
     
     />
    </div>
  );
}
