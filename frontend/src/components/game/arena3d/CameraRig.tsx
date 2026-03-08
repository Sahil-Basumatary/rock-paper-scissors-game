"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const INITIAL_POS = new THREE.Vector3(0, 2, 6);
const SWEEP_POS = new THREE.Vector3(3, 1.5, 4);
const ZOOM_POS = new THREE.Vector3(0, 1, 3);
const LOOK_TARGET = new THREE.Vector3(0, 0.5, 0);

const SWEEP_START_MS = 400;
const SWEEP_END_MS = 800;
const IMPACT_MS = 1400;
const ZOOM_END_MS = 1600;
const SHAKE_DURATION_MS = 300;
const SHAKE_MAX_OFFSET = 0.12;

function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function CameraRig() {
  const { camera } = useThree();
  const elapsedRef = useRef(0);
  const tmpVec = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    elapsedRef.current += delta * 1000;
    const ms = elapsedRef.current;

    if (ms < SWEEP_START_MS) {
      camera.position.copy(INITIAL_POS);
    } else if (ms < SWEEP_END_MS) {
      const t = easeInOutCubic((ms - SWEEP_START_MS) / (SWEEP_END_MS - SWEEP_START_MS));
      tmpVec.current.lerpVectors(INITIAL_POS, SWEEP_POS, t);
      camera.position.copy(tmpVec.current);
    } else if (ms < IMPACT_MS) {
      camera.position.copy(SWEEP_POS);
    } else if (ms < ZOOM_END_MS) {
      const t = easeInOutCubic((ms - IMPACT_MS) / (ZOOM_END_MS - IMPACT_MS));
      tmpVec.current.lerpVectors(SWEEP_POS, ZOOM_POS, t);
      camera.position.copy(tmpVec.current);
    } else {
      camera.position.copy(ZOOM_POS);
    }

    if (ms >= IMPACT_MS && ms < IMPACT_MS + SHAKE_DURATION_MS) {
      const shakeElapsed = ms - IMPACT_MS;
      const decay = Math.exp(-shakeElapsed * 0.01);
      const intensity = SHAKE_MAX_OFFSET * decay;
      camera.position.x += Math.sin(shakeElapsed * 0.06) * intensity;
      camera.position.y += Math.cos(shakeElapsed * 0.05) * intensity * 0.6;
    }

    camera.lookAt(LOOK_TARGET);
  });

  return null;
}
