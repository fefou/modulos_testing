import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const cartsEsquema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
            },
            quantity: Number
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
    isTest: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

cartsEsquema.plugin(paginate)
export const cartsModelo = mongoose.model("carts", cartsEsquema)