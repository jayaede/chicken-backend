const Sale = require("../../models/Sale");
const Stock = require("../../models/Stock");
const Gst = require("../../models/GstConfig");

exports.createSale = async (req, res) => {
  const { cutType, weightKg, pricePerKg } = req.body;

  const gst = await Gst.findOne();
  const subTotal = weightKg * pricePerKg;

  const cgst = (subTotal * gst.cgstPercent) / 100;
  const sgst = (subTotal * gst.sgstPercent) / 100;

  await Stock.updateOne(
    { shopId: req.user.shopId, cutType },
    { $inc: { remainingKg: -weightKg } }
  );

  const sale = await Sale.create({
    shopId: req.user.shopId,
    cutType,
    weightKg,
    pricePerKg,
    subTotal,
    cgst,
    sgst,
    gstAmount: cgst + sgst,
    totalAmount: subTotal + cgst + sgst,
    invoiceNo: "INV-" + Date.now()
  });

  res.json(sale);
};
