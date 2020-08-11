import axios from "axios";

export async function handler(event, context) {

    try {
        const response = await axios.get(`https://web-production.lime.bike/api/rider/v1/views/map?ne_lat=${event.queryStringParameters.lat}ne_lng=${event.queryStringParameters.lon}`&user_latitude=${event.queryStringParameters.lat}&user_longitude=${event.queryStringParameters.lon}&zoom=12,
            {
                headers: {
                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX3Rva2VuIjoiUFNFQUxQNFQ0WVlaWCIsImxvZ2luX2NvdW50IjoxfQ.IwZCyO423W_YrtXLR3W9JGtsWIvH-2BcnCiCWj-mrKI",
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
