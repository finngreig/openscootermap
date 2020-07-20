import axios from "axios";

export async function handler(event, context) {

    /*
      Latest version can be checked by sending the user-agent to https://gateway.ridebeam.com/api/versions
    */
    try {
        const response = await axios.get(`https://gateway.ridebeam.com/api/vehicles/scooter/latlong?latitude=${event.queryStringParameters.lat}&longitude=${event.queryStringParameters.lon}`,
            {
                headers: {
                        "x-requested-with": "XMLHttpRequest",
                        "accept": "application/json",
                        "user-agent": "escooterapp/1.36.0; ios",
                        "content-type": "application/json",
                        "accept-language": "en-US"
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
