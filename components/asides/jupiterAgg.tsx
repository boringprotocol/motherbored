const JupterAgg = () => {
    return (
        <>
            {/* jupiter agg */}
            <div className="sm:flex p-12 border-t border-gray-lightest dark:border-gray-dark">
                <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                    <img className="h-11 w-11 text-gray-300" src='/img/jupiter-aggregator.svg' width='28px' />
                </div>
                <div>
                    <h4 className="text-sm">Jupiter Aggregator</h4>
                    <p className="mt-1 text-xs">
                        Acquire $BOP
                    </p>
                </div>
            </div>
        </>
    );
}

export default JupterAgg;
