import React, { useState } from 'react';

interface DateRangePickerProps {
  onStartDateChange: (startDate: string) => void;
  onEndDateChange: (endDate: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onStartDateChange,
  onEndDateChange,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (event: { target: { value: string } }) => {
    setStartDate(event.target.value);
    onStartDateChange(event.target.value);
  };

  const handleEndDateChange = (event: { target: { value: string } }) => {
    setEndDate(event.target.value);
    onEndDateChange(event.target.value);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Start Date:</span>
          </label>
          <input
            id="start-date"
            type="datetime-local"
            value={startDate}
            onChange={handleStartDateChange}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">End Date:</span>
          </label>
          <input
            id="end-date"
            type="datetime-local"
            value={endDate}
            min={startDate} // Set the min attribute to the value of startDate
            onChange={handleEndDateChange}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
      </div>

    </div>
  );
};

export default DateRangePicker;
