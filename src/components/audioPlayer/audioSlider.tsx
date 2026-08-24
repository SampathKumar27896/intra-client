import React from 'react';
import { Slider } from "@/components/ui/slider";
import useAudioStore from '../../store';
export interface AudioSliderProps {
    duration: number;
    currentTime: number;
}
function AudioSlider({
    duration,
    currentTime,
}: {
    duration: number;
    currentTime: number;
}) {
    const sliderValue = currentTime;
    const setModifiedTime = useAudioStore((state)  => state.setModifiedTime);

    function handleSliderChange(val: number[]) {
        console.log("Inside slider callback ", val)
       setModifiedTime(val[0]);
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