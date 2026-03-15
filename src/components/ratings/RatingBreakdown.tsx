import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Star } from 'lucide-react';

interface RatingBreakdownProps {
  positiveRatingCount: number;
  neutralRatingCount: number;
  negativeRatingCount: number;
  averageOverallRating: number;
  totalRatingsCount: number;
  recentRatings?: Array<{
    id: number;
    stars: number;
    raterName: string;
    comment: string;
    date: string;
  }>;
}

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  positiveRatingCount,
  neutralRatingCount,
  negativeRatingCount,
  averageOverallRating,
  totalRatingsCount,
  recentRatings = [],
}) => {
  const distributionData = [
    { name: 'Positive (4-5★)', value: positiveRatingCount, color: '#10b981' },
    { name: 'Neutral (3★)', value: neutralRatingCount, color: '#f59e0b' },
    { name: 'Negative (1-2★)', value: negativeRatingCount, color: '#ef4444' },
  ];

  const pieData = [
    { name: 'Positive', value: positiveRatingCount },
    { name: 'Neutral', value: neutralRatingCount },
    { name: 'Negative', value: negativeRatingCount },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rating Distribution - All Ratings Visible</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-gray-600 text-sm mb-1">Average Rating</p>
            <p className="text-3xl font-bold text-blue-700">
              {averageOverallRating.toFixed(2)}
            </p>
            <div className="mt-2">{renderStars(Math.round(averageOverallRating))}</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-gray-600 text-sm mb-1">Positive</p>
            <p className="text-3xl font-bold text-green-700">{positiveRatingCount}</p>
            <p className="text-xs text-gray-600 mt-1">
              {totalRatingsCount > 0
                ? ((positiveRatingCount / totalRatingsCount) * 100).toFixed(0)
                : 0}
              %
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-gray-600 text-sm mb-1">Neutral</p>
            <p className="text-3xl font-bold text-yellow-700">{neutralRatingCount}</p>
            <p className="text-xs text-gray-600 mt-1">
              {totalRatingsCount > 0
                ? ((neutralRatingCount / totalRatingsCount) * 100).toFixed(0)
                : 0}
              %
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-gray-600 text-sm mb-1">Negative</p>
            <p className="text-3xl font-bold text-red-700">{negativeRatingCount}</p>
            <p className="text-xs text-gray-600 mt-1">
              {totalRatingsCount > 0
                ? ((negativeRatingCount / totalRatingsCount) * 100).toFixed(0)
                : 0}
              %
            </p>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="grid grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm mb-3">Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm mb-3">Rating Counts</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Ratings */}
        {recentRatings.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm mb-3">Recent Ratings</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentRatings.slice(0, 5).map((rating) => (
                <div
                  key={rating.id}
                  className="border rounded-lg p-3 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{rating.raterName}</p>
                      <div>{renderStars(rating.stars)}</div>
                    </div>
                    <p className="text-xs text-gray-500">{rating.date}</p>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-gray-700 italic">
                      "{rating.comment}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transparency Note */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
          <p className="text-blue-900 font-semibold mb-1">📊 Complete Transparency</p>
          <p className="text-blue-800">
            All ratings are displayed here. The recency-weighted score gives more
            importance to recent trades, helping show improvement or recovery
            patterns. No ratings are hidden or removed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingBreakdown;
