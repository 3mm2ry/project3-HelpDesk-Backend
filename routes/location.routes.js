
const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const Location = require("../models/Location");

// Create Location
router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const createLocation = await Location.create({
        building: req.body.building,
        floor: req.body.floor,
        officeNumber: req.body.officeNumber,
        deskNumber: req.body.deskNumber,
        coordinates: {
          x: req.body.coordinates.x,
          y: req.body.coordinates.y,
        },
      });

      res.status(201).json(createLocation);
    } else {
      return res.status(403).json({ error: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


 // Get All Locations
router.get("/", verifyToken, async (req, res) => {
  try {
    const getAllLocations = await Location.find();

    res.status(200).json(getAllLocations);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});


 // Get Location by ID
router.get("/:locationId", verifyToken, async (req, res) => {
  try {
    const getLocationById = await Location.findById(
      req.params.locationId
    );

    res.status(200).json(getLocationById);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


 // Update Location
router.put("/:locationId/edit", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const updateLocation = await Location.findByIdAndUpdate(
        req.params.locationId,
        {
          building: req.body.building,
          floor: req.body.floor,
          officeNumber: req.body.officeNumber,
          deskNumber: req.body.deskNumber,
          coordinates: {
            x: req.body.coordinates.x,
            y: req.body.coordinates.y,
          },
        },
        { new: true }
      );

      res.status(200).json(updateLocation);
    } else {
      return res.status(403).json({ error: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


 // Delete Location
router.delete("/:locationId/delete", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const deleteLocation = await Location.findByIdAndDelete(
        req.params.locationId
      );

      res.status(200).json(deleteLocation);
    } else {
      return res.status(403).json({ error: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
