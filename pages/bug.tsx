import axios from "axios";
import { useEffect, useState } from "react";

function BitcoinPrice() {
  const [price, setPrice] = useState(0);
  const [name, setName] = useState("BTC");

  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
          params: {
            ids: "bitcoin",
            vs_currencies: "usd"
          }
        });
        if (response.data.bitcoin) {
          setPrice(response.data.bitcoin.usd);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchPrice();
  }, []);

  return (
    <div className="flex items-center">
      <span className="text-2xl font-bold text-gray-800">{`${name}: $${price}`}</span>
    </div>
  );
}

export default BitcoinPrice;
