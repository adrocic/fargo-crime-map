import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const MyDatePicker = () => {
  // Set default start and end dates to today
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const handleStartDateChange = (date: React.SetStateAction<Date>) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date: React.SetStateAction<Date>) => {
    setSelectedEndDate(date);
  };

  const handleFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (selectedStartDate && selectedEndDate) {
      const formattedStartDate = format(selectedStartDate, "M/d/yyyy");
      const formattedEndDate = format(selectedEndDate, "M/d/yyyy");
      console.log("Start Date:", formattedStartDate);
      console.log("End Date:", formattedEndDate);
    } else {
      console.log("Please select both start and end dates.");
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="start-date">
          Start Date:
          <DatePicker
            id="start-date"
            selected={selectedStartDate}
            onChange={(date) => date && handleStartDateChange(date)}
            dateFormat="MM/dd/yyyy"
          />
        </label>
      </div>
      <div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="end-date">
          End Date:
          <DatePicker
            id="end-date"
            selected={selectedEndDate}
            onChange={(date) => date && handleEndDateChange(date)}
            dateFormat="MM/dd/yyyy"
          />
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyDatePicker;
