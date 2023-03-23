import React from "react";

const Flag = ({ countryCode, ...rest }) => {
  const flagPath = `/img/flags/${countryCode.toLowerCase()}.svg`;

  return (
    <div className="text-primary">
      <object
        type="image/svg+xml"
        data={flagPath}
        aria-label={`Flag of ${countryCode}`}
        className="flag-image"
        style={{ fill: "none", stroke: "currentColor", strokeWidth: "1" }}
        {...rest}
      />
    </div>
  );
};

export default Flag;
