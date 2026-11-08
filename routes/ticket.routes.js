const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const Ticket = require("../models/Ticket");

// Create Ticket
router.post("/", verifyToken, async (req, res) => {
  try {
    const createTicket = await Ticket.create({
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

    return res.status(201).json(createTicket);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get All Tickets
router.get("/", verifyToken, async (req, res) => {
  try {
    let getAllTickets;

    if (req.user.role === "Employee") {
      getAllTickets = await Ticket.find({
        createdBy: req.user._id,
      });
    } else {
      getAllTickets = await Ticket.find();
    }

    return res.status(200).json(getAllTickets);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get Ticket by ID
router.get("/:ticketId", verifyToken, async (req, res) => {
  try {
    const getTicketById = await Ticket.findById(
      req.params.ticketId
    );

    if (!getTicketById) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    if (
      req.user.role === "Employee" &&
      getTicketById.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You cannot access this Ticket",
      });
    }

    return res.status(200).json(getTicketById);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update Ticket
router.put("/:ticketId/edit", verifyToken, async (req, res) => {
  try {
    const foundTicket = await Ticket.findById(
      req.params.ticketId
    );

    if (!foundTicket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    if (
      req.user.role === "Employee" &&
      foundTicket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You cannot update this Ticket",
      });
    }

    const updateTicket = await Ticket.findByIdAndUpdate(
      req.params.ticketId,
      {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        priority: req.body.priority,
        status: req.body.status,
        assignedTo: req.body.assignedTo,
        contactMethod: req.body.contactMethod,
        slaDeadline: req.body.slaDeadline,
      },
      { new: true }
    );

    return res.status(200).json(updateTicket);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete Ticket
router.delete("/:ticketId/delete", verifyToken, async (req, res) => {
  try {
    const foundTicket = await Ticket.findById(
      req.params.ticketId
    );

    if (!foundTicket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    if (
      req.user.role === "Employee" &&
      foundTicket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You cannot delete this Ticket",
      });
    }

    const deleteTicket = await Ticket.findByIdAndDelete(
      req.params.ticketId
    );

    return res.status(200).json(deleteTicket);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;