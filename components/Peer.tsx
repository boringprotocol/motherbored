import React from 'react'
import Router from 'next/router'
import { IoLaptopOutline, IoWifiOutline, IoServerOutline, IoCloudOutline, IoPricetagOutline } from 'react-icons/io5'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

import faker from "faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      display: false,
    },
    title: {
      display: false,
    },
  },
  axisX: {
    gridThickness: 0,
    tickLength: 0,
    lineThickness: 0,
  },
  scales: {
    y: {
      grid: {
        drawBorder: false,
        display: false

      },
      ticks: {
        display: false
      }
    },
    x: {
      grid: {
        drawBorder: false,
        display: false
      },
      ticks: {
        display: false
      }
    }
  }
};

const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 50 })),
      borderColor: 'colors.white[600]',
      borderWidth: .1,
      backgroundColor: 'colors.zinc[200]',
    },
  ],
};


export type PeerProps = {
  id: string;
  name: string | null;
  setupkey: string | null;
  kind: string | null;
  provider_kind: string | null;
  provider_platform: string | null;
  consumer_platform: string | null;
  target: string | null;
  pubkey: string | null;
  label: string | null;
  ssid: string | null;
  country_code: string | null;
  wifi_preference: string | null;
  wpa_passphrase: string | null;
  channel: string | null;
};


const Peer: React.FC<{ peer: PeerProps }> = ({ peer }) => {

  // 
  let providerActive = false
  if (peer.pubkey != null) {
    providerActive = true
  }

  // Sorting by peer kind (provider or consumer)
  let isProvider = false
  if (peer.kind == "provider") {
    isProvider = true
  }

  let isConsumer = false
  if (peer.kind == "consumer") {
    isConsumer = true
  }

  // Sorting by provider_kind (local or cloud)
  let isCloudProvider = false
  if (peer.provider_kind == "cloud") {
    isCloudProvider = true
  }

  let isLocalProvider = false
  if (peer.provider_kind == "local") {
    isLocalProvider = true
  }

  return (
    <div
      className='card card-bordered cursor-pointer shadow-md  hover:shadow-lg active:shadow-md bg-base-100'
      onClick={() => Router.push("/p/[id]", `/p/${peer.id}`)}
    >
      <div className="card-body">
        <h2 className='text-lg md:text-xl lg:text-2xl px-4 mt-4'>{peer.name}</h2>
        <p className="inline-flex items-center font-jetbrains px-4 text-xs text-gray-500 capitalize">
          {isConsumer && (<IoLaptopOutline className="float-left mr-2" />)}
          {isCloudProvider && (<IoCloudOutline className="float-left mr-2" />)}
          {isLocalProvider && (<IoServerOutline className="float-left mr-2" />)}
          <span className="capitalize">{peer.provider_kind} {peer.kind}</span>
        </p>
        <div className=' w-full h-12 top-0 left-0 z-50 flex items-center justify-center'>
          <div className="">
            {/* <Line options={options} data={data} /> */}
          </div>
        </div>
        <div className='pt-4'>
          <span className="inline-block align-bottom text-xs mt-6 p-4">
            <IoPricetagOutline className="float-left mr-2" /> {peer.label}
          </span>
          <span className="inline-block align-bottom text-xs mt-6 p-4 float-right">
            {isConsumer && (<IoWifiOutline className="mr-2" />)}
            {isProvider && isLocalProvider && (<IoWifiOutline className="float-left mr-2" />)}
            {isConsumer && (peer.ssid)}
            {isLocalProvider && (peer.ssid)}
          </span>
        </div>
      </div>
    </div>

  );
};

export default Peer;
