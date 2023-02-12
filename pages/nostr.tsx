import LayoutAuthenticated from "../components/layoutAuthenticated";
import React, { useEffect, useRef, useState } from "react";
import { useNostrEvents, dateToUnix, useProfile } from "nostr-react";
import NostrNav from "../components/NostrNav";

const GlobalFeed = () => {
  const [userDataMap, setUserDataMap] = useState<{ [key: string]: any }>({});
  const now = useRef(new Date());
  const { events } = useNostrEvents({
    filter: {
      since: dateToUnix(now.current),
      kinds: [1],
    },
  });

  useEffect(() => {
    const fetchUserData = async (pubkey: string) => {
      const { data: userData } = await useProfile({ pubkey });
      setUserDataMap((prevUserDataMap) => ({
        ...prevUserDataMap,
        [pubkey]: userData,
      }));
    };

    events.forEach((event) => {
      const { pubkey } = event;
      if (!userDataMap[pubkey]) {
        fetchUserData(pubkey);
      }
    });
  }, [events, userDataMap, setUserDataMap]);

  return (
    <LayoutAuthenticated>
      <div className="container mx-auto">
        <NostrNav />

        <div className="text-xs p-12 w-1/2 text-gray">
          <ul role="list" className="divide-y divide-gray-lighter dark:divide-gray-dark">
            {events.map((event) => {
              const { pubkey } = event;
              const userData = userDataMap[pubkey];

              // images in posts (jpg, jpeg, png, gif)
              const imageUrl = event.content.match(
                /https:\/\/nostr\.build\/i\/.*\.(jpg|jpeg|png|gif)/
              );
              let content = event.content;

              // hashtags
              content = content.replace(/#(\S+)/g, '<a href="#" class="text-blue-500 underline">#$1</a>');


              if (imageUrl) {
                content = content.replace(imageUrl[0], "");
              }
              return (
                <li key={event.id} className="py-4">
                  <div className="flex space-x-3">
                    <img
                      className="h-6 w-6 rounded-full"
                      src={userData?.picture}
                      alt=""
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">
                          {userData?.name} ({event.pubkey})
                        </h3>
                      </div>
                      <p
                        className="text-sm text-gray-500 w-1/2"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                      {imageUrl && <img src={imageUrl[0]} className="w-1/2" />}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </LayoutAuthenticated>
  );
};


export default GlobalFeed;
