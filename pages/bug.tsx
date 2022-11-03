import { useSession } from "next-auth/react"
import LayoutAuthenticated from "../components/layoutAuthenticated"
import { useEffect, useState } from "react";
import React from 'react'
import { IoLogoGithub, IoSunnyOutline } from "react-icons/io5";
// import Tetris from 'react-tetris'


export default function MotherboredBugReportPage() {

  return (
    <LayoutAuthenticated>
      <div className="px-12 py-12">
        {/* <span className="font-jetbrains text-xs truncate">
          motherbored-bug-report
        </span> */}
7 days remain 
<a
                        href="https://github.com/boringprotocol/docs"
                        className="mb-2 inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-3 py-2 text-boring-black hover:bg-boring-white hover:opacity-70 active:opacity-50 shadow-md active:shadow-sm"
                      ><IoLogoGithub className="mr-2" />GitHub</a>
                      
<p className="pb-12 leading-relaxed">The Boring Protocol network has 456 consumer peers and 378 provider peers connected. 324578634 TB of data to date, have passed through the network with an average of 32452 per day. </p>

<p className="pb-12 leading-relaxed">Of the 546 consumers connected to the network, 102 are using a Motherbored, 23 are on a Linux machine, 39 are connecting on OS X, and the remaining 89, Windows.</p>


        <div className="App">
        {/* <form name="bug-report" method="POST" data-netlify="true" action="/">
        <input type="hidden" name="bug-report" value="contact" />
          <p>
            <label>
              Name: <input type="text" name="name" />
            </label>
          </p>
          <p>
            <label>
              Bug: <input type="text" name="bug" />
            </label>
          </p>
          <p>
            <button type="submit">Send</button>
          </p>
        </form>     */}
        </div>

      </div>
      
    </LayoutAuthenticated>
  )
}

