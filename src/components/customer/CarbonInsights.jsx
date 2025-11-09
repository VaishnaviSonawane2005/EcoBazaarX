import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { carbonService } from '../../services/carbonService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Leaf, TrendingDown, TrendingUp, Award, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function CarbonInsights() {
  const { user } = useAuth();
  const [insights, setInsights] = useState(null);
  const [report, setReport] = useState(null);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user, period]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [insightsData, reportData] = await Promise.all([
        carbonService.getUserInsights(user.id),
        carbonService.getReport(user.id, period),
      ]);
      setInsights(insightsData);
      setReport(reportData);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !insights || !report) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Footprint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-emerald-600">{insights.totalFootprint.toFixed(1)} kg</div>
            <p className="text-xs text-gray-600 mt-1">All time CO₂ emissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-600">{insights.monthlyFootprint.toFixed(1)} kg</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">{report.reduction}% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">vs Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{Math.abs(insights.comparisonToAverage)}% lower</div>
            <p className="text-xs text-gray-600 mt-1">Than typical consumer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Carbon Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-600" />
              <span className="text-2xl">{insights.carbonPoints}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Keep up the good work!</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v)}>
        <TabsList>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="space-y-6 mt-6">
          {/* Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Carbon Footprint Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={report.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="footprint" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>By Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={insights.categoryBreakdown}
                      dataKey="footprint"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {insights.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.categoryBreakdown.map((cat, index) => (
                    <div key={cat.category}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">{cat.category}</span>
                        <span className="text-sm">{cat.footprint.toFixed(1)} kg CO₂</span>
                      </div>
                      <Progress
                        value={(cat.footprint / insights.totalFootprint) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <CardTitle>Personalized Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                <Leaf className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Your Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {insights.achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="text-4xl">{achievement.icon}</div>
                <div>
                  <h4 className="mb-1">{achievement.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{achievement.description}</p>
                  <p className="text-xs text-gray-500">
                    Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
