const ethers = require("ethers");
const fs = require("fs");


async function main() {
    // http://127.0.0.1:7545 - Ganache rpc server
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
    const wallet = new ethers.Wallet(
        "3bc239262921495c11ee322dbd90b8c05f508140063bba6cd6d18e073b84fbb1" //ganache random private key
        , provider);
    // pass file path, encoding
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

    // abi - allow code to interact with contract
    // binary
    // wallet - provide private key to sign contract at deployment 
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

    console.log("Deploying... Please wait.");
    const contract = await contractFactory.deploy(); // wait until contract is deployed
    console.log(contract);
}   

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })