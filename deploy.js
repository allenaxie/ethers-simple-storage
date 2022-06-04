const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
    // RPC_URL - Ganache rpc server
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(
        process.env.PRIVATE_KEY //ganache random private key
        , provider);
    // pass file path, encoding
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

    // abi - allow code to interact with contract
    // binary
    // wallet - provide private key to sign contract at deployment 
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

    console.log("Deploying... Please wait.");

    // deploy contract
    // can pass arguments to your contract deployment
    const contract = await contractFactory.deploy({gasLimit: 1000000}); 
    // wait 1 block to send tx
    await contract.deployTransaction.wait(1);

    // get initial value
    const currentFavoriteNumber = await contract.retrieve();
    console.log(`Current favorite number: ${currentFavoriteNumber.toString()}`);

    // update favorite number in contract
    const transactionResponse = await contract.store("7");
    const transactionReceipt = await transactionResponse.wait(1);
    const updatedFavoriteNumber = await contract.retrieve();
    console.log(`Updated favorite number is: ${updatedFavoriteNumber}`);
}   

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })