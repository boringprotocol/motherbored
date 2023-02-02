{/* Design tool shows CSS breakpoints on the rendered page */}
const breakpoints = () => {
    return ( 
        <>

         <div className="flex items-center m-2 fixed bottom-0 right-0 border border-gray-400 rounded p-2 bg-boring-white text-pink-600 text-sm z-50">
                Current breakpoint - 
                <span className="ml-1 sm:hidden md:hidden lg:hidden xl:hidden">default (&lt; 640px)</span>
                <span className="ml-1 hidden sm:inline md:hidden font-extrabold">sm</span>
                <span className="ml-1 hidden md:inline lg:hidden font-extrabold">md</span>
                <span className="ml-1 hidden lg:inline xl:hidden font-extrabold">lg</span>
                <span className="ml-1 hidden xl:inline 2xl:hidden font-extrabold">xl</span>
                <span className="ml-1 hidden 2xl:inline font-extrabold">2xl</span>
            </div>
        </>
     );
}

export default breakpoints;
