'use client'

import { RubixHero } from "@/LanderComponents/rubix-hero";
import Logo from "@/LanderComponents/Headercomponents/logo";
import { StarBorder } from "@/components/ui/star-border";
import { motion } from "framer-motion";
import Link from "next/link";
import { HoverButton } from "@/components/ui/hover-button";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { ThreeDMarqueeDemo } from "@/components/marquedemo";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section - Fixed Height */}
      <section className="relative h-screen">
        <div className="relative flex items-center justify-center h-full">
          <RubixHero />

          {/* Overlay StarBorder on cube */}
          <div className="absolute bottom-135 flex justify-center w-full">
            <StarBorder>
              Meet With AI
            </StarBorder>
          </div>
          
          <div className="absolute bottom-20 flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <Link href='/sign-in'>  
                <HoverButton>Get Started</HoverButton>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Overlay header */}
        <Logo />
      </section>

      {/* Content that extends below hero */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          
          {/* Add more content here that will naturally scroll */}
          
             <div className="h-[17.5rem] flex items-center justify-center">
      <TextHoverEffect text="ZENOMEET" />
    </div>
    <div className=" text-center">
            <h2 className="bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent text-4xl font-bold mb-6">
              AI-Powered Meeting Excellence
            </h2>
           <p className="text-xl text-gray-400 max-w-2xl mx-auto">
Connect with expert AI agents on-demand. Get instant answers, solve complex problems, and gain comprehensive meeting insights that accelerate your success
  </p>
          </div>
          <div>
            <ThreeDMarqueeDemo/>
          </div>
        </div>
      </section>
    </div>
  );
}
