// src/App.js
import React, { useState } from 'react';
import { connectWallet, addProduct, addProductToHub, transferProduct, getFarmerProducts } from './AgriHub';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [pricePerUnit, setPricePerUnit] = useState(0);
    const [farmerProducts, setFarmerProducts] = useState([]);
    const [farmerAddress, setFarmerAddress] = useState('');
    const [account, setAccount] = useState('');

    const handleConnectWallet = async () => {
        const connected = await connectWallet();
        if (connected) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            setAccount(accounts[0]);
        }
    };

    const handleAddProduct = async () => {
        try {
            await addProduct(productName, quantity, pricePerUnit);
            alert('Product added successfully!');
        } catch (error) {
            console.error("Error adding product:", error);
            alert('Failed to add product. Check console for details.');
        }
    };

    const handleAddToHub = async () => {
        try {
            await addProductToHub(productName, quantity);
            alert('Product added to hub successfully!');
        } catch (error) {
            console.error("Error adding to hub:", error);
            alert('Failed to add to hub. Check console for details.');
        }
    };

    const handleTransferProduct = async (toFarmer) => {
        try {
            await transferProduct(productName, toFarmer, quantity);
            alert('Product transferred successfully!');
        } catch (error) {
            console.error("Error transferring product:", error);
            alert('Failed to transfer product. Check console for details.');
        }
    };

    const handleGetFarmerProducts = async () => {
        try {
            const products = await getFarmerProducts(farmerAddress);
            setFarmerProducts(products);
        } catch (error) {
            console.error("Error fetching farmer products:", error);
            alert('Failed to fetch products. Check console for details.');
        }
    };

    return (
        <div className="container mt-5">
            <h1>AgriHub</h1>
            <button className="btn btn-primary mb-3" onClick={handleConnectWallet}>
                {account ? `Connected: ${account}` : 'Connect Wallet'}
            </button>
            <div className="mb-3">
                <input type="text" className="form-control" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
                <input type="number" className="form-control mt-2" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                <input type="number" className="form-control mt-2" placeholder="Price per Unit (in wei)" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} />
                <button className="btn btn-success mt-2" onClick={handleAddProduct}>Add Product</button>
                <button className="btn btn-warning mt-2" onClick={handleAddToHub}>Add to Hub</button>
            </div>
            <div className="mb-3">
                <input type="text" className="form-control" placeholder="Farmer Address" value={farmerAddress} onChange={(e) => setFarmerAddress(e.target.value)} />
                <button className="btn btn-info mt-2" onClick={handleGetFarmerProducts}>Get Farmer Products</button>
            </div>
            <h2>Farmer Products</h2>
            <ul>
                {farmerProducts[0] && farmerProducts[0].map((name, index) => (
                    <li key={index}>{name}: {farmerProducts[1][index]} units</li>
                ))}
            </ul>
        </div>
    );
}

export default App;