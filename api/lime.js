import axios from "axios";

module.exports = async (req, res) => {
    try {
        const response = await axios.get(`https://web-production.lime.bike/api/rider/v1/views/map?ne_lat=${req.query.northEastLat}&ne_lng=${req.query.northEastLon}&user_latitude=${req.query.userLat}&user_longitude=${req.query.userLon}&sw_lat=${req.query.southWestLat}&sw_lng=${req.query.southWestLon}&zoom=16`,
            {
                headers: {
                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX3Rva2VuIjoiUFNFQUxQNFQ0WVlaWCIsImxvZ2luX2NvdW50IjoxfQ.IwZCyO423W_YrtXLR3W9JGtsWIvH-2BcnCiCWj-mrKI",
                    }
            }
        );
        const data = response.data;
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err.message });
    }
}