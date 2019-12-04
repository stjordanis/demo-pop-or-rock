const axios = require("axios");
const querystring = require("querystring");

class GiphyApi {
    constructor(config) {
        this._endpoint = config.endpoint;
        this._apiKey = config.apiKey;
    }
    pickImageFromResponse(responseBody) {
        let randomIndex = Math.round(Math.random() * responseBody.data.length);
        return responseBody.data[randomIndex].images.downsized_medium.url;
    }
    async getImage(genre) {
        const params = {
            api_key: this._apiKey,
            limit: 20,
            q: `${genre} music`
        };
        const uri = `${this._endpoint}/v1/gifs/search?${querystring.encode(params)}`;
        const response = await axios.get(uri);
        return this.pickImageFromResponse(response.data);
    }
}

module.exports = GiphyApi;