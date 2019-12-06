const express = require("express");
const create_router = require("../lib/routes");
const bodyParser = require("body-parser");
const request = require("supertest");
const app = express();

function getClassifyMockResponse() {
    return {"rock": 0.234323, "pop": 0.765677 };
}

function getImageMockResponse(genre) {
    return "https://example.com/genre/" + genre;
}

class MockPlatformApi {
    async classifyLyrics(lyrics) {
        return getClassifyMockResponse();
    }
}

class MockGiphyApi {
    async getImage(genre) {
        return getImageMockResponse(genre);
    }
}

describe("Routes", function() {
    it("check that the classify route accepts correct input", function (done) {
        const routes = create_router(new MockPlatformApi(), new MockGiphyApi());
        app.use(bodyParser.json());
        app.use("/api", routes);
        request(app).post("/api/classify")
          .send({lyrics: "test"})
          .expect("Content-Type", /json/)
          .expect(200, getClassifyMockResponse(), done);
    });
    it("check that the image route accepts correct input and produces right output", function (done) {
        const genre = "pop";
        const routes = create_router(new MockPlatformApi(), new MockGiphyApi());
        app.use(bodyParser.json());
        app.use("/api", routes);
        request(app).get("/api/image?genre=" + genre)
          .expect("Content-Type", /json/)
          .expect(200, { "image": getImageMockResponse(genre) }, done);
    });
});