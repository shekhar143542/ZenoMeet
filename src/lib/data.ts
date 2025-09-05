import HomeIcon from "@/icons/HomeIcon";
import LeadIcon from "@/icons/LeadIcon";
import SettingsIcon from "@/icons/SettingsIcon";
import { Crown, Video, Bot } from "lucide-react";

export const SidebarData = [
    {
        id: 1,
        title: 'Home',
        icon: HomeIcon,
        link: '/dashboard'
    },
    {
        id: 2,
        title: 'Meetings',
        icon: Video, // Changed from Webcam to Video for more professional look
        link: '/dashboard/meetings'
    },
    {
        id: 3,
        title: 'AI Agents',
        icon: Bot, // Changed from LeadIcon to Bot for better representation of AI Agents
        link: '/dashboard/agents'
    },
    {
        id: 4,
        title: 'Settings',
        icon: SettingsIcon,
        link: '/dashboard/settings'
    },
    {
        id: 5,
        title: 'Upgrade',
        icon: Crown,
        link: '/dashboard/upgrade'
    }
]