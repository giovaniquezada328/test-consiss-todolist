import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const task = new mongoose.Schema({
    title: String,
    status: {
        type: String,
        default: 'pendiente'
    },
    date: { type: Date, default: Date.now },
    description: {
        type: String,
        default: null,
    },
});

const Task = mongoose.model('Task', task);

module.exports = Task;