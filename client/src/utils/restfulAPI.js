import axios from 'axios';
import Ajv from 'ajv';

export async function sendServerRequest(requestBody, serverPort=getOriginalServerPort()) {
    try { return await axios.post(`${serverPort}/api/${requestBody.requestType}`, JSON.stringify(requestBody)) }
    catch(error) { return null; }
}

export function getOriginalServerPort() {
    const serverProtocol = location.protocol;
    const serverHost = location.hostname;
    const serverPort = location.port;
    const alternatePort = process.env.SERVER_PORT;
    return `${serverProtocol}\/\/${serverHost}:${(!alternatePort ? serverPort : alternatePort)}`;
}

export function isJsonResponseValid(object, schema) {
    let anotherJsonValidator = new Ajv();
    let validate = anotherJsonValidator.compile(schema);
    return validate(object);
}

export async function getReverseGeoLocation(position) {
    try {
        let response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location=${position.lng},${position.lat}`);
        let json = await response.json();
        return json.address.LongLabel;
    } catch (e) {
        return "";
    }
}