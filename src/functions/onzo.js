import axios from "axios";

export async function handler(event, context) {
    try {
        const response = await axios.get(`https://app.onzo.co.nz/nearby/${event.queryStringParameters.lat}/${event.queryStringParameters.lon}/${event.queryStringParameters.range}.json`,
            {
                headers: {
                        "Accept": "application/json, text/plain, */*",
                        "Origin": "https://app.onzo.co.nz",
                        "Referer": "https://app.onzo.co.nz/nearby",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0"
                    }
            }
        );
        const data = response.data;
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
        }
    }
}