// IN USER MODEL ONLY ADMIN CAN ACCESS THE WHOLE ROUTE + ASSOSIATED ROUTES.

const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User");

router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const allUsers = await User.find()
        .populate("department")
        .populate("location");
      return res.json(allUsers);
    } else {
      return res
        .status(404)
        .json({ message: "You dont have the prevliges to do this..." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
router.get("/me", verifyToken, async (req, res) => {
  try {
    const foundUser = await User.findById(req.user._id)
      .populate("department")
      .populate("location");
    res.json(foundUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const foundUser = await User.findById(req.params.userId)
        .populate("department")
        .populate("location");

      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(foundUser);
    } else {
      return res
        .status(404)
        .json({ message: "You dont have the previleges to see this..." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:userId/edit", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const { username, email, role, department, location } = req.body;
      if (req.params.userId === req.user._id && role && role !== "Admin") {
        return res
          .status(400)
          .json({ message: "You cant remove your own Admin role" });
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          username: username,
          email: email,
          role: role,
          department: department,
          location: location,
        },
        { new: true, runValidators: true },
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(updatedUser);
    } else {
      return res
        .status(404)
        .json({ message: "You dont have the previleges to edit this..." });
    }
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      if (req.params.userId === req.user._id) {
        return res.status(400).json({ message: "You cant delete yourself" });
      }

      const assignedAsset = await Asset.findOne({
        assignedTo: req.params.userId,
      });
      const borrowedAsset = await Asset.findOne({
        borrowedBy: req.params.userId,
      });

      if (assignedAsset || borrowedAsset) {
        return res
          .status(400)
          .json({ message: "This user still has an asset, return it first" });
      }
      const deletedUser = await User.findByIdAndDelete(req.params.userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(deletedUser);
    } else {
      return res
        .status(404)
        .json({ message: "You dont have the previleges to DELETE this..." });
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
