import axios from "axios";

module.exports = async (req, res) => {
    /*
      Latest version can be checked by sending the user-agent to https://gateway.ridebeam.com/api/versions
    */
      try {
        const response = await axios.get(`https://gateway.ridebeam.com/api/vehicles/scooter/latlong?latitude=${req.query.lat}&longitude=${req.query.lon}`,
            {
                headers: {
                        "x-requested-with": "XMLHttpRequest",
                        "accept": "application/json",
                        "user-agent": "escooterapp/1.17.0; android",
                        "content-type": "application/json",
                        "accept-language": "en-US"
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