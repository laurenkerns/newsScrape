//dependicies 
const mongoose = require("mongoose");

//schema constructor
const Schema = mongoose.Schema;

//new Schema object
const ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

const Article = mongoose.model("Article", ArticleSchema);

//export model
module.exports = Article;
