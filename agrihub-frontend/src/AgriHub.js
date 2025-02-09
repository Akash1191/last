import Web3 from 'web3';

// Contract ABI and address
const contractABI = [
    [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "string",
              "name": "productName",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "fixedPrice",
              "type": "uint256"
            }
          ],
          "name": "FixedPriceUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "farmer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "quantity",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "pricePerUnit",
              "type": "uint256"
            }
          ],
          "name": "ProductAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "string",
              "name": "productName",
              "type": "string"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "farmer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "quantity",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "fixedPrice",
              "type": "uint256"
            }
          ],
          "name": "ProductAddedToHub",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "string",
              "name": "productName",
              "type": "string"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "fromFarmer",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "toFarmer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "quantity",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "fixedPrice",
              "type": "uint256"
            }
          ],
          "name": "ProductTransferred",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "hubProducts",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "priceCeiling",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "priceFloor",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "productBids",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "quantity",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "pricePerUnit",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "farmer",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "productList",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "name": "products",
          "outputs": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "totalQuantity",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "fixedPrice",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isFixedPriceSet",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_quantity",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_pricePerUnit",
              "type": "uint256"
            }
          ],
          "name": "addProduct",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_quantity",
              "type": "uint256"
            }
          ],
          "name": "addProductToHub",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "_toFarmer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_quantity",
              "type": "uint256"
            }
          ],
          "name": "transferProduct",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_farmer",
              "type": "address"
            }
          ],
          "name": "getFarmerProducts",
          "outputs": [
            {
              "internalType": "string[]",
              "name": "",
              "type": "string[]"
            },
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        }
      ]
];
const contractAddress = '0x12C882ec07028771B86FB1e9b22907D8B71FD4dC';

let web3;
let contract;

export const connectWallet = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      contract = new web3.eth.Contract(contractABI, contractAddress);
      return true;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      return false;
    }
  } else {
    alert('Please install MetaMask!');
    return false;
  }
};

export const addProduct = async (productName, quantity, pricePerUnit) => {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.addProduct(productName, quantity, pricePerUnit).send({
    from: accounts[0],
  });
};

export const addProductToHub = async (productName, quantity) => {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.addProductToHub(productName, quantity).send({
    from: accounts[0],
  });
};

export const transferProduct = async (productName, toFarmer, quantity) => {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.transferProduct(productName, toFarmer, quantity).send({
    from: accounts[0],
  });
};

export const getFarmerProducts = async (farmerAddress) => {
  const products = await contract.methods.getFarmerProducts(farmerAddress).call();
  return products;
};
