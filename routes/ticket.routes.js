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

    res.status(201).json(createTicket);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Tickets
router.get("/", verifyToken, async (req, res) => {
  try {
    const getAllTickets = await Ticket.find();

    res.status(200).json(getAllTickets);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});
   
// Get Ticket by ID
router.get("/:ticketId", verifyToken, async (req, res) => {
  try {
    const getTicketById = await Ticket.findById(req.params.ticketId);

    res.status(200).json(getTicketById);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Ticket
router.put("/:ticketId/edit", verifyToken, async (req, res) => {
  try {
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

    res.status(200).json(updateTicket);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Ticket
router.delete("/:ticketId/delete", verifyToken, async (req, res) => {
  try {
    const deleteTicket = await Ticket.findByIdAndDelete(
      req.params.ticketId
    );

    res.status(200).json(deleteTicket);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
