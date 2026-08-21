"use client";
import { useState, useEffect } from "react";
import  AudioPlayer  from "@/components/audioPlayer/audioplayer";
import useSWR from "swr";
import { dataGetter } from "../../api/fetcher";
import { Track } from "@/app/types"
import useAudioStore from '../../../store';

export default function Player() {
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const setCurrentTrack = useAudioStore((state) => state.setCurrentTrack);
  const [songList, setSongList] = useState<Track[]>([])
  const { data, isLoading } = useSWR("audio", dataGetter);
  useEffect(() => {
    if(!isLoading && data?.songList) {
      console.log("setting up data", data)
      setSongList(data?.songList);
      if(!currentTrack) {
        setCurrentTrack(data?.songList[0])
      } else {
        console.log("current track already there")
      }
      
    }
  }, [data, isLoading])
  const upadateSongList = (songId: string, fileUrl: string) => {
    const selectedSong = songList.find(song => song._id === songId);
    if(selectedSong) {
      selectedSong.fileUrl = fileUrl;
      const updatedSongList = songList.map(song =>
      song._id === selectedSong._id
        ? { ...song, ...selectedSong }
        : song
      )
      setSongList(updatedSongList);
    }
  }
  return (
    <div>
      {!isLoading && songList?.length > 0 && <AudioPlayer songList={songList} upadateSongList={upadateSongList}/>}
    </div>
  );
}
