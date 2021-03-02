const express = require("express");

const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");

const router = express.Router();

// Routes

router.use(adminController.getLoginTemplate);
// router.use(authController.protect);

router.get("/", adminController.getDashboard);

router.get("/search", adminController.getSearchResults);

router.get("/products/update/:slug", adminController.getUpdateProductForm);
router.get("/products/:slug/delete", adminController.confirmDeleteProduct);
router.get("/products/all", adminController.getAllProducts);

router.get("/categories/all", adminController.getAllCategories);
router.get("/categories/add", adminController.getCategoryForm);
router.get("/categories/:slug/delete", adminController.confirmDeleteCategory);

router.get("/customers/all", adminController.getAllCustomers);

router.get("/orders/all", adminController.getAllOrders);
router.get("/orders/:id/delete", adminController.confirmDeleteOrder);
router.get("/orders/:orderId", adminController.getOrderDetail);
router.get("/sliders/update", adminController.getSliderUpdateForm);

module.exports = router;
