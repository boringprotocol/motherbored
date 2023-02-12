const tabs = [
    { name: 'Nostr', href: '#', current: false },
    { name: 'User', href: '#', current: false },
    { name: '#hashtag', href: '#', current: false },
    { name: 'DMs', href: '#', count: '52', current: false },
]

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function NostrNav() {
    const currentTab = tabs.find((tab) => tab.current);
    return (
        <div>
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    defaultValue={currentTab ? currentTab.name : ''}
                >
                    {tabs.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                    ))}
                </select>
            </div>
            <div className="hidden sm:block">
                <div className="border-b border-gray-200 px-12">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            tab && (
                                <a
                                    key={tab.name}
                                    href="#"
                                    className={classNames(
                                        tab.current
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                                        'whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm'
                                    )}
                                    aria-current={tab.current ? 'page' : undefined}
                                >
                                    {tab.name}
                                    {tab.count ? (
                                        <span
                                            className={classNames(
                                                tab.current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                                                'hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'
                                            )}
                                        >
                                            {tab.count}
                                        </span>
                                    ) : null}
                                </a>
                            )
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}
