"use client";
import * as React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from "@/components/ui/label"
import { CartesianGrid, Line, LineChart, XAxis,ResponsiveContainer, Tooltip,YAxis, Legend } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useYieldCurve, useProjectionBands, useHistoricalBonds, useTableParams } from '@/hooks/use-market-data';
import { Loader2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

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
  spotYield: { label: 'Yield Curve', color: 'hsl(var(--chart-1))' },
  upperBand: { label: 'Upper Band', color: 'hsl(var(--chart-2))' },
  lowerBand: { label: 'Lower Band', color: 'hsl(var(--chart-3))' },
  oneWeekAgo: { label: '1 week ago', color: 'hsl(var(--chart-4))' },
  oneMonthAgo: { label: '1 month ago', color: 'hsl(var(--chart-5))' },
  oneYearAgo: { label: '1 year ago', color: 'hsl(var(--chart-6))' },
}

export function SpotYieldChart() {
  const [showProjections, setShowProjections] = React.useState(true);
  const [showHistorical, setShowHistorical] = React.useState(true);

  // Use the new hooks
  const { data: spotYieldData = [], isLoading: isSpotLoading } = useYieldCurve();
  const { data: tableParams, isLoading: isParamsLoading } = useTableParams();
  const { data: projectionBands, isLoading: isProjectionsLoading } = useProjectionBands(showProjections);
  const { data: historicalData, isLoading: isHistoricalLoading } = useHistoricalBonds(showHistorical);

  const transformedData = React.useMemo(() => {
    if (!spotYieldData.length) return [];

    return spotYieldData.map((point: any) => {
      const dataPoint: DataPoint = {
        maturity: point.x,
        spotYield: parseFloat(point.y.toFixed(4)),
      };

      const findMatchingPoint = (arr: any[], targetX: number) => {
        if (!arr) return null;
        return arr.find((p) => Math.abs(p.x - targetX) < 0.01);
      };

      if (showProjections && projectionBands) {
        const upper = findMatchingPoint(projectionBands.upperBand, point.x);
        const lower = findMatchingPoint(projectionBands.lowerBand, point.x);
        if (upper) dataPoint.upperBand = parseFloat(upper.y.toFixed(4));
        if (lower) dataPoint.lowerBand = parseFloat(lower.y.toFixed(4));
      }

      if (showHistorical && historicalData) {
        const w = findMatchingPoint(historicalData.oneWeekAgo, point.x);
        const m = findMatchingPoint(historicalData.oneMonthAgo, point.x);
        const y = findMatchingPoint(historicalData.oneYearAgo, point.x);
        if (w) dataPoint.oneWeekAgo = parseFloat(w.y.toFixed(4));
        if (m) dataPoint.oneMonthAgo = parseFloat(m.y.toFixed(4));
        if (y) dataPoint.oneYearAgo = parseFloat(y.y.toFixed(4));
      }

      return dataPoint;
    });
  }, [spotYieldData, projectionBands, historicalData, showProjections, showHistorical]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{`${label} Yrs`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-xs">
              {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(4) : entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const isLoading = isSpotLoading || isParamsLoading;

  return (
    <Card className="col-span-12">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Yield Curve</CardTitle>
            <CardDescription className="text-primary">Kenya Market</CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="projections" checked={showProjections} onCheckedChange={() => setShowProjections(!showProjections)} />
              <Label htmlFor="projections" className="text-xs">Projections</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="historical" checked={showHistorical} onCheckedChange={() => setShowHistorical(!showHistorical)} />
              <Label htmlFor="historical" className="text-xs">Historical</Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[350px] w-full">
          {isLoading ? (
            <div className="space-y-4 w-full h-full">
              <div className="flex items-end space-x-2 h-[280px]">
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="flex-1" style={{ height: `${Math.random() * 60 + 20}%` }} />
                ))}
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transformedData} margin={{ top: 20, right: 10, bottom: 20, left: 20 }}>
                <XAxis dataKey="maturity" />
                <YAxis domain={[5, 15]} ticks={[5, 7, 9, 11, 13, 15]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" align="right" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <Line type="monotone" dataKey="spotYield" stroke={chartConfig.spotYield.color} name={chartConfig.spotYield.label} dot strokeWidth={2} />
                {showProjections && (
                  <>
                    <Line type="monotone" dataKey="upperBand" stroke={chartConfig.upperBand.color} name={chartConfig.upperBand.label} strokeDasharray="5 5" dot={false} />
                    <Line type="monotone" dataKey="lowerBand" stroke={chartConfig.lowerBand.color} name={chartConfig.lowerBand.label} strokeDasharray="5 5" dot={false} />
                  </>
                )}
                {showHistorical && (
                  <>
                    <Line type="monotone" dataKey="oneWeekAgo" stroke={chartConfig.oneWeekAgo.color} name={chartConfig.oneWeekAgo.label} dot={false} strokeWidth={1} />
                    <Line type="monotone" dataKey="oneMonthAgo" stroke={chartConfig.oneMonthAgo.color} name={chartConfig.oneMonthAgo.label} dot={false} strokeWidth={1} />
                    <Line type="monotone" dataKey="oneYearAgo" stroke={chartConfig.oneYearAgo.color} name={chartConfig.oneYearAgo.label} dot={false} strokeWidth={1} />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-2">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="py-2 text-xs font-bold">Inflation Rate:</TableCell>
                <TableCell className="py-2 text-xs">{tableParams ? `${(tableParams.Inflation * 100).toFixed(1)}%` : '...'}</TableCell>
                <TableCell className="py-2 text-xs font-bold">CBR Rate:</TableCell>
                <TableCell className="py-2 text-xs">{tableParams ? `${(tableParams.CbrRate * 100).toFixed(1)}%` : '...'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50">
                <TableHead className="h-8 text-[10px] uppercase font-bold">Spot Curve Stats</TableHead>
                <TableHead className="h-8 text-[10px] uppercase font-bold">Level</TableHead>
                <TableHead className="h-8 text-[10px] uppercase font-bold">Slope</TableHead>
                <TableHead className="h-8 text-[10px] uppercase font-bold">Curvature</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="py-2" />
                <TableCell className="py-2 text-xs font-medium">{tableParams ? `${(tableParams.Level * 100).toFixed(4)}%` : '...'}</TableCell>
                <TableCell className="py-2 text-xs font-medium">{tableParams ? `${(tableParams.Slope * 100).toFixed(2)}%` : '...'}</TableCell>
                <TableCell className="py-2 text-xs font-medium">{tableParams ? `${(tableParams.Curvature * 100).toFixed(2)}%` : '...'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardFooter>
    </Card>
  )
}
