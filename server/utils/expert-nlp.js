const axios = require("axios");

let token = null;

async function fetchToken() {
    const res = await axios.post("https://developer.expert.ai/oauth2/token", {
        username: process.env.EXPERT_AI_USERNAME,
        password: process.env.EXPERT_AI_PASSWORD
    })

    return res.data
}

async function analyseText(text) {
    if (!token) {
        token = await fetchToken();
    }

    try {
        const res = await axios.post("https://nlapi.expert.ai/v2/analyze/standard/en", {
            document: {
                text: text
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data.data;
    } catch (e) {
        if (e.res.statusCode === 401) {
            token = null;
            return analyseText(text);
        }
        throw e;
    }
}

async function classifyText(text, taxonomy) {
    if (!token) {
        token = await fetchToken();
    }

    try {
        const res = await axios.post(`https://nlapi.expert.ai/v2/categorize/${taxonomy}/en`, {
            document: {
                text: text
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data.data;
    } catch (e) {
        if (e.res.statusCode === 401) {
            token = null;
            return classifyText(text, taxonomy);
        }
        throw e;
    }
}

async function classifyTextAllTaxonomy(text) {
    if (!token) {
        token = await fetchToken();
    }

    const taxonomy = ['iptc', 'geotax', 'emotional-traits', 'behavioral-traits']

    try {
        const promises = taxonomy.map(v => classifyText(text, v))
        const results = await Promise.all(promises);
        const res = {}
        taxonomy.forEach((v, i) => res[v] = results[i])

        return res;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    analyseText,
    classifyText,
    classifyTextAllTaxonomy
}
