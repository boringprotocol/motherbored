import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';
import React, { useState, useEffect } from 'react';

interface CoinData {
    sol: {
        usd: number,
        usd_market_cap: number,
        usd_24h_vol: number,
        usd_24h_change: number
    },
    bop: {
        usd: number,
        usd_market_cap: number,
        usd_24h_vol: number,
        usd_24h_change: number
    },
    btc: {
        usd: number,
        usd_market_cap: number,
        usd_24h_vol: number,
        usd_24h_change: number
    }
}

const Prices: React.FC = () => {
    //    const [priceData, setPriceData] = useState<CoinData>({});
    // const [priceData, setPriceData] = useState<CoinData | {}>({});
    const [priceData, setPriceData] = useState<CoinData>({
        bop: {
            usd: 0,
            usd_market_cap: 0,
            usd_24h_vol: 0,
            usd_24h_change: 0,
        },
        sol: {
            usd: 0,
            usd_market_cap: 0,
            usd_24h_vol: 0,
            usd_24h_change: 0,
        },
        btc: {
            usd: 0,
            usd_market_cap: 0,
            usd_24h_vol: 0,
            usd_24h_change: 0,
        },
    });
    console.log(priceData);


    useEffect(() => {
        async function fetchData() {
            const res = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=boring-protocol%2Csolana%2Cbitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true'
            );
            const data = await res.json();
            setPriceData({
                bop: {
                    usd: data['boring-protocol'].usd,
                    usd_market_cap: data['boring-protocol'].usd_market_cap,
                    usd_24h_vol: data['boring-protocol'].usd_24h_vol,
                    usd_24h_change: data['boring-protocol'].usd_24h_change,
                },
                sol: {
                    usd: data.solana.usd,
                    usd_market_cap: data.solana.usd_market_cap,
                    usd_24h_vol: data.solana.usd_24h_vol,
                    usd_24h_change: data.solana.usd_24h_change,
                },
                btc: {
                    usd: data.bitcoin.usd,
                    usd_market_cap: data.bitcoin.usd_market_cap,
                    usd_24h_vol: data.bitcoin.usd_24h_vol,
                    usd_24h_change: data.bitcoin.usd_24h_change,
                },
            });
            console.log(data);
        }

        fetchData();
    }, []);

    return (
        <div>
            {/* <p>BOP price: ${priceData.bop?.usd}</p>
            <p>BOP market cap: ${priceData.bop?.usd_market_cap}</p>
            <p>BOP 24hr volume: ${priceData.bop?.usd_24h_vol}</p>
            <p>BOP 24hr change: ${priceData.bop?.usd_24h_change}</p>

            <p>SOL price: ${priceData.sol?.usd}</p>
            <p>SOL market cap: ${priceData.sol?.usd_market_cap}</p>
            <p>SOL 24hr volume: ${priceData.sol?.usd_24h_vol}</p>
            <p>SOL 24hr change: ${priceData.sol?.usd_24h_change}</p>

            <p>BTC price: ${priceData.btc?.usd}</p>
            <p>BTC market cap: ${priceData.btc?.usd_market_cap}</p>
            <p>BTC 24hr volume: ${priceData.btc?.usd_24h_vol}</p>
            <p>BTC 24hr change: ${priceData.btc?.usd_24h_change}</p> */}


            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                <div
                    className="relative overflow-hidden rounded-lg px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
                >
                    <dt>

                        <p className="truncate text-sm font-medium">$BOP</p>
                    </dt>
                    <dd className="items-baseline pb-6 sm:pb-7">
                        <p className="text-2xl font-semibold ">${priceData.bop?.usd}</p>
                        <p
                            className={`flex items-baseline text-xs font-semibold ${priceData.bop?.usd_24h_change >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                                }`}
                        >
                            {priceData.bop?.usd_24h_change >= 0 ? (
                                <ArrowUpIcon className="h-3 w-3 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                            ) : (
                                <ArrowDownIcon className="h-3 w-3 flex-shrink-0 self-center text-boring-red" aria-hidden="true" />
                            )}
                            {priceData.bop?.usd_24h_change.toFixed(2)} %
                        </p>
                        <div className="absolute inset-x-0 bottom-0 px-4 py-4 sm:px-6">
                            <div className="text-xs">
                                Market Cap: ${priceData.bop?.usd_market_cap}<br />
                                24/hr Volume: ${priceData.bop?.usd_24h_vol}
                            </div>
                        </div>
                    </dd>
                </div>


                <div
                    className="relative overflow-hidden rounded-lg px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
                >
                    <dt>

                        <p className="truncate text-sm font-medium ">$SOL</p>
                    </dt>
                    <dd className="items-baseline pb-6 sm:pb-7">
                        <p className="text-2xl font-semibold ">${priceData.sol?.usd}</p>
                        <p
                            className={`flex items-baseline text-xs font-semibold ${priceData.sol?.usd_24h_change >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                                }`}
                        >
                            {priceData.sol?.usd_24h_change >= 0 ? (
                                <ArrowUpIcon className="h-3 w-3 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                            ) : (
                                <ArrowDownIcon className="h-3 w-3 flex-shrink-0 self-center text-boring-red" aria-hidden="true" />
                            )}
                            {priceData.sol?.usd_24h_change.toFixed(2)} %
                        </p>
                        <div className="absolute inset-x-0 bottom-0 px-4 py-4 sm:px-6">
                            <div className="text-xs">
                                Market Cap: ${priceData.sol?.usd_market_cap}<br />
                                24/hr Volume: ${priceData.sol?.usd_24h_vol}
                            </div>
                        </div>
                    </dd>
                </div>


                <div
                    className="relative overflow-hidden rounded-lg px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
                >
                    <dt>

                        <p className="truncate text-sm font-medium text-gray-500">$BTC</p>
                    </dt>
                    <dd className="items-baseline pb-6 sm:pb-7">
                        <p className="text-2xl font-semibold ">${priceData.btc?.usd}</p>
                        <p
                            className={`flex items-baseline text-xs font-semibold ${priceData.btc?.usd_24h_change >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                                }`}
                        >
                            {priceData.btc?.usd_24h_change >= 0 ? (
                                <ArrowUpIcon className="h-3 w-3 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                            ) : (
                                <ArrowDownIcon className="h-3 w-3 flex-shrink-0 self-center text-boring-red" aria-hidden="true" />
                            )}
                            {priceData.btc?.usd_24h_change.toFixed(2)} %
                        </p>
                        <div className="absolute inset-x-0 bottom-0 px-4 py-4 sm:px-6">
                            <div className="text-xs">
                                Market Cap: ${priceData.btc?.usd_market_cap}<br />
                                24/hr Volume: ${priceData.btc?.usd_24h_vol}
                            </div>
                        </div>
                    </dd>
                </div>

            </dl>

        </div>
    );
};

export default Prices;
