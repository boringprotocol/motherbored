import React, { useEffect, useState } from 'react';
import { PublicKey, Connection } from "@solana/web3.js";

const addresses = [
    { address: "3TPRQVe3xViyn3nDJwAdsb3ojBay4ZW2VKDzHz9PKT1i", name: "Address 1" },
    { address: "oyja18UadrHNEuDxYzUr4mgyLSe81WdN8uBCoyGbK6V", name: "Address 2" },
    { address: "3tnJiqWsFeJryQxRuYFaDwd2PnJgBtph5Xd6g6Wc3KEv", name: "Address 3" },
    { address: "CSRzECBAcZVNu95aPXwEfibSgfRWDHRr6sir1nyfGgXe", name: "Address 4" },
    { address: "AMY8xszT5tdLkZpF361EA4iAZN6urDpTff3vB83hidfV", name: "Address 5" }
];

const Tokenomics = () => {
    const [balances, setBalances] = useState([]);

    useEffect(() => {
        const fetchBalances = async () => {
            const solana = new Connection("https://flashy-newest-sponge.solana-mainnet.quiknode.pro/");
            const balances = await Promise.all(addresses.map(async ({ address, name }) => {
                const publicKey = new PublicKey(address);
                return solana.getBalance(publicKey);
            }));
            setBalances(balances);
        };

        fetchBalances();
    }, []);

    return (
        <div>
            {
                addresses.map(({ address, name }, index) => (
                    <p key={index}>
                        Name: {name} |
                        Address: {address} |
                        Balance: {balances[index]?.toLocaleString()}
                    </p>
                ))
            }
        </div>
    );
};

export default Tokenomics;
