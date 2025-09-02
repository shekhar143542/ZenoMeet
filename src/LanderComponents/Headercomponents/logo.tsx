import Image from "next/image";
import React from 'react'

const Logo = () => {
  return (
   <div>
  <header className="absolute top-0 left-0 w-full p-6 bg-black/50 text-white z-10 flex justify-center items-center">
    {/* Logo + Text (absolute top-left) */}
    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center">
      {/* Big Logo */}
      <div className="w-28 h-32 relative rounded-full overflow-hidden bg-black/40 ">
        <Image src="/zenologo1.png" alt="Logo" fill className="object-cover" />
      </div>
      {/* Text very close to logo */}
      <span className="-ml-7 text-2xl font-semibold tracking-wide text-gray-500/100">ZenoMeet</span>
    </div>

    {/* Navigation (centered) */}
    <div className="hidden md:flex items-center space-x-8">
      <a href="#" className="text-orange-200/60 hover:text-orange-200/80 transition-colors">Home</a>
      <a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
      <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
    </div>
  </header>
</div>


  )
}

export default Logo
