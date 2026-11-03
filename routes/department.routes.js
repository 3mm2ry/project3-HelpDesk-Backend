const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const Department = require("../models/Department");

// Create Department
router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const createDepartment = await Department.create({
        name: req.body.name,
        description: req.body.description,
      });

      res.status(201).json(createDepartment);
    } else {
      return res.status(403).json({ error: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Departments
router.get("/", verifyToken, async (req, res) => {
  try {
    const getAllDepartments = await Department.find();

    res.status(200).json(getAllDepartments);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Department
router.put("/:departmentId/edit", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const updateDepartment = await Department.findByIdAndUpdate(
        req.params.departmentId,
        {
          name: req.body.name,
          description: req.body.description,
        },
        { new: true }
      );

      res.status(200).json(updateDepartment);
    } else {
      return res.status(403).json({ error: "Not authorized" });
    }
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});


 // Delete Department
router.delete("/:departmentId/delete", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const deleteDepartment = await Department.findByIdAndDelete(
        req.params.departmentId
      );

      res.status(200).json(deleteDepartment);
    } else {
      return res.status(403).json({ error: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
