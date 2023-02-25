import { CheckCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface PeerInsightProps {
    peersLength: number;
}

const PeerInsight: React.FC<PeerInsightProps> = ({ peersLength }) => {
    let content;
    if (peersLength === 0) {
        content = (
            <div className="p-12">
                You don't have any peers setup yet. If you want to mine, setup up a
                provider. If you want to browser the internet through a our dVPN choose a consumer.

            </div>
        );
    } else if (peersLength === 1) {
        content = <div className="p-12">You have one peer</div>;
    } else if (peersLength >= 2 && peersLength < 5) {
        content = (
            <div className="p-12">
                You have {peersLength} peers. nice!!!{' '}
            </div>
        );
    } else if (peersLength >= 5) {
        content = (
            <div className="px-4 sm:px-6 md:px-12 pb-4">
                <div className="rounded-md bg-gray-50 p-4 border border-gray-light dark:border-gray-dark">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <CheckCircleIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-800">
                                Whoa dang!
                            </h3>
                            <div className="mt-2 text-xs text-gray-700">
                                <p>
                                    You have many peers bro! Maybe you want to try your hand and
                                    running some of the experimental peer types?
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{content}</>;
};

export default PeerInsight;
