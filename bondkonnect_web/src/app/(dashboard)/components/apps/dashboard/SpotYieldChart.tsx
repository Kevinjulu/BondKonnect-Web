"use client";
  import * as React from 'react'
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/app/components/ui/card"
  import { Checkbox } from '@/app/components/ui/checkbox'
  import { Label } from "@/app/components/ui/label"
  import { CartesianGrid, Line, LineChart, XAxis,ResponsiveContainer, Tooltip,YAxis, Legend } from "recharts"
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { getHistoricalBonds, getProjectionBands, getSpotYieldCurve, getTableParams } from '@/app/lib/actions/api.actions';
  

  // Add this interface before the SpotYieldChart component
  interface DataPoint {
    maturity: number;
    spotYield: number;
    upperBand?: number;
    lowerBand?: number;
    oneWeekAgo?: number;
    oneMonthAgo?: number;
    oneYearAgo?: number;
  }
  
  const chartConfig = {
    spotYield: {
      label: 'Yield Curve',
      color: 'hsl(var(--chart-1))',
    },
    upperBand: {
      label: 'Upper Band',
      color: 'hsl(var(--chart-2))',
    },
    lowerBand: {
      label: 'Lower Band',
      color: 'hsl(var(--chart-3))',
    },
    oneWeekAgo: {
      label: '1 week ago',
      color: 'hsl(var(--chart-4))',
    },
    oneMonthAgo: {
      label: '1 month ago',
      color: 'hsl(var(--chart-5))',
    },
    oneYearAgo: {
      label: '1 year ago',
      color: 'hsl(var(--chart-6))',
    },
  }

  export function SpotYieldChart() {
    const [showProjections, setShowProjections] = React.useState(true);
    const [showHistorical, setShowHistorical] = React.useState(true);
    interface SpotYieldPoint {
      x: number;
      y: number;
    }
  
    interface HistoricalData {
      oneWeekAgo: SpotYieldPoint[];
      oneMonthAgo: SpotYieldPoint[];
      oneYearAgo: SpotYieldPoint[];
    }
  
    interface ProjectionBands {
      upperBand: { x: number; y: number }[];
      lowerBand: { x: number; y: number }[];
    }

    interface TableParams {
      CbrRate: number;
      Inflation: number;
      Level: number;
      Slope: number;
      Curvature: number;
    }
  
    const [spotYieldData, setSpotYieldData] = React.useState<SpotYieldPoint[]>([]);
    const [projectionBands, setProjectionBands] = React.useState<ProjectionBands>({ upperBand: [], lowerBand: [] });
    const [historicalData, setHistoricalData] = React.useState<HistoricalData>({ oneWeekAgo: [], oneMonthAgo: [], oneYearAgo: [] });
    const [tableParams, setTableParams] = React.useState<TableParams | null>(null);
  
    React.useEffect(() => {
      const fetchSpotYieldCurve = async () => {
        const response = await getSpotYieldCurve();
        const { data } = response;
        setSpotYieldData(data);
      };
      fetchSpotYieldCurve();
    }, []);

    React.useEffect(() => {
      const fetchTableParams = async () => {
        try {
          const response = await getTableParams();
          if (response) {
            setTableParams({
              CbrRate: response.CbrRate,
              Inflation: response.Inflation,
              Level: response.Level,
              Slope: response.Slope,
              Curvature: response.Curvature,
            });
          }
        } catch (error) {
          console.error('Error fetching table params:', error);
        }
      };
      fetchTableParams();
    }, []);
  
    React.useEffect(() => {
      const fetchProjectionBands = async () => {
        if (showProjections) {
          const response = await getProjectionBands();
          const { data } = response;
          setProjectionBands({
            upperBand: data.upperBand,
            lowerBand: data.lowerBand,
          });
        } else {
          setProjectionBands({ upperBand: [], lowerBand: [] });
        }
      };
      
      fetchProjectionBands();
    }, [showProjections]);
  
    React.useEffect(() => {
      const fetchHistoricalBonds = async () => {
        if (showHistorical) {
          const response = await getHistoricalBonds();
          const { data } = response;
          setHistoricalData({
            oneWeekAgo: data.oneWeekAgo,//set to 4 decimals
            oneMonthAgo: data.oneMonthAgo,
            oneYearAgo: data.oneYearAgo,
          });
        } else {
          setHistoricalData({ oneWeekAgo: [], oneMonthAgo: [], oneYearAgo: [] });
        }
      };
      
      fetchHistoricalBonds();
    }, [showHistorical]);
  
    const transformedData = spotYieldData.map((point) => {
      const dataPoint: DataPoint = {
        maturity: point.x,
        spotYield: parseFloat(point.y.toFixed(4)), // Format to 4 decimal places
      };
    
      // Helper function to find matching point with tolerance
      const findMatchingPoint = (arr: {x: number, y: number}[], targetX: number) => {
        return arr.find((p) => Math.abs(p.x - targetX) < 0.01);
      };
    
      if (showProjections && projectionBands.upperBand && projectionBands.lowerBand) {
        const upperBandPoint = findMatchingPoint(projectionBands.upperBand, point.x);
        const lowerBandPoint = findMatchingPoint(projectionBands.lowerBand, point.x);
        if (upperBandPoint) dataPoint.upperBand = parseFloat(upperBandPoint.y.toFixed(4));
        if (lowerBandPoint) dataPoint.lowerBand = parseFloat(lowerBandPoint.y.toFixed(4));
      }
    
      if (showHistorical && historicalData.oneWeekAgo && historicalData.oneMonthAgo && historicalData.oneYearAgo) {
        const oneWeekAgoPoint = findMatchingPoint(historicalData.oneWeekAgo, point.x);
        const oneMonthAgoPoint = findMatchingPoint(historicalData.oneMonthAgo, point.x);
        const oneYearAgoPoint = findMatchingPoint(historicalData.oneYearAgo, point.x);
        if (oneWeekAgoPoint) dataPoint.oneWeekAgo = parseFloat(oneWeekAgoPoint.y.toFixed(4));
        if (oneMonthAgoPoint) dataPoint.oneMonthAgo = parseFloat(oneMonthAgoPoint.y.toFixed(4));
        if (oneYearAgoPoint) dataPoint.oneYearAgo = parseFloat(oneYearAgoPoint.y.toFixed(4));
      }
    
      return dataPoint;
    });
    console.log("transformedData", transformedData);
  
    // Custom tooltip formatter to show 4 decimal places
    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
            <p className="font-semibold">{`${label}`}</p>
            {payload.map((entry: any, index: number) => (
              <p key={index} style={{ color: entry.color }}>
                {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(4) : entry.value}`}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };
  
    return (
      <Card className="col-span-12">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Yield Curve</CardTitle>
              <CardDescription className="text-primary">Kenya</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="projections"
                  checked={showProjections}
                  onCheckedChange={() => setShowProjections(!showProjections)}
                />
                <Label htmlFor="projections">Show Projections</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="historical"
                  checked={showHistorical}
                  onCheckedChange={() =>{ setShowHistorical(!showHistorical)}}
                />
                <Label htmlFor="historical">Show Historical Data</Label>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6"> {/* Add padding top */}
          <div className="h-[350px] w-full"> {/* Reduced height to 350px */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={transformedData}
                margin={{ top: 20, right: 10, bottom: 20, left: 20 }}
              >
                <XAxis
                  dataKey="maturity"
                  label={{ value: 'Maturity (years)', position: 'bottom', offset: -10 }}
                />
                <YAxis
                  domain={[5, 15]}
                  ticks={[5, 7, 9, 11, 13, 15]} // Adjusted ticks with a difference of 2
                  label={{ value: 'Yield (%)', angle: -90, position: 'left', offset: 0 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" align="right" /> {/* Add legend */}
                <CartesianGrid strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="spotYield"
                  stroke={chartConfig.spotYield.color}
                  name={chartConfig.spotYield.label}
                  dot
                  strokeWidth={2}
                />
                <Line
                      type="monotone"
                      dataKey="upperBand"
                      stroke={chartConfig.upperBand.color}
                      name={chartConfig.upperBand.label}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="lowerBand"
                      stroke={chartConfig.lowerBand.color}
                      name={chartConfig.lowerBand.label}
                      strokeDasharray="5 5"
                      dot={false}
                    />

<Line
                      type="monotone"
                      dataKey="oneWeekAgo"
                      stroke={chartConfig.oneWeekAgo.color}
                      name={chartConfig.oneWeekAgo.label}
                      dot
                      strokeWidth={1}
                    />
                    <Line
                      type="monotone"
                      dataKey="oneMonthAgo"
                      stroke={chartConfig.oneMonthAgo.color}
                      name={chartConfig.oneMonthAgo.label}
                      dot
                      strokeWidth={1}
                    />
                    <Line
                      type="monotone"
                      dataKey="oneYearAgo"
                      stroke={chartConfig.oneYearAgo.color}
                      name={chartConfig.oneYearAgo.label}
                      dot
                      strokeWidth={1}
                    />
                

               
                
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-2">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Inflation Rate:</TableCell>
                  <TableCell>{tableParams ? `${(tableParams.Inflation * 100).toFixed(1)}%` : '5.9%'}</TableCell>
                  <TableCell>CBR Rate:</TableCell>
                  <TableCell>{tableParams ? `${(tableParams.CbrRate * 100).toFixed(1)}%` : '7.0%'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Spot Curve Stats</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Slope</TableHead>
                  <TableHead>Curvature</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell />
                  <TableCell>{tableParams ? `${(tableParams.Level * 100).toFixed(4)}%` : '11.8458%'}</TableCell>
                  <TableCell>{tableParams ? `${(tableParams.Slope * 100).toFixed(2)}%` : '2.52%'}</TableCell>
                  <TableCell>{tableParams ? `${(tableParams.Curvature * 100).toFixed(2)}%` : '-0.11%'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardFooter>
      </Card>
   
    )
  }
