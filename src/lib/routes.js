const express = require("express");
const router = express.Router();

module.exports = (platformApi, giphyApi) => {
    router.post("/classify", async (req, res) => {
        try {
            const result = await platformApi.classifyLyrics(req.body.lyrics);
            return res.json(result);
        } catch (e) {
            if (e.response) {
                res.sendStatus(e.response.status);
                return;
            }
            console.error(e);
            res.sendStatus(500);
        }
    });

    router.get("/image", async (req, res) => {
        try {
            const result = await giphyApi.getImage(req.query.genre);
            return res.json({ image: result });
        } catch (e) {
            if (e.response) {
                res.sendStatus(e.response.status);
                return;
            }
            console.error(e);
            res.sendStatus(500);
        }
    });
    return router;
};