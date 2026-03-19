"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import { Expense } from "@/lib/types";
import { useMemo } from "react";

interface SpendingChartProps {
  expenses: Expense[];
}

export function SpendingChart({ expenses }: SpendingChartProps) {
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const dailyData = useMemo(() => {
    const map: Record<string, number> = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(date => map[date] = 0);
    expenses.forEach(e => {
      if (map[e.date] !== undefined) {
        map[e.date] += e.amount;
      }
    });

    return Object.entries(map).map(([date, amount]) => ({
      date: date.split('-').slice(2).join('/'),
      amount
    }));
  }, [expenses]);

  const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', '#1F8289', '#33BF72', '#145A5F', '#279055'];

  const CustomTooltipContent = (props: any) => {
    return (
      <ChartTooltipContent 
        {...props} 
        formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
      />
    );
  };

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
          <CardDescription>Spending distribution</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] sm:h-[300px]">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<CustomTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
             {categoryData.slice(0, 4).map((entry, index) => (
               <div key={entry.name} className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                 <span className="text-[10px] text-muted-foreground">{entry.name}</span>
               </div>
             ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Last 7 Days</CardTitle>
          <CardDescription>Daily trend in ₹</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] sm:h-[300px]">
          <ChartContainer config={{ amount: { label: "Spent (₹)", color: "var(--chart-1)" } }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide />
                <ChartTooltip content={<CustomTooltipContent />} />
                <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
