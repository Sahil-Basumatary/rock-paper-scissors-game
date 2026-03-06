"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Move } from "@/types/game";
import { BEATS } from "@/types/game";
import MoveModel from "./MoveModel";

const TOTAL_DURATION_MS = 2200;
const START_X = 3;

type Outcome = "player" | "opponent" | "draw";

function getOutcome(p: Move, o: Move): Outcome {
  if (p === o) return "draw";
  return BEATS[p] === o ? "player" : "opponent";
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// standard back-ease overshoot (Penner)
function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function setEmissive(group: THREE.Group, intensity: number) {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      (child.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });
}

function fadeGroup(group: THREE.Group, opacity: number) {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const mat = child.material as THREE.Material;
      if (!mat.transparent) {
        mat.transparent = true;
        mat.needsUpdate = true;
      }
      mat.opacity = opacity;
    }
  });
}

interface ClashSequenceProps {
  playerMove: Move;
  opponentMove: Move;
  onComplete: () => void;
}

export default function ClashSequence({
  playerMove,
  opponentMove,
  onComplete,
}: ClashSequenceProps) {
  const playerRef = useRef<THREE.Group>(null);
  const opponentRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(0);
  const completedRef = useRef(false);
  const outcome = useRef<Outcome>(getOutcome(playerMove, opponentMove));

  useEffect(() => {
    elapsedRef.current = 0;
    completedRef.current = false;
    outcome.current = getOutcome(playerMove, opponentMove);
  }, [playerMove, opponentMove]);

  useFrame((_, delta) => {
    if (completedRef.current) return;

    elapsedRef.current += delta * 1000;
    const ms = elapsedRef.current;
    const player = playerRef.current;
    const opponent = opponentRef.current;
    if (!player || !opponent) return;

    // materialize
    if (ms < 400) {
      const t = easeOutBack(ms / 400);
      player.scale.setScalar(t);
      opponent.scale.setScalar(t);
      player.rotation.y = (1 - t) * Math.PI * 0.5;
      opponent.rotation.y = -(1 - t) * Math.PI * 0.5;
    } else {
      player.scale.setScalar(1);
      opponent.scale.setScalar(1);
      player.rotation.y = 0;
      opponent.rotation.y = 0;
    }

    // fly toward center
    if (ms < 800) {
      player.position.x = -START_X;
      opponent.position.x = START_X;
    } else if (ms < 1400) {
      const t = easeOutCubic((ms - 800) / 600);
      player.position.x = THREE.MathUtils.lerp(-START_X, 0, t);
      opponent.position.x = THREE.MathUtils.lerp(START_X, 0, t);
    } else {
      player.position.x = 0;
      opponent.position.x = 0;
    }

    // bloom flash on impact
    if (ms >= 1400 && ms < 1600) {
      const t = (ms - 1400) / 200;
      const intensity = 3.0 * (1 - t) + 0.05;
      setEmissive(player, intensity);
      setEmissive(opponent, intensity);
    }

    // winner glows, loser fades
    if (ms >= 1600) {
      const t = Math.min((ms - 1600) / 600, 1);
      const result = outcome.current;
      if (result === "draw") {
        const glow = THREE.MathUtils.lerp(0.05, 0.4, t);
        setEmissive(player, glow);
        setEmissive(opponent, glow);
      } else {
        const winner = result === "player" ? player : opponent;
        const loser = result === "player" ? opponent : player;
        setEmissive(winner, THREE.MathUtils.lerp(0.05, 1.2, t));
        setEmissive(loser, 0.05);
        fadeGroup(loser, 1 - t);
        loser.position.y = -0.5 * t;
      }
    }

    // TODO: add freeze-frame stall at impact once CameraRig is in
    if (ms >= TOTAL_DURATION_MS && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  });

  return (
    <group>
      <group ref={playerRef} position={[-START_X, 0, 0]} scale={0}>
        <MoveModel move={playerMove} side="player" />
      </group>
      <group ref={opponentRef} position={[START_X, 0, 0]} scale={0}>
        <MoveModel move={opponentMove} side="opponent" />
      </group>
    </group>
  );
}
