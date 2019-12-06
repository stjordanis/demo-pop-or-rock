const axios = require("axios");
const querystring = require("querystring");

class PeltarionApi {
    constructor(config) {
        this._endpoint = config.endpoint;
        this._token = config.token;
    }

    async classifyLyrics(lyrics) {
        const response = await axios.post(
          this._endpoint,
          querystring.encode({ lyrics: lyrics}),
          { headers: { "Authorization": `Bearer ${this._token}` }
          });
        return response.data;
    }
}

module.exports = PeltarionApi;