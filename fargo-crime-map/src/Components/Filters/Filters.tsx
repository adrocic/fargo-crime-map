// src/components/Filters.tsx
import React, { useState, forwardRef } from "react";
import { Box, FormControl, FormLabel, Input, Button, VStack, HStack, Text } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { differenceInCalendarDays, addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

interface Filters {
    startDate: Date | null;
    endDate: Date | null;
    // callType?: string;
}

type FiltersProps = {
    onFilterChange: React.Dispatch<React.SetStateAction<Filters>>;
};

const CustomInput = forwardRef<HTMLInputElement, any>((props, ref) => <Input ref={ref} size="sm" {...props} />);

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
    const today = new Date();
    const yesterday = addDays(today, -1);

    // const [callType, setCallType] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | null>(yesterday);
    const [endDate, setEndDate] = useState<Date | null>(today);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleFilter = () => {
        setErrorMessage(""); // Reset error message

        if (startDate && endDate) {
            if (startDate > endDate) {
                setErrorMessage("Start date cannot be after end date.");
                return;
            }

            const dayDifference = differenceInCalendarDays(endDate, startDate) + 1;
            if (dayDifference > 2) {
                setErrorMessage("Date range must not exceed 2 days.");
                return;
            }
        }

        const filters: Filters = {
            startDate,
            endDate,
            // callType,
        };
        onFilterChange(filters);
    };

    const isDateRangeValid =
        startDate && endDate && startDate <= endDate && differenceInCalendarDays(endDate, startDate) + 1 <= 2;

    const maxEndDate = startDate ? addDays(startDate, 1) : today;

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
                {/* Uncomment if using callType */}
                {/* <FormControl id="call-type">
          <FormLabel>Call Type</FormLabel>
          <Select
            placeholder="Select call type"
            value={callType}
            onChange={(e) => setCallType(e.target.value)}
          >
            <option value="17 Falls">17 Falls</option>
            <option value="Accident - Injury">Accident - Injury</option>
            <option value="09 Cardiac/Respiratory arrest">
              09 Cardiac/Respiratory arrest
            </option>
          </Select>
        </FormControl> */}

                <FormControl id="date-range">
                    <FormLabel>Date Range</FormLabel>
                    <VStack spacing={2} align="stretch">
                        <FormControl id="start-date">
                            <HStack spacing={2}>
                                <Text fontSize="sm">Start Date:</Text>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    maxDate={endDate || today}
                                    customInput={<CustomInput />}
                                    placeholderText="Select start date"
                                />
                            </HStack>
                        </FormControl>
                        <FormControl id="end-date">
                            <HStack spacing={2}>
                                <Text fontSize="sm">End Date:</Text>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    minDate={startDate}
                                    maxDate={maxEndDate}
                                    customInput={<CustomInput />}
                                    placeholderText="Select end date"
                                />
                            </HStack>
                        </FormControl>
                    </VStack>
                </FormControl>

                {errorMessage && (
                    <Text color="red.500" fontSize="sm" textAlign="center">
                        {errorMessage}
                    </Text>
                )}

                <Button colorScheme="blue" onClick={handleFilter} width="full" isDisabled={!isDateRangeValid}>
                    Apply Filters
                </Button>
            </VStack>
        </Box>
    );
};

export default Filters;
