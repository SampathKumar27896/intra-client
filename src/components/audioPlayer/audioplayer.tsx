import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Music,
  StepForward,
  StepBack,
  ChevronDownIcon,
} from "lucide-react";

import { Track, AudioPlayerProps, TypeGetSongResponse } from "@/app/types";
import Image from "next/image";
import clsx from "clsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import useSWRMutation from "swr/mutation";
import useAudioElement from './useAudioElementHook'
import fetcher from "@/app/api/fetcher";
import useAudioStore from '../../store';
import AudioSlider from './audioSlider';



export default function AudioPlayer({
  songList,
  upadateSongList,
}: AudioPlayerProps) {
  const currentTime = useAudioStore((state) => state.currentTime);
  
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const setCurrentTrack = useAudioStore((state) => state.setCurrentTrack);
  const duration = useAudioStore((state) => state.duration);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const handleAction = useAudioStore((state) => state.handleAction);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [button, setButton] = useState(!isPlaying ? <Play className="size-6" />: <Pause className="size-6" />);
  const { trigger } = useSWRMutation<
    TypeGetSongResponse,
    unknown,
    string,
    { songId: string }
  >("audio/getSong", fetcher);
  
  const {
   
    audioRef
  } = useAudioElement(); 
   

 
  
  async function handleButtonClick(track: Track | null) {
    if(track) {
         if (track !== currentTrack) setCurrentTrack(track);
        const result = await handleAction(track);
        if(result) {
          updateButton(track)
        } else {
          const result = await trigger({ songId: track._id });
          if(audioRef.current) {
            const updatedAudioUrl = {
              _id: "",
              movieName: "",
              title:"",
              fileName: "",
              albumArt: "",
              fileUrl: result?.data.songUrl,
              createdAt: "",
              updatedAt: ""
            }
            await handleAction(updatedAudioUrl);
            upadateSongList(track._id, result?.data.songUrl);
          }
        }
    }
  }
  function updateButton(track: Track) {
    let currentButton;
    if (currentTrack && currentTrack._id === track._id) {
      currentButton = !isPlaying ? (
        <Pause className="size-6" />
      ) : (
        <Play className="size-6" />
      );
    } else {
      currentButton = <Pause className="size-6" />;
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
      className={`flex flex-col h-screen overflow-y-hidden  bg-cover bg-center bg-white`}
    >
      
     
      <div
        className={clsx({
          "min-h-[30%]": isLibraryOpen,
          "min-h-[60%]": !isLibraryOpen,
        })}
      >
        <Card className={`border-none h-full flex flex-col gap-1`}>
          <CardHeader>
            <CardTitle className="text-lg  text-center tracking-widest uppercase text-xl">
              Now Playing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-5 flex flex-col justify-end">
              {!isLibraryOpen && (
                <Image
                  src={currentTrack && currentTrack.albumArt || "/bg.png"}
                  alt="album-art"
                  width={300}
                  height={300}
                  className="self-center rounded-xl mb-5"
                />
              )}
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
              >
              <StepBack size={24} className="size-8" />
              </Button>
              <Button
                className="size-[5rem] rounded-full"
                onClick={() => handleButtonClick(currentTrack)}
              >
                {button}
              </Button>
              <Button
                className="size-[5rem] rounded-full"
                variant="ghost"
              >
              <StepForward size={24} className="size-8" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div
        className={clsx("border-none", {
          "min-h-[60%]": isLibraryOpen,
          "min-h-[5%]": !isLibraryOpen,
        })}
      >
        <Collapsible
          className="h-full group rounded-md overflow-y-hidden"
          onOpenChange={() => setIsLibraryOpen(!isLibraryOpen)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="text-md group w-full h-22 border-none bg-transparent shadow-none text-xl bg-card"
            >
              PLAYLIST
              <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="h-full overflow-y-scroll bg-card">
            <div>
              {songList &&
                songList.map((track, index) => (
                  <Item key={index} onClick={() => handleButtonClick(track)} 
                  className={clsx(
                      track._id === currentTrack?._id && "bg-accent"
                  )}>
                    <ItemMedia variant="icon">
                      <Music />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{track.title}</ItemTitle>
                      <ItemDescription>{track.movieName}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button variant="ghost" className="">
                        {currentTrack &&  track._id === currentTrack._id ? (
                          button
                        ) : (
                          <Play className="size-6" />
                        )}
                      </Button>
                    </ItemActions>
                  </Item>
                ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
