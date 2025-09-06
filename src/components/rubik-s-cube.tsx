"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, useHelper } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { SpotLight, useDepthBuffer, SpotLightProps } from '@react-three/drei';
import * as THREE from 'three';
import React, { Suspense, useRef, useState, useEffect, forwardRef, useMemo, useCallback } from "react";
import { Vector3, Matrix4, Quaternion } from "three";
import { RoundedBox } from "@react-three/drei";

interface RubiksCubeModelProps extends React.ComponentProps<'group'> {
  position?: [number, number, number];
  scale?: number;
}

const RubiksCubeModel = forwardRef<{ reset: () => void }, RubiksCubeModelProps>((props, ref) => {
  const ANIMATION_DURATION = 1.2;
  const GAP = 0.01;
  const RADIUS = 0.075;
  
  const mainGroupRef = useRef<THREE.Group>(null);
  const isAnimatingRef = useRef(false);
  const currentRotationRef = useRef(0);
  const lastMoveAxisRef = useRef<"x" | "y" | "z" | null>(null);
  const currentMoveRef = useRef<{
    axis: "x" | "y" | "z";
    layer: number;
    direction: 1 | -1;
    rotationAngle: number;
  } | null>(null);
  const animationFrameRef = useRef(null);
  const isMountedRef = useRef(true); 
  const viewportSizeRef = useRef({ width: window.innerWidth, height: window.innerHeight });
  
  const isResizingRef = useRef(false);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [size, setSize] = useState(0.8);
  const [cubes, setCubes] = useState<Array<{
    position: THREE.Vector3;
    rotationMatrix: THREE.Matrix4;
    id: string;
    originalCoords: { x: number; y: number; z: number };
  }>>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [deviceSettings, setDeviceSettings] = useState(() => {
    const isMobile = window.innerWidth < 768;
    return {
      smoothness: isMobile ? 2 : 4,
      castShadow: !isMobile,
      receiveShadow: !isMobile
    };
  });
  
  const reusableVec3 = useMemo(() => new Vector3(), []);
  const reusableMatrix4 = useMemo(() => new Matrix4(), []);
  const reusableQuaternion = useMemo(() => new Quaternion(), []);
  
  React.useImperativeHandle(ref, () => ({
    reset: resetCube
  }));

  const initializeCubes = useCallback(() => {
    const initial = [];
    const positions = [-1, 0, 1];
    
    for (let x of positions) {
      for (let y of positions) {
        for (let z of positions) {
          initial.push({
            position: new Vector3(x, y, z),
            rotationMatrix: new Matrix4().identity(),
            id: `cube-${x}-${y}-${z}`,
            originalCoords: { x, y, z }
          });
        }
      }
    }
    return initial;
  }, []);

  useEffect(() => {
    setCubes(initializeCubes());
    
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
    };
  }, [initializeCubes]);

  const resetCube = useCallback(() => {
    if (!isMountedRef.current) return;
    
    setCubes(initializeCubes());
    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.set(0, 0, 0);
    }
    isAnimatingRef.current = false;
    currentRotationRef.current = 0;
    lastMoveAxisRef.current = null;
    currentMoveRef.current = null;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [initializeCubes]);

  const handleViewportChange = useCallback(() => {
    if (!isMountedRef.current) return;
    
    isResizingRef.current = true;
    
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      const visualViewportWidth = window.visualViewport ? window.visualViewport.width : width;
      const visualViewportHeight = window.visualViewport ? window.visualViewport.height : height;
      
      const effectiveWidth = Math.min(width, visualViewportWidth);
      const effectiveHeight = Math.min(height, visualViewportHeight);
      
      const prevSize = viewportSizeRef.current;
      if (Math.abs(prevSize.width - effectiveWidth) < 10 && 
          Math.abs(prevSize.height - effectiveHeight) < 10) {
        isResizingRef.current = false;
        return;
      }
      
      viewportSizeRef.current = { width: effectiveWidth, height: effectiveHeight };
      
      const isMobile = effectiveWidth < 768;
      setDeviceSettings(prevSettings => {
        const newSettings = {
          smoothness: isMobile ? 2 : 4,
          castShadow: !isMobile,
          receiveShadow: !isMobile
        };
        
        if (prevSettings.smoothness !== newSettings.smoothness ||
            prevSettings.castShadow !== newSettings.castShadow ||
            prevSettings.receiveShadow !== newSettings.receiveShadow) {
          return newSettings;
        }
        return prevSettings;
      });
      
      isResizingRef.current = false;
    }, 150);
    
  }, [resetCube]);

  useEffect(() => {
    handleViewportChange();
    
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;
    const throttledHandler = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        handleViewportChange();
        throttleTimer = null;
      }, 100);
    };
    
    window.addEventListener("resize", throttledHandler);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", throttledHandler);
      window.visualViewport.addEventListener("scroll", throttledHandler);
    }
    
    const handleOrientationChange = () => {
      if (isAnimatingRef.current) {
        resetCube();
      }
      setTimeout(handleViewportChange, 100);
    };
    
    window.addEventListener("orientationchange", handleOrientationChange);
    
    return () => {
      window.removeEventListener("resize", throttledHandler);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", throttledHandler);
        window.visualViewport.removeEventListener("scroll", throttledHandler);
      }
      window.removeEventListener("orientationchange", handleOrientationChange);
      
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
    };
  }, [handleViewportChange, resetCube]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isMountedRef.current) return;
      const isPageVisible = document.visibilityState === "visible";
      setIsVisible(isPageVisible);

      if (!isPageVisible) {
        resetCube();
      } else {
        setTimeout(() => {
          if (isMountedRef.current) {
            handleViewportChange();
          }
        }, 100);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [resetCube, handleViewportChange]);

  const possibleMoves = useMemo(() => {
    const moves: { axis: 'x' | 'y' | 'z'; layer: number; direction: 1 | -1 }[] = [];
    for (const axis of ['x', 'y', 'z'] as const) {
      for (let layer of [-1, 0, 1]) {
        for (let direction of [1, -1] as const) {
          moves.push({ axis, layer, direction });
        }
      }
    }
    return moves;
  }, []);

  interface CubePosition {
    x: number;
    y: number;
    z: number;
  }

  interface CubeData {
    position: THREE.Vector3;
    rotationMatrix: THREE.Matrix4;
    id: string;
    originalCoords: CubePosition;
  }

  interface Move {
    axis: 'x' | 'y' | 'z';
    layer: number;
    direction: 1 | -1;
    rotationAngle?: number;
  }

  const isInLayer = useCallback(
    (position: THREE.Vector3, axis: Move['axis'], layer: number): boolean => {
      const coord =
        axis === "x"
          ? position.x
          : axis === "y"
          ? position.y
          : position.z;
      return Math.abs(coord - layer) < 0.1;
    },
    []
  );

  const selectNextMove = useCallback(() => {
    if (!isAnimatingRef.current && isVisible && isMountedRef.current && !isResizingRef.current) {
      const availableMoves = possibleMoves.filter(
        (move) => move.axis !== lastMoveAxisRef.current
      );
      
      const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      const rotationAngle = Math.PI / 2;
            
      currentMoveRef.current = { ...move, rotationAngle };
      lastMoveAxisRef.current = move.axis;
      isAnimatingRef.current = true;
      currentRotationRef.current = 0;
    }
  }, [possibleMoves, isVisible]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const scheduleNextMove = () => {
      if (isVisible && isMountedRef.current && !isResizingRef.current) {
        const delay = isAnimatingRef.current ? ANIMATION_DURATION * 1000 : 200;
        
        timeoutId = setTimeout(
          () => {
            selectNextMove();
            if (isMountedRef.current) {
              scheduleNextMove();
            }
          },
          delay
        );
      } else {
        if (isResizingRef.current && isVisible && isMountedRef.current) {
          setTimeout(() => {
            if (isMountedRef.current) {
              scheduleNextMove();
            }
          }, 500);
        }
      }
    };

    scheduleNextMove();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isVisible, selectNextMove]);

  interface CreateRotationMatrixFn {
    (axis: 'x' | 'y' | 'z', angle: number): THREE.Matrix4;
  }

  const createRotationMatrix: CreateRotationMatrixFn = useCallback(
    (axis, angle) => {
      reusableMatrix4.identity();
      reusableQuaternion.identity();
      reusableVec3.set(0, 0, 0);

      reusableVec3[axis] = 1;
      reusableQuaternion.setFromAxisAngle(reusableVec3, angle);
      return reusableMatrix4.makeRotationFromQuaternion(reusableQuaternion);
    },
    [reusableMatrix4, reusableQuaternion, reusableVec3]
  );

  interface EaseInOutQuadFn {
    (t: number): number;
  }

  const easeInOutQuad: EaseInOutQuadFn = useCallback((t: number): number => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }, []);

  interface MatrixToQuaternionFn {
    (matrix: THREE.Matrix4): THREE.Quaternion;
  }

  const matrixToQuaternion: MatrixToQuaternionFn = useCallback((matrix: THREE.Matrix4): THREE.Quaternion => {
    reusableQuaternion.setFromRotationMatrix(matrix);
    return reusableQuaternion.clone();
  }, [reusableQuaternion]);

  interface NormalizePositionsFn {
    (cubes: CubeData[]): CubeData[];
  }

  const normalizePositions: NormalizePositionsFn = useCallback((cubes: CubeData[]): CubeData[] => {
    return cubes.map((cube: CubeData) => {
      const x = Math.round(cube.position.x);
      const y = Math.round(cube.position.y);
      const z = Math.round(cube.position.z);
      
      const newPosition = 
        (Math.abs(cube.position.x - x) > 0.001 || 
         Math.abs(cube.position.y - y) > 0.001 || 
         Math.abs(cube.position.z - z) > 0.001) 
          ? new Vector3(x, y, z) 
          : cube.position;
      
      return {
        ...cube,
        position: newPosition
      };
    });
  }, []);

  interface CheckCubeIntegrityCube {
    position: THREE.Vector3;
    id: string;
  }

  type CheckCubeIntegrityFn = (cubes: CheckCubeIntegrityCube[]) => boolean;

  const checkCubeIntegrity: CheckCubeIntegrityFn = useCallback((cubes) => {
    if (cubes.length !== 27) {
      console.warn("Incorrect number of cubes:", cubes.length);
      return false;
    }

    for (const cube of cubes) {
      const { x, y, z } = cube.position;
      if (Math.abs(x) > 1.1 || Math.abs(y) > 1.1 || Math.abs(z) > 1.1) {
        console.warn("Cube out of range:", cube.id, x, y, z);
        return false;
      }
    }
    
    return true;
  }, []);

  interface UpdateCubesMove {
    axis: 'x' | 'y' | 'z';
    layer: number;
    direction: 1 | -1;
    rotationAngle?: number;
  }

  interface UpdateCubesFn {
    (
      prevCubes: CubeData[],
      move: UpdateCubesMove,
      stepRotationMatrix: THREE.Matrix4
    ): CubeData[];
  }

  const updateCubes: UpdateCubesFn = useCallback(
    (prevCubes, move, stepRotationMatrix) => {
      return prevCubes.map((cube) => {
        if (isInLayer(cube.position, move.axis, move.layer)) {
          const tempVec3 = new Vector3(
            cube.position.x,
            cube.position.y,
            cube.position.z
          );

          tempVec3.applyMatrix4(stepRotationMatrix);

          const newRotationMatrix = new Matrix4().multiplyMatrices(
            stepRotationMatrix,
            cube.rotationMatrix
          );

          return {
            ...cube,
            position: tempVec3,
            rotationMatrix: newRotationMatrix,
          };
        }
        return cube;
      });
    },
    [isInLayer]
  );

  useFrame((state, delta) => {
    if (!isVisible || !isMountedRef.current) return;

    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.x += delta * 0.3;
      mainGroupRef.current.rotation.y += delta * 0.5;
      mainGroupRef.current.rotation.z += delta * 0.2;
    }

    if (isResizingRef.current && isAnimatingRef.current) {
      resetCube();
      return;
    }

    if (isAnimatingRef.current && currentMoveRef.current) {
      const move = currentMoveRef.current;
      const targetRotation = move.rotationAngle;
      const rotation = delta / ANIMATION_DURATION;

      if (currentRotationRef.current < 1) {
        const newRotation = Math.min(currentRotationRef.current + rotation, 1);
        const prevRotation = currentRotationRef.current;
        currentRotationRef.current = newRotation;

        const easedProgress = easeInOutQuad(newRotation);
        const prevEasedProgress = easeInOutQuad(prevRotation);
        const currentAngle = easedProgress * targetRotation;
        const prevAngle = prevEasedProgress * targetRotation;
        const stepRotation = currentAngle - prevAngle;

        const stepRotationMatrix = createRotationMatrix(
          move.axis,
          stepRotation * move.direction
        );

        if (isMountedRef.current && !isResizingRef.current) {
          setCubes((prevCubes) => {
            const updatedCubes = updateCubes(prevCubes, move, stepRotationMatrix);
            
            if (newRotation >= 1) {
              const normalizedCubes = normalizePositions(updatedCubes);
              
              if (!checkCubeIntegrity(normalizedCubes)) {
                console.warn("Found a cube out of bounds");
                if (isMountedRef.current) {
                  setTimeout(() => resetCube(), 0);
                }
              }
              
              isAnimatingRef.current = false;
              currentRotationRef.current = 0;
              currentMoveRef.current = null;
              
              return normalizedCubes;
            }
            
            return updatedCubes;
          });
        }
      }
    }
  });

  const chromeMaterial = useMemo(() => ({
    color: '#000000',
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 0,
    clearcoatRoughness: 0,
    reflectivity: 0.5,
    iridescence: 0,
    iridescenceIOR: 0,
    iridescenceThicknessRange: [100, 400] as [number, number],
    envMapIntensity: 8
  }), []);

  const sharedMaterial = useMemo(() => (
    <meshPhysicalMaterial {...chromeMaterial} />
  ), [chromeMaterial]);

  return (
    <group ref={mainGroupRef} {...props}>
      {cubes.map((cube) => (
        <group
          key={cube.id}
          position={[
            cube.position.x * (size + GAP),
            cube.position.y * (size + GAP),
            cube.position.z * (size + GAP),
          ]}
          quaternion={matrixToQuaternion(cube.rotationMatrix)}
        >
          <RoundedBox
            args={[size, size, size]}
            radius={RADIUS}
            smoothness={deviceSettings.smoothness}
            castShadow={deviceSettings.castShadow}
            receiveShadow={deviceSettings.receiveShadow}
          >
            {sharedMaterial}
          </RoundedBox>
        </group>
      ))}
    </group>
  );
});

