import React from 'react';
import { Slider } from "@/components/ui/slider";
import useAudioStore from '../../store';

function AudioSlider({
    duration,
    audioRef,
    currentTime,
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