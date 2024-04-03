import { expect } from "chai";
import { describe, it } from "mocha";
import mongoose from "mongoose";
import supertest from "supertest";
import { config } from "../src/config/config.js";


const requester = supertest(`http://localhost:/3000`);

describe("Prueba proyecto de Tienda", async function () {
    this.timeout(50000);

    before(async function () {
        try {
            await mongoose.connect(config.MONGO_URL);
            console.log("BD Online");
        } catch (error) {
            console.log(error.message);
        }
    })

    // describe("Prueba del router de Carrito", async function () {
    //     after(async () => { });

    //     it("La ruta /api/carts, en su metodo POST, permite crear un nuevo carrito vacío ", async () => {
    //         let carrito = { products: [] };

    //         let { statusCode, body, ok } = await requester
    //             .post("/api/carts")
    //             .send(carrito);

    //         expect(statusCode).to.be.equal(201);
    //         expect(ok).to.be.true;
    //         expect(body.payload._id).to.exist;
    //         expect(body.status).to.exist.and.to.be.equal("success");
    //     });
    // });

    describe("Prueba del router de Productos", async function () {

        it("La ruta /api/products, en su metodo POST, permite crear un nuevo producto", async () => {

            let producto = { title: "prueba_TEST", description: "decripcion test", price: "100", code: "73571", stock: "10", category: "TESTJS" }

            let resultado = await requester.post("/api/products").send(producto)

            console.log(resultado)

        })


    })
});
