const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const Department = require("../models/Department");
const User = require("../models/User");

// Create Department
router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const createDepartment = await Department.create({
        name: req.body.name,
        description: req.body.description,
      });

      return res.status(201).json(createDepartment);
    } else {
      return res.status(403).json({
        error: "Not authorized",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get All Departments
router.get("/", verifyToken, async (req, res) => {
  try {
    const getAllDepartments = await Department.find();

    return res.status(200).json(getAllDepartments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get Department Users (Admin Only)
router.get("/:departmentId/users", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const getDepartmentUsers = await User.find({
        department: req.params.departmentId,
      });

      return res.status(200).json(getDepartmentUsers);
    } else {
      return res.status(403).json({
        error: "Not authorized",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get Department by ID
router.get("/:departmentId", verifyToken, async (req, res) => {
  try {
    const getDepartmentById = await Department.findById(
      req.params.departmentId
    );

    if (!getDepartmentById) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    return res.status(200).json(getDepartmentById);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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

      if (!updateDepartment) {
        return res.status(404).json({
          message: "Department not found",
        });
      }

      return res.status(200).json(updateDepartment);
    } else {
      return res.status(403).json({
        error: "Not authorized",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete Department
router.delete("/:departmentId/delete", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const deleteDepartment = await Department.findByIdAndDelete(
        req.params.departmentId
      );

      if (!deleteDepartment) {
        return res.status(404).json({
          message: "Department not found",
        });
      }

      return res.status(200).json(deleteDepartment);
    } else {
      return res.status(403).json({
        error: "Not authorized",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;