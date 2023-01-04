import { useSession } from "next-auth/react"
import LayoutAuthenticated from "../components/layoutAuthenticated"
import { useEffect, useState } from "react";
import React from 'react'
import { IoLogoGithub, IoSunnyOutline } from "react-icons/io5";
// import Tetris from 'react-tetris'


export default function AccountPage() {

  return (
    <LayoutAuthenticated>
      <div className="px-12 py-12">
        {/* <span className="font-jetbrains text-xs truncate">
          motherbored-bug-report
        </span> */}
        <h1 className="text-2xl mb-4">CojKKtJMg94Gx75NG4sPpVLngZDtLG9KHNfrg2Liqzu3</h1>
        <p>Your account allows for up to 4 consumer peers.</p>
        <p>3/4 NFT licenses used</p>
        <h2 className="text-2xl">Consumer Account</h2>
        <p>You are paid up. 7 days remain </p>
        <p>6/8 devices </p>
        <hr />
        <ul>
          <li>Linux</li>
          <li>Macintosh</li>
          <li>Windows</li>
          <li>Mothebored - crazy-donkey-2487</li>
          <li></li>
        </ul>

        <h2 className="text-2xl">Provider Account</h2>
        <p>You are running three provider nodes</p>



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

