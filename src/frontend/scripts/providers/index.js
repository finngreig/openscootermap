import {Lime} from "./lime";
import {Onzo} from "./onzo";
import {Jump} from "./jump";

/*
Please note that provider loader functions should return an array of vehicle objects, based on this common object format:
    {
        id: Number || String,
        lat: Number,
        lon: Number,
        battery: Number || String
    }
 */

export {
    Lime,
    Onzo,
    Jump
}
