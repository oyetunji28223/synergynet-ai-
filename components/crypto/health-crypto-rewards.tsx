"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Coins, TrendingUp, Gift, Zap, Crown, Gem } from "lucide-react"

export function HealthCryptoRewards() {
  const [healthCoins, setHealthCoins] = useState(1247.89)
  const [nftCollection, setNftCollection] = useState([
    { id: 1, name: "Perfect Heart Rate NFT", rarity: "Legendary", value: 2.5 },
    { id: 2, name: "Marathon Achievement", rarity: "Epic", value: 1.8 },
    { id: 3, name: "Meditation Master", rarity: "Rare", value: 0.9 },
  ])
  const [stakingRewards, setStakingRewards] = useState(156.34)
  const [healthMining, setHealthMining] = useState({
    rate: 0.0234,
    totalMined: 89.67,
    efficiency: 94.2,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthCoins((prev) => prev + Math.random() * 0.1)
      setStakingRewards((prev) => prev + Math.random() * 0.01)
      setHealthMining((prev) => ({
        ...prev,
        totalMined: prev.totalMined + Math.random() * 0.001,
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const claimRewards = () => {
    setHealthCoins((prev) => prev + stakingRewards)
    setStakingRewards(0)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "text-yellow-400"
      case "Epic":
        return "text-purple-400"
      case "Rare":
        return "text-blue-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white border-2 border-yellow-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Coins className="h-8 w-8 text-yellow-400" />
            HealthCoin Ecosystem
            <Badge className="bg-yellow-400 text-black font-bold animate-pulse">CRYPTO</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-black/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{healthCoins.toFixed(2)}</div>
              <div className="text-sm">HealthCoins (HLC)</div>
            </div>
            <div className="bg-black/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">${(healthCoins * 0.47).toFixed(2)}</div>
              <div className="text-sm">USD Value</div>
            </div>
            <div className="bg-black/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">+23.7%</div>
              <div className="text-sm">24h Change</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-black/90 border-2 border-green-400">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Health Mining Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white">Mining Rate</span>
                <span className="text-green-400">{healthMining.rate} HLC/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Total Mined Today</span>
                <span className="text-green-400">{healthMining.totalMined.toFixed(3)} HLC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Mining Efficiency</span>
                <span className="text-green-400">{healthMining.efficiency}%</span>
              </div>
              <Progress value={healthMining.efficiency} className="h-2" />
            </div>

            <div className="bg-green-900/30 p-3 rounded-lg">
              <h4 className="text-green-400 font-semibold mb-2">Active Mining Activities</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Daily Steps (12,847)</span>
                  <span className="text-green-400">+0.128 HLC</span>
                </div>
                <div className="flex justify-between">
                  <span>Heart Rate Monitoring</span>
                  <span className="text-green-400">+0.045 HLC</span>
                </div>
                <div className="flex justify-between">
                  <span>Medication Compliance</span>
                  <span className="text-green-400">+0.089 HLC</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/90 border-2 border-purple-400">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Gem className="h-5 w-5" />
              Health NFT Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {nftCollection.map((nft) => (
              <div key={nft.id} className="bg-purple-900/30 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-white">{nft.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${getRarityColor(nft.rarity)} bg-transparent border`}>{nft.rarity}</Badge>
                      <span className="text-sm text-gray-400">{nft.value} ETH</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-purple-400 text-purple-400">
                    Trade
                  </Button>
                </div>
              </div>
            ))}

            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Crown className="h-4 w-4 mr-2" />
              Mint New Achievement NFT
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-900 to-cyan-900 text-white border-blue-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Staking Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400 mb-2">{stakingRewards.toFixed(2)} HLC</div>
            <p className="text-sm text-gray-300 mb-4">Available to claim</p>
            <Button
              onClick={claimRewards}
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={stakingRewards < 0.01}
            >
              Claim Rewards
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900 to-emerald-900 text-white border-green-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Health Marketplace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Premium Supplements</span>
                <span className="text-green-400">-20% HLC</span>
              </div>
              <div className="flex justify-between">
                <span>Fitness Equipment</span>
                <span className="text-green-400">-15% HLC</span>
              </div>
              <div className="flex justify-between">
                <span>Telemedicine Credits</span>
                <span className="text-green-400">Pay with HLC</span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">Browse Marketplace</Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900 to-pink-900 text-white border-purple-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              DeFi Health Pool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Pool TVL</span>
                <span className="text-purple-400">$2.4M</span>
              </div>
              <div className="flex justify-between">
                <span>APY</span>
                <span className="text-green-400">247.8%</span>
              </div>
              <div className="flex justify-between">
                <span>Your Share</span>
                <span className="text-purple-400">0.023%</span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-purple-500 hover:bg-purple-600">Add Liquidity</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
