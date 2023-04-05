import React, { useContext } from "react";
import { ThemeContext } from "../Themes/themeContext";
import * as Themes from "../Themes/index";

const ThemeChanger = () => {
  const { setTheme } = useContext(ThemeContext);
  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-ghost btn-xs gap-2">
        Themes
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <ul tabIndex="0" className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
        {Object.keys(Themes).map((key) => {
          return (
            <li key={key} onClick={() => setTheme(key)}>
              <a href="#" className="dropdown-item capitalize">
                {key}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ThemeChanger;
