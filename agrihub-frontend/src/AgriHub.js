// src/AgriHub.js
import Web3 from 'web3';
import AgriHubABI from './AgriHubABI.json'; // Import your contract ABI

let web3;
let agriHubContract;

export const connectWallet = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const contractAddress = "0x143DAe7be86c0Ca9dA18E3C6507e45a638232646"; // Your deployed contract address
        agriHubContract = new web3.eth.Contract(AgriHubABI, contractAddress);
        return true; // Wallet connected
    } else {
        alert('Please install MetaMask!');
        return false; // Wallet not connected
    }
};

// The rest of your functions (addProduct, addProductToHub, etc.) remain unchanged

export const addProduct = async (name, quantity, pricePerUnit) => {
    const accounts = await web3.eth.getAccounts();
    return await agriHubContract.methods.addProduct(name, quantity, pricePerUnit).send({ from: accounts[0] });
};

export const addProductToHub = async (name, quantity) => {
    const accounts = await web3.eth.getAccounts();
    return await agriHubContract.methods.addProductToHub(name, quantity).send({ from: accounts[0] });
};

export const transferProduct = async (name, toFarmer, quantity) => {
    const accounts = await web3.eth.getAccounts();
    return await agriHubContract.methods.transferProduct(name, toFarmer, quantity).send({ from: accounts[0] });
};

export const getFarmerProducts = async (farmerAddress) => {
    return await agriHubContract.methods.getFarmerProducts(farmerAddress).call();
};