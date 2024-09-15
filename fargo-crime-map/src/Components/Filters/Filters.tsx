// src/components/Filters.tsx
import React, { useState } from "react";
import { Box, FormControl, FormLabel, Select, Input, Button, VStack, HStack, Text } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type FiltersProps = {
    onFilterChange: (filters: any) => void;
};

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
    // const [callType, setCallType] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());

    const handleFilter = () => {
        const filters = {
            // callType,
            startDate,
            endDate,
        };
        onFilterChange(filters);
    };

    return (
        <Box
            position="absolute"
            top={4}
            left={4}
            zIndex={1000}
            backgroundColor="white"
            p={4}
            borderRadius="md"
            boxShadow="md"
            width="250px"
        >
            <VStack spacing={4} align="stretch">
                <FormControl id="call-type">
                    <FormLabel>Call Type</FormLabel>
                    {/* <Select
                        placeholder="Select call type"
                        value={''}
                        onChange={(e) => setCallType(e.target.value)}
                    >
                        <option value="17 Falls">17 Falls</option>
                        <option value="Accident - Injury">Accident - Injury</option>
                        <option value="09 Cardiac/Respiratory arrest">09 Cardiac/Respiratory arrest</option>
                    </Select> */}
                </FormControl>

                <FormControl id="date-range">
                    <FormLabel>Date Range</FormLabel>
                    <VStack spacing={2} align="stretch">
                        <HStack spacing={2}>
                            <Text fontSize="sm">Start Date:</Text>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date as Date)}
                                maxDate={endDate || new Date()}
                                customInput={<Input size="sm" />}
                                placeholderText="Select start date"
                            />
                        </HStack>
                        <HStack spacing={2}>
                            <Text fontSize="sm">End Date:</Text>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date as Date)}
                                minDate={startDate}
                                maxDate={new Date()}
                                customInput={<Input size="sm" />}
                                placeholderText="Select end date"
                            />
                        </HStack>
                    </VStack>
                </FormControl>

                <Button colorScheme="blue" onClick={handleFilter} width="full">
                    Apply Filters
                </Button>
            </VStack>
        </Box>
    );
};

export default Filters;
