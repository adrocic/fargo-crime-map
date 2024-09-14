// src/components/MyDatePicker.tsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type MyDatePickerProps = {
    onDateChange: (startDate: Date | null, endDate: Date | null) => void;
};

const MyDatePicker: React.FC<MyDatePickerProps> = ({ onDateChange }) => {
    const currentDateTime = new Date();
    const [selectedDateRange, setSelectedDateRange] = useState<[Date | null, Date | null]>([
        currentDateTime,
        currentDateTime,
    ]);

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setSelectedDateRange(dates);
        onDateChange(start, end);
    };

    return (
        <DatePicker
            selected={selectedDateRange[0]}
            onChange={handleDateChange}
            startDate={selectedDateRange[0]}
            endDate={selectedDateRange[1]}
            selectsRange
            withPortal
        />
    );
};

export default MyDatePicker;
