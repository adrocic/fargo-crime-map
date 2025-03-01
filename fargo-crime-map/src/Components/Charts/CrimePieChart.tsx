import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PieChartData {
    label: string;
    value: number;
}

interface CrimePieChartProps {
    data: PieChartData[];
}

const CrimePieChart: React.FC<CrimePieChartProps> = ({ data }) => {
    // Limit to top 5 for pie chart readability, group others
    const MAX_SEGMENTS = 5;
    const pieData = [...data]
        .sort((a, b) => b.value - a.value)
        .reduce((acc, curr, index) => {
            if (index < MAX_SEGMENTS) {
                acc.push(curr);
            } else {
                const otherSegment = acc.find((segment) => segment.label === "Other");
                if (otherSegment) {
                    otherSegment.value += curr.value;
                } else {
                    acc.push({ label: "Other", value: curr.value });
                }
            }
            return acc;
        }, [] as PieChartData[]);

    // Color palette that works well in light and dark modes
    const COLORS = ["#3182CE", "#68D391", "#F6AD55", "#9F7AEA", "#E53E3E", "#718096"];

    const textColor = useColorModeValue("#1A202C", "#EDEDEE"); // gray.800 or white

    return (
        <Box width="100%" height="100%">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        dataKey="value"
                        nameKey="label"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number, name: string) => [value, name]}
                        contentStyle={{
                            backgroundColor: useColorModeValue("#FFFFFF", "#2D3748"),
                            borderColor: useColorModeValue("#E2E8F0", "#4A5568"),
                            color: textColor,
                        }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default CrimePieChart;
