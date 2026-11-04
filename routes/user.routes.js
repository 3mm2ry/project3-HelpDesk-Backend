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
  }
});

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const foundUser = await User.findById(req.params.userId)
        .populate("department")
        .populate("location");
      return res.json(foundUser);
    } else {
      return res
        .status(404)
        .json({ message: "You dont have the previleges to see this..." });
    }
  } catch (err) {
    console.log(err);
  }
});

router.put("/:userId/edit", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true },
      );
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
      const deletedUser = await User.findByIdAndDelete(req.params.userId);
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
