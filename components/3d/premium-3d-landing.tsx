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
} from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, SparklesIcon, Zap, Star, Brain, Atom } from "lucide-react"

// Floating Health Icons Component
function FloatingHealthIcon({ position, icon, color, scale = 1 }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1
      meshRef.current.scale.setScalar(hovered ? scale * 1.2 : scale)
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.2}
          transparent
          opacity={0.9}
          roughness={0.1}
          metalness={0.8}
        />
        <Html distanceFactor={8} position={[0, 0, 0]}>
          <div className="text-white text-2xl">{icon}</div>
        </Html>
      </mesh>
    </Float>
  )
}

// Premium Health Orb
function PremiumHealthOrb({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [energy, setEnergy] = useState(0)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.x += 0.003
      setEnergy(Math.sin(time * 2) * 0.5 + 0.5)
    }
  })

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={3}>
      <mesh ref={meshRef} position={position}>
        <Sphere args={[2, 64, 64]}>
          <MeshDistortMaterial
            color="#00ffff"
            attach="material"
            distort={0.3 + energy * 0.2}
            speed={2}
            roughness={0}
            metalness={1}
            emissive="#0066ff"
            emissiveIntensity={0.3 + energy * 0.3}
            transparent
            opacity={0.8}
          />
        </Sphere>

        {/* Inner Core */}
        <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={0.5 + energy * 0.3}
            transparent
            opacity={0.6}
          />
        </Sphere>

        <Html distanceFactor={15} position={[0, 3, 0]}>
          <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-2xl border-2 border-cyan-400">
            <div className="text-cyan-400 text-sm font-bold">HEALTH INTELLIGENCE</div>
            <div className="text-white text-2xl font-bold">{(energy * 100).toFixed(0)}%</div>
            <div className="text-cyan-300 text-xs">AI Optimization</div>
          </div>
        </Html>
      </mesh>
    </Float>
  )
}

