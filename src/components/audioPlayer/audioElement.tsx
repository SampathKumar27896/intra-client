'use client'

import React from 'react';
import useAudioStore from '../../store';
function AudioElement() {
    const ref = useAudioStore((state) => state.ref);
    const onTimeUpdate = useAudioStore((state) => state.onTimeUpdate);
    const onLoadedMetadata = useAudioStore((state) => state.onLoadedMetadata);
    return (
        <div>
            <audio
                ref={ref}
                onLoadedMetadata={onLoadedMetadata}
                onTimeUpdate={onTimeUpdate}
                preload="metadata"
            />
      </div>
    )
}

export default AudioElement;