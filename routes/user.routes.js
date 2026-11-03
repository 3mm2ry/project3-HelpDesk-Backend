// IN USER MODEL ONLY ADMIN CAN ACCESS THE WHOLE ROUTE + ASSOSIATED ROUTES

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

module.exports = router;
