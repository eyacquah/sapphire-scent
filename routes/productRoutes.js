const express = require("express");

const productController = require("../controllers/productController");

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.createProduct
  );

router.route("/search").get(productController.getSearchData);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProductInfo
  )
  .delete(productController.deleteProduct);

module.exports = router;
