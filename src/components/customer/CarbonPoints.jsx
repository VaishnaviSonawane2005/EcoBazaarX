import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Award, Leaf, Gift, TrendingUp, Lock } from 'lucide-react';

export default function CarbonPoints() {
  const { user } = useAuth();
  const currentPoints = user?.carbonPoints || 0;

  const rewards = [
    { id: '1', name: '5% Discount Coupon', description: 'Get 5% off your next purchase', pointsRequired: 500, icon: '🎟️', unlocked: currentPoints >= 500 },
    { id: '2', name: '10% Discount Coupon', description: 'Get 10% off your next purchase', pointsRequired: 1000, icon: '🎫', unlocked: currentPoints >= 1000 },
    { id: '3', name: 'Free Shipping', description: 'Free shipping on your next 3 orders', pointsRequired: 1500, icon: '🚚', unlocked: currentPoints >= 1500 },
    { id: '4', name: 'Eco Warrior Badge', description: 'Exclusive badge on your profile', pointsRequired: 2000, icon: '🏆', unlocked: currentPoints >= 2000 },
    { id: '5', name: '₹500 Store Credit', description: 'Get ₹500 to spend on any product', pointsRequired: 3000, icon: '💰', unlocked: currentPoints >= 3000 },
    { id: '6', name: 'Plant a Tree', description: 'We\'ll plant a tree in your name', pointsRequired: 5000, icon: '🌳', unlocked: currentPoints >= 5000 },
  ];

  const nextReward = rewards.find(r => !r.unlocked);
  const progressToNext = nextReward ? (currentPoints / nextReward.pointsRequired) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white mb-2">Your Carbon Points</h2>
              <div className="flex items-center gap-4">
                <Award className="w-12 h-12" />
                <span className="text-5xl">{currentPoints}</span>
              </div>
            </div>
            <Leaf className="w-24 h-24 opacity-20" />
          </div>
          
          {nextReward && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Next reward: {nextReward.name}</span>
                <span>{nextReward.pointsRequired - currentPoints} points to go</span>
              </div>
              <Progress value={progressToNext} className="h-3 bg-white/20" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* How to Earn */}
      <Card>
        <CardHeader>
          <CardTitle>How to Earn Carbon Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-emerald-600 rounded-full p-2">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm">Eco-Friendly Purchases</h4>
              </div>
              <p className="text-sm text-gray-600">Earn 10 points per kg of CO₂ saved</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-600 rounded-full p-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm">Regular Shopping</h4>
              </div>
              <p className="text-sm text-gray-600">Earn 1 point per ₹10 spent</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-purple-600 rounded-full p-2">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm">Achievements</h4>
              </div>
              <p className="text-sm text-gray-600">Bonus points for milestones</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards */}
      <div>
        <h3 className="mb-4">Available Rewards</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <Card
              key={reward.id}
              className={`${
                reward.unlocked
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'opacity-75'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl">{reward.icon}</div>
                  {reward.unlocked ? (
                    <Badge className="bg-emerald-600">Unlocked</Badge>
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <h4 className="mb-2">{reward.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">{reward.pointsRequired} points</span>
                </div>
                {!reward.unlocked && (
                  <div className="mt-4">
                    <Progress
                      value={(currentPoints / reward.pointsRequired) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {reward.pointsRequired - currentPoints} points needed
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Points History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'Purchased Organic Cotton T-Shirt', points: 25, date: '2024-10-25', type: 'earn' },
              { action: 'Eco-friendly shopping bonus', points: 50, date: '2024-10-24', type: 'earn' },
              { action: 'Achievement unlocked: Green Shopper', points: 100, date: '2024-10-20', type: 'earn' },
              { action: 'Redeemed 5% discount coupon', points: -500, date: '2024-10-15', type: 'redeem' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {item.type === 'earn' ? (
                    <div className="bg-green-100 rounded-full p-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="bg-purple-100 rounded-full p-2">
                      <Gift className="w-4 h-4 text-purple-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm">{item.action}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </div>
                <span
                  className={`${
                    item.type === 'earn' ? 'text-green-600' : 'text-purple-600'
                  }`}
                >
                  {item.points > 0 ? '+' : ''}{item.points}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
