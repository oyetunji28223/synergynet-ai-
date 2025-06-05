"use client"

import { Canvas } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  Float,
  Html,
  Text,
  Sphere,
  ContactShadows,
  MeshDistortMaterial,
  Sparkles,
  Box,
  Cylinder,
} from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, Star, Atom, Shield, Flame } from "lucide-react"

// VitaForge Core - The Central Power Source
function VitaForgeCore({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const [energy, setEnergy] = useState(0)
  const [powerLevel, setPowerLevel] = useState(0)

  useFrame((state) => {
    if (meshRef.current && innerRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.rotation.y += 0.008
      meshRef.current.rotation.x += 0.004
      innerRef.current.rotation.y -= 0.012
      innerRef.current.rotation.z += 0.006

      const newEnergy = Math.sin(time * 3) * 0.5 + 0.5
      const newPower = Math.cos(time * 2) * 0.3 + 0.7
      setEnergy(newEnergy)
      setPowerLevel(newPower)
    }
  })

  return (
    <Float speed={4} rotationIntensity={3} floatIntensity={4}>
      <group position={position}>
        {/* Outer Forge Shell */}
        <mesh ref={meshRef}>
          <Sphere args={[3, 64, 64]}>
            <MeshDistortMaterial
              color="#ff6b00"
              attach="material"
              distort={0.4 + energy * 0.3}
              speed={3}
              roughness={0.1}
              metalness={0.9}
              emissive="#ff3300"
              emissiveIntensity={0.4 + energy * 0.4}
              transparent
              opacity={0.85}
            />
          </Sphere>
        </mesh>

        {/* Inner Power Core */}
        <mesh ref={innerRef}>
          <Sphere args={[1.5, 32, 32]}>
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff44"
              emissiveIntensity={0.6 + powerLevel * 0.4}
              transparent
              opacity={0.8}
              metalness={1}
              roughness={0}
            />
          </Sphere>
        </mesh>

        {/* Energy Rings */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}>
            <torusGeometry args={[2.5 + i * 0.5, 0.1, 16, 100]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#0088ff"
              emissiveIntensity={0.5 + energy * 0.3}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}

        <Html distanceFactor={20} position={[0, 4.5, 0]}>
          <div className="bg-black/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-2xl border-4 border-orange-400">
            <div className="text-orange-400 text-lg font-bold">VITAFORGE CORE</div>
            <div className="text-white text-3xl font-bold">{(powerLevel * 100).toFixed(0)}%</div>
            <div className="text-orange-300 text-sm">POWER LEVEL</div>
            <div className="text-green-400 text-sm mt-2">FORGING PERFECT HEALTH</div>
          </div>
        </Html>
      </group>
    </Float>
  )
}

// Health Forge Stations
function HealthForgeStation({ position, type, color, icon }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [active, setActive] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group position={position}>
        <mesh ref={meshRef} onPointerOver={() => setActive(true)} onPointerOut={() => setActive(false)}>
          <Box args={[1.2, 1.2, 1.2]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={active ? 0.6 : 0.3}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.9}
            />
          </Box>
        </mesh>

        {/* Energy Beam to Core */}
        <mesh position={[0, 0, 0]} lookAt={[0, 0, 0]}>
          <Cylinder args={[0.05, 0.05, 8, 8]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.6} />
          </Cylinder>
        </mesh>

        <Html distanceFactor={12} position={[0, 2, 0]}>
          <div
            className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-xl border-2"
            style={{ borderColor: color }}
          >
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-white text-sm font-bold">{type}</div>
            <div className="text-xs text-gray-300">FORGE STATION</div>
          </div>
        </Html>
      </group>
    </Float>
  )
}

