"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Html, Sphere, MeshDistortMaterial, Text } from "@react-three/drei"
import { Suspense, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Infinity, Zap } from "lucide-react"

function TemporalHealthSphere({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [timeDistortion, setTimeDistortion] = useState(0)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.rotation.x = time * 0.5
      meshRef.current.rotation.y = time * 0.3
      meshRef.current.rotation.z = time * 0.1
      setTimeDistortion(Math.sin(time * 2) * 0.5 + 0.5)
    }
  })

  return (
    <Float speed={4} rotationIntensity={3} floatIntensity={4}>
      <mesh ref={meshRef} position={position}>
        <Sphere args={[3, 64, 64]}>
          <MeshDistortMaterial
            color="#ff00ff"
            attach="material"
            distort={0.5 + timeDistortion * 0.3}
            speed={5}
            roughness={0}
            metalness={1}
            emissive="#00ffff"
            emissiveIntensity={0.5 + timeDistortion * 0.3}
            transparent
            opacity={0.8}
          />
        </Sphere>
        <Html distanceFactor={20} position={[0, 4, 0]}>
          <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 text-center shadow-2xl border-2 border-cyan-400">
            <div className="text-cyan-400 text-sm font-bold">TEMPORAL FIELD ACTIVE</div>
            <div className="text-white text-2xl font-bold">{(timeDistortion * 100).toFixed(1)}%</div>
            <div className="text-cyan-300 text-xs">Time Dilation Factor</div>
          </div>
        </Html>
      </mesh>
    </Float>
  )
}

function TimeParticles() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.02
      groupRef.current.rotation.x += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 100 }).map((_, i) => (
        <Float key={i} speed={2 + i * 0.02} rotationIntensity={2} floatIntensity={2}>
          <mesh position={[(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial
              color={`hsl(${(i * 3.6) % 360}, 100%, 50%)`}
              emissive={`hsl(${(i * 3.6) % 360}, 100%, 30%)`}
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export function TemporalHealthEngine() {
  const [timeManipulation, setTimeManipulation] = useState({
    cellularTimeReverse: 0,
    agingRate: 1.0,
    healingAcceleration: 1.0,
    consciousnessExpansion: 0,
    quantumEntanglement: 0,
  })
  const [isActive, setIsActive] = useState(false)

  const activateTimeEngine = () => {
    setIsActive(!isActive)
    if (!isActive) {
      // Simulate time manipulation effects
      const interval = setInterval(() => {
        setTimeManipulation((prev) => ({
          cellularTimeReverse: Math.min(100, prev.cellularTimeReverse + Math.random() * 5),
          agingRate: Math.max(0.1, prev.agingRate - Math.random() * 0.1),
          healingAcceleration: Math.min(50, prev.healingAcceleration + Math.random() * 2),
          consciousnessExpansion: Math.min(100, prev.consciousnessExpansion + Math.random() * 3),
          quantumEntanglement: Math.min(100, prev.quantumEntanglement + Math.random() * 4),
        }))
      }, 1000)

      setTimeout(() => {
        clearInterval(interval)
        setIsActive(false)
      }, 30000)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-900 via-pink-900 to-red-900 text-white border-4 border-rainbow animate-pulse">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl">
            <Clock className="h-10 w-10 text-cyan-400 animate-spin" />
            Temporal Health Manipulation Engine
            <Badge className="bg-rainbow text-black font-bold animate-bounce">TIME CONTROL</Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-black/95 border-4 border-cyan-400">
          <CardHeader>
            <CardTitle className="text-cyan-400">4D Time-Space Health Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 rounded-xl overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black">
              <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
                <Suspense fallback={null}>
                  <Environment preset="night" />
                  <ambientLight intensity={0.2} />
                  <pointLight position={[15, 15, 15]} intensity={3} color="#ff00ff" />
                  <pointLight position={[-15, -15, -15]} intensity={2} color="#00ffff" />
                  <pointLight position={[0, 20, 0]} intensity={2} color="#ffff00" />

                  <TemporalHealthSphere position={[0, 0, 0]} />
                  <TimeParticles />

                  <Text position={[0, 8, 0]} fontSize={1} color="#ffffff" anchorX="center" anchorY="middle">
                    CONTROLLING TIME ITSELF
                  </Text>

                  <OrbitControls enableZoom={true} enablePan={true} />
                </Suspense>
              </Canvas>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-red-900 to-pink-900 text-white border-4 border-red-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Infinity className="h-6 w-6 animate-pulse" />
                Time Manipulation Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={activateTimeEngine}
                className={`w-full mb-4 text-xl py-4 ${
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"
                    : "bg-gradient-to-r from-cyan-500 to-purple-500"
                }`}
              >
                <Zap className="h-6 w-6 mr-2" />
                {isActive ? "TIME ENGINE ACTIVE" : "ACTIVATE TIME CONTROL"}
              </Button>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-black/40 rounded border border-cyan-400">
                  <span>Cellular Time Reversal</span>
                  <span className="text-cyan-400 font-bold">{timeManipulation.cellularTimeReverse.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/40 rounded border border-green-400">
                  <span>Aging Rate Reduction</span>
                  <span className="text-green-400 font-bold">{timeManipulation.agingRate.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/40 rounded border border-yellow-400">
                  <span>Healing Acceleration</span>
                  <span className="text-yellow-400 font-bold">{timeManipulation.healingAcceleration.toFixed(1)}x</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/40 rounded border border-purple-400">
                  <span>Consciousness Expansion</span>
                  <span className="text-purple-400 font-bold">
                    {timeManipulation.consciousnessExpansion.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/40 rounded border border-pink-400">
                  <span>Quantum Entanglement</span>
                  <span className="text-pink-400 font-bold">{timeManipulation.quantumEntanglement.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
