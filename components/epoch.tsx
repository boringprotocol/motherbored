import React, { useState, useEffect } from 'react';
import { getEpochsTime, getEpochsData } from '../lib/epochs';

const EpochDisplay: React.FC = () => {
    const epochsData = getEpochsData();
    const epochsTime = getEpochsTime();
    const now = new Date().getTime();

    const [currentEpochIndex, setCurrentEpochIndex] = useState(-1);
    const [nextEpochIndex, setNextEpochIndex] = useState(-1);

    useEffect(() => {
        let currentEpoch = -1;
        let nextEpoch = -1;
        for (let i = 0; i < epochsTime.length; i++) {
            if (epochsTime[i] >= now) {
                nextEpoch = i;
                break;
            }
            currentEpoch = i;
        }
        setCurrentEpochIndex(currentEpoch);
        setNextEpochIndex(nextEpoch);
    }, [epochsTime, now]);

    return (
        <div className="p-12 font-jetbrains bg-boring-white dark:bg-boring-black">
            <h1 className="mt-4 text-xs">boring-epochs</h1>
            <div>
                <div>
                    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                        {currentEpochIndex >= 0 && (
                            <>
                                <div className="overflow-hidden rounded-lg bg-boring-white dark:bg-boring-black white px-4 py-5 shadow sm:p-6">
                                    <dt className="truncate text-sm font-medium text-gray">Most Recent </dt>
                                    <dd className="mt-1 text-2xl uppercase text-boring-black dark:text-boring-white">
                                        {epochsData[currentEpochIndex].name} - {new Date(epochsTime[currentEpochIndex]).toLocaleDateString()}
                                    </dd>
                                </div>
                            </>
                        )}
                        {nextEpochIndex >= 0 && (
                            <>
                                <div className="overflow-hidden rounded-lg bg-boring-white dark:bg-boring-black white px-4 py-5 shadow dark:shadow-gray-dark dark:border-white sm:p-6">
                                    <dt className="truncate text-sm font-medium text-gray">Next</dt>
                                    <dd className="mt-1 text-2xl uppercase text-boring-black dark:text-boring-white">
                                        {epochsData[nextEpochIndex].name} - {new Date(epochsTime[nextEpochIndex]).toLocaleDateString()}
                                    </dd>
                                </div>
                            </>
                        )}
                    </dl>
                </div>
            </div>
            <h2 className="mt-8 mb-2 text-sm">All Epochs</h2>
            <ul className="text-xs border border-gray-lightest p-6">
                {epochsData.map((epoch, index) => {
                    const date = new Date(epochsTime[index]);
                    return (
                        <li key={index}>
                            {epoch.name}: {date.toLocaleDateString()}
                            {epochsTime[index] < now && ' \u2713'}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default EpochDisplay;
