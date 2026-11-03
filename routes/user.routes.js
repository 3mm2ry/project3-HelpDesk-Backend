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
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const foundUser = await User.findById(req.params.userId)
        .populate("department")
        .populate("location");
      return res.json(foundUser);
    }
  } catch (err) {
    console.log(err);
  }
});

router.put("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true },
      );
      return res.json(updatedUser);
    }
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const deletedUser = await User.findByIdAndDelete(req.params.userId);
      return res.json(deletedUser);
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
