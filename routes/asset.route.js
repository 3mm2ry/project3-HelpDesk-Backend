const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const Asset = require("../models/Assets");

// Added: Multer Middleware
const upload = require("../middleware/upload");

router.post("/", verifyToken, upload.array("images", 5), async (req, res) => {
  try {
    if (req.user.role === "IT-Staff" || req.user.role === "Admin") {
      const { assetTag, name, category, serialNumber, status } = req.body;
      const newAsset = await Asset.create({
        assetTag: assetTag,
        name: name,
        category: category,
        serialNumber: serialNumber,
        status: status,

        // Added: Save uploaded image paths
        images: req.files.map((file) => `/uploads/${file.filename}`),
      });
      return res.status(201).json(newAsset);
    } else {
      return res
        .status(403)
        .json({ message: "You dont have the previleges to DO this..." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const allAssets = await Asset.find()
      .populate("assignedTo")
      .populate("borrowedBy");
    res.json(allAssets);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/:assetId", verifyToken, async (req, res) => {
  try {
    const foundAsset = await Asset.findById(req.params.assetId)
      .populate("assignedTo")
      .populate("borrowedBy");

    if (!foundAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.json(foundAsset);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:assetId/delete", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "IT-Staff" || req.user.role === "Admin") {
      const foundAsset = await Asset.findById(req.params.assetId);
      if (!foundAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }

      if (
        foundAsset.borrowStatus === "Pending" ||
        foundAsset.borrowStatus === "Borrowed"
      ) {
        return res
          .status(404)
          .json({ message: "This asset is borrowed or has a request" });
      }
      const deletedAsset = await Asset.findByIdAndDelete(req.params.assetId);
      return res.json(deletedAsset);
    } else {
      return res
        .status(404)
        .json({ message: "You dont have the previleges to Delete this..." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:assetId/edit", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "IT-Staff" || req.user.role === "Admin") {
      const foundAsset = await Asset.findById(req.params.assetId);

      if (!foundAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }

      if (
        foundAsset.borrowStatus === "Pending" ||
        foundAsset.borrowStatus === "Borrowed"
      ) {
        return res
          .status(404)
          .json({ message: "You cant edit an asset while it is borrowed" });
      }
      const { assetTag, name, category, serialNumber, status, assignedTo } =
        req.body;
      const updatedAsset = await Asset.findByIdAndUpdate(
        req.params.assetId,
        {
          assetTag: assetTag,
          name: name,
          category: category,
          serialNumber: serialNumber,
          status: status,
          assignedTo: assignedTo,
        },
        { new: true, runValidators: true },
      );
      return res.json(updatedAsset);
    } else {
      return res
        .status(404)
        .json({ message: "You dont have the previleges to edit this..." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/:assetId/borrow", verifyToken, async (req, res) => {
  try {
    const foundAsset = await Asset.findById(req.params.assetId);
    if (!foundAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    if (
      foundAsset.status === "Available" &&
      foundAsset.borrowStatus === "Available"
    ) {
      const updatedAsset = await Asset.findByIdAndUpdate(
        req.params.assetId,
        {
          borrowStatus: "Pending",
          borrowedBy: req.user._id,
          expectedReturnDate: req.body.expectedReturnDate,
        },
        { new: true },
      );
      return res.json(updatedAsset);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:assetId/cancel", verifyToken, async (req, res) => {
  try {
    const foundAsset = await Asset.findById(req.params.assetId);

    if (!foundAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    if (
      foundAsset.borrowStatus === "Pending" &&
      foundAsset.borrowedBy.equals(req.user._id)
    ) {
      const updatedAsset = await Asset.findByIdAndUpdate(
        req.params.assetId,
        {
          borrowStatus: "Available",
          borrowedBy: null,
          expectedReturnDate: null,
        },
        { new: true },
      );
      return res.json(updatedAsset);
    } else {
      return res
        .status(404)
        .json({ message: "You dont have a request on this asset" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:assetId/approve", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "IT-Staff" || req.user.role === "Admin") {
      const updatedAsset = await Asset.findByIdAndUpdate(
        req.params.assetId,
        {
          status: "Borrowed",
          borrowStatus: "Borrowed",
          borrowDate: new Date(),
        },
        { new: true },
      );
      return res.json(updatedAsset);
    } else {
      return res
        .status(404)
        .json({ message: "You dont have the previleges to ADO this..." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:assetId/reject", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "IT-Staff" || req.user.role === "Admin") {
      const foundAsset = await Asset.findById(req.params.assetId);

      if (!foundAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }

      const updatedAsset = await Asset.findByIdAndUpdate(
        req.params.assetId,
        {
          borrowStatus: "Available",
          borrowedBy: null,
          expectedReturnDate: null,
        },
        { new: true },
      );
      return res.json(updatedAsset);
    } else {
      return res
        .status(404)
        .json({ message: "You dont have the previleges to RDO this..." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:assetId/return", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "IT-Staff" || req.user.role === "Admin") {
      const foundAsset = await Asset.findById(req.params.assetId);

      if (!foundAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }

      const updatedAsset = await Asset.findByIdAndUpdate(
        req.params.assetId,
        {
          status: "Available",
          borrowStatus: "Available",
          borrowedBy: null,
          borrowDate: null,
          expectedReturnDate: null,
        },
        { new: true },
      );
      return res.json(updatedAsset);
    } else {
      return res.status(404).json({
        message: "You dont have the previleges to Even try and do this...",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
