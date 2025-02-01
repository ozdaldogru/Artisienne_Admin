import mongoose from "mongoose";


const DrawingSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  price: { 
    type: mongoose.Schema.Types.Decimal128, 
    get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) },
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  media: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { toJSON: { getters: true } });

const Drawing = mongoose.models.Drawing || mongoose.model("Drawing", DrawingSchema);
export default Drawing;


