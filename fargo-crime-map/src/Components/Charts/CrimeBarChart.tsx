import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface BarChartData {
    category: string;
    count: number;
}

interface CrimeBarChartProps {
    data: BarChartData[];
}

const CrimeBarChart: React.FC<CrimeBarChartProps> = ({ data }) => {
    const barColor = useColorModeValue("#3182CE", "#63B3ED"); // blue.500 or blue.300
    const textColor = useColorModeValue("#1A202C", "#EDEDEE"); // gray.800 or white
    const gridColor = useColorModeValue("#E2E8F0", "#2D3748"); // gray.200 or gray.600

    // Truncate long category names
    const processedData = data.map((item) => ({
        ...item,
        displayCategory: item.category.length > 15 ? `${item.category.substring(0, 15)}...` : item.category,
    }));

    return (
        <Box width="100%" height="100%">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal stroke={gridColor} />
                    <XAxis type="number" tick={{ fill: textColor }} />
                    <YAxis
                        dataKey="displayCategory"
                        type="category"
                        tick={{ fill: textColor }}
                        width={100}
                        style={{ fontSize: "12px" }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: useColorModeValue("#FFFFFF", "#2D3748"),
                            borderColor: useColorModeValue("#E2E8F0", "#4A5568"),
                            color: textColor,
                        }}
                        formatter={(value: number, name: string, props: any) => {
                            // Show the full category name in the tooltip
                            const fullCategory = data.find((d) => d.category === props.payload.category)?.category;
                            return [`${value} incidents`, fullCategory];
                        }}
                        labelFormatter={() => "Count"}
                    />
                    <Bar dataKey="count" fill={barColor} radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default CrimeBarChart;
