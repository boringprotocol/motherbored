import { CheckIcon } from '@heroicons/react/24/solid'

const steps = [
  { id: '01', name: 'Peer Creation', href: '#', status: 'complete' },
  { id: '02', name: 'Network Activation', href: '#', status: 'current' },
  { id: '03', name: 'Configuration', href: '#', status: 'upcoming' },
]

export default function ProviderPeerSetupProgress() {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="divide-y divide-light-200 rounded-md border border-light-200 md:flex md:divide-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative md:flex md:flex-1">
            {step.status === 'complete' ? (
              <a href={step.href} className="group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-xs font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 group-hover:bg-primary-700">
                    <CheckIcon className="h-6 w-6 " aria-hidden="true" />
                  </span>
                  <span className="ml-4 text-xs font-medium text-dark-900">{step.name}</span>
                </span>
              </a>
            ) : step.status === 'current' ? (
              <a href={step.href} className="flex items-center px-6 py-4 text-xs font-medium" aria-current="step">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary-500">
                  <span className="text-primary-500">{step.id}</span>
                </span>
                <span className="ml-4 text-xs font-medium text-primary-500">{step.name}</span>
              </a>
            ) : (
              <a href={step.href} className="group flex items-center">
                <span className="flex items-center px-6 py-4 text-xs font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-light-300 group-hover:border-light-400">
                    <span className="text-light-500 group-hover:text-dark-900">{step.id}</span>
                  </span>
                  <span className="ml-4 text-xs font-medium text-light-500 group-hover:text-dark-900">{step.name}</span>
                </span>
              </a>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div className="absolute top-0 right-0 hidden h-full w-5 md:block" aria-hidden="true">
                  <svg
                    className="h-full w-full text-light-300"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>

    </nav>
  )
}
