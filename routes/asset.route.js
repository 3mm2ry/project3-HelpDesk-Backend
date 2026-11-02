const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const Asset = require("../models/Assets");

router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "IT-Staff" || req.user.role === "Admin") {
      const { assetTag, name, category, serialNumber, status } = req.body;
      const newAsset = await Asset.create({
        assetTag: assetTag,
        name: name,
        category: category,
        serialNumber: serialNumber,
        status: status,
      });
      return res.status(201).json(newAsset);
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const allAssets = await Asset.find();
    res.json(allAssets);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
