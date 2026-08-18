"use client"

import * as React from "react"
import Link from "next/link"
import {
  Card,
} from "@/components/ui/card";
import { House, Disc3 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function NavigationMenuDemo() {
  const pathName = usePathname();
  const navigationItems = [
    {
        title: "Home",
        href: "/home",
        icon: (<div className="text-secondary"><House/></div>),
        iconSelected: (<div className="text-primary"><House fill={"#ffff"} /></div>)
    },
    {
        title: "Player",
        href: "/player",
        icon: (<div className="text-secondary"><Disc3/></div>),
        iconSelected: (<div className="text-primary"><Disc3 fill={"#ffff"}/></div>)
    }
  ]
  return (
    <div className="fixed bottom-4 inset-x-4">
    <Card className="p-2 shadow-none bg-primary">
        <div className="flex flex-row gap-2 justify-around ">
            {
                navigationItems.map((item, index) => {
                    
                    const isActive = pathName === item.href;
                    const icon = isActive ? item.iconSelected : item.icon;
                    return(
                        <Link href={item.href} className="text-xs" key={index}>
                            <div className={`flex flex-col gap-2 items-center w-15 pt-1 rounded-md text-secondary`} key={index}>
                                {icon}
                                {item.title}
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    </Card>
</div>
  )
}