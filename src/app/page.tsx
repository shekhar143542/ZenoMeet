'use client'

import { RubixHero } from "@/LanderComponents/rubix-hero";
import Logo from "@/LanderComponents/Headercomponents/logo";
import { StarBorder } from "@/components/ui/star-border";
import { motion } from "framer-motion";
import Link from "next/link";
import { HoverButton } from "@/components/ui/hover-button";

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
              Meeting With AI
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
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold mb-8">More Content Below</h2>
            <p className="text-lg text-gray-600">
              This content extends below the hero section and creates natural vertical scroll.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}