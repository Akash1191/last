// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgriHub {

    struct Product {
        string name;
        uint totalQuantity;  // Total quantity submitted
        uint fixedPrice;     // Fixed price for the product in wei
        bool isFixedPriceSet; // Flag to indicate if the fixed price is set
    }

    struct Bid {
        uint quantity;
        uint pricePerUnit;   // Price submitted by the farmer in wei
        address farmer;
    }

    mapping(string => Product) public products;  // Mapping of product name to product details
    mapping(string => Bid[]) public productBids; // Mapping of product name to array of bids
    mapping(string => mapping(address => uint)) public hubProducts;  // Hub product storage by farmer

    string[] public productList; // List of all product names

    // Price floor and ceiling
    uint public priceFloor = 30; // Minimum acceptable price (in wei)
    uint public priceCeiling = 80; // Maximum acceptable price (in wei)

    event ProductAdded(string name, address indexed farmer, uint quantity, uint pricePerUnit);
    event FixedPriceUpdated(string productName, uint fixedPrice);
    event ProductAddedToHub(string productName, address indexed farmer, uint quantity, uint fixedPrice);
    event ProductTransferred(string productName, address indexed fromFarmer, address indexed toFarmer, uint quantity, uint fixedPrice);

    // Function to convert a string to lowercase
    function toLowerCase(string memory _str) internal pure returns (string memory) {
        bytes memory strBytes = bytes(_str);
        for (uint i = 0; i < strBytes.length; i++) {
            if (strBytes[i] >= 0x41 && strBytes[i] <= 0x5A) { // A-Z in ASCII
                strBytes[i] = bytes1(uint8(strBytes[i]) + 32); // Convert to lowercase
            }
        }
        return string(strBytes);
    }

    // Function for farmers to add products
    function addProduct(string memory _name, uint _quantity, uint _pricePerUnit) public {
        string memory normalizedProductName = toLowerCase(_name); // Normalize product name to lowercase
        require(_quantity > 0, "Quantity must be greater than zero.");
        require(_pricePerUnit > 0, "Price per unit must be greater than zero.");

        // Add to product list if new product
        if (!products[normalizedProductName].isFixedPriceSet) {
            productList.push(normalizedProductName);
        }

        // Add the farmer's bid
        Bid memory newBid = Bid({
            quantity: _quantity,
            pricePerUnit: _pricePerUnit,
            farmer: msg.sender
        });
        productBids[normalizedProductName].push(newBid);

        // Calculate the new weighted average price
        uint totalWeightedPrice = 0;
        uint totalQuantity = 0;

        for (uint i = 0; i < productBids[normalizedProductName].length; i++) {
            totalWeightedPrice += productBids[normalizedProductName][i].quantity * productBids[normalizedProductName][i].pricePerUnit;
            totalQuantity += productBids[normalizedProductName][i].quantity;
        }

        uint newFixedPrice = totalWeightedPrice / totalQuantity;

        // Ensure the fixed price is within the acceptable price range (floor and ceiling)
        if (newFixedPrice < priceFloor) {
            newFixedPrice = priceFloor;
        } else if (newFixedPrice > priceCeiling) {
            newFixedPrice = priceCeiling;
        }

        // Update the product details
        products[normalizedProductName] = Product({
            name: normalizedProductName,
            totalQuantity: totalQuantity,
            fixedPrice: newFixedPrice,
            isFixedPriceSet: true
        });

        emit ProductAdded(normalizedProductName, msg.sender, _quantity, _pricePerUnit);
        emit FixedPriceUpdated(normalizedProductName, newFixedPrice);
    }

    // Function to add products to the hub
    function addProductToHub(string memory _name, uint _quantity) public {
        string memory normalizedProductName = toLowerCase(_name); // Normalize product name to lowercase
        require(products[normalizedProductName].isFixedPriceSet, "Fixed price not set for this product.");
        require(_quantity > 0, "Quantity must be greater than zero.");

        hubProducts[normalizedProductName][msg.sender] += _quantity;

        emit ProductAddedToHub(normalizedProductName, msg.sender, _quantity, products[normalizedProductName].fixedPrice);
    }

    // Function to transfer products
    function transferProduct(string memory _name, address _toFarmer, uint _quantity) public {
        string memory normalizedProductName = toLowerCase(_name);
        require(products[normalizedProductName].isFixedPriceSet, "Fixed price not set for this product.");
        require(_quantity > 0, "Quantity must be greater than zero.");
        require(hubProducts[normalizedProductName][msg.sender] >= _quantity, "Insufficient quantity.");

        hubProducts[normalizedProductName][msg.sender] -= _quantity;
        hubProducts[normalizedProductName][_toFarmer] += _quantity;

        emit ProductTransferred(normalizedProductName, msg.sender, _toFarmer, _quantity, products[normalizedProductName].fixedPrice);
    }

    // Function to get a farmer's products
    function getFarmerProducts(address _farmer) public view returns (string[] memory, uint[] memory) {
        uint totalProducts = 0;

        // Count total products for the farmer
        for (uint i = 0; i < productList.length; i++) {
            if (hubProducts[productList[i]][_farmer] > 0) {
                totalProducts++;
            }
        }

        string[] memory productNames = new string[](totalProducts);
        uint[] memory quantities = new uint[](totalProducts);

        uint index = 0;
        for (uint i = 0; i < productList.length; i++) {
            if (hubProducts[productList[i]][_farmer] > 0) {
                productNames[index] = productList[i];
                quantities[index] = hubProducts[productList[i]][_farmer];
                index++;
            }
        }

        return (productNames, quantities);
    }
}
