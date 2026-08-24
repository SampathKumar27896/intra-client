"use client";
import { useEffect } from "react";
import  AudioPlayer  from "@/components/audioPlayer/audioplayer";

import { dataGetter } from "../../api/fetcher";

import useAudioStore from '../../../store';
import useSWRImmutable from 'swr/immutable';
export default function Player() {
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const setCurrentTrack = useAudioStore((state) => state.setCurrentTrack);
  const storeSongList = useAudioStore((state) => state.storeSongList);
  const setStoreSongList = useAudioStore((state) => state.setStoreSongList);
  //const [songList, setSongList] = useState<Track[]>([])
  const shouldFetch = !storeSongList || storeSongList.length === 0;
  const { data, isLoading } = useSWRImmutable(shouldFetch ? "audio" : null, dataGetter);
  useEffect(() => {
    if(!isLoading && data?.songList) {
      console.log("setting up data", data)
      setStoreSongList(data?.songList);
      if(!currentTrack) {
        setCurrentTrack(data?.songList[0])
      } else {
        console.log("current track already there")
      }
    }
  }, [data, isLoading])
  
  return (
    <div>
      {!isLoading && storeSongList?.length > 0 && <AudioPlayer/>}
    </div>
  );
}
