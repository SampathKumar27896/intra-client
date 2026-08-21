import React, { JSX } from 'react';
import { clsx } from 'clsx';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Music, ChevronsUp
} from "lucide-react";
import { Track } from "@/app/types";
import useAudioStore from '../../store';
export default function AudioPlaylist({
    songList,
    currentTrack,
    button,
    playButton,
    // handleButtonClick
}:{
    songList: Track[],
    currentTrack: Track | null,
    button:  JSX.Element,
    playButton: JSX.Element
    // handleButtonClick: (track: Track | null) => Promise<void>
}) {
    const setCurrentSongIndex = useAudioStore((state) => state.setCurrentSongIndex)
    return (
        <div className="w-full">
            <Sheet key={"bottom"}>
                <SheetTrigger asChild>
                    <Card className={`border-none h-full flex flex-col gap-1`}>
          
          <CardContent>
           <div className="flex flex-row justify-between">
            <p className="font-medium">PLAYLIST</p>
            <p><ChevronsUp strokeWidth={3} /></p>
           </div>
          </CardContent>
          
        </Card>
                </SheetTrigger>
                <SheetContent showCloseButton={true} side={"bottom"} className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]">
                    <SheetHeader>
                        <SheetTitle>No Close Button</SheetTitle>
                        <SheetDescription asChild>
                            <div className="no-scrollbar h-[60vh] overflow-y-auto">
                                {songList &&
                                    songList.map((track, index) => (
                                        <Item key={index} onClick={() => {
                                            // handleButtonClick(track);
                                            setCurrentSongIndex(index);
                                        }}
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
                                                    {currentTrack && track._id === currentTrack._id ? (
                                                        button
                                                    ) : (
                                                        playButton
                                                    )}
                                                </Button>
                                            </ItemActions>
                                        </Item>
                                    ))}

                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>

            </Sheet>
        </div>
    )
}