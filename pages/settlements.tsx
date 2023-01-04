import LayoutAuthenticated from "../components/layoutAuthenticated"
import React from 'react'



// import ToolTipSteps from "../components/toolTipSteps"

const people = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    department: 'Optimization',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  // More people...
]



export default function SettlementsPage() {

  return (
    <LayoutAuthenticated>

      <div className="px-4 sm:px-6 lg:px-8">
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-lightest dark:divide-gray-dark">
                <thead className="bg-boring-white dark:bg-boring-black ">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-boring-black dark:text-boring-white-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-boring-black dark:text-boring-white-900">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-boring-black dark:text-boring-white-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-boring-black dark:text-boring-white-900">
                      Role
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-boring-white dark:bg-boring-black">
                  {people.map((person) => (
                    <tr key={person.email}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-full" src={person.image} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-boring-black dark:text-boring-white">{person.name}</div>
                            <div className="text-boring-black dark:text-boring-white">{person.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-boring-black dark:text-boring-white-500">
                        <div className="text-boring-black dark:text-boring-white">{person.title}</div>
                        <div className="text-boring-black dark:text-boring-white">{person.department}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-boring-black dark:text-boring-white">
                        <span className="inline-flex rounded-full bg-green px-2 text-xs font-semibold leading-5 text-white">
                          Active
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-boring-black dark:text-boring-white">{person.role}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {person.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </div>

    {/* <ToolTipSteps /> */}  
      
    </LayoutAuthenticated>
  )
}

