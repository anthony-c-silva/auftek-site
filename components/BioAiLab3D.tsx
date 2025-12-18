"use client";

import React, { Suspense, useEffect, useRef, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber"; // <--- ADICIONEI useThree
import { OrbitControls, useGLTF, Html, Preload, Environment, Center } from "@react-three/drei";

// Pré-carregamento imediato
useGLTF.preload("/models/bioailab.glb");

// --- O HACK DE INICIALIZAÇÃO (O RETORNO) ---
// Esse componente força o desenho nos primeiros momentos
function HackDeInicio() {
  const { invalidate } = useThree();
  
  useEffect(() => {
    invalidate(); // Desenha agora
    const interval = setInterval(() => invalidate(), 100); // Desenha a cada 100ms
    // Para de forçar depois de 2 segundos (tempo suficiente para carregar tudo)
    const timeout = setTimeout(() => clearInterval(interval), 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [invalidate]);

  return null;
}

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
      // Seus ajustes de escala
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
        // Ajuste Z=1000 mantido, mas adicionei far: 10000 para garantir que renderize
        camera={{ position: [5, 2, 1000], fov: 45, far: 10000 }}
      >
        {/* --- INSERIR O HACK AQUI --- */}
        <HackDeInicio />

        <Suspense
          fallback={
            <Html center className="pointer-events-none">
               <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
               </div>
            </Html>
          }
        >
          <Environment preset="city" />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} castShadow />

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