console.log("Hello world from controllers/cart.js");
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// [SECTION - CART - ADDGOAL] User retrieves/views cart
export async function viewCart(req, res) {
    console.log('This is viewCart function')
    try {
        const userCart = await Cart.findOne({ userId: req.user.id });
        if (!userCart) {
            return res.status(404).json({
                error: 'No file found',
                message: 'There is no userCart with that id'
            });
        };

        if (!userCart || userCart.products.length === 0) {
            return res.status(204).send(false);
        };

        return res.status(200).send(userCart);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - STRETCH - CART] Add to cart
export async function addProductToCart(req, res) {
    console.log('This is addProductToCart function')
    const { productId, name, price, quantity, img, imgLqip } = req.body;
    const newProduct = {
        productId,
        name,
        price,
        quantity,
        img,
        imgLqip,
        subTotal: price * quantity
    };
    let totalAmount;
    try {
        const userCart = await Cart.findOne({ userId: req.user.id });
        if(userCart){
            let newProductArray;
            // Check if the product already exists in the cart
            const existingProductIndex = userCart.products.findIndex(
            (product) => product.productId === newProduct.productId
            );

            if (existingProductIndex !== -1) {
            // If the product exists, update its quantity and subTotal
                userCart.products[existingProductIndex].quantity += newProduct.quantity;
                userCart.products[existingProductIndex].subTotal += newProduct.subTotal;
            } else {
            // If the product is new, add it to the cart
                newProductArray = userCart.products.push(newProduct);
            };
            // Recalculate total amount based on the updated cart
            totalAmount = userCart.products.reduce((total, product) => total + product.subTotal, 0);
            // Update totalAmount in the cart
            userCart.totalAmount = totalAmount;
            await userCart.save();

            return res.status(200).send(userCart);
        } else if(!userCart){
            totalAmount = newProduct.subTotal;
            let cart = new Cart({
                userId: req.user.id,
                products: [newProduct],
                totalAmount: totalAmount
            })
            await cart.save();
    
            return res.status(200).send(cart);
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - STRETCH - CART] Change product quantities and CAN REMOVE PRODUCTS just have to set input button when user clicks remove set Quantity in req.body.quantity to be 0
export async function editCart(req, res) {
    console.log('This is editCart function')
    try {
        const userCart = await Cart.findOne({ userId: req.user.id });
        if (!userCart) {
            return res.status(404).json({
            error: 'Not found',
            message: 'User not found',
            });
        };

        const { productId, quantity } = req.body;

        // Check if the product exists in the cart
        const existingProductIndex = userCart.products.findIndex(
            (product) => product.productId === productId
        );

        if (existingProductIndex !== -1) {
            if (quantity === 0) {
            // If quantity is 0, remove the product from the cart
            userCart.products.splice(existingProductIndex, 1);
            } else {
            // If the product exists, update its quantity and recalculate the subtotal
            userCart.products[existingProductIndex].quantity = quantity;
            userCart.products[existingProductIndex].subTotal = userCart.products[existingProductIndex].price * quantity;
            }
        } else {
            return res.status(404).json({
            error: 'Not found',
            message: 'Product not found in the cart',
            });
        }

        // Recalculate total amount based on the updated cart
        const totalAmount = userCart.products.reduce(
            (total, product) => total + product.subTotal,
            0
        );

        // Update totalAmount in the cart
        userCart.totalAmount = totalAmount;
    
        await userCart.save();

        return res.status(200).send(userCart);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION] User checkout with Cart added
export async function userCheckout(req, res) {
    console.log('This is userCheckout function')
    try {
    // Find user
        let userCart = await Cart.findOne({ userId: req.user.id });
        if (!userCart) {
            return res.status(404).json({
            error: 'Not found',
            message: 'There is no user with that information'
            });
        };

        // Prepare purchased items
        const itemsInCart = userCart.products.map(product => ({
            productId: product.productId,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            subTotal: product.subTotal
        }));

        // Create an order
        const newOrder = new Order({
            userId: req.user.id,
            products: itemsInCart,
            totalAmount: userCart.totalAmount,
            paymentInfo: req.body.paymentInfo,
            orderStatus: 'pending'
        });
        // Validation check if products in MongoDB has enough quantities
        for (let item of itemsInCart) {
            const product = await Product.findById(item.productId);
            if (product) {
                if (item.quantity > product.quantity) {
                // Validation check if user's cart quantity is greater than available quantity
                // console.log(`Not enough quantity`)
                    return res.status(400).json({
                        error: 'Insufficient Quantity',
                        message: `Not enough quantity available for product with ID ${item.productId}`
                    });
                };
            };
        };
        
        // Clear user's cart
        userCart.products = [];
        userCart.totalAmount = 0;
        
        await userCart.save();
        await newOrder.save();
        // console.log(`Order has been saved`)
        // Since Order has been saved, its fine to decrease the quantities of the products in MongoDB
        for (let item of itemsInCart) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.quantity -= item.quantity;
                await product.save();
                // console.log(`product has been saved`)
                };
            };
        return res.status(200).send(newOrder)
        ;
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

export default viewCart;