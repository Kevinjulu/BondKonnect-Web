"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Download, Calendar, ArrowUpRight, TrendingUp, Users, ShoppingCart, CreditCard, Activity } from "lucide-react"

export function AnalysisComponent() {
  const [dateRange, setDateRange] = useState("Dec 10, 2022 - July 18, 2023")

  // Sample data for charts
  const performanceData = [
    { state: "WA", value: 85 },
    { state: "OR", value: 65 },
    { state: "CA", value: 90 },
    { state: "NV", value: 50 },
    { state: "AZ", value: 40 },
    { state: "MT", value: 60 },
    { state: "ID", value: 55 },
    { state: "WY", value: 95 },
    { state: "CO", value: 75 },
    { state: "NM", value: 45 },
    { state: "TX", value: 70 },
    { state: "OK", value: 65 },
    { state: "KS", value: 60 },
    { state: "NE", value: 55 },
    { state: "SD", value: 50 },
    { state: "ND", value: 45 },
    { state: "MN", value: 70 },
    { state: "IA", value: 65 },
    { state: "MO", value: 60 },
    { state: "AR", value: 55 },
    { state: "LA", value: 50 },
    { state: "MS", value: 45 },
    { state: "AL", value: 70 },
    { state: "GA", value: 85 },
    { state: "FL", value: 60 },
    { state: "SC", value: 55 },
    { state: "NC", value: 50 },
    { state: "TN", value: 45 },
    { state: "KY", value: 70 },
    { state: "VA", value: 65 },
    { state: "WV", value: 60 },
    { state: "MD", value: 55 },
    { state: "DE", value: 50 },
    { state: "NJ", value: 45 },
    { state: "PA", value: 70 },
    { state: "NY", value: 65 },
    { state: "CT", value: 60 },
    { state: "RI", value: 55 },
    { state: "MA", value: 50 },
    { state: "NH", value: 45 },
    { state: "VT", value: 70 },
    { state: "ME", value: 65 },
  ]

  const budgetData = [
    { name: "Fuel consumption", value: 30, color: "#3b82f6", amount: "$30L" },
    { name: "Maintenance cost", value: 40, color: "#ef4444", amount: "$64K" },
    { name: "Other cost", value: 30, color: "#f97316", amount: "$114K" },
  ]

  const kpiData = [
    { id: 1, metric: "Fuel consumption", value: "30L", performance: "8%", cost: "$456k", traveled: "77KM" },
    { id: 2, metric: "Vehicle utilization", value: "50L", performance: "28%", cost: "$456k", traveled: "77KM" },
    { id: 3, metric: "Driver performance", value: "30L", performance: "3%", cost: "$456k", traveled: "77KM" },
    { id: 4, metric: "Maintenance efficiency", value: "30L", performance: "7%", cost: "$456k", traveled: "77KM" },
  ]

  const monthlyData = [
    { name: "Jan", sales: 4000, revenue: 2400, profit: 1800 },
    { name: "Feb", sales: 3000, revenue: 1398, profit: 1000 },
    { name: "Mar", sales: 2000, revenue: 9800, profit: 1500 },
    { name: "Apr", sales: 2780, revenue: 3908, profit: 2000 },
    { name: "May", sales: 1890, revenue: 4800, profit: 1200 },
    { name: "Jun", sales: 2390, revenue: 3800, profit: 1700 },
    { name: "Jul", sales: 3490, revenue: 4300, profit: 2100 },
  ]

  const salesData = [
    { name: "Product A", value: 400 },
    { name: "Product B", value: 300 },
    { name: "Product C", value: 300 },
    { name: "Product D", value: 200 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Report and analytics</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {dateRange}
          </Button>
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </Button>
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <h3 className="text-sm text-muted-foreground mb-1">Daily target</h3>
              <div className="relative w-24 h-24 mb-2">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">450</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset="70"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">Target: 500</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <h3 className="text-sm text-muted-foreground mb-1">Weekly target</h3>
              <div className="relative w-24 h-24 mb-2">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">2708</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset="113"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">Target: 3500</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <h3 className="text-sm text-muted-foreground mb-1">Monthly target</h3>
              <div className="relative w-24 h-24 mb-2">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">40k</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset="141"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">Target: 50k</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <h3 className="text-sm text-muted-foreground mb-1">Yearly target</h3>
              <div className="relative w-24 h-24 mb-2">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">10m</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset="198"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">Target: 500k</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <h3 className="text-sm text-muted-foreground mb-1">Total Revenue</h3>
              <div className="text-3xl font-bold mb-2">$450K</div>
              <div className="flex items-center text-green-500">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+12.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Driver performance</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="h-8">
                  Monthly
                </Button>
                <Button size="sm" className="h-8">
                  Yearly
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="profit" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                <span className="text-sm">High priority</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm">Medium priority</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                <span className="text-sm">Low priority</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Budget Analytics</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="h-8">
                  Monthly
                </Button>
                <Button size="sm" className="h-8">
                  Yearly
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[350px]">
              <div className="w-64 h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="text-2xl font-bold">$450K</div>
                  <div className="text-sm text-muted-foreground">Total Budget</div>
                </div>
              </div>
              <div className="space-y-4">
                {budgetData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <div className="flex-1">
                      <div className="text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>KPI details</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Dec 10, 2022 - July 18, 2023</span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Fuel consumption</TableHead>
                <TableHead>Vehicle utilization</TableHead>
                <TableHead>Driver performance</TableHead>
                <TableHead>Maintenance cost</TableHead>
                <TableHead>Total Traveled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpiData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.value}</TableCell>
                  <TableCell>{row.value}</TableCell>
                  <TableCell>{row.performance}</TableCell>
                  <TableCell>{row.cost}</TableCell>
                  <TableCell>{row.traveled}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">+18.2%</Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm text-muted-foreground">Total Sales</h3>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">+5.2%</Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm text-muted-foreground">New Customers</h3>
              <div className="text-2xl font-bold">+2,420</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-200">-3.1%</Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm text-muted-foreground">Active Orders</h3>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">-3.1% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">+12.2%</Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm text-muted-foreground">Conversion Rate</h3>
              <div className="text-2xl font-bold">24.5%</div>
              <p className="text-xs text-muted-foreground">+12.2% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {salesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                        i % 3 === 0
                          ? "bg-blue-100 text-blue-600"
                          : i % 3 === 1
                            ? "bg-green-100 text-green-600"
                            : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">
                        Payment from{" "}
                        {["John Doe", "Jane Smith", "Robert Johnson", "Emily Davis", "Michael Brown"][i - 1]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {["Apr 24, 2023", "Apr 23, 2023", "Apr 22, 2023", "Apr 21, 2023", "Apr 20, 2023"][i - 1]} at{" "}
                        {["2:30 PM", "1:45 PM", "3:15 PM", "11:30 AM", "10:00 AM"][i - 1]}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${(Math.random() * 1000).toFixed(2)}</div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
