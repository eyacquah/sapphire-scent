const express = require("express");

const webController = require("../controllers/webController");

const router = express.Router();

// Middleware for all
router.use(webController.getAllCategories);

// Routes
router.get("/", webController.getIndex);
router.get("/search", webController.getSearchResults);
router.get("/checkout", webController.getCheckoutPage);

router.get("/categories/:categorySlug", webController.getCategoryProducts);
router.get("/products/:slug", webController.getProductDetail);
router.get("/products/:slug/view", webController.getQuickView);
router.get("/orders/:orderID", webController.getOrderCompletePage);

module.exports = router;
