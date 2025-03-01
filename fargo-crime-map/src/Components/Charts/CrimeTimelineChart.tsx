import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TimelineData {
    date: string;
    count: number;
}

interface CrimeTimelineChartProps {
    data: TimelineData[];
}

const CrimeTimelineChart: React.FC<CrimeTimelineChartProps> = ({ data }) => {
    const lineColor = useColorModeValue("#3182CE", "#63B3ED"); // blue.500 or blue.300
    const textColor = useColorModeValue("#1A202C", "#EDEDEE"); // gray.800 or white
    const gridColor = useColorModeValue("#E2E8F0", "#2D3748"); // gray.200 or gray.600

    // Format the data to ensure readable dates
    const formattedData = data.map((item) => ({
        ...item,
        // Format the date for display if needed
        formattedDate: new Date(item.date).toLocaleDateString(),
    }));

    return (
        <Box width="100%" height="100%">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={formattedData}
                    margin={{
                        top: 5,
                        right: 20,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="formattedDate" tick={{ fill: textColor }} style={{ fontSize: "12px" }} />
                    <YAxis tick={{ fill: textColor }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: useColorModeValue("#FFFFFF", "#2D3748"),
                            borderColor: useColorModeValue("#E2E8F0", "#4A5568"),
                            color: textColor,
                        }}
                        formatter={(value: number) => [`${value} incidents`, "Count"]}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke={lineColor}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default CrimeTimelineChart;
