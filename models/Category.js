const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
