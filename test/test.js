import { expect } from "chai";
import { describe, it } from "mocha";
import mongoose from "mongoose";
import supertest from "supertest";
import { config } from "../src/config/config.js";
import session from "supertest-session"
import { app } from "../src/app.js";


const requester = supertest(`http://localhost:${config.PORT}`);


let testSession = null;

beforeEach(function () {
    testSession = session(app);
});

describe("Prueba proyecto de Tienda", async function () {
    this.timeout(5000);

    before(async function () {
        try {
            await mongoose.connect(config.MONGO_URL);
            console.log("BD Online");
        } catch (error) {
            console.log(error.message);
        }
    })

    describe("Prueba del router de Sessiones", async function () {
        after(async () => {
            await mongoose.connection
                .collection("usuarios")
                .deleteOne({
                    email:"testjs@testjs.com"
                });
        });

        it("La ruta /api/sessions/register, crea un usuario y luego inicia sesión con el mismo", async () => {
            
            let registro = await testSession.post("/api/sessions/register").send({
                first_name: "Fefo", 
                last_name: "testjs",
                age: 26,
                email: "testjs@testjs.com",
                password: "123",
                rol: "user"
            })
            
            // Iniciar sesión para obtener una sesión de usuario autenticada
           let loggeo = await testSession.post("/api/sessions/login")
                .send({ email: "testjs@testjs.com", password: "123" });

                expect(registro.statusCode).to.be.equal(302)
                expect(loggeo.statusCode).to.be.equal(302)


        });
    });

    describe("Prueba del router de Carrito", async function () {
        after(async () => {
            await mongoose.connection
                .collection("carts")
                .deleteMany({
                    isTest: true
                });
        });

        it("La ruta /api/carts, en su metodo POST, permite crear un nuevo carrito vacío", async () => {
            // Iniciar sesión para obtener una sesión de usuario autenticada
            await testSession.post("/api/sessions/login")
                .send({ email: "premium@test.com", password: "123" });

            // Crear un nuevo carrito
            const response = await testSession.post("/api/carts")
                .send({ products: [], isTest: true });

            // console.log(response)
            // Verificar que se haya creado el carrito exitosamente
            expect(response.status).to.equal(201);
            expect(response.body.success).to.be.true;
            expect(response.body.carrito._id).to.exist;

            // Verificar que el carrito está vacío
            expect(response.body.carrito.products).to.be.an("array").that.is.empty;
        });
    });

    describe("Prueba del router de Productos", async function () {

        after(async () => {
            await mongoose.connection
                .collection("products")
                .deleteMany({
                    category: "TESTJS"
                });
        });

        it("La ruta /api/products, en su metodo POST, permite crear un nuevo producto", async () => {

            // Iniciar sesión para obtener una sesión de usuario autenticada
            await testSession.post("/api/sessions/login")
                .send({ email: "premium@test.com", password: "123" });

            // Crear un nuevo producto utilizando la sesión de prueba
            const producto = { title: "prueba_TEST", description: "decripcion test", price: "100", code: "7357", stock: "10", category: "TESTJS" };
            const response = await testSession.post("/api/products")
                .send(producto);

            // Verificar que se haya creado el producto exitosamente
            expect(response.status).to.equal(201);
            expect(response.body.success).to.be.true;
            expect(response.body.producto._id).to.exist;

        })

    })
});
