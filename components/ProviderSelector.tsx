import React, { useState } from 'react';
import CountryCodes from '../data/country_codes';
import ProviderCommandPalette from './ProviderCommandPalette';

function ProviderSelector() {
  const [showSearch, setShowSearch] = useState(false);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    // handle country code selection here
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    // handle search input change here
  };

  const handleToggleChange = (e) => {
    setShowSearch(e.target.checked);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="boring-network">
          Relay / Hop
        </label>
        <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="boring-network" defaultValue="boring">
          <option value="boring" selected>Boring Network</option>
          <option value="dank-earth" disabled>Dank Earth</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="country-selector">
          Country / Region
        </label>
        <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="country-selector" onChange={handleCountryChange}>
          <option value="" disabled selected>Choose a country...</option>
          {CountryCodes.map((country) => (
            <option key={country.alpha2} value={country.alpha2}>{country.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">



        <div className="flex items-center mb-2">
          <label className="block text-gray-700 font-bold mr-2" htmlFor="search-toggle">
            Choose Provider
          </label>
          <label className="toggle-switch">
            <input type="checkbox" id="search-toggle" onChange={handleToggleChange} />
            <span className="toggle-switch-slider"></span>
          </label>
        </div>
        {showSearch && (
          <div className="mb-4">
            <ProviderCommandPalette />
            {/* <label className="block text-gray-700 font-bold mb-2" htmlFor="search-input">
              Search
            </label>
            <input className="appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="search-input" type="text" placeholder="Search..." onChange={handleSearchChange} /> */}
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Don't change peers
        </label>
        <label className="toggle-switch">
          <input type="checkbox" onChange={handleToggleChange} />
          <span className="toggle-switch-slider"></span>
        </label>
      </div>
    </div>
  );
}

export default ProviderSelector;
