import { useState, useEffect } from 'react'
import { useTheme } from "next-themes"
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5"

const ThemeChanger = () => {

  // const [playSound] = typeof window !== 'undefined' ? useSound('/sounds/switch-off.mp3') : [null];
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string>(theme || 'light');

  useEffect(() => {
    setCurrentTheme(theme || 'light');
  }, [theme]);

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme, setTheme]);


  const handleClick = () => {
    if (currentTheme === 'light') {
      setCurrentTheme('dark');
    } else {
      setCurrentTheme('light');
    }
  }

  return (
    <div className=''>
      <button
        className='rounded-sm border border-gray-light dark:border-gray-dark text-center inline-flex items-center text-xs px-4 py-3 text-boring-black dark:text-boring-white hover:bg-gray-lightest dark:hover:bg-gray-dark'
        onClick={handleClick}
      >
        {currentTheme === 'light' ? <IoSunnyOutline className='h-4' /> : <IoMoonOutline className='h-4' />}
      </button>
    </div>
  )
}
export default ThemeChanger;
