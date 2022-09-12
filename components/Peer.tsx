import React from "react";
import Router from "next/router";

export type PeerProps = {
    id: string;
    name: string;
    setupkey: string;
    kind: string;
};

const Peer: React.FC<{ peer: PeerProps }> = ({ peer }) => {
    const peerName = peer.name ? peer.id : "Unknown peer name";
    return (
        <div onClick={() => Router.push("/p/[id]", `/p/${peer.id}`)}>
            <ul>
                <li>Name: {peer.name}</li>
                <li>Id: {peer.id}</li>
                <li>netbird setupkey: {peer.setupkey}</li>
                <li>kind: {peer.kind}</li>
            </ul>
        </div>
    );
};

export default Peer;