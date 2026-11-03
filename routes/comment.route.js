const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const comment = require("../models/Comment");

router.post("/", verifyToken, async (req, res) => {
  try {
    const { ticket, message } = req.body;
    const newComment = await comment.create({
      ticket: ticket,
      message: message,
      author: req.user._id,
    });
    res.status(201).json(newComment);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
