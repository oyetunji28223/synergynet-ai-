"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Html } from "@react-three/drei"
import { Suspense, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

function HealthOrb({ position, color, label, value, onClick }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1)
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh
        ref={meshRef}
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          transparent
          opacity={0.8}
        />
        <Html distanceFactor={10} position={[0, 1.5, 0]}>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center shadow-lg">
            <div className="text-xs font-semibold text-gray-800">{label}</div>
            <div className="text-lg font-bold text-blue-600">{value}</div>
          </div>
        </Html>
      </mesh>
    </Float>
  )
}

function HealthVisualization({ healthData }: { healthData: any }) {
  return (
    <>
      <HealthOrb
        position={[-4, 0, 0]}
        color="#ef4444"
        label="Heart Rate"
        value={`${healthData.heartRate || 72} BPM`}
        onClick={() => console.log("Heart rate clicked")}
      />
      <HealthOrb
        position={[4, 0, 0]}
        color="#10b981"
        label="Blood Pressure"
        value={healthData.bloodPressure || "120/80"}
        onClick={() => console.log("Blood pressure clicked")}
      />
      <HealthOrb
        position={[0, 3, 0]}
        color="#f59e0b"
        label="Temperature"
        value={`${healthData.temperature || 98.6}°F`}
        onClick={() => console.log("Temperature clicked")}
      />
      <HealthOrb
        position={[0, -3, 0]}
        color="#8b5cf6"
        label="Weight"
        value={`${healthData.weight || 150} lbs`}
        onClick={() => console.log("Weight clicked")}
      />
    </>
  )
}

function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <Float key={i} speed={1 + i * 0.1} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[Math.cos(i * 0.5) * 2, i * 0.3 - 3, Math.sin(i * 0.5) * 2]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#3b82f6" : "#ef4444"}
              emissive="#ffffff"
              emissiveIntensity={0.1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export function HealthScene({ healthData }: { healthData: any }) {
  return (
    <div className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <Environment preset="night" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />

          <HealthVisualization healthData={healthData} />
          <DNAHelix />

          <OrbitControls enableZoom={false} enablePan={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}
