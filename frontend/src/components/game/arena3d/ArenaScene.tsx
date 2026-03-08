"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import type { Move } from "@/types/game";
import ClashSequence from "./ClashSequence";
import ImpactVFX from "./ImpactVFX";
import CameraRig from "./CameraRig";

const ARENA_BG = "#0d0c0a";
const GOLD_LIGHT = "#c9a227";
const BRONZE_LIGHT = "#cd7f32";

interface ArenaSceneProps {
  playerMove: Move;
  opponentMove: Move;
  onComplete: () => void;
}

function ArenaLighting() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <spotLight
        position={[-5, 4, 2]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.2}
        color={GOLD_LIGHT}
      />
      <spotLight
        position={[5, 4, 2]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.0}
        color={BRONZE_LIGHT}
      />
    </>
  );
}

function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.8}
        luminanceSmoothing={0.3}
        intensity={0.6}
      />
      <Vignette darkness={0.6} offset={0.3} />
    </EffectComposer>
  );
}

export default function ArenaScene({
  playerMove,
  opponentMove,
  onComplete,
}: ArenaSceneProps) {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 2, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={[ARENA_BG]} />
        <Suspense fallback={null}>
          <ArenaLighting />
          <ClashSequence
            playerMove={playerMove}
            opponentMove={opponentMove}
            onComplete={onComplete}
          />
          <ImpactVFX />
          <CameraRig />
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
