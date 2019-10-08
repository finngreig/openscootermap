import axios from 'axios';

export async function handler(event, context) {
    try {
        const response = await axios.get(`https://vehicles.scootermap.com/api/vehicles?user_location=${event.queryStringParameters.userLat},${event.queryStringParameters.userLon}&northeast_point=${event.queryStringParameters.northEast}&southwest_point=${event.queryStringParameters.southWest}&company=${event.queryStringParameters.company}&mode=ride&randomize=false`,
            {
                headers: {
                    'Origin': 'https://scootermap.com',
                    'Referer': 'https://scootermap.com/map'
                }
            });
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
            body: JSON.stringify({msg: err.message}) // Could be a custom message or object i.e. JSON.stringify(err)
        }
    }
}