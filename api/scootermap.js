import axios from 'axios';

module.exports = async (req, res) => {
    try {
        const response = await axios.get(`https://vehicles.scootermap.com/api/vehicles?user_location=${req.query.userLat},${req.query.userLon}&northeast_point=${req.query.northEast}&southwest_point=${req.query.southWest}&company=${req.query.company}&mode=ride&randomize=false`,
            {
                headers: {
                    'Origin': 'https://scootermap.com',
                    'Referer': 'https://scootermap.com/map'
                }
            });
        const data = response.data;
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err.message });
    }
}