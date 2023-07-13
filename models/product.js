const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        title: {type: String},
        price: {type: Number},
        categories: Schema.Types.Mixed,
        stock: {type: Number},
        imageurl: {type: String}
    }
)

module.exports = mongoose.model("Product", ProductSchema, "products");
/// mongoose.model(Modelname, modelschema, collection)