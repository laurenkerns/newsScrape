//dependicies 
const mongoose = require("mongoose");

//schema constructor
const Schema = mongoose.Schema;

//new note Schema object
const NoteSchema = new Schema ({
    title: {
        type: String
    },
    body: {
        type: String
    }
});

const Note = mongoose.model("Note", NoteSchema);

//export model
module.exports = Note;
