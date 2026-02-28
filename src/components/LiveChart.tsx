import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartData } from "@/types";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LiveChartProps {
  data: ChartData[];
}

export function LiveChart({ data }: LiveChartProps) {
  return (
    <Card className="flex flex-col h-125 bg-[#16181c] border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-500" />
          <h3 className="text-slate-200 font-medium text-sm">
            Real-time Performance Chart
          </h3>
        </div>
      </CardHeader>

      <CardContent className="flex-1 w-full pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#374151"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
              minTickGap={30}
            />
            <YAxis
              domain={["auto", "auto"]}
              stroke="#374151"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              orientation="right"
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
              labelStyle={{ color: "#f8fafc", fontSize: 12 }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPrice)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
