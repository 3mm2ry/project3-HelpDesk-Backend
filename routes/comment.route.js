const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");

// user should only write on his ticket
router.post("/", verifyToken, async (req, res) => {
  try {
    const { ticket: ticketId, message } = req.body;
    const foundTicket = await Ticket.findById(ticketId);
    if (!foundTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

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
      return res
        .status(403)
        .json({ message: "You cannot comment on this Ticket" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.query.ticket) {
      const foundTicket = await Ticket.findById(req.query.ticket);
      if (!foundTicket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      if (
        foundTicket.createdBy.equals(req.user._id) ||
        req.user.role === "IT-Staff" ||
        req.user.role === "Admin"
      ) {
        const ticketComments = await Comment.find({
          ticket: req.query.ticket,
        })
          .populate("author")
          .sort({ createdAt: 1 });
        return res.json(ticketComments);
      } else {
        return res
          .status(403)
          .json({ message: "You are Not authorized to do these...." });
      }
    } else {
      if (req.user.role === "Admin") {
        const allComments = await Comment.find()
          .populate("author")
          .populate("ticket");
        return res.json(allComments);
      } else {
        return res
          .status(404)
          .json({ message: "You are Not authorized to do these...." });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:commentId/edit", verifyToken, async (req, res) => {
  try {
    const foundComment = await Comment.findById(req.params.commentId);

    if (foundComment.author.equals(req.user._id)) {
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        { message: req.body.message },
        { new: true },
      );
      return res.json(updatedComment);
    } else {
      return res.status(404).json({ message: "You cant edit this..." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
////// delete comment only if you are the author of the comment or if you are an admin
router.delete("/:commentId", verifyToken, async (req, res) => {
  try {
    const foundComment = await Comment.findById(req.params.commentId);

    if (foundComment.author.equals(req.user._id) || req.user.role === "Admin") {
      const deletedComment = await Comment.findByIdAndDelete(
        req.params.commentId,
      );
      return res.json(deletedComment);
    } else {
      return res.status(404).json({ message: "You cant Delete this..." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
