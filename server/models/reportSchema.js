const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    image: {
      Data: Buffer,
      contentType: String,
    },
  },
  {
    timestamps: true,
  }
)

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;




