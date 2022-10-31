import { useSession } from "next-auth/react"
import LayoutAuthenticated from "../components/layoutAuthenticated"
import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'

const licenses = [
  {
    name: 'MBV1',
    multiplier: 'x1.5',
    quantity: '3',
  },
  {
    name: 'MBV2',
    multiplier: 'x1.25',
    quantity: '1',
  },
  {
    name: 'MBVX',
    multiplier: 'x0',
    quantity: '0',
  },
]

export default function SandBox() {
  const [selected, setSelected] = useState(licenses[0])

  return (
    <div className="font-jetbrains text-xs w-full px-4 py-16">
      <div className="mx-auto w-full max-w-md">
        <h2 className="mb-4">Choose license</h2>
        <RadioGroup value={selected} onChange={setSelected}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-2">
            {licenses.map((plan) => (
              <RadioGroup.Option
                key={plan.name}
                value={plan}
                className={({ active, checked }) =>
                  `${
                    active
                      ? 'ring-2 ring-blue ring-opacity-60 '
                      : ''
                  }
                  ${
                    checked ? 'bg-gray-dark border-gray-300 bg-opacity-75 text-white' : 'bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-xs">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {plan.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? 'text-sky-100' : 'text-gray-500'
                            }`}
                          >
                            <span>
                              {plan.multiplier} Multiplier
                            </span>{' '}
                            <span aria-hidden="true">&middot;</span>{' '}
                            <span>{plan.quantity} Available</span>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
