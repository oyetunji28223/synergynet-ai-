"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Html, Text } from "@react-three/drei"
import { Suspense, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Video, Globe, Headphones, Gamepad2, Sparkles } from "lucide-react"

function VirtualDoctor({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        <mesh ref={meshRef}>
          <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
          <meshStandardMaterial color="#4ade80" emissive="#22c55e" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.3} />
        </mesh>
        <Html distanceFactor={10} position={[0, 2.5, 0]}>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center shadow-lg">
            <div className="text-xs font-bold text-green-600">Dr. AI Avatar</div>
            <div className="text-xs text-gray-600">Available 24/7</div>
          </div>
        </Html>
      </group>
    </Float>
  )
}

function HealthPortal({ position, label, onClick }: any) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.02
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position} onClick={onClick}>
        <torusGeometry args={[1, 0.3, 16, 100]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.5} transparent opacity={0.8} />
        <Html distanceFactor={15} position={[0, 0, 0]}>
          <div className="bg-purple-900/90 backdrop-blur-sm rounded-lg p-2 text-center shadow-lg border border-purple-400">
            <div className="text-purple-200 text-xs font-bold">{label}</div>
          </div>
        </Html>
      </mesh>
    </Float>
  )
}

export function VirtualHealthClinic() {
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [isInVR, setIsInVR] = useState(false)

  const healthPortals = [
    { id: "consultation", label: "Virtual Consultation", position: [-4, 2, 0] },
    { id: "surgery", label: "AR Surgery Training", position: [4, 2, 0] },
    { id: "therapy", label: "VR Therapy", position: [-4, -2, 0] },
    { id: "fitness", label: "Holographic Fitness", position: [4, -2, 0] },
  ]

  const enterVR = () => {
    setIsInVR(true)
    // In a real app, this would initialize WebXR
  }

  const joinSession = (sessionId: string) => {
    setActiveSession(sessionId)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white border-2 border-purple-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Globe className="h-8 w-8 text-purple-400" />
            Metaverse Health Clinic
            <Badge className="bg-purple-400 text-black font-bold animate-pulse">METAVERSE</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={enterVR}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Headphones className="h-4 w-4 mr-2" />
              Enter VR Clinic
            </Button>
            <Button
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
            >
              <Video className="h-4 w-4 mr-2" />
              AR Mode
            </Button>
            <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black">
              <Users className="h-4 w-4 mr-2" />
              Join Group Session
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-black/90 border-2 border-purple-500">
          <CardHeader>
            <CardTitle className="text-purple-400">Virtual Health Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 rounded-xl overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
              <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
                <Suspense fallback={null}>
                  <Environment preset="night" />
                  <ambientLight intensity={0.4} />
                  <pointLight position={[10, 10, 10]} intensity={2} color="#8b5cf6" />
                  <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />

                  <VirtualDoctor position={[0, 0, 0]} />

                  {healthPortals.map((portal) => (
                    <HealthPortal
                      key={portal.id}
                      position={portal.position}
                      label={portal.label}
                      onClick={() => joinSession(portal.id)}
                    />
                  ))}

                  <Text position={[0, 4, 0]} fontSize={0.5} color="#ffffff" anchorX="center" anchorY="middle">
                    Welcome to the Future of Healthcare
                  </Text>

                  <OrbitControls enableZoom={true} enablePan={true} />
                </Suspense>
              </Canvas>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-pink-900 to-purple-900 text-white border-pink-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5" />
                Active VR Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                  <div>
                    <div className="font-semibold">Heart Surgery Simulation</div>
                    <div className="text-xs text-gray-300">12 participants</div>
                  </div>
                  <Badge className="bg-green-500">Live</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                  <div>
                    <div className="font-semibold">Anxiety Therapy Session</div>
                    <div className="text-xs text-gray-300">8 participants</div>
                  </div>
                  <Badge className="bg-blue-500">Starting</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                  <div>
                    <div className="font-semibold">Fitness Challenge</div>
                    <div className="text-xs text-gray-300">156 participants</div>
                  </div>
                  <Badge className="bg-purple-500">Popular</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900 to-blue-900 text-white border-cyan-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Holographic Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>3D Organ Visualization</span>
                  <span className="text-cyan-400">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Holographic Consultations</span>
                  <span className="text-green-400">Available</span>
                </div>
                <div className="flex justify-between">
                  <span>AR Surgery Guidance</span>
                  <span className="text-purple-400">Premium</span>
                </div>
                <div className="flex justify-between">
                  <span>Virtual Lab Results</span>
                  <span className="text-yellow-400">Real-time</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {activeSession && (
        <Card className="bg-gradient-to-r from-green-900 to-emerald-900 text-white border-green-400">
          <CardHeader>
            <CardTitle>Active Session: {activeSession}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-200">You are now connected to the virtual health session.</p>
            <Button onClick={() => setActiveSession(null)} className="mt-4 bg-red-500 hover:bg-red-600">
              Leave Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
