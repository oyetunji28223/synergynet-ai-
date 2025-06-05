"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Html, Sphere, MeshDistortMaterial } from "@react-three/drei"
import { Suspense, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Brain, Dna, Atom } from "lucide-react"

function QuantumHealthOrb({ position, healthData, onQuantumAnalysis }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [quantumState, setQuantumState] = useState(0)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.02
      setQuantumState(Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5)
    }
  })

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={3}>
      <mesh ref={meshRef} position={position} onClick={onQuantumAnalysis}>
        <Sphere args={[2, 64, 64]}>
          <MeshDistortMaterial
            color="#00ffff"
            attach="material"
            distort={0.3 + quantumState * 0.2}
            speed={2}
            roughness={0}
            metalness={0.8}
            emissive="#0066ff"
            emissiveIntensity={0.3 + quantumState * 0.2}
          />
        </Sphere>
        <Html distanceFactor={15} position={[0, 3, 0]}>
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-2xl border border-cyan-400">
            <div className="text-cyan-400 text-xs font-bold">QUANTUM HEALTH STATE</div>
            <div className="text-white text-lg font-bold">{(quantumState * 100).toFixed(1)}%</div>
            <div className="text-cyan-300 text-xs">Cellular Optimization</div>
          </div>
        </Html>
      </mesh>
    </Float>
  )
}

function HolographicDNA() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 50 }).map((_, i) => (
        <Float key={i} speed={1 + i * 0.05} rotationIntensity={1} floatIntensity={1}>
          <mesh position={[Math.cos(i * 0.3) * 3, i * 0.2 - 5, Math.sin(i * 0.3) * 3]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial
              color={i % 4 === 0 ? "#ff0080" : i % 4 === 1 ? "#00ff80" : i % 4 === 2 ? "#8000ff" : "#ff8000"}
              emissive="#ffffff"
              emissiveIntensity={0.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export function QuantumHealthEngine() {
  const [quantumAnalysis, setQuantumAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const runQuantumAnalysis = async () => {
    setIsAnalyzing(true)

    // Simulate quantum health analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setQuantumAnalysis({
      cellularAge: 28.5,
      geneticOptimization: 94.2,
      quantumCoherence: 87.8,
      bioenergyLevel: 92.1,
      longevityScore: 156.7,
      diseaseResistance: 89.3,
      cognitiveEnhancement: 91.5,
      metabolicEfficiency: 88.9,
    })
    setIsAnalyzing(false)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-black via-purple-900 to-black text-white border-2 border-cyan-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Atom className="h-8 w-8 text-cyan-400" />
            Quantum Health Engine
            <Badge className="bg-cyan-400 text-black font-bold animate-pulse">QUANTUM</Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-black/90 border-2 border-purple-500">
          <CardHeader>
            <CardTitle className="text-purple-400">Holographic Health Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 rounded-xl overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black">
              <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                <Suspense fallback={null}>
                  <Environment preset="night" />
                  <ambientLight intensity={0.3} />
                  <pointLight position={[10, 10, 10]} intensity={2} color="#00ffff" />
                  <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />

                  <QuantumHealthOrb position={[0, 0, 0]} healthData={{}} onQuantumAnalysis={runQuantumAnalysis} />
                  <HolographicDNA />

                  <OrbitControls enableZoom={true} enablePan={true} />
                </Suspense>
              </Canvas>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-cyan-900 to-blue-900 text-white border-cyan-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Quantum Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                  <p className="text-cyan-400">Running quantum health analysis...</p>
                  <p className="text-xs text-gray-300 mt-2">Analyzing 10^23 cellular interactions</p>
                </div>
              ) : quantumAnalysis ? (
                <div className="grid gap-3">
                  {Object.entries(quantumAnalysis).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-black/30 rounded">
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="text-cyan-400 font-bold">{value}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Button
                    onClick={runQuantumAnalysis}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Run Quantum Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900 to-pink-900 text-white border-purple-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dna className="h-5 w-5" />
                Genetic Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Longevity Genes</span>
                  <span className="text-green-400">+47 years</span>
                </div>
                <div className="flex justify-between">
                  <span>Disease Resistance</span>
                  <span className="text-blue-400">98.7%</span>
                </div>
                <div className="flex justify-between">
                  <span>Cognitive Enhancement</span>
                  <span className="text-purple-400">+156 IQ points</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
