'use client'

import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Spotlight from '@/icons/Spotlight';
import { SidebarData } from '@/lib/data';
import { Tooltip } from '@radix-ui/react-tooltip';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardUserButton from './dashboard-user-button';

const Sidebar = () => {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`${isExpanded ? 'w-64' : 'w-18 sm:w-24'} h-screen sticky top-0 py-10 px-2 sm:px-6 border rounded-lg 
        bg-background border-border flex flex-col items-center justify-start gap-10 transition-all duration-300 ease-in-out`}>
            <div className="w-full flex items-center justify-between">
                <div className={`${isExpanded ? 'block' : 'hidden'}`}>
                    <Spotlight/>
                </div>
                {!isExpanded && (
                    <div>
                        <Spotlight/>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                    {isExpanded ? (
                        <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                </button>
            </div>
            
            <div className='w-full h-full justify-between items-center flex flex-col'>
                <div className='w-full h-fit flex flex-col gap-4 items-center justify-center'>
                    {SidebarData.map((item) => (
                        <div key={item.id} className="w-full">
                            {isExpanded ? (
                                <Link
                                    href={item.link}
                                    className={`flex items-center gap-3 cursor-pointer rounded-lg p-3 w-full text-left transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50
                                    ${pathname === item.link ? 'iconBackground' : ''}`}
                                >
                                    <item.icon
                                        className={`w-5 h-5 flex-shrink-0 ${pathname === item.link ? '' : 'opacity-80'}`}
                                    />
                                    <span className={`text-sm font-medium transition-all duration-200 ${
                                        pathname === item.link ? 'text-foreground' : 'text-muted-foreground'
                                    }`}>
                                        {item.title}
                                    </span>
                                </Link>
                            ) : (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={item.link}
                                                className={`flex items-center justify-center cursor-pointer rounded-lg p-2 
                                                ${pathname === item.link ? 'iconBackground' : ''}`}
                                            >
                                                <item.icon
                                                    className={`w-4 h-4 ${pathname === item.link ? '' : 'opacity-80'}`}
                                                />
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p>{item.title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    ))}
                </div>

                {/* User Button at the bottom */}
                <div className="w-full pb-2">
                    <DashboardUserButton isExpanded={isExpanded} />
                </div>
            </div>
        </div>
    )
}

export default Sidebar