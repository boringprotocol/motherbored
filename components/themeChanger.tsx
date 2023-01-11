import { useTheme } from "next-themes";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

// light mode / dark mode
const ThemeChanger = () => {
    const { setTheme } = useTheme()
  
    return (
      <div className='mt-12 border rounded-sm  border-gray dark:border-black'>
        <button className='text-center inline-flex items-center  text-xs bg-white px-3 py-2 text-boring-black hover:bg-gray-lightestest dark:hover:bg-gray-light border-r border-gray dark:border-black  w-1/2' onClick={() => setTheme('light')}><IoSunnyOutline className="float-left mr-2" /> Light Mode</button>
        <button className='inline-flex items-center text-xs bg-white px-3 py-2 text-boring-black hover:bg-gray-lightestest dark:hover:bg-gray-light w-1/2' onClick={() => setTheme('dark')}><IoMoonOutline className="float-left mr-2" /> Dark Mode</button>
      </div>
    )
  }
  export default ThemeChanger;
