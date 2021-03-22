import { IXmlElement } from "./Xml";
/**
 * Some helper methods to handle MXL files.
 */
export declare class MXLHelper {
    /**
     *
     * @param data
     * @returns {Promise<IXmlElement>}
     * @constructor
     */
    static MXLtoIXmlElement(data: string): Promise<IXmlElement>;
    static MXLtoXMLstring(data: string): Promise<string>;
}