// DNA Helix Structure
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 60 }).map((_, i) => (
        <Float key={i} speed={1 + i * 0.02} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[Math.cos(i * 0.2) * 4, i * 0.15 - 4.5, Math.sin(i * 0.2) * 4]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={i % 4 === 0 ? "#ff0080" : i % 4 === 1 ? "#00ff80" : i % 4 === 2 ? "#8000ff" : "#ff8000"}
              emissive="#ffffff"
              emissiveIntensity={0.3}
              transparent
              opacity={0.9}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// Quantum Particles
function QuantumParticles() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.001
      groupRef.current.rotation.y += 0.002
      groupRef.current.rotation.z += 0.001
    }
  })

  return (
    <group ref={groupRef}>
      <Sparkles count={200} scale={[20, 20, 20]} size={3} speed={0.5} opacity={0.8} color="#00ffff" />
      {Array.from({ length: 150 }).map((_, i) => (
        <Float key={i} speed={2 + i * 0.01} rotationIntensity={1} floatIntensity={1}>
          <mesh position={[(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial
              color={`hsl(${(i * 2.4) % 360}, 100%, 50%)`}
              emissive={`hsl(${(i * 2.4) % 360}, 100%, 30%)`}
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// Holographic Text
function HolographicText({ position, text, size = 1 }: any) {
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <Text
        position={position}
        fontSize={size}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {text}
        <meshStandardMaterial emissive="#00ffff" emissiveIntensity={0.5} transparent opacity={0.9} />
      </Text>
    </Float>
  )
}

// Main 3D Scene Component
function Premium3DScene() {
  const healthIcons = [
    { position: [-8, 4, 2], icon: "❤️", color: "#ff4757" },
    { position: [8, 3, -2], icon: "🧠", color: "#3742fa" },
    { position: [-6, -3, 4], icon: "💊", color: "#2ed573" },
    { position: [6, -2, 3], icon: "🏥", color: "#ffa502" },
    { position: [0, 6, -4], icon: "⚡", color: "#ff6b6b" },
    { position: [-4, 0, -6], icon: "🔬", color: "#4834d4" },
    { position: [4, 2, 6], icon: "🩺", color: "#ff9ff3" },
    { position: [0, -5, 0], icon: "💉", color: "#54a0ff" },
  ]

  return (
    <>
      {/* Lighting Setup */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#00ffff" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#ff00ff" />
      <pointLight position={[0, 15, 0]} intensity={1} color="#ffff00" />
      <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={2} color="#ffffff" castShadow />

      {/* Main Health Orb */}
      <PremiumHealthOrb position={[0, 0, 0]} />

      {/* Floating Health Icons */}
      {healthIcons.map((icon, index) => (
        <FloatingHealthIcon
          key={index}
          position={icon.position}
          icon={icon.icon}
          color={icon.color}
          scale={0.8 + Math.random() * 0.4}
        />
      ))}

      {/* DNA Helix */}
      <DNAHelix />

      {/* Quantum Particles */}
      <QuantumParticles />

      {/* Holographic Text */}
      <HolographicText position={[0, 8, 0]} text="ULTIMATE HEALTH" size={1.5} />
      <HolographicText position={[0, -8, 0]} text="INTELLIGENCE" size={1.2} />

      {/* Environment */}
      <Environment preset="night" />

      {/* Contact Shadows */}
      <ContactShadows position={[0, -10, 0]} opacity={0.4} scale={50} blur={2} far={20} />
    </>
  )
}

export function Premium3DLanding() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [stats, setStats] = useState({
    users: 2847293,
    revenue: 156.7,
    satisfaction: 99.8,
    countries: 195,
  })

  useEffect(() => {
    setIsLoaded(true)
    // Animate stats
    const interval = setInterval(() => {
      setStats((prev) => ({
        users: prev.users + Math.floor(Math.random() * 10),
        revenue: prev.revenue + Math.random() * 0.1,
        satisfaction: Math.min(99.9, prev.satisfaction + Math.random() * 0.01),
        countries: prev.countries,
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white overflow-hidden">
      {/* Hero Section with 3D Scene */}
      <div className="relative h-screen">
        {/* 3D Canvas */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ antialias: true, alpha: true }} shadows>
            <Suspense fallback={null}>
              <Premium3DScene />
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 4}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <div className="text-center max-w-6xl mx-auto">
            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                ULTIMATE
              </h1>
              <h2 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-gold via-white to-gold bg-clip-text text-transparent">
                HEALTH INTELLIGENCE
              </h2>
              <p className="text-2xl md:text-3xl text-cyan-300 mb-8 animate-pulse">
                The Future of Human Health & Longevity
              </p>
            </div>

            {/* Premium Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge className="bg-gradient-to-r from-gold to-yellow-500 text-black text-xl px-6 py-3 animate-bounce">
                <Crown className="h-6 w-6 mr-2" />
                WORLD'S #1 PLATFORM
              </Badge>
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl px-6 py-3 animate-pulse">
                <Brain className="h-6 w-6 mr-2" />
                AI POWERED
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl px-6 py-3 animate-bounce">
                <Atom className="h-6 w-6 mr-2" />
                QUANTUM ENHANCED
              </Badge>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xl px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                <Zap className="h-6 w-6 mr-2" />
                START YOUR TRANSFORMATION
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gold text-gold hover:bg-gold hover:text-black text-xl px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <SparklesIcon className="h-6 w-6 mr-2" />
                EXPLORE FEATURES
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Stats Cards */}
        <div className="absolute bottom-8 left-8 right-8 z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-400 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">{stats.users.toLocaleString()}+</div>
                <div className="text-sm">Active Users</div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 backdrop-blur-sm border-2 border-green-400 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">${stats.revenue.toFixed(1)}M</div>
                <div className="text-sm">Revenue Generated</div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 backdrop-blur-sm border-2 border-purple-400 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.satisfaction.toFixed(1)}%</div>
                <div className="text-sm">Satisfaction Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 backdrop-blur-sm border-2 border-yellow-400 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.countries}</div>
                <div className="text-sm">Countries Served</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Preview Section */}
      <div className="relative py-20 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Revolutionary Features
            </h3>
            <p className="text-xl text-gray-300">Experience the future of health technology</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🧬",
                title: "Quantum Health Analysis",
                description: "AI-powered quantum analysis of your cellular health with 99.9% accuracy",
                color: "from-cyan-500 to-blue-500",
              },
              {
                icon: "🧠",
                title: "Neural Interface",
                description: "Direct brain-computer interface for real-time health monitoring",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: "🌌",
                title: "Metaverse Clinic",
                description: "Virtual reality healthcare consultations in immersive environments",
                color: "from-green-500 to-teal-500",
              },
              {
                icon: "⚡",
                title: "Instant Healing",
                description: "Accelerated recovery using quantum field manipulation technology",
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: "🔮",
                title: "Future Prediction",
                description: "Predict health issues years before they manifest using AI",
                color: "from-indigo-500 to-purple-500",
              },
              {
                icon: "💎",
                title: "Immortality Protocol",
                description: "Advanced longevity treatments for extended lifespan",
                color: "from-pink-500 to-red-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-black/60 backdrop-blur-sm border-2 border-gray-600 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{feature.icon}</div>
                  <h4
                    className={`text-xl font-bold mb-3 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}
                  >
                    {feature.title}
                  </h4>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative py-20 bg-gradient-to-r from-black via-purple-900 to-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-6xl font-bold mb-6 bg-gradient-to-r from-gold via-white to-gold bg-clip-text text-transparent animate-pulse">
            JOIN THE REVOLUTION
          </h3>
          <p className="text-2xl text-gray-300 mb-12">
            Be among the first to experience the future of human health and unlock your infinite potential
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Button className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-black text-2xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse">
              <Crown className="h-8 w-8 mr-3" />
              CLAIM YOUR SPOT NOW
            </Button>
            <Button
              variant="outline"
              className="border-3 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black text-2xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
            >
              <Star className="h-8 w-8 mr-3" />
              LEARN MORE
            </Button>
          </div>

          <div className="mt-12 text-lg text-gray-400">
            <p>🔒 Secure • 🌍 Global • ⚡ Instant • 💎 Premium</p>
          </div>
        </div>
      </div>
    </div>
  )
}
