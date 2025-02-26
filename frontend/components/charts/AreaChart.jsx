"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { chartData } from "@/constants/constant";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
};

const timeRanges = [
    { label: "Last 3 months", value: "90d", days: 90 },
    { label: "Last 30 days", value: "30d", days: 30 },
    { label: "Last 7 days", value: "7d", days: 7 },
];

const DashboardAreaChart = () => {
    const [timeRange, setTimeRange] = React.useState(timeRanges[0].value);

    const getFilteredData = React.useMemo(() => {
        const selectedRange = timeRanges.find((range) => range.value === timeRange);
        if (!selectedRange) return chartData;

        const referenceDate = new Date("2024-06-30");
        const startDate = new Date(referenceDate);
        startDate.setDate(referenceDate.getDate() - selectedRange.days);

        return chartData.filter((item) => new Date(item.date) >= startDate);
    }, [timeRange]);

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Expense - Overview</CardTitle>
                    <CardDescription>
                        Track your spending habits and see trends over the selected time frame.
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a time range"
                    >
                        <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        {timeRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value} className="rounded-lg">
                                {range.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={getFilteredData}>
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="var(--color-desktop)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default DashboardAreaChart;