import {Lime} from "./lime"
import {Bird} from "./scootermap";
import {Onzo} from "./onzo";
import {Beam} from "./beam";
import {Flamingo} from "./flamingo";

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
    Beam,
    Bird,
    Flamingo
}
