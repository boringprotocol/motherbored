import { useState } from 'react';
import { useTheme } from "next-themes";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

const ThemeChanger = () => {
  const { setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState('light');

  const handleClick = () => {
    if (currentTheme === 'light') {
      setTheme('dark');
      setCurrentTheme('dark');
    } else {
      setTheme('light');
      setCurrentTheme('light');
    }
  }

  return (
    <div className='mt-8'>
      <button
        className='rounded-sm border border-gray-light dark:border-gray-dark text-center inline-flex items-center text-xs px-3 py-2 text-boring-black dark:text-boring-white hover:bg-gray-lightestest dark:hover:bg-gray-dark'
        onClick={handleClick}
      >
        {currentTheme === 'light' ? <IoSunnyOutline /> : <IoMoonOutline />}
      </button>
    </div>
  )
}
export default ThemeChanger;
