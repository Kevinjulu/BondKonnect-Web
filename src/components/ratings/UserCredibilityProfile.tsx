'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CredibilityBadge } from './CredibilityBadge'
import { RatingSummary } from './RatingSummary'
import { getUserCredibility } from '@/lib/actions/ratings.actions'
import { UserCredibilityScore } from '@/lib/types/ratings'
import { Loader2, TrendingUp, Users, CheckCircle2, Clock, Shield } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Platinum': { bg: '#E5E7EB', text: '#374151', border: '#D1D5DB' },
  'Gold': { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  'Silver': { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' },
  'Bronze': { bg: '#FED7AA', text: '#92400E', border: '#FDBA74' },
  'Unrated': { bg: '#F3F4F6', text: '#9CA3AF', border: '#E5E7EB' }
}

const SENTIMENT_COLORS = ['#10B981', '#FBBF24', '#EF4444']

interface UserCredibilityProfileProps {
  userId: string
  userName?: string
  className?: string
}

export function UserCredibilityProfile({
  userId,
  userName = 'User',
  className = ''
}: UserCredibilityProfileProps) {
  const [credibility, setCredibility] = useState<UserCredibilityScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCredibility = async () => {
      try {
        setLoading(true)
        const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId
        const data = await getUserCredibility(numericUserId)
        setCredibility(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load credibility data')
      } finally {
        setLoading(false)
      }
    }

    fetchCredibility()
  }, [userId])

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        <span className="ml-3 text-sm text-neutral-500 font-medium">Loading credibility profile...</span>
      </div>
    )
  }

  if (error || !credibility) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-sm text-red-600 font-medium">{error || 'Credibility data not available'}</p>
        </CardContent>
      </Card>
    )
  }

  const scoreData = [
    { name: 'Ratings', value: Math.round(credibility.component_scores?.rating_score || 0), max: 100 },
    { name: 'Activity', value: Math.round(credibility.component_scores?.activity_score || 0), max: 100 },
    { name: 'Verification', value: Math.round(credibility.component_scores?.verification_score || 0), max: 100 },
    { name: 'Settlement', value: Math.round(credibility.component_scores?.settlement_score || 0), max: 100 },
    { name: 'Response', value: Math.round(credibility.component_scores?.response_time_score || 0), max: 100 }
  ]

  const sentimentData = [
    { name: 'Positive', value: credibility.sentiment_distribution?.positive || 0, color: SENTIMENT_COLORS[0] },
    { name: 'Neutral', value: credibility.sentiment_distribution?.neutral || 0, color: SENTIMENT_COLORS[1] },
    { name: 'Negative', value: credibility.sentiment_distribution?.negative || 0, color: SENTIMENT_COLORS[2] }
  ]

  const badgeColor = BADGE_COLORS[credibility.badge] || BADGE_COLORS['Unrated']

  const getBadgeDescription = (badge: string): string => {
    const descriptions: Record<string, string> = {
      'Platinum': 'Exceptional trader with outstanding history',
      'Gold': 'Excellent credibility and consistent performance',
      'Silver': 'Reliable trader with good transaction history',
      'Bronze': 'Established presence with developing history',
      'Unrated': 'Insufficient trading history for rating'
    }
    return descriptions[badge] || ''
  }

  return (
    <div className={className}>
      {/* Header Card with Badge */}
      <Card className="border-neutral-200 bg-white shadow-sm mb-6">
        <CardContent className="pt-8 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-black mb-2">{userName}</h2>
                <p className="text-sm text-neutral-500 mb-4">Credibility Profile</p>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Main Score */}
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Credibility Score</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-black">
                        {Math.round(credibility.credibility_index || 0)}
                      </span>
                      <span className="text-sm font-bold text-neutral-400">/100</span>
                    </div>
                  </div>

                  {/* Total Ratings */}
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Ratings Received</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-black">
                        {credibility.total_ratings || 0}
                      </span>
                      <span className="text-sm font-bold text-neutral-400">rating{(credibility.total_ratings || 0) !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Badge */}
                <div className="inline-block">
                  <div
                    className="px-4 py-2 rounded-xl border-2 font-bold text-sm text-center"
                    style={{
                      backgroundColor: badgeColor.bg,
                      color: badgeColor.text,
                      borderColor: badgeColor.border
                    }}
                  >
                    {credibility.badge || 'Unrated'}
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 font-medium">{getBadgeDescription(credibility.badge)}</p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex flex-col gap-4 min-w-[200px]">
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-neutral-500" />
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Active Transactions</span>
                  </div>
                  <p className="text-2xl font-black text-black">{credibility.total_transactions || 0}</p>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-neutral-500" />
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Settlement Rate</span>
                  </div>
                  <p className="text-2xl font-black text-black">
                    {credibility.settlement_rate ? `${Math.round(credibility.settlement_rate)}%` : 'N/A'}
                  </p>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-neutral-500" />
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Disputes</span>
                  </div>
                  <p className="text-2xl font-black text-black">{credibility.disputes_count || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for detailed breakdown */}
      <Tabs defaultValue="scores" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-3 bg-neutral-100 p-1 rounded-xl mb-6">
          <TabsTrigger 
            value="scores"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-widest rounded-lg"
          >
            Component Scores
          </TabsTrigger>
          <TabsTrigger 
            value="ratings"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-widest rounded-lg"
          >
            Rating Details
          </TabsTrigger>
          <TabsTrigger 
            value="sentiment"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-widest rounded-lg"
          >
            Sentiment
          </TabsTrigger>
        </TabsList>

        {/* Component Scores Tab */}
        <TabsContent value="scores">
          <Card className="border-neutral-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-black">Credibility Component Breakdown</CardTitle>
              <CardDescription>Individual score contributions to overall credibility index</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={scoreData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      style={{ fontSize: '12px', fontWeight: '500' }}
                    />
                    <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => `${value}/100`}
                    />
                    <Bar dataKey="value" fill="#000000" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                {/* Score Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scoreData.map((item) => (
                    <div key={item.name} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-bold text-neutral-600">{item.name}</span>
                        <span className="text-lg font-black text-black">{item.value}</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-black rounded-full h-2 transition-all"
                          style={{ width: `${(item.value / item.max) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-neutral-400 mt-2 font-medium">{Math.round((item.value / item.max) * 100)}% of max</p>
                    </div>
                  ))}
                </div>

                {/* Score Calculation Info */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                  <p className="text-xs font-bold text-blue-900 mb-2">Score Calculation</p>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Final Score = (50% Rating) + (20% Activity) + (15% Verification) + (10% Settlement) + (5% Response Time)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ratings Tab */}
        <TabsContent value="ratings">
          <Card className="border-neutral-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-black">Rating Distribution</CardTitle>
              <CardDescription>Summary of ratings across all dimensions</CardDescription>
            </CardHeader>
            <CardContent>
              <RatingSummary userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sentiment Tab */}
        <TabsContent value="sentiment">
          <Card className="border-neutral-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-black">Rating Sentiment</CardTitle>
              <CardDescription>Distribution of positive, neutral, and negative ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, color }) => (
                        <text fill={color} fontSize={12} fontWeight="bold">
                          {name}: {value}
                        </text>
                      )}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Sentiment Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {sentimentData.map((item) => (
                    <div key={item.name} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-center">
                      <div
                        className="w-3 h-3 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <p className="text-sm font-bold text-neutral-600">{item.name}</p>
                      <p className="text-2xl font-black text-black">{item.value}</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {credibility.total_ratings ? `${Math.round((item.value / credibility.total_ratings) * 100)}%` : '0%'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Trust Indicators */}
      <Card className="border-neutral-200 bg-white shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-black">Trust Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-neutral-600 uppercase">Email Verified</p>
                <p className="text-sm font-black text-black">Yes</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <Users className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-neutral-600 uppercase">KYC Status</p>
                <p className="text-sm font-black text-black">{credibility.is_kyc_verified ? 'Verified' : 'Pending'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <Clock className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-neutral-600 uppercase">Member Since</p>
                <p className="text-sm font-black text-black">
                  {credibility.account_age_days ? `${Math.floor(credibility.account_age_days / 30)} mo` : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <Shield className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-neutral-600 uppercase">Trust Score</p>
                <p className="text-sm font-black text-black">
                  {credibility.credibility_index ? (credibility.credibility_index >= 75 ? 'High' : credibility.credibility_index >= 50 ? 'Medium' : 'Low') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
