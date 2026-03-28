import { useRef, useState, useEffect } from "react";
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
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Music,
  ChevronRight,
  ChevronLeft,
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
import fetcher from "@/app/api/fetcher";

export default function AudioPlayer({
  songList,
  upadateSongList,
}: AudioPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(songList[0]);
  const [isPlay, setIsPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [button, setButton] = useState(<Play className="size-6" />);
  const { trigger } = useSWRMutation<
    TypeGetSongResponse,
    unknown,
    string,
    { songId: string }
  >("audio/getSong", fetcher);
  function onLoadMetaData() {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isSeeking) return;
    setCurrentTime(audio.currentTime);
  }

  function handleSliderChange(val: number[]) {
    const audio = audioRef.current;
    if (!audio) return;
    setSeekValue(val[0]);
    //audio.currentTime = time;
    //setCurrentTime(time);
  }
  async function handleButtonClick(track: Track) {
    if (track !== currentTrack) setCurrentTrack(track);
    if (audioRef.current) {
      try {
        if (audioRef.current.src === track.fileUrl) {
          if (!audioRef.current.paused) {
            audioRef.current.pause();
            setIsPlay(false);
          } else {
            await audioRef.current.play();
            setIsPlay(true);
          }
        }
        if (audioRef.current.src !== track.fileUrl) {
          audioRef.current.src = track.fileUrl;
          await audioRef.current.play();
          setIsPlay(true);
        }
        updateButton(track);
      } catch (error) {
        console.log(error);
        if (
          error instanceof DOMException &&
          error.name === "NotSupportedError"
        ) {
          const result = await trigger({ songId: track._id });
          audioRef.current.src = result?.data.songUrl;
          await audioRef.current.play();
          upadateSongList(track._id, result?.data.songUrl);
          setIsPlay(!isPlay);
        }
      }
      updateButton(track);
    }
  }
  function updateButton(track: Track) {
    console.log("Comparing here for button", currentTrack, track, isPlay);
    let currentButton;
    if (currentTrack._id === track._id) {
      currentButton = !isPlay ? (
        <Pause className="size-6" />
      ) : (
        <Play className="size-6" />
      );
    } else currentButton = <Pause className="size-6" />;
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
      <audio
        ref={audioRef}
        onLoadedMetadata={onLoadMetaData}
        onTimeUpdate={handleTimeUpdate}
        preload="metadata"
      />
      <div
        className={clsx({
          "min-h-[30%]": isLibraryOpen,
          "min-h-[60%]": !isLibraryOpen,
        })}
      >
        <Card className={`border-none h-full flex flex-col gap-1 rounded-none`}>
          <CardHeader>
            <CardTitle className="text-lg tracking-tighter text-center uppercase text-xl">
              Now Playing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-5 flex flex-col justify-end">
              {!isLibraryOpen && (
                <Image
                  src={currentTrack.albumArt || "/bg.png"}
                  alt="album-art"
                  width={360}
                  height={360}
                  className="self-center rounded-xl mb-5"
                />
              )}
              <p className="text-md font-semibold mb-1 text-2xl">
                {currentTrack.title}
              </p>
              <p className="text-sm mb-10">{}</p>
              <div className="mb-5 flex flex-row justify-between">
                <p className="text-lg font-medium">{formatTime(currentTime)}</p>
                <p className="text-lg font-medium">{formatTime(duration)}</p>
              </div>
              <Slider
                value={[isSeeking ? seekValue : currentTime]}
                max={duration || 0}
                min={0}
                onValueChange={(val) => {
                  setIsSeeking(true);
                  handleSliderChange(val);
                }}
                onValueCommit={(val) => {
                  const audio = audioRef.current;
                  if (!audio) return;

                  const time = val[0];

                  audio.currentTime = time;
                  setCurrentTime(time);

                  setIsSeeking(false);
                }}
                className=""
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-row justify-items-center w-full">
              <ChevronLeft size={24} className="basis-64" />
              <Button
                variant="ghost"
                className=""
                onClick={() => handleButtonClick(currentTrack)}
              >
                {button}
              </Button>
              <ChevronRight size={24} className="basis-64" />
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
              className="text-md group w-full h-22 border-none bg-transparent shadow-none bg-card"
            >
              Playlist
              <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="h-full overflow-y-scroll bg-card">
            <div>
              {songList &&
                songList.map((track, index) => (
                  <Item key={index} onClick={() => handleButtonClick(track)}>
                    <ItemMedia variant="icon">
                      <Music />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{track.title}</ItemTitle>
                      <ItemDescription>{track.movieName}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button variant="ghost" className="">
                        {track._id === currentTrack._id ? (
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
