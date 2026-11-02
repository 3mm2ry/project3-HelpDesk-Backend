
const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const Ticket = require("../models/Ticket");

// Create Ticket
router.post("/", verifyToken, async (req, res) => {
  try {
    const ticket = await Ticket.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      priority: req.body.priority,
      status: req.body.status,
      createdBy: req.user._id,
      assignedTo: req.body.assignedTo,
      contactMethod: req.body.contactMethod,
      slaDeadline: req.body.slaDeadline,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
