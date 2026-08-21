"use client"

import * as React from "react"
import Image from "next/image";
import {
  Card,
} from "@/components/ui/card";
import {
  Play,
  Pause
} from "lucide-react";
import { usePathname } from 'next/navigation';
import useAudioStore from '../../store';


export function FloatingPlayer() {
  const pathName = usePathname();
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const duration = useAudioStore((state) => state.duration);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const handleAction = useAudioStore((state) => state.handleAction);
  const playButton = <Play fill={"#ffff"} color={"#ffff"} size={22}/>;
  const pauseButton = <Pause fill={"#ffff"} color={"#ffff"} size={22} />;

  async function handleButtonClick() {
    if(currentTrack)
      handleAction(currentTrack);
  }
  return (
    <div>
      { pathName !== '/player' && currentTrack?.fileUrl && 
        <Card className="p-2 shadow-none bg-primary rounded-none border-b-chart-2 h-14">
            <div className="flex flex-row gap-4 justify-start">
                <Image
                  src={currentTrack?.albumArt || "/bg.png"}
                  alt="album-art"
                  width={40}
                  height={40}
                  className="self-center rounded-md"
                />
              <div className="flex flex-col gap-1 text-secondary text-xs">
                  <label>{currentTrack?.title || ''}</label>
                  <label>{currentTrack?.movieName || ''}</label>
              </div>
              <div className="self-center ml-auto mr-2 mt-2">
                <button onClick={handleButtonClick}>
                {isPlaying ? pauseButton : playButton}
                </button>
              </div> 
            </div>
        </Card>
      }
    </div> 
   
  )
}