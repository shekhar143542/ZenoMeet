// import { Scene } from "@/components/rubik-s-cube";


// const RubixHero = () => {
//   return (
//     <div className="h-screen w-screen relative flex flex-col justify-center items-center">
//       <div className="absolute inset-0">
//         <Scene />
//       </div>
//       <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight mix-blend-difference text-white">
//         Solve the Complexity
//       </h1>
//       <p className="text-lg md:text-xl text-white mix-blend-exclusion max-w-2xl px-6 leading-relaxed">
//          One twist at a time.
//       </p>
//     </div>
//   );
// };

// export { RubixHero };




import { motion } from "framer-motion";
import { Scene } from "@/components/rubik-s-cube";

const RubixHero = () => {
  return (
    <div className="h-screen w-screen relative flex flex-col justify-center items-center">
      <div className="absolute inset-0">
        <Scene />
      </div>
      
      <motion.h1 
        className="text-6xl md:text-8xl font-bold mb-6 tracking-tight mix-blend-difference text-white"
        initial={{ 
          opacity: 0, 
          y: 50,
          scale: 0.8
        }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: 1
        }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.3
        }}
      >
        Solve the Complexity
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-white mix-blend-exclusion max-w-2xl px-6 leading-relaxed"
        initial={{ 
          opacity: 0,
          y: 30,
          filter: "blur(10px)"
        }}
        animate={{ 
          opacity: 1,
          y: 0,
          filter: "blur(0px)"
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
          delay: 0.8
        }}
      >
        One twist at a time.
      </motion.p>
    </div>
  );
};

export { RubixHero };
