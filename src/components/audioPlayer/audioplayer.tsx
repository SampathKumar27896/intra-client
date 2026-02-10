import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Music, ChevronRight, ChevronLeft, ChevronDownIcon } from "lucide-react"
import { Track, AudioPlayerProps, TypeGetSongResponse } from "@/app/types"
import Image from 'next/image';
import clsx from 'clsx';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import useSWRMutation from 'swr/mutation'
import  fetcher from "@/app/api/fetcher";



export default function AudioPlayer({songList, upadateSongList }: AudioPlayerProps) {
  const defaultCurrentTrack: Track = {
    "_id": "",
    "title": "",
    "movieName": "",
    "fileName": "",
    "fileUrl": "",
    "albumArt": "",
    "createdAt": "",
    "updatedAt": ""
}
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0);
  const currentTrack = useRef<Track>(defaultCurrentTrack)
  const [duration, setDuration] = useState(0)
  const { trigger } = useSWRMutation<
  TypeGetSongResponse, 
  unknown,                
  string,                
  { songId: string }  
>('audio/getSong', fetcher);
 // console.log("coming here", JSON.stringify(currentTrack.current), songList[0])
  const handleAudioSelect = async(selectedSong: Track) => {
    console.log(
      "selectedSong",
      selectedSong,
      "currentTrack",
      currentTrack, 
      isPlaying
    )
    currentTrack.current = selectedSong;
    console.log("after update current track", currentTrack)
      setIsPlaying(!isPlaying)
    console.log(audioRef)
    try {
        if(audioRef && audioRef.current) {
          if(selectedSong._id === currentTrack.current._id) {
            if(isPlaying)
              await audioRef.current.pause();
            else{
              audioRef.current.src = selectedSong.fileUrl;
              await audioRef.current.load()
              await audioRef.current.play();
              console.log(audioRef.current)
            }
          } else {
            console.log("selected song url", selectedSong.fileUrl)
            audioRef.current.src = selectedSong.fileUrl;
            currentTrack.current = selectedSong;
            audioRef.current.load()
            await audioRef.current.play();
          } 
        }
    }catch(error: unknown) {
      console.log("coming here", error)
      if(error instanceof DOMException && error?.name === "NotSupportedError") {
        console.log(trigger, selectedSong)
        const result = await trigger({songId: selectedSong._id});
        if(audioRef && audioRef.current && result) {
          audioRef.current.src = result?.data.songUrl;
          audioRef.current.load()
          await audioRef.current.play();
          currentTrack.current = selectedSong;
          upadateSongList(selectedSong._id, result?.data.songUrl);
        }
      }
      setIsPlaying(!isPlaying)  
    }
    
  }
  const handleError = (e: ErrorEvent) => {
    console.log(JSON.stringify(e))
  }
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleMetadata = () => setDuration(audio.duration)
    if (audio.readyState >= 1) handleMetadata()
    audio.addEventListener("loadedmetadata", handleMetadata)
    audio.addEventListener("error", (e) => handleError(e))
    return () => {
      audio.removeEventListener("loadedmetadata", handleMetadata)
      audio.removeEventListener("error", (e) => handleError(e))
    }
  })

  return (

    <div
      className={
        `flex flex-col h-screen overflow-y-hidden gap-4 bg-cover bg-center bg-white` 
      }
    >
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) =>
          setProgress((e.currentTarget.currentTime / duration) * 100 || 0)
        }
        onEnded={() => setIsPlaying(false)}
      />
       <div className={` `+clsx((!isLibraryOpen) ? `min-h-[30%]`: `min-h-30%]`)}>
        <Card
          className={`
             border-none h-full flex flex-col gap-1`}
        >
          <CardHeader>
            <CardTitle className="text-lg">Now Playing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-5 flex flex-col justify-end">
              {/* {!isLibraryOpen && <Image src={currentTrack.current.albumArt || '/bg.png'} alt="album-art" width={120} height={120} className="self-center rounded-xl mb-5"/>} */}
              <p className="text-md font-semibold mb-1">{currentTrack.current.title}</p>
              <p className="text-sm mb-10">{currentTrack.current.movieName}</p>
              <Slider
              value={[progress]}
              max={100}
              step={1}
              onValueChange={(val) => {
                if (!audioRef.current) return
                audioRef.current.currentTime = (val[0] / 100) * duration
                setProgress(val[0])
              }}
              className=""
            />
            </div>
            
          </CardContent>
          <CardFooter>
            <div className="flex flex-row justify-items-center w-full">
                <ChevronLeft size={24} className="basis-64" />
                <Button variant="ghost" className="" onClick={() => handleAudioSelect(currentTrack.current)}>
                  {isPlaying ? (
                    <Pause className="size-6" />
                  ) : (
                    <Play className="size-6" />
                  )}
                </Button>

                <ChevronRight size={24} className="basis-64"/>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className={`` + clsx(!isLibraryOpen && `h-[20%]`, isLibraryOpen && `h-[60%]`)}>
      <Collapsible className="h-full group rounded-md overflow-y-hidden ">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="text-md group w-full" onClick={() => setIsLibraryOpen(!isLibraryOpen)}>
              Playlist
              <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
          </Button>
          </CollapsibleTrigger>
             <CollapsibleContent className="h-full overflow-y-scroll ">
                <div>
                  {songList && songList.map((track, index) => (
                  <Item key={index}>
                    <ItemMedia variant="icon">
                      <Music />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{track.title}</ItemTitle>
                      <ItemDescription>{track.movieName}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                          <Button variant="ghost" className="" onClick={() => handleAudioSelect(track)}>
                            {isPlaying && track._id === currentTrack.current._id ? (
                              <Pause className="size-5" />
                            ) : (
                              <Play className="size-5" />
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
  )
}
