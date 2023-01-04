import axios from 'axios';

function BopPrice({ price, name }: { price: number, name: string }) {

  return (
    <div className="flex items-center">
      <span className="text-2xl font-bold text-gray-800">{`${name}: $${price}`}</span>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bopo',
        vs_currencies: 'usd'
      }
    });
    let price = 0;
    let name = "BOP";
    if (response.data.bopo) {
      price = response.data.bopo.usd;
    }

    return {
      props: {
        price,
        name
      }
    };
  } catch (error) {
    console.error(error);
  }
}


export default BopPrice;
