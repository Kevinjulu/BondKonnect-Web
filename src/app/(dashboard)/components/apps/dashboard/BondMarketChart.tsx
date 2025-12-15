"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/app/components/ui/chart";
// import { TrendingUp } from "lucide-react";
import { getBondMarketPerformance } from "@/app/lib/actions/api.actions";

export const description = "A multiple line chart";

const chartConfig = {
  oneYr: {
    label: "1 Year Bond",
    color: "hsl(var(--chart-1))",
  },
  inflation: {
    label: "Inflation",
    color: "hsl(var(--chart-2))",
  },
  cbrRate: {
    label: "CBR Rate",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function BondMarketChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getBondMarketPerformance();
      if (response?.data) {
        const { oneYr, inflation, cbrRate } = response.data;

        // Transform data to match the chart format
        const transformedData = oneYr.map((item: { x: string; y: string; }, index: string | number) => ({
          date: item.x,
          oneYr: parseFloat(item.y),
          inflation: parseFloat(inflation[index]?.y || 0) * 100, // Multiply inflation by 100
          cbrRate: parseFloat(cbrRate[index]?.y || 0)* 100,
        }));
        console.log(" BondMarketChart",transformedData);

        setChartData(transformedData);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="col-span-12">
      <CardHeader>
        <CardTitle>Bond Market Performance Vs Economic Indicators</CardTitle>
        <CardDescription>Kenya</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.split(" ")[0]} // Format date
            />  
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="oneYr"
              type="monotone"
              stroke="var(--color-oneYr)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="inflation"
              type="monotone"
              stroke="var(--color-inflation)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="cbrRate"
              type="monotone"
              stroke="var(--color-cbrRate)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
