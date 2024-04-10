const Product = require("../models/product.model.js");
const cloudinary = require("../utils/cloudinary.js");

const getAllProductController = async (req, res) => {
    try {
        const product = await Product.find({})
        res.status(200).json({ success: true, message: "All products fetched successfully.", product });
    } catch (error) {
        console.error("Error in get all product controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

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
        const { name, description, price, stock, category } = req.body;
        if (!name || !description || !price || !stock) {
            return res.status(400).json({ success: false, message: "Please provide all fields." });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            stock,
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

        if (product.images && product.images.length > 0) {
            const deletePromises = product.images.map(async (image) => {
                await cloudinary.uploader.destroy(image.public_id);
            });
        
            await Promise.all(deletePromises);
            product.images = [];
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
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

module.exports = {
    getAllProductController,
    getProductByIdController,
    createProductController,
    updateProductController,
    updateImageController,
}