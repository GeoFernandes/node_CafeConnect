import mongoose, { Schema } from "mongoose";

const ContadorSchema = new Schema({
  model: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

export default mongoose.model("Counter", ContadorSchema);