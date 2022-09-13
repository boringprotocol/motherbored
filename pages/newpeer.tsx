import React, { useState } from "react";
import Layout from "../components/layout";
import Router from "next/router";

const Peer: React.FC = () => {
    const [name, setName] = useState("");
    const [kind, setKind] = useState("");

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const body = { name, kind };
            await fetch("/api/peer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            await Router.push("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            <div>
            
            <div className="w/50">
            <div>
                <label htmlFor="mode" className="block text-sm font-medium">
                    Mode
                </label>
                <select
                    id="mode"
                    name="mode"
                    className="mt-1 block w-full rounded-md border-gray-light py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    defaultValue="provider"
                >
                    <option value="consumer">Consumer</option>
                    <option value="provider">Provider</option>
                    
                </select>
            </div>

            <div>
                <label htmlFor="setupkey" className="block text-sm font-medium">
                    SetUp Key
                </label>
                <div className="mt-1">
                    <input
                    type="text"
                    name="text"
                    id="setupkey"
                    defaultValue="5e244a99-56b6-4d19-a39b-0a1cb97121c1" // set up key from pi goes here
                    disabled
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
                    placeholder="5e244a99-56b6-4d19-a39b-0a1cb97121c1"
                    />
                    </div>
            </div>
            </div>

                <form onSubmit={submitData}>
                    <h1>New Peer</h1>

                    
                    <input
                        autoFocus
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        type="text"
                        value={name}
                    />
                    <input
                        onChange={(e) => setKind(e.target.value)}
                        placeholder="Kind (producer or consumer)"
                        type="text"
                        value={kind}
                    />
                    <input disabled={!name || !kind} type="submit" value="Create" />
                    <a className="back" href="#" onClick={() => Router.push("/")}>
                        or Cancel
                    </a>
                </form>
            </div>
            <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        input[type="text"],
        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }
        .back {
          margin-left: 1rem;
        }
      `}</style>
        </Layout>
    );
};

export default Peer;
