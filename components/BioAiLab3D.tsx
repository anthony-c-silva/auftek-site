"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Stage } from "@react-three/drei";

// 1. Criamos uma variável global fora do componente para saber se já carregou alguma vez na sessão
let globalModelLoaded = false;

function Model({ onLoad }: { onLoad: () => void }) {
  const { scene } = useGLTF("/models/bioailab.glb");

  // Avisa que o modelo foi montado
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  return <primitive object={scene} />;
}

export const BioAiLab3D: React.FC = () => {
  // Estado local para forçar o componente a saber que está pronto
  const [isReady, setIsReady] = useState(globalModelLoaded);

  const handleModelLoad = () => {
    globalModelLoaded = true;
    setIsReady(true);
  };

  return (
    <div className="w-full h-full relative bg-gray-900/50 border border-blue-500/30">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        // CONFIGURAÇÃO CRÍTICA PARA ABAS:
        // preserveDrawingBuffer: Tenta manter a imagem na memória mesmo se a aba dormir
        // powerPreference: Pede ao navegador para não economizar energia nessa aba
        gl={{
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]} // Ajuda na nitidez sem travar
      >
        <Suspense
          fallback={
            // TRUQUE: Se já carregou uma vez (isReady), mostramos NADA (null) em vez do spinner.
            // Assim, se o navegador recarregar o contexto, o usuário vê o modelo "piscar" rápido
            // ou a tela preta por milissegundos, mas não vê a animação de "Carregando...".
            isReady ? null : (
              <Html center className="text-white text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p>Carregando...</p>
                </div>
              </Html>
            )
          }
        >
          <Stage environment="city" intensity={0.5}>
            <Model onLoad={handleModelLoad} />
          </Stage>
        </Suspense>

        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

useGLTF.preload("/models/bioailab.glb");
