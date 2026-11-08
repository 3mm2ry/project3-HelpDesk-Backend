
const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const Comment = require("../models/Comment");
const ticket = require("../models/Ticket");

// user should only write on his ticket
router.post("/", verifyToken, async (req, res) => {
  try {
    const { ticket: ticketId, message } = req.body;

    const foundTicket = await ticket.findById(ticketId);

    if (!foundTicket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
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
      return res.status(403).json({
        message: "You cannot comment on this Ticket",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.query.ticket) {
      const foundTicket = await ticket.findById(req.query.ticket);

      if (!foundTicket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      if (
        req.user.role === "Employee" &&
        !foundTicket.createdBy.equals(req.user._id)
      ) {
        return res.status(403).json({
          message: "You cannot access comments on this Ticket",
        });
      }

      const ticketComments = await Comment.find({
        ticket: req.query.ticket,
      }).populate("author");

      return res.json(ticketComments);
    } else {
      if (
        req.user.role === "IT-Staff" ||
        req.user.role === "Admin"
      ) {
        const allComments = await Comment.find()
          .populate("author")
          .populate("ticket");

        return res.json(allComments);
      } else {
        const userTickets = await ticket.find({
          createdBy: req.user._id,
        }).select("_id");

        const ticketIds = userTickets.map((ticket) => ticket._id);

        const allComments = await Comment.find({
          ticket: { $in: ticketIds },
        })
          .populate("author")
          .populate("ticket");

        return res.json(allComments);
      }
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.put("/:commentId/edit", verifyToken, async (req, res) => {
  try {
    const foundComment = await Comment.findById(
      req.params.commentId
    );

    if (!foundComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (foundComment.author.equals(req.user._id)) {
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        { message: req.body.message },
        { new: true }
      );

      return res.json(updatedComment);
    } else {
      return res.status(403).json({
        message: "You cant edit this...",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.delete("/:commentId", verifyToken, async (req, res) => {
  try {
    const foundComment = await Comment.findById(
      req.params.commentId
    );

    if (!foundComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (
      foundComment.author.equals(req.user._id) ||
      req.user.role === "Admin"
    ) {
      const deletedComment = await Comment.findByIdAndDelete(
        req.params.commentId
      );

      return res.json(deletedComment);
    } else {
      return res.status(403).json({
        message: "You cant Delete this...",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
