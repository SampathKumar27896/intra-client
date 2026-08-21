import React from 'react'

export default function AnimatedEquilizer() {
    return (
        <div className="flex h-8 w-8 items-center justify-center gap-1">
            {[1, 2, 3, 4].map((bar) => (
                <span
                    key={bar}
                    className="w-[2px] rounded-full bg-black animate-equalizer"
                    style={{
                        animationDelay: `${bar * 100}ms`,
                        height: `${10 + bar * 4}px`,
                    }}
                />
            ))}
        </div>
    );
}