import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type MyDatePickerProps = {
    onDateChange: (startDate: Date | null, endDate: Date | null) => void;
};

const MyDatePicker: React.FC<MyDatePickerProps> = ({ onDateChange }) => {
    const [selectedDateRange, setSelectedDateRange] = useState<[Date | null, Date | null]>([null, null]);

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;

        if (start) {
            const maxEndDate = new Date(start);
            maxEndDate.setDate(start.getDate() + 3);

            if (end && end > maxEndDate) {
                dates[1] = maxEndDate;
            }
        }

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
            minDate={new Date()}
            maxDate={selectedDateRange[0] ? new Date(selectedDateRange[0].getTime() + 3 * 24 * 60 * 60 * 1000) : null}
            withPortal
        />
    );
};

export default MyDatePicker;
