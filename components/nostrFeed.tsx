const people = [
    {
      name: 'Lindsay Walton',
      imageUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80',
    },
    {
        name: 'Courtney Henry',
        imageUrl:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80',
    },
    {
        name: 'Tom Cook',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiO',
    }
    // More people...
  ]
  const activityItems = [
    { id: 1, person: people[0], project: 'This shit is sick brah', commit: '2d89f0c8', environment: '#boredroom', time: '1m' },
    { id: 2, person: people[1], project: 'I love Boring Protocol', commit: '2d89f0c8', environment: '#boredroom', time: '7m' },
    { id: 3, person: people[2], project: 'If you want to rich. Buy $BOP now.', commit: '2d89f0c8', environment: '#boredroom', time: '1h' },
    { id: 4, person: people[0], project: 'Workcation', commit: '2d89f0c8', environment: '#boredroom', time: '2h' },
    { id: 5, person: people[1], project: 'Workcation', commit: '2d89f0c8', environment: '#boredroom', time: '9h' }
    // More items...
  ]

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}


const nostrFeed = () => {
    return (
        <>
          <div>
      <ul role="list" className="divide-y dark:divide-gray-dark divide-gray-lightest">
        {activityItems.map((activityItem) => (
          <li key={activityItem.id} className="py-4">
            <div className="flex space-x-3">
              <img className="h-6 w-6 rounded-full" src={activityItem.person.imageUrl} alt="" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-medium">{activityItem.person.name}</h3>
                  <p className="text-xs text-gray-500">{activityItem.time}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {activityItem.project} ({activityItem.commit}) in {activityItem.environment}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
        </>
    );
}

export default nostrFeed;
