"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import type { Move } from "@/types/game";

const ROCK_COLOR = "#8a8578";
const PAPER_COLOR = "#f5e6c8";
const SCISSORS_COLOR = "#c0c0c0";
const GOLD_TINT = "#c9a227";
const BRONZE_TINT = "#cd7f32";
const BLADE_ANGLE = Math.PI / 6;

interface MoveModelProps {
  move: Move;
  side: "player" | "opponent";
}

function emissiveForSide(side: "player" | "opponent") {
  return side === "player" ? GOLD_TINT : BRONZE_TINT;
}

function RockModel({ side }: { side: "player" | "opponent" }) {
  return (
    <mesh>
      <dodecahedronGeometry args={[0.8, 1]} />
      <MeshDistortMaterial
        color={ROCK_COLOR}
        emissive={emissiveForSide(side)}
        emissiveIntensity={0.05}
        roughness={0.85}
        metalness={0.1}
        distort={0.25}
        speed={1.5}
      />
    </mesh>
  );
}

function PaperModel({ side }: { side: "player" | "opponent" }) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1.2, 1.6, 12, 12);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 2) * 0.06 + Math.cos(y * 1.5) * 0.04);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 20), [geometry]);

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
      <group rotation={[0.1, 0, 0.05]}>
        <mesh geometry={geometry}>
          <meshStandardMaterial
            color={PAPER_COLOR}
            emissive={emissiveForSide(side)}
            emissiveIntensity={0.08}
            roughness={0.6}
            metalness={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={GOLD_TINT} />
        </lineSegments>
      </group>
    </Float>
  );
}

function ScissorsModel({ side }: { side: "player" | "opponent" }) {
  const emissive = emissiveForSide(side);
  return (
    <group>
      <mesh rotation={[0, 0, BLADE_ANGLE]} position={[0, 0.15, 0]}>
        <boxGeometry args={[0.12, 1.4, 0.04]} />
        <meshStandardMaterial
          color={SCISSORS_COLOR}
          emissive={emissive}
          emissiveIntensity={0.05}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
      <mesh rotation={[0, 0, -BLADE_ANGLE]} position={[0, 0.15, 0]}>
        <boxGeometry args={[0.12, 1.4, 0.04]} />
        <meshStandardMaterial
          color={SCISSORS_COLOR}
          emissive={emissive}
          emissiveIntensity={0.05}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
        <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

const MoveModel = forwardRef<THREE.Group, MoveModelProps>(
  ({ move, side }, ref) => {
    return (
      <group ref={ref}>
        {move === "ROCK" && <RockModel side={side} />}
        {move === "PAPER" && <PaperModel side={side} />}
        {move === "SCISSORS" && <ScissorsModel side={side} />}
      </group>
    );
  }
);

MoveModel.displayName = "MoveModel";

export default MoveModel;
