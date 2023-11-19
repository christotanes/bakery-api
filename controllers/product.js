console.log("Hello world from controllers/product.js");
import Product from '../models/Product.js';

// [SECTION] Get All Products
export async function getAllProducts(req, res) {
  console.log('This is getAllProducts function');
  try {
    const allProducts = await Product.find({});

    if (!allProducts.length) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No products found'
      });
    }

    return res.status(200).json(allProducts);
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

// [SECTION - ADMIN] Create Product
export async function createProduct (req, res){
    console.log('This is createProduct function');
    console.log(req.body)
    try {
        const productExists = await Product.findOne({ name: req.body.name });
        if (productExists) {
            return res.status(409).json({
              error: 'Conflict',
              message: 'Product Name has already been used or registered.'
            });
          } else {
            const newProduct = new Product({
                name: req.body.name,
                description: req.body.description,
                type: req.body.type,
                size: req.body.size,
                quantity: req.body.quantity,
                price: req.body.price,
                allergens: req.body.allergens,
                weight: req.body.weight,
                deliveryAvailable: req.body.deliveryAvailable,
                flavors: req.body.flavors,
                bestBefore: req.body.bestBefore,
                vegetarian: req.body.vegetarian,
                img: req.body.img,
                imgLqip: req.body.imgLqip,
                imgBanner: req.body.imgBanner,
                imgBannerLqip: req.body.imgBannerLqip
            });
    
            const savedProduct = await newProduct.save();

            return res.status(201).json({
                message: 'Product is successfully created!',
                product: savedProduct
            });
        }
      } catch (error) {
        console.log(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
      }
    }

// [SECTION] Retrieve all ACTIVE products
export async function activeProducts(req, res){
  console.log('This is activeProducts function');
  try{
    const activeProducts = await Product.find({ isActive: true});

    if(!activeProducts.length){
      return res.status(404).json({
        error: 'Not found',
        message: 'There are no products available as of this moment.'
      });
    }
    
    return res.status(200).json(activeProducts);
  } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).send('Internal Server Error');
  }
}

// [SECTION] Retrieve a SINGLE product
export async function getProductById(req, res){
  console.log('This is getProductById function');
  console.log(req.params);
  try{
    const singleProduct = await Product.findById(req.params.productId)
    // console.log(`singleProduct value: ${singleProduct}`)
    if(!singleProduct){
      return res.status(404).json({
        error: 'Not found',
        message: 'We do not have that product you are looking for'
      });
    } else if (singleProduct.isActive == false){
      return res.send('That product is currently unavailable right now');
    }
    
    return res.status(200).send(singleProduct);
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send('Internal Server Error')
  }
}

// [SECTION - ADMIN] Update Product
export async function updateProduct(req, res) {
  console.log('This is updateProduct function');
  const { productId, isActive, ...updates } = req.body;

  try {
    const productToUpdate = await Product.findByIdAndUpdate(req.params.productId, updates, { new: true });

    if (!productToUpdate) {
      return res.status(404).json({
        error: 'Not found',
        message: 'There is no product with that information'
      });
    };

    return res.status(200).json({
      message: 'Product is successfully updated!',
      product: productToUpdate
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
  };
}

// [SECTION - ADMIN] Archive Product
export async function archiveProduct(req, res) {
  console.log('This is archiveProduct function');
  try {
    const productToArchive = await Product.findById(req.params.productId);

    if (!productToArchive) {
      return res.status(404).json({
        error: 'Not found',
        message: 'There is no product with that information'
      });
    }

    if (productToArchive.isActive === false) {
      return res.status(200).json({
        message: 'Product is already archived',
        product: productToArchive
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { isActive: false },
      { new: true }
    );

    return res.status(200).json({
      message: 'Product is successfully archived!',
      product: updatedProduct
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

// [SECTION - ADMIN] Activate Product
export async function activateProduct(req, res) {
  console.log('This is activateProduct function');
  try {
    const productToActivate = await Product.findById(req.params.productId);

    if (!productToActivate) {
      return res.status(404).json({
        error: 'Not found',
        message: 'There is no product with that information'
      });
    }

    if (productToActivate.isActive === true) {
      return res.status(200).json({
        message: 'Product is already activated',
        product: productToActivate
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { isActive: true },
      { new: true }
    );

    return res.status(200).json({
      message: 'Product is successfully activated!',
      product: updatedProduct
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

// Search
export async function searchProducts(req, res){
    console.log('This is the searchProducts function');
    try {
        const query = {};

        // Building the query dynamically based on provided search criteria
        for (const key in req.query) {
            if (req.query[key]) {
                // Use regex for string fields for partial matching
                query[key] = { $regex: req.query[key], $options: 'i' };
            }
        }

        // If no search criteria are provided, you might want to handle it differently
        if (Object.keys(query).length === 0) {
            return res.status(400).send('Search criteria are required');
        }

        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error in searching products:', error);
        res.status(500).send('Internal Server Error');
  }
}

export default getAllProducts;