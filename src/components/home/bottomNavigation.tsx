"use client"

import * as React from "react"
import Link from "next/link"
import {
  Card,
} from "@/components/ui/card";
import { House, LibraryBig, Music, UsersRound } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function NavigationMenuDemo() {
  const pathName = usePathname();
  const navigationItems = [
    {
        title: "Home",
        href: "/home",
        icon: <House/>,
        iconSelected: <House strokeWidth={4}/>
    },
    {
        title: "Collection",
        href: "/collection",
        icon: <LibraryBig/>,
        iconSelected: <LibraryBig strokeWidth={4}/>
    },
    {
        title: "Songs",
        href: "/songs",
        icon: <Music/>,
        iconSelected: <Music strokeWidth={4}/>
    },
    {
        title: "Artists",
        href: "/artists",
        icon: <UsersRound/>,
        iconSelected: <UsersRound strokeWidth={4}/>
    }
  ]
  return (
    <div className="fixed bottom-4 inset-x-4">
    <Card className="p-2 shadow-none">
        <div className="flex flex-row gap-2 justify-around ">
            {
                navigationItems.map((item, index) => {
                    
                    const isActive = pathName === item.href;
                    const icon = isActive ? item.iconSelected : item.icon;
                    return(
                        <Link href={item.href} className="text-xs" key={index}>
                            <div className={`flex flex-col gap-2 items-center w-15 pt-1 rounded-md
                                ${
                                    isActive ? "text-primary": "text-muted-foreground hover:text-foreground"
                                }
                            `} key={index}>
                                {icon}
                                {item.title}
                            </div>
                        </Link>
                    )
                })
            }
            {/* <div className="flex flex-col gap-2 items-center">
                <House/>
                <Link href="/home" className="text-xs">Home</Link>
            </div>
            <div className="flex flex-col gap-2 items-center">
                <LibraryBig/>
                <Link href="/home" className="text-xs">Collection</Link>
            </div>
            <div className="flex flex-col gap-2 items-center">
                <Music/>
                <Link href="/home" className="text-xs">Songs</Link>
            </div>
            <div className="flex flex-col gap-2 items-center">
                <UsersRound/>
                <Link href="/home" className="text-xs">Artists</Link>
            </div> */}
        </div>
    </Card>
</div>
  )
}