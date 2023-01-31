import qrcode from 'qrcode';
import { useState } from 'react';

interface Props {
    imageUrl:string;
}

export default function GenerateQRCode({ imageUrl }:Props) {
  return (
    <div>
      {imageUrl ? <img src={imageUrl} alt="QR code" /> : <p>Generating QR code...</p>}
    </div>
  );
}

export async function getInitialProps() :Promise<Props> {
  const imageUrl = '/qr/qrcode.png';
  try{
    await qrcode.toFile(`static${imageUrl}`, 'your-data', {
      color: {
        dark: '#000',  // Dark color of the QR code
        light: '#fff' // Light color of the QR code
      }
    });
  } catch(err){
    console.log(err);
  }
  return { imageUrl };
}
