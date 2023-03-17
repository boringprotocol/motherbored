const { getAssociatedTokenAddress } = require("@solana/spl-token");
const { PublicKey } = require("@solana/web3.js");


(async () => {
  const payerWalletPublicKey = "bRbMM4GtaBduQZqNxC9Kg41NtKMqL6axi4mdzZYFta8";
  const recipientWalletPublicKey = "CojKKtJMg94Gx75NG4sPpVLngZDtLG9KHNfrg2Liqzu3";
  const tokenMintAddress = "BLwTnYKqf7u4qjgZrrsKeNs2EzWkMLqVCu6j8iHyrNA3";

  const expectedSourceTokenAccount = "7KfYZ3Zh6Bqeaee5fncposAiPtNAZdcppKhbRdrrDSDk";
  const expectedDestinationTokenAccount = "DU5CQR4WWfQSdqraKWWwh3sRzKM1FvouXwn6vZxbrf91";

  const sourceTokenAccount = await getAssociatedTokenAddress(
    new PublicKey(payerWalletPublicKey),
    new PublicKey(tokenMintAddress)
  );
  const destinationTokenAccount = await getAssociatedTokenAddress(
    new PublicKey(recipientWalletPublicKey),
    new PublicKey(tokenMintAddress)
  );

  console.log("Expected sourceTokenAccount (payer):", expectedSourceTokenAccount);
  console.log("Actual sourceTokenAccount (payer):", sourceTokenAccount.toString());
  console.log("Expected destinationTokenAccount (recipient):", expectedDestinationTokenAccount);
  console.log("Actual destinationTokenAccount (recipient):", destinationTokenAccount.toString());
})();
