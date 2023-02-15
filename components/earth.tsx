import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import worldMap from '@d3/world-map';

interface Props { }

const WorldMap: React.FC<Props> = () => {
  const [rotate, setRotate] = useState([110, -40]);
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    fetch('https://unpkg.com/world-atlas@1/world/110m.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          return response.json();
        }
      })
      .then(data => {
        setMapData(feature(data, data.objects.countries));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  if (!mapData) {
    return <div>Loading...</div>;
  }

  const projection = d3
    .geoAzimuthalEquidistant()
    .rotate(rotate)
    .fitSize([960, 500], mapData);

  return (
    <div>
      <h2>World Map with Azimuthal Equidistant Projection</h2>
      <select
        value={JSON.stringify(rotate)}
        onChange={event => setRotate(JSON.parse(event.target.value))}
      >
        <option value='[110, -40]'>U.S.-centric</option>
        <option value='[0, 0]'>Standard</option>
        <option value='[0, -90]'>North polar</option>
        <option value='[0, 90]'>South polar</option>
      </select>
      <svg width='960' height='500'>
        <path
          d={d3.geoPath().projection(projection)(mapData)}
          fill='#e5e5e5'
          stroke='#404040'
          strokeWidth='0.5'
        />
      </svg>
    </div>
  );
};

export default WorldMap;
