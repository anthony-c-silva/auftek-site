"use client";

import React, { Suspense, useEffect, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Preload, Environment, Center } from "@react-three/drei";

// Pré-carregamento imediato
useGLTF.preload("/models/bioailab.glb");

function Model({ onLoad }: { onLoad?: () => void }) {
  const { scene } = useGLTF("/models/bioailab.glb");
  
  // Clone para estabilidade na memória
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  return (
    <primitive 
      object={clonedScene} 
      // --- CONTROLE DE ESCALA AGORA FUNCIONA ---
      // Como removemos o Stage, este número agora é lei.
      // Se ficar pequeno demais, aumente para 1 ou 2.
      // Se ficar grande demais, diminua para 0.1 ou 0.05.
      scale={2.5} 
      rotation={[0, 0, 0]} 
    />
  );
}

export const BioAiLab3D: React.FC = () => {
  const controlsRef = useRef<any>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
  };

  const handleEnd = () => {
    resetTimerRef.current = setTimeout(() => {
      if (controlsRef.current) {
        controlsRef.current.reset();
      }
    }, 3000);
  };

  return (
    <div className="w-full h-full relative bg-transparent rounded-lg overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
          antialias: true 
        }}
        // CONTROLE DA CÂMERA
        // Ajuste o terceiro número (Z) para afastar ou aproximar.
        camera={{ position: [50, 2, 1000], fov: 45 }}
      >
        <Suspense
          fallback={
            <Html center className="pointer-events-none">
               <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
               </div>
            </Html>
          }
        >
          {/* ILUMINAÇÃO MANUAL (Substituindo o Stage) */}
          {/* Environment: Dá os reflexos bonitos no material */}
          <Environment preset="city" />
          
          {/* Luzes para dar volume e sombra */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} castShadow />

          {/* O Center garante que o objeto gire pelo centro geométrico dele */}
          <Center>
            <Model />
          </Center>

          <Preload all />
        </Suspense>

        <OrbitControls 
          ref={controlsRef}
          makeDefault
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
          onStart={handleStart}
          onEnd={handleEnd}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};