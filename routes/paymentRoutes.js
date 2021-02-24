const express = require("express");

const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.get("/create-ref/:name", paymentController.generatePaystackREF);

router.route("/:ref").get(paymentController.getRefDoc);

module.exports = router;
