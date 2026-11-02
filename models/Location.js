const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    building: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    officeNumber: {
      type: String,
    },
    deskNumber: {
      type: String,
    },
    coordinates: {
      x: {
        type: Number,
      },
      y: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
