import LayoutAuthenticated from "../../components/layoutAuthenticated";


export default function settings() {

  // settings

  return (
    <LayoutAuthenticated>

      <div className="p-12 w-1/2">
        <h1 className="text-2xl font-bold">Settings</h1>
        <h2 className="text-lg font-medium mt-6">Points System</h2>
        <form className="mt-4">
          <ul className="divide-y divide-gray-200 text-xs">
            <div className="bg-white p-6 rounded-lg shadow-md mt-4">
              <h3>Consumers</h3>
              <p>Give additional rewards to consumers as desired.</p>
              <li className="py-2 flex items-center justify-between">
                <label className="mr-4">Consumer Local</label>
                <div className="flex items-center">
                  <input type="number" id="consumer-local" name="consumer-local" min="0" max="50" className="w-16 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={0} />
                  <span className="ml-2 text-gray-500">points</span>
                </div>
              </li>
              <li className="py-2 flex items-center justify-between">
                <label className="mr-4">Consumer Linux</label>
                <div className="flex items-center">
                  <input type="number" id="consumer-linux" name="consumer-linux" min="0" max="50" className="w-16 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={1} />
                  <span className="ml-2 text-gray-500">points</span>
                </div>
              </li>
              <li className="py-2 flex items-center justify-between">
                <label className="mr-4">Consumer Macintosh</label>
                <div className="flex items-center">
                  <input type="number" id="consumer-macintosh" name="consumer-macintosh" min="0" max="50" className="w-16 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={1} />
                  <span className="ml-2 text-gray-500">points</span>
                </div>
              </li>
              <li className="py-2 flex items-center justify-between">
                <label className="mr-4">Consumer Windows</label>
                <div className="flex items-center">
                  <input type="number" id="consumer-windows" name="consumer-windows" min="0" max="50" className="w-16 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={1} />
                  <span className="ml-2 text-gray-500">points</span>
                </div>
              </li>
              <li className="py-2 flex items-center justify-between">
                <label className="mr-4">Consumer Android</label>
                <div className="flex items-center">
                  <input type="number" id="consumer-android" name="consumer-android" min="0" max="50" className="w-16 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={2} />
                  <span className="ml-2 text-gray-500">points</span>
                </div>
              </li>
              <li className="py-2 flex items-center justify-between">
                <label className="mr-4">Consumer iOS</label>
                <div className="flex items-center">
                  <input type="number" id="consumer-ios" name="consumer-ios" min="0" max="50" className="w-16 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={2} />
                  <span className="ml-2 text-gray-500">points</span>
                </div>
              </li>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mt-4">
              <h3>Providers</h3>
              <p>Give additional rewards to providers as desired.</p>
              <li className="py-2 flex items-center justify-between">
                <label className="mr-4">Provider Local</label>
                <div className="flex items-center">
                  <input type="number" id="provider-local" name="provider-local" min="0" max="50" className="w-16 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={7} />
                  <span className="ml-2 text-gray-500">points</span>
                </div>
              </li>
              <li className="py-2 flex items-center justify-between">
                <label className="mr-4">Provider Cloud</label>
                <div className="flex items-center">
                  <input type="number" id="provider-cloud" name="provider-cloud" min="0" max="50" className="w-16 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={13} />
                  <span className="ml-2 text-gray-500">points</span>
                </div>
              </li>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mt-4">
              <h3>NFT Licenses</h3>
              <p>In addition to the multiplier additional points can be assigned to holders of NFT licenses. Useful for promoting purchase of a specefic one. Kept at 0, the multiplier works as it should.</p>
              <li className="py-2 flex items-center justify-between">
                <label className="mr-4">V1 NFT License</label>
                <div className="flex items-center">
                  <input type="number" id="v1" name="v1" min="0" max="50" className="w-16 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={4} />
                  <span className="ml-2 text-gray-500">points</span>
                </div>
              </li>
              <li className="py-2 flex items-center justify-between">
                <label className="mr-4">V2 NFT License</label>
                <div className="flex items-center">
                  <input type="number" id="v2" name="v2" min="0" max="50" className="w-16 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={3} />
                  <span className="ml-2 text-gray-500">points</span>
                </div>
              </li>
              <li className="py-2 flex items-center justify-between">
                <label className="mr-4">VX NFT License</label>
                <div className="flex items-center">
                  <input type="number" id="vx" name="vx" min="0" max="50" className="w-16 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={2} />
                  <span className="ml-2 text-gray-500">points</span>
                </div>
              </li>
            </div>
            {/* <li className="py-2 flex items-center justify-between">
              <label className="mr-4">POA</label>
              <div className="flex items-center">
                <input type="number" id="poa" name="poa" min="0" max="50" className="w-16 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={0} />
                <span className="ml-2 text-gray-500">points</span>
              </div>
            </li> */}
          </ul>
        </form>

      </div>



    </LayoutAuthenticated>
  );
}