// Quantum Health Particles
function QuantumHealthParticles() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.002
      groupRef.current.rotation.y += 0.003
      groupRef.current.rotation.z += 0.001
    }
  })

  return (
    <group ref={groupRef}>
      <Sparkles count={300} scale={[25, 25, 25]} size={4} speed={0.8} opacity={0.9} color="#ff6b00" />
      {Array.from({ length: 200 }).map((_, i) => (
        <Float key={i} speed={3 + i * 0.01} rotationIntensity={2} floatIntensity={2}>
          <mesh position={[(Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial
              color={`hsl(${(i * 1.8) % 360}, 100%, 60%)`}
              emissive={`hsl(${(i * 1.8) % 360}, 100%, 40%)`}
              emissiveIntensity={0.7}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// VitaForge Logo Text
function VitaForgeLogo({ position }: any) {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
      <Text
        position={position}
        fontSize={2.5}
        color="#ff6b00"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        VITAFORGE
        <meshStandardMaterial
          emissive="#ff3300"
          emissiveIntensity={0.8}
          transparent
          opacity={0.95}
          metalness={0.5}
          roughness={0.1}
        />
      </Text>
    </Float>
  )
}

// Main 3D Scene
function VitaForge3DScene() {
  const forgeStations = [
    { position: [-8, 2, 3], type: "GENETIC FORGE", color: "#ff0066", icon: "🧬" },
    { position: [8, 3, -2], type: "NEURAL FORGE", color: "#0066ff", icon: "🧠" },
    { position: [-6, -3, 5], type: "CELLULAR FORGE", color: "#00ff66", icon: "⚡" },
    { position: [6, -2, 4], type: "QUANTUM FORGE", color: "#ff6600", icon: "⚛️" },
    { position: [0, 7, -5], type: "ENERGY FORGE", color: "#ffff00", icon: "🔥" },
    { position: [-5, 0, -7], type: "IMMUNE FORGE", color: "#ff00ff", icon: "🛡️" },
    { position: [5, 4, 7], type: "LONGEVITY FORGE", color: "#00ffff", icon: "♾️" },
    { position: [0, -6, 2], type: "HEALING FORGE", color: "#88ff00", icon: "💚" },
  ]

  return (
    <>
      {/* Advanced Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[15, 15, 15]} intensity={3} color="#ff6b00" />
      <pointLight position={[-15, -15, -15]} intensity={2} color="#00ff88" />
      <pointLight position={[0, 20, 0]} intensity={2.5} color="#0088ff" />
      <spotLight position={[0, 25, 0]} angle={0.4} penumbra={1} intensity={3} color="#ffffff" castShadow />

      {/* VitaForge Core */}
      <VitaForgeCore position={[0, 0, 0]} />

      {/* Health Forge Stations */}
      {forgeStations.map((station, index) => (
        <HealthForgeStation
          key={index}
          position={station.position}
          type={station.type}
          color={station.color}
          icon={station.icon}
        />
      ))}

      {/* Quantum Particles */}
      <QuantumHealthParticles />

      {/* VitaForge Logo */}
      <VitaForgeLogo position={[0, 10, 0]} />

      {/* Tagline */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.8}>
        <Text
          position={[0, -10, 0]}
          fontSize={1.2}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist-Bold.ttf"
        >
          FORGE YOUR PERFECT HEALTH
          <meshStandardMaterial emissive="#00ff44" emissiveIntensity={0.6} transparent opacity={0.9} />
        </Text>
      </Float>

      {/* Environment */}
      <Environment preset="night" />
      <ContactShadows position={[0, -12, 0]} opacity={0.5} scale={60} blur={3} far={25} />
    </>
  )
}

export function VitaForge3DLanding() {
  const [stats, setStats] = useState({
    healthForged: 5847293,
    livesTransformed: 2847293,
    perfectHealth: 99.97,
    globalReach: 195,
    powerLevel: 9847,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        healthForged: prev.healthForged + Math.floor(Math.random() * 50),
        livesTransformed: prev.livesTransformed + Math.floor(Math.random() * 25),
        perfectHealth: Math.min(99.99, prev.perfectHealth + Math.random() * 0.001),
        globalReach: prev.globalReach,
        powerLevel: prev.powerLevel + Math.floor(Math.random() * 10),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-900 to-black text-white overflow-hidden">
      {/* Hero Section with 3D Scene */}
      <div className="relative h-screen">
        {/* 3D Canvas */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 18], fov: 65 }} gl={{ antialias: true, alpha: true }} shadows>
            <Suspense fallback={null}>
              <VitaForge3DScene />
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.3}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 3}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <div className="text-center max-w-7xl mx-auto">
            {/* Main Branding */}
            <div className="mb-12">
              <div className="flex items-center justify-center mb-6">
                <Flame className="h-16 w-16 text-orange-500 mr-4 animate-pulse" />
                <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">
                  VITAFORGE
                </h1>
                <Flame className="h-16 w-16 text-orange-500 ml-4 animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                FORGE YOUR PERFECT HEALTH
              </h2>
              <p className="text-2xl md:text-3xl text-orange-300 mb-8 animate-pulse">
                The Ultimate Health Transformation Engine
              </p>
            </div>

            {/* Power Badges */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-2xl px-8 py-4 animate-pulse">
                <Flame className="h-8 w-8 mr-3" />
                HEALTH FORGING TECHNOLOGY
              </Badge>
              <Badge className="bg-gradient-to-r from-green-500 to-cyan-500 text-white text-2xl px-8 py-4 animate-bounce">
                <Shield className="h-8 w-8 mr-3" />
                PERFECT IMMUNITY
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl px-8 py-4 animate-pulse">
                <Atom className="h-8 w-8 mr-3" />
                QUANTUM ENHANCEMENT
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-8 mb-20">
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-2xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse">
                <Flame className="h-8 w-8 mr-3" />
                START FORGING NOW
              </Button>
              <Button
                variant="outline"
                className="border-4 border-green-400 text-green-400 hover:bg-green-400 hover:text-black text-2xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
              >
                <Zap className="h-8 w-8 mr-3" />
                EXPLORE THE FORGE
              </Button>
            </div>
          </div>
        </div>

        {/* Live Stats Dashboard */}
        <div className="absolute bottom-8 left-8 right-8 z-20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-7xl mx-auto">
            <Card className="bg-black/50 backdrop-blur-sm border-4 border-orange-400 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">{stats.healthForged.toLocaleString()}+</div>
                <div className="text-sm">Health Profiles Forged</div>
              </CardContent>
            </Card>
            <Card className="bg-black/50 backdrop-blur-sm border-4 border-green-400 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{stats.livesTransformed.toLocaleString()}+</div>
                <div className="text-sm">Lives Transformed</div>
              </CardContent>
            </Card>
            <Card className="bg-black/50 backdrop-blur-sm border-4 border-cyan-400 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">{stats.perfectHealth.toFixed(2)}%</div>
                <div className="text-sm">Perfect Health Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-black/50 backdrop-blur-sm border-4 border-purple-400 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.globalReach}</div>
                <div className="text-sm">Countries Served</div>
              </CardContent>
            </Card>
            <Card className="bg-black/50 backdrop-blur-sm border-4 border-yellow-400 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.powerLevel.toLocaleString()}</div>
                <div className="text-sm">Forge Power Level</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Forge Stations Showcase */}
      <div className="relative py-24 bg-gradient-to-r from-orange-900/60 to-red-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-6xl font-bold mb-8 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              🔥 THE VITAFORGE STATIONS 🔥
            </h3>
            <p className="text-2xl text-orange-200">8 Powerful Health Forging Technologies</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "🧬",
                title: "GENETIC FORGE",
                description: "Rewrite your DNA for superhuman health and longevity",
                color: "from-pink-500 to-red-500",
                power: "ULTIMATE",
              },
              {
                icon: "🧠",
                title: "NEURAL FORGE",
                description: "Enhance brain power and cognitive abilities beyond limits",
                color: "from-blue-500 to-purple-500",
                power: "SUPREME",
              },
              {
                icon: "⚡",
                title: "CELLULAR FORGE",
                description: "Regenerate and optimize every cell in your body",
                color: "from-green-500 to-cyan-500",
                power: "MAXIMUM",
              },
              {
                icon: "⚛️",
                title: "QUANTUM FORGE",
                description: "Manipulate quantum fields for instant healing",
                color: "from-orange-500 to-yellow-500",
                power: "INFINITE",
              },
              {
                icon: "🔥",
                title: "ENERGY FORGE",
                description: "Unlimited life force energy and vitality",
                color: "from-yellow-500 to-orange-500",
                power: "COSMIC",
              },
              {
                icon: "🛡️",
                title: "IMMUNE FORGE",
                description: "Perfect immunity against all diseases",
                color: "from-purple-500 to-pink-500",
                power: "ABSOLUTE",
              },
              {
                icon: "♾️",
                title: "LONGEVITY FORGE",
                description: "Achieve biological immortality and eternal youth",
                color: "from-cyan-500 to-blue-500",
                power: "ETERNAL",
              },
              {
                icon: "💚",
                title: "HEALING FORGE",
                description: "Instant regeneration and perfect recovery",
                color: "from-green-500 to-teal-500",
                power: "DIVINE",
              },
            ].map((forge, index) => (
              <Card
                key={index}
                className="bg-black/70 backdrop-blur-sm border-4 border-orange-400 hover:border-green-400 transition-all duration-300 transform hover:scale-105 hover:rotate-1"
              >
                <CardContent className="p-8 text-center">
                  <div className="text-7xl mb-6">{forge.icon}</div>
                  <h4
                    className={`text-2xl font-bold mb-4 bg-gradient-to-r ${forge.color} bg-clip-text text-transparent`}
                  >
                    {forge.title}
                  </h4>
                  <p className="text-gray-300 mb-4 text-lg">{forge.description}</p>
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg px-4 py-2">
                    {forge.power} POWER
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Ultimate Call to Action */}
      <div className="relative py-24 bg-gradient-to-r from-black via-orange-900 to-black">
        <div className="max-w-6xl mx-auto text-center px-4">
          <div className="mb-12">
            <Flame className="h-24 w-24 text-orange-500 mx-auto mb-8 animate-pulse" />
            <h3 className="text-7xl font-bold mb-8 bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent animate-pulse">
              FORGE YOUR DESTINY
            </h3>
            <p className="text-3xl text-orange-200 mb-12">
              Join millions who have transformed their health with VitaForge technology
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-red-600 hover:to-orange-700 text-white text-3xl px-16 py-8 rounded-full shadow-2xl transform hover:scale-115 transition-all duration-300 animate-bounce">
              <Crown className="h-10 w-10 mr-4" />
              BEGIN YOUR TRANSFORMATION
            </Button>
            <Button
              variant="outline"
              className="border-4 border-green-400 text-green-400 hover:bg-green-400 hover:text-black text-3xl px-16 py-8 rounded-full shadow-2xl transform hover:scale-115 transition-all duration-300"
            >
              <Star className="h-10 w-10 mr-4" />
              DISCOVER THE POWER
            </Button>
          </div>

          <div className="text-xl text-orange-300">
            <p>🔥 Revolutionary • 🛡️ Secure • 🌍 Global • ⚡ Instant • 👑 Premium</p>
          </div>
        </div>
      </div>
    </div>
  )
}
