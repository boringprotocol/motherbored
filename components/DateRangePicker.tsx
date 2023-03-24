import React, { useState } from 'react';

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <label htmlFor="start-date" className="font-semibold">
          Start Date:
        </label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="end-date" className="font-semibold">
          End Date:
        </label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="input input-bordered w-full"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
