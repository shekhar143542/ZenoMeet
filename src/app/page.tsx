'use client'

import { RubixHero } from "@/LanderComponents/rubix-hero";
import Logo from "@/LanderComponents/Headercomponents/logo";
import { StarBorder } from "@/components/ui/star-border";
import { motion } from "framer-motion";
import Link from "next/link";
import { HoverButton } from "@/components/ui/hover-button";

export default function Home() {
  return (
    <>

   <main className="relative min-h-screen">
  {/* Cube + StarBorder wrapper */}
  <div className="relative flex items-center justify-center">
    <RubixHero />

    {/* Overlay StarBorder on cube */}
    <div className="absolute bottom-135 flex justify-center">
      <StarBorder>
        Create With AI
      </StarBorder>
    </div>
    <div className="absolute bottom-20 flex justify-center">
      <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
             <Link href='/'>  
            
      <HoverButton>Get Started</HoverButton>
    
            </Link>
          </motion.div>
    </div>
  </div>

  {/* Overlay header */}
  <Logo />
</main>
    
    </>
  );
}
