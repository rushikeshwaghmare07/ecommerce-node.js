const Product = require("../models/product.model.js");
const cloudinary = require("../utils/cloudinary.js");
const Category = require("../models/category.model.js");

const getAllProductController = async (req, res) => {
    try {
        const { keyword, category } = req.query;

        const product = await Product.find({
            name: {
                $regex: keyword ? keyword: "",
                $options: "i",
            },
        });

        res.status(200).json({ success: true, message: "All products fetched successfully.", totalProduct: product.length, product });
    } catch (error) {
        console.error("Error in get all product controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getTopProductController = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ rating: -1 }).limit(3)
        res.status(200).json({ success: true, message: "Top 3 products.", products });
    } catch (error) {
        console.error("Error in get top product controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getProductByIdController = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });  
        }
        res.status(200).json({ success: true, message: "Product fetched successfully.", product});
    } catch (error) {
        console.error("Error in get single product controller: ", error);
        if (error === "CastError") {
            return res.status(500).json({ success: false, message: "Invalid ID" });
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const createProductController = async (req, res) => {
    try {
        const { name, description, price, stock, quantity } = req.body;
        if (!name || !description || !price || !stock || !quantity) {
            return res.status(400).json({ success: false, message: "Please provide all fields." });
        }

        const category = await Category.findById(req.body.category);
        if(!category) return res.status(400).send('Invalid Category')

        const result = await cloudinary.uploader.upload(req.file.path);

        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            quantity,
            images: [
                {
                    public_id: result.public_id,
                    url: result.secure_url
                }
            ]
        });
        
        res.status(201).json({ success: true, message: "Product created successfully.", newProduct });

    } catch (error) {
        console.error("Error in create product controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

const updateProductController = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const updatedProduct = { name, description, price, stock, category };

        const product = await Product.findByIdAndUpdate(req.params.id, updatedProduct, {
            new: true,
            runValidators: true
        });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found!!"});
        }

        res.status(201).json({ success: true, message: "Product updated successfully.", product });
    } catch (error) {
        console.error("Error in update product controller: ", error);
        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid product ID format." });
        };
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

const updateImageController = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: "Please provide an image file." });
        }        

        const updatedImage = await cloudinary.uploader.upload(file.path);

        product.images.push({
            public_id: updatedImage.public_id,
            url: updatedImage.secure_url
        });

        await product.save();
        res.status(200).json({ success: true, message: "Product image updated successfully." });

    } catch (error) {
        console.error("Error in update product image controller: ", error);
        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid product ID format." });
        };
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

const deleteProductImageController = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found !!" });
        }

        // find the index of the image to delete
        const imageId = req.query.id;
        if (!imageId) { 
            return res.status(404).json({ success: false, message: "Product image ID not provided !!" });
        }

        const index = product.images.findIndex(item => item._id.toString() === imageId.toString());
        if (index === -1) { 
            return res.status(404).json({ success: false, message: "Image Not Found !!" });
        }

        // delete product image from cloudinary
        await cloudinary.uploader.destroy(product.images[index].public_id);

        // remove the image from the product's image array
        product.images.splice(index, 1);

        // save the updated product
        await product.save();

        res.status(200).json({ success: true, message: "Product image deleted successfully." });
    } catch (error) {
        console.error("Error in delete product image controller: ", error);
        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid product ID format." });
        };
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

const deleteProductController = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found !!" });
        }

        // deleting all the images of the product from cloudinary
        for (const image of product.images) {
            await cloudinary.uploader.destroy(image.public_id);
        }

        // delete the product from the database
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Product deleted successfully." });
    } catch (error) {
        console.error("Error in delete product controller: ", error);
        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid product ID format." });
        };
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

const productReviewController = async (req, res) => {
    try {
        const { comment, rating } = req.body;

        const product = await Product.findById(req.params.id);

        // check previous review
        const alreadyReviewed = product.reviews.some( (r) => r.user.toString() === req.user._id.toString() );
        if (alreadyReviewed) {
            return res.status(400).send({ success: false, message: "Product already reviewed" });
        };

         // review object
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        // passing review object to reviews array
        product.reviews.push(review);

        // update the number of reviews and calculate the average rating
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((total, review) => total + review.rating, 0) / product.reviews.length;

        await product.save();

        res.status(200).send({ success: true, message: "Review added successfully." });
    } catch (error) {
        console.error("Error in product review controller: ", error);
        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid product ID format." });
        };
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

module.exports = {
    getAllProductController,
    getTopProductController,
    getProductByIdController,
    createProductController,
    updateProductController,
    updateImageController,
    deleteProductImageController,
    deleteProductController,
    productReviewController
}