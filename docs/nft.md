---
title: 'NFT'
metaTitle: 'NFT'
metaDesc: ''
socialImage: public/img/cathy.png
date: '2022-09-24'
tags:
  - nft
  - license
---


// psuedo code for nft attached tp provider peer 
// Check authenticated wallet for NFTs from motherbored nft collection
// if a user has 7 nfts and 3 provider peers
// they'll have 4 nfts left to assign to new peers
// 
// Database Operations: 
// when creating a provider peer an NFT must be attached to it
// check from database for unused NFTs as some in that wallet may 
// be attached to other peers beloging to that user
// 
// Provider peer creation form
// 1. Add Provider Peer
// 2. Assign values to all the normal provider peer fields (Label, Country, etc..)
// 3. Take from an unused NFT in user's wallet the unique ID of that NFT
// 4. PUT into the peer record under "License" the unique ID
//
// If the NFT attached to the peer is removed from the wallet (tranfered, sold, whatever)
// the peer should be disallowed rewards from that time of transaction forward
// and the record deleted from that peer 
// when settlements run at the end of each period the chain will be checked for time gaps
// where a provider peer had the attached NFT removed from their authenticated wallet
// 


// You can run a provider peer without an NFT
// You only get rewards if you have the NFT attached to the peer record

// you can always create consumer peers without an NFT

// NFTs are lazy-staked, meaning we don't place them in any contract. the owner can just 
// render their rewards null

// usability: if they want to take a nft to market it's on them to see which of theirs is not attached to a peer
// we can print a list on screen of those nfts not attached to their wallet
// developement: fewer moving parts. responisbility/ownership/custody in hands of user. s


// https://docs.metaplex.com/resources/definitions
