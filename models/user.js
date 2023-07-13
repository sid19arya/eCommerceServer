const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {type: String},
        password: {type: String},
        created: {type: Date},
        cart: Schema.Types.Mixed,
        wishlist: Schema.Types.Mixed,
        coupons: Schema.Types.Mixed
    }
)

module.exports = mongoose.model("User", UserSchema, "users");
/// mongoose.model(Modelname, modelschema, collection)
/// mongoose.model()
// test this out later
// I think if you dont give a collection explicityl itll just put it somehwere
