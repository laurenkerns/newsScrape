//dependicies 
const mongoose = require("mongoose");

//schema constructor
const Schema = mongoose.Schema;

//new Schema object
const ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    saved: {
        saved: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

const Article = mongoose.model("Article", ArticleSchema);

//export model
module.exports = Article;
