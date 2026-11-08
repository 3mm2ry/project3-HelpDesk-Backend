
const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const comment = require("../models/Comment");
const ticket = require("../models/Ticket");

// user should only write on his ticket
router.post("/", verifyToken, async (req, res) => {
  try {
    const { ticket, message } = req.body;
    const foundTicket = await ticket.findById(ticket);
    if (
      foundTicket.createdBy.equals(req.user._id) ||
      req.user.role === "IT-Staff" ||
      req.user.role === "Admin"
    ) {
      const newComment = await Comment.create({
        ticket: ticketId,
        message: message,
        author: req.user._id,
      });

      return res.status(201).json(newComment);
    } else {
      return res.status(403).json({
        message: "You cannot comment on this Ticket",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.query.ticket) {
      const ticketComments = await Comment.find({
        ticket: req.query.ticket,
      }).populate("author");
      return res.json(ticketComments);
    } else {
      const allComments = await Comment.find()
        .populate("author")
        .populate("ticket");
      return res.json(allComments);
    }
  } catch (err) {
    console.log(err);
  }
});

router.put("/:commentId/edit", verifyToken, async (req, res) => {
  try {
    const foundComment = await Comment.findById(
      req.params.commentId
    );

    if (foundComment.author == req.user._id) {
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        { message: req.body.message },
        { new: true }
      );

      return res.json(updatedComment);
    }
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:commentId", verifyToken, async (req, res) => {
  try {
    const foundComment = await Comment.findById(
      req.params.commentId
    );

    if (foundComment.author == req.user._id || req.user.role === "Admin") {
      const deletedComment = await Comment.findByIdAndDelete(
        req.params.commentId
      );

      return res.json(deletedComment);
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
