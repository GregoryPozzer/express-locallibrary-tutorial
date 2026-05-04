
const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const musicaSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.ObjectId, ref: "Author", required: true },
  ano: { type: Number, required: true },

});

// Virtual para URL

musicaSchema.virtual("url").get(function () {
  return "/catalog/musica/" + this._id;

});

// Exporta o model
module.exports = mongoose.model("Musica", musicaSchema);