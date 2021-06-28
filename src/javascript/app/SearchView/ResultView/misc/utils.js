export function addProduct(id, productQty) {
    // Parse any JSON previously stored in allProducts
    let existingProducts = JSON.parse(localStorage.getItem('allProducts'));
    if (existingProducts === null) {
        existingProducts = [];
    }

    // Save allProducts back to local storage
    let itExists = false;
    for (let i = 0; i < existingProducts.length; i++) {
        if (existingProducts[i].id === id) {
            let newQty = parseInt(existingProducts[i].qty, 10) + parseInt(productQty, 10);
            let updatedProduct = {
                id: id,
                qty: newQty
            };

            // RemoveProduct(i);
            existingProducts.splice(i, 1);
            existingProducts.push(updatedProduct);
            localStorage.setItem('Product', JSON.stringify(updatedProduct));

            itExists = true;
            break;
        }
    }

    if (itExists === false) {
        let Product = {
            id: id,
            qty: productQty
        };
        existingProducts.push(Product);
        localStorage.setItem('Product', JSON.stringify(Product));
    }

    localStorage.setItem('allProducts', JSON.stringify(existingProducts));
}

export function removeProduct(index) {
// Parse json
    let products = JSON.parse(localStorage.getItem('allProducts'));
    // Get index of object
    console.log('index:' + index);
    // Splice the array at the index of your object
    products.splice(index, 1);
    console.log('products:' + products.toString());
    // Save back to localStorage
    localStorage.setItem('allProducts', JSON.stringify(products));
}

window.onload = () => {
    // Clear localStorage
    if (localStorage.getItem('allProducts') === 'true') {
        localStorage.removeItem('allProducts');
        // Show them the sign in form
    }
};
