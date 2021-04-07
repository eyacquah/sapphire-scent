const express = require("express");

const orderController = require("../controllers/orderController");

const router = express.Router();

// router.get("/test", orderController.testPaystack);

router.get("/create-ref/:name", orderController.generatePaystackREF);

router.route("/:ref").get(orderController.verifyPaystackTransaction);

router.post("/charge-success", orderController.handleChargeSuccess);

router
  .route("/")
  .get(orderController.getAllOrders)
  .post(orderController.handleCashOnDelivery);

router
  .route("/:id")
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
