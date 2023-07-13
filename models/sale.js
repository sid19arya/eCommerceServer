const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SaleSchema = new Schema(
    {
        products: Schema.Types.Mixed,
        value: {type: Number},
        date: {type: Date}
    }
)

module.exports = mongoose.model("Sale", SaleSchema, "sales");
/// mongoose.model(Modelname, modelschema, collection)