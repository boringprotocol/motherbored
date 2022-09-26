import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { Bars3BottomLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Header from './header'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Switch } from '@headlessui/react'
import Waiting from './art/waiting'

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="font-jetbrains text-xs">
      {/* The current theme is: <span className="capitalize">{theme}</span><br /><br /> */}
      <button className='p-1 mr-3 bg-black dark:bg-boring-black text-boring-white dark:text-boring-white' onClick={() => setTheme('light')}>Light Mode</button>
      <button className='p-1 bg-white text-black' onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  )
}

const userNavigation = [
  { name: 'Your Account', href: '/brng' },
  { name: 'Sign out', href: '#' },
  { name: 'Add Peer', href: '/newpeer' },
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [enabled, setEnabled] = useState(false)


  return (

    <>
      <div className="flex items-center justify-center h-screen">
        <div className="">
          <div className='font-jetbrains text-sm'>
            <div className='p-2'>A Private Path</div>
            <Waiting />
          </div>
        <div className=''>
          <div className='font-jetbrains text-center text-sm'>
            <Header />
          </div>
        </div>
      </div>
    </div>
    </>




  );
}
