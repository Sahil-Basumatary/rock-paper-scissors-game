"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 24;
const PARTICLE_SPEED = 3.0;
const IMPACT_START_MS = 1400;
const PARTICLE_DURATION_MS = 400;

export default function ImpactVFX() {
  const pointsRef = useRef<THREE.Points>(null);
  const elapsedRef = useRef(0);

  const velocities = useMemo(() => {
    const vels = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = PARTICLE_SPEED * (0.5 + Math.random() * 0.5);
      vels[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vels[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      vels[i * 3 + 2] = Math.cos(phi) * speed;
    }
    return vels;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3)
    );
    return geo;
  }, []);

  useFrame((_, delta) => {
    elapsedRef.current += delta * 1000;
    const ms = elapsedRef.current;
    const points = pointsRef.current;
    if (!points) return;

    if (ms < IMPACT_START_MS) {
      points.visible = false;
      return;
    }

    const localMs = ms - IMPACT_START_MS;
    if (localMs > PARTICLE_DURATION_MS) {
      points.visible = false;
      return;
    }

    points.visible = true;
    const t = localMs / PARTICLE_DURATION_MS;
    const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
    const dt = localMs / 1000;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posAttr.setXYZ(
        i,
        velocities[i * 3] * dt,
        velocities[i * 3 + 1] * dt,
        velocities[i * 3 + 2] * dt
      );
    }
    posAttr.needsUpdate = true;
    const mat = points.material as THREE.PointsMaterial;
    mat.opacity = 1 - t;
    mat.size = 0.08 * (1 + t * 2);
  });

  return (
    <points ref={pointsRef} geometry={geometry} visible={false}>
      <pointsMaterial
        color="#c9a227"
        size={0.08}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
