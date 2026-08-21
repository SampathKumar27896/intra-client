import React from 'react';
import { Slider } from "@/components/ui/slider";
import useAudioStore from '../../store';
export interface AudioSliderProps {
    duration: number;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    currentTime: number;
}
function AudioSlider({
    duration,
    audioRef,
    currentTime,
}: {
    duration: number;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    currentTime: number;
}) {
    const sliderValue = currentTime;
    function handleSliderChange(val: number[]) {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = val[0];
    }

    return (
        <div>
            <Slider
                value={[sliderValue]}
                max={duration || 0}
                min={0}
                onValueChange={(val) => {
                    handleSliderChange(val);
                }}
                className=""
            />
        </div>
    )
}

export default AudioSlider;