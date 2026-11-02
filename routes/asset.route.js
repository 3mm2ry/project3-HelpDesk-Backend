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

router.get("/:assetId", verifyToken, async (req, res) => {
  try {
    const foundAsset = await Asset.findById(req.params.assetId);
    res.json(foundAsset);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:assetId", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "IT-Staff" || req.user.role === "Admin") {
      const deletedAsset = await Asset.findByIdAndDelete(req.params.assetId);
      return res.json(deletedAsset);
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
