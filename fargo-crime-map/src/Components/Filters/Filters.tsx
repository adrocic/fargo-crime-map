import React from "react";
import {
    Box,
    FormControl,
    FormLabel,
    Switch,
    Heading,
    Text,
    Flex,
    useColorModeValue,
    Icon,
    Tooltip,
} from "@chakra-ui/react";
import { FaInfoCircle, FaCalendarAlt, FaFireAlt, FaMapMarkerAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FiltersProps {
    dateRange: [Date | null, Date | null];
    onDateRangeChange: (dates: [Date | null, Date | null]) => void;
    showHeatmap: boolean;
    onHeatmapChange: (show: boolean) => void;
}

const Filters: React.FC<FiltersProps> = ({ dateRange, onDateRangeChange, showHeatmap, onHeatmapChange }) => {
    const [startDate, endDate] = dateRange;
    const labelColor = useColorModeValue("gray.600", "gray.300");
    const inputBg = useColorModeValue("white", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const handleHeatmapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onHeatmapChange(e.target.checked);
    };

    return (
        <Box>
            <Flex align="center" justify="space-between" mb={4}>
                <Heading size="md" fontWeight="600">
                    Filters
                </Heading>
                <Tooltip label="Filter crime data by date and visualization type">
                    <span>
                        <Icon as={FaInfoCircle} color="blue.500" />
                    </span>
                </Tooltip>
            </Flex>

            <FormControl mb={5}>
                <Flex align="center" mb={2}>
                    <Icon as={FaCalendarAlt} color="blue.500" mr={2} />
                    <FormLabel htmlFor="date-range" margin={0} fontWeight="medium" color={labelColor}>
                        Date Range
                    </FormLabel>
                </Flex>
                <Box border="1px solid" borderColor={borderColor} borderRadius="md" p={1} background={inputBg}>
                    <DatePicker
                        selected={startDate}
                        onChange={onDateRangeChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        className="date-picker-input"
                        wrapperClassName="date-picker-wrapper"
                        dateFormat="MM/dd/yyyy"
                        placeholderText="Select date range"
                    />
                </Box>
                <Text mt={1} fontSize="xs" color="gray.500">
                    Select start and end dates to filter crime data
                </Text>
            </FormControl>

            <FormControl display="flex" alignItems="center">
                <Flex align="center" width="100%" justify="space-between">
                    <Flex align="center">
                        {showHeatmap ? (
                            <Icon as={FaFireAlt} color="red.500" mr={2} />
                        ) : (
                            <Icon as={FaMapMarkerAlt} color="blue.500" mr={2} />
                        )}
                        <FormLabel htmlFor="heatmap-toggle" mb="0" fontWeight="medium" color={labelColor}>
                            {showHeatmap ? "Heatmap View" : "Marker View"}
                        </FormLabel>
                    </Flex>
                    <Switch
                        id="heatmap-toggle"
                        isChecked={showHeatmap}
                        onChange={handleHeatmapChange}
                        colorScheme="blue"
                    />
                </Flex>
            </FormControl>

            <Text mt={2} fontSize="xs" color="gray.500">
                Toggle between heatmap and individual markers
            </Text>
        </Box>
    );
};

export default Filters;
