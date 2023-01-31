// import NostrChatWidget from 'nostr-chat-widget-react'
import LayoutAuthenticated from "../components/layoutAuthenticated"
import React from 'react'
import SpicolliArt from '../components/art/spicolli'
import Link from 'next/link'
import { NostrProvider } from "nostr-react";

import NostrFeed from '../components/nostrFeed'

const relayUrls = [
  "wss://nostr-pub.wellorder.net",
  "wss://relay.nostr.ch",
];

const nostr = () => {

  return (
    <LayoutAuthenticated>
      <>
        <div className="container mx-auto relative">

          <div className='border-b border-gray-lightest dark:border-gray-dark'>

            <div className=''>
              <SpicolliArt />
              <div className='p-12'>
                <NostrFeed />
              </div>

              <br />

              <NostrProvider relayUrls={relayUrls} debug={true}>
      <App />
    </NostrProvider>

    
            </div>
          </div>
          
          <div className="absolute top-0 w-3/4 lg:w-1/2">
            <div className='p-12'>
              <p className='text-sm'>Isn't this our time?</p>
              <p className='text-gray text-xs'>nostr: wss://relay.boring.surf</p>
              <ul className='leading-6 mt-12 mb-12 pl-4 text-xs list-disc text-gray-dark dark:text-gray-light'>
                <li>Recieve Lightning Network Payments</li>
                <li>NIP-05 your-name@boring.surf</li>
                <li>#boredroom nostr channel feed</li>
                <li>Global and following feeds</li>
                <li>Direct Messages</li>
              </ul>
              
              <Link href="/profile" >
                <span className="bg-gray-dark text-white p-2 rounded-sm mt-4 text-xs">Add nostr</span></Link>
            </div>
            
          </div>
        </div>
        {/* <NostrChatWidget
              recipientPk={'npub1zttn0dzm9cjvz70zalvz7sgyswtfxr4ca6qt736kr57y07nqgdyqhdgxvs'}
              relayUrls={['wss://no.str.cr', 'wss://relay.damus.io', 'wss://nostr.fly.dev', 'wss://nostr.robotechy.com']} 
          /> */}
      </>
    </LayoutAuthenticated>
  )
}

export default nostr;