function CameraController() {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

interface EnhancedSpotlightProps extends SpotLightProps {
  shadowBias?: number;
}

function EnhancedSpotlight(props: EnhancedSpotlightProps) {
  const light = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    if (light.current) {
      light.current.target.position.set(0, 0, 0);
      light.current.target.updateMatrixWorld();
    }
  }, []);

  return (
    <>
      <SpotLight 
        castShadow={false}
        ref={light} 
        {...props} 
      />
    </>
  );
}

// Professional bottom fade overlay component
function BottomFadeOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Bottom fade gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: `linear-gradient(to top, 
            rgba(0, 0, 0, 0.95) 0%,
            rgba(0, 0, 0, 0.8) 15%,
            rgba(0, 0, 0, 0.6) 30%,
            rgba(0, 0, 0, 0.4) 45%,
            rgba(0, 0, 0, 0.2) 60%,
            rgba(0, 0, 0, 0.1) 75%,
            rgba(0, 0, 0, 0.05) 85%,
            transparent 100%
          )`,
        }}
      />
      
      {/* Subtle vignette effect for premium look */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, 
            transparent 20%,
            rgba(0, 0, 0, 0.1) 70%,
            rgba(0, 0, 0, 0.3) 100%
          )`,
        }}
      />
      
      {/* Extra bottom shadow for depth */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-20"
        style={{
          background: `linear-gradient(to top, 
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.3) 40%,
            transparent 100%
          )`,
        }}
      />
    </div>
  );
}

function SceneContent() {
  const depthBuffer = useDepthBuffer({ 
    size: 2048,
    frames: 1
  });
  
  const [time, setTime] = useState(0);
  useFrame((state) => {
    setTime(state.clock.getElapsedTime());
  });
  
  return (
    <>
      <EnhancedSpotlight 
        depthBuffer={depthBuffer} 
        color="#aaaace" 
        position={[3, 3, 2]}
        volumetric={true}
        opacity={0.7}
        penumbra={0.8}
        distance={20}
        angle={0.9}
        attenuation={50}
        anglePower={8}
        intensity={0.6}
        shadowBias={-0.0001}
        castShadow={true}
      />
      
      <PerspectiveCamera
        makeDefault
        fov={50}
        position={[0, 0, 7]}
        near={0.1}
        far={1000}
      />

      <CameraController />

      <Suspense fallback={null}>
        <RubiksCubeModel position={[0, 0, 0]} scale={1} />
      </Suspense>
    </>
  );
}

export function Scene() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  return (
    <div className="h-svh w-screen relative bg-black overflow-hidden">
      <Canvas
        shadows
        gl={{
          antialias: isDesktop,
          preserveDrawingBuffer: isDesktop,
          powerPreference: isDesktop ? "high-performance" : "default",
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
      >
        <SceneContent />
      </Canvas>
      
      {/* Professional bottom fade overlay */}
      <BottomFadeOverlay />
    </div>
  );
}