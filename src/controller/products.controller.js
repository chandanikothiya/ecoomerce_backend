const { default: mongoose } = require('mongoose');
const products = require('../model/products.model')
const fs = require('fs')

const getproducts = async (req, res) => {
    try {
        const product = await products.find();

        if (!product) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'product not fetch'
            })
        }

        return res.status(200).json({
            success: true,
            data: product,
            message: 'products fetch successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'internal server error at product fetch ' + error.message
        })
    }
}

const addproducts = async (req, res) => {
    console.log("files", req.files)
    console.log("body", req.body)
    try {
        console.log("product", products)
        console.log("NAME:", req.body.name);
        const checkproduct = await products.findOne({ name: req.body.name })

        if (checkproduct) {
            return res.status(400).json({
                success: false,
                data: checkproduct,
                message: 'product alerady exists'
            })
        }
        console.log("STEP 2", checkproduct);

        let pro_img = [];

        let variants = JSON.parse(req.body.variants);
        console.log("parsed variants", variants);

        let vari = []

        variants.map((v, i) => {
            //vari.push({color:v.color})
            const imges = req.files.filter((v) => v.fieldname === `variant_images_${i}`).map(file => file.path);
            console.log(imges)
            vari.push({
                color: v.color,
                images: imges,
                size: v.size,
                quantity: v.quantity,
                isFlashSale: v.isFlashSale,
                flashPrice: v.flashPrice,
                flashStart: v.flashStart,
                flashEnd: v.flashEnd
            })

        })
        console.log("var", vari)

        // req.files.map((v) => {
        //     pro_img.push(v.path)
        // })

        const product = await products.create({ ...req.body, variants: vari });

        if (!product) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'product not add'
            })
        }

        return res.status(200).json({
            success: true,
            data: product,
            message: 'product add successfully'
        })

    } catch (error) {
        console.log(" ERROR:", error); // ✅ ADD THIS

        return res.status(500).json({
            success: false,
            data: null,
            message: 'internal server error at product add ' + error.message
        })
    }
}

const updateproducts = async (req, res) => {
    try {
        console.log("files", req.files)
        console.log("body", req.body)

        const checkproduct = await products.findById(req.params.id);
        console.log("checkproduct", checkproduct)

        let updatdata = { ...req.body, variants: checkproduct.variants }
        console.log("updatdata", updatdata)

        let variants = JSON.parse(req.body.variants);
        let updatedVariants = [];

        variants.forEach((v, i) => {

            const newImages = (req.files || [])
                .filter(file => file.fieldname === `variant_images_${i}`)
                .map(file => file.path);

            const oldImages = checkproduct.variants[i]?.images || [];

            let bodyImages = v.images || [];

            if (!Array.isArray(bodyImages)) {
                bodyImages = [bodyImages];
            }

            // 🔥 VERY IMPORTANT
            bodyImages = bodyImages.filter(img => typeof img === "string");

            console.log("OLD:", oldImages);
            console.log("BODY:", bodyImages);

            // 🔴 delete removed images
            const deletedImages = oldImages.filter(img => !bodyImages.includes(img));

            deletedImages.forEach(img => {
                fs.unlink(img, (err) => {
                    if (err) console.log("delete error", err);
                });
            });

            // ✅ final images
            const finalImages = [...bodyImages, ...newImages];

            updatedVariants.push({
                _id: checkproduct.variants[i]?._id || new mongoose.Types.ObjectId(),
                color: v.color,
                images: finalImages,
                size: v.size,
                quantity: Number(v.quantity),
                isFlashSale: v.isFlashSale,
                flashPrice: v.flashPrice,
                flashStart: v.flashStart,
                flashEnd: v.flashEnd,
                createdAt:
                    checkproduct.variants[i]?.createdAt || new Date(),
            });

        });

        const updatepro = await products.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                price: req.body.price,
                category_id: req.body.category_id,
                discount: req.body.discount,
                variants: updatedVariants,

            },
            { new: true }
        );

        // if (req.files.length > 0) {

        //     let bodyImages = req.body.product_img || [];

        //     if (!Array.isArray(bodyImages)) {
        //         bodyImages = [bodyImages];
        //     }

        //     console.log("ok")
        //     const fimg = checkproduct?.product_img?.filter((v) => !bodyImages.includes(v));
        //     console.log("fimg", fimg)

        //     if (fimg) {
        //         fimg.map((v) => {
        //             fs.unlink(v, (error) => {
        //                 console.log("image not delte at update", error)
        //             })
        //         })
        //     }

        //     let pro_img = [];

        //     req.files.map((v) => {
        //         pro_img.push(v.path)
        //     })

        //     updatdata.product_img = [...bodyImages, ...pro_img]

        // }

        if (!checkproduct) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'product not exists'
            })
        }

        // const oldimages = checkproduct.product_img;
        // let bodyimages = req.body.

        // const updatepro = await products.findByIdAndUpdate(
        //     req.params.id,
        //     updatdata,
        //     { new: true, runValidators: true }
        // )

        if (!updatepro) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'product not update'
            })
        }

        return res.status(200).json({
            success: true,
            data: updatepro,
            message: 'product update successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'internal server error at update product ' + error.message
        })
    }
}

const deleteproducts = async (req, res) => {
    try {

        const checkproduct = await products.findById(req.params.id);

        if (!checkproduct) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'product not exists'
            })
        }


        const delpro = await products.findByIdAndDelete(req.params.id);

        delpro.product_img.map((v) => {
            fs.unlink(v, (error) => {
                console.log("image not delte at update", error)
            })
        })

        if (!delpro) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'product not delete'
            })
        }

        return res.status(200).json({
            success: true,
            data: delpro,
            message: 'product delete successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'internal server error at product delete ' + error.message
        })
    }
}



// const updateVariantDates = async (req, res) => {

//     try {

//         const productsdata = await products.find();

//         for (const product of productsdata) {

//             const updatedVariants = product.variants.map((v) => {

//                 const obj = v.toObject();

//                 // force set product createdAt
//                 obj.createdAt = product.createdAt;

//                 return obj;
//             });

//             await products.updateOne(
//                 { _id: product._id },
//                 { $set: { variants: updatedVariants } }
//             );
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Variant dates updated"
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

module.exports = {
    addproducts,
    getproducts,
    updateproducts,
    deleteproducts,
    
    // updateVariantDates
}