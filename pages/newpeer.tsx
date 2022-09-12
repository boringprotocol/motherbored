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
