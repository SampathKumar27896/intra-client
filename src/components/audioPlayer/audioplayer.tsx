import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Music, ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from "lucide-react"
import { Track, AudioPlayerProps } from "@/app/types"
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
  const [isLibraryOpen, setIsLibraryOpen] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0);
  const currentTrack = useRef<Track>(defaultCurrentTrack)
  const [duration, setDuration] = useState(0)
  const { trigger, data, error, isMutating, reset } = useSWRMutation('audio/getSong', fetcher);
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
        if(audioRef && audioRef.current) {
          audioRef.current.src = result.data.songUrl;
          audioRef.current.load()
          await audioRef.current.play();
          currentTrack.current = selectedSong;
          upadateSongList(selectedSong._id, result.data.songUrl);
        }
      }
      setIsPlaying(!isPlaying)  
    }
    
  }
  const handleError = (e: any) => {
    console.log(JSON.stringify(e))
  }
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleMetadata = () => setDuration(audio.duration)

    if (audio.readyState >= 1) handleMetadata()
    if(songList && songList.length > 0) {
      console.log("state updated")
      currentTrack.current = songList[0];
    }
    audio.addEventListener("loadedmetadata", handleMetadata)
    audio.addEventListener("error", (e) => handleError(e))
    return () => {
      audio.removeEventListener("loadedmetadata", handleMetadata)
      audio.removeEventListener("error", (e) => handleError(e))
    }
  }, [songList[0]['_id']])

  return (

    <div
      className='flex flex-col h-screen overflow-y-hidden gap-4'
    >
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) =>
          setProgress((e.currentTarget.currentTime / duration) * 100 || 0)
        }
        onEnded={() => setIsPlaying(false)}
      />
       <div className={clsx("",isLibraryOpen ? `basis-1/4`:`basis-3/4`)}>
        <Card
          className={`
             border-none shadow-none flex flex-col h-full gap-0`}
        >
          <CardHeader>
            <CardTitle className="text-xl">Now Playing</CardTitle>
          </CardHeader>
          <CardContent className={clsx("",isLibraryOpen ? `basis-0`:`basis-128`)}>
            <div className="mb-5 flex flex-col justify-end h-full">
              {!isLibraryOpen && <Image src={currentTrack.current.albumArt} alt="album-art" width={200} height={200} className="self-center rounded-xl mb-5"/>}
              <p className="text-2xl font-semibold mb-1">{currentTrack.current.title}</p>
              <p className="text-xl mb-10">{currentTrack.current.movieName}</p>
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
          <CardFooter className="basis-24">
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
      <div className={clsx("",isLibraryOpen ? `basis-3/4`:`basis-1/4`)}>
        <Card className='border-none'>
          <CardHeader
            className="cursor-pointer select-none"
          >
            <CardTitle className="flex items-center justify-between">
              MP3 Library
              <Button variant="ghost" size="icon" onClick={() => setIsLibraryOpen((prev) => !prev)}>
               {isLibraryOpen ? <ChevronUp size={24} />: <ChevronDown size={24} />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="space-y-3 overflow-y-auto">
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
                          <Button variant="ghost" className="" onClick={(e) => handleAudioSelect(track)}>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
