const User = require('../routes/usersRouter')
const request = require("supertest");
const express = require("express");
const {initializeMongoServer, closeMongoServer} = require("./mongoConfigTesting");
const app = express();

app.use(express.json());
app.use("/", User);

const db_instance = [];

describe('User', () => {

    beforeAll(async () => {
        const memory_server = await initializeMongoServer();
        db_instance[0] = memory_server;
    });
    
    afterAll(async () => {
        await db_instance[0].stop();
        await closeMongoServer();
    })

    // close connection setup...

    test("User test endpoint working", done => {
        request(app).get("/test").expect(200, done);
    })

    test("Find non-existant user", done => {
        request(app).get("/some_user").expect(204, done);
    })

    test("Create user", done => {
        request(app).post("/").send({
            username: "test_adam",
            password: "solemon"
        }).expect({message: "Successfully created User"}).expect(200, done);
    })

    test("Find existing user", done => {
        request(app).get("/test_adam").expect(function(res) {
            expect(res.body).toEqual(
                {
                _id: expect.any(String),
                username: 'test_adam',
                password: 'solemon',
                __v: expect.any(Number)
            })
        }).expect(200, done);
    })
})