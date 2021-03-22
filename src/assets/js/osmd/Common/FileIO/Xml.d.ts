/**
 * IXmlAttribute is just the standard Attr
 */
export declare type IXmlAttribute = Attr;
/**
 * Just a wrapper for an XML Element object.
 * It facilitates handling of XML elements by OSMD
 */
export declare class IXmlElement {
    name: string;
    value: string;
    hasAttributes: boolean;
    firstAttribute: IXmlAttribute;
    hasElements: boolean;
    private attrs;
    private elem;
    /**
     * Wraps 'elem' Element in a IXmlElement
     * @param elem
     */
    constructor(elem: Element);
    /**
     * Get the attribute with the given name
     * @param attributeName
     * @returns {Attr}
     */
    attribute(attributeName: string): IXmlAttribute;
    /**
     * Get all attributes
     * @returns {IXmlAttribute[]}
     */
    attributes(): IXmlAttribute[];
    /**
     * Get the first child element with the given node name
     * @param elementName
     * @returns {IXmlElement}
     */
    element(elementName: string): IXmlElement;
    /**
     * Get the children with the given node name (if given, otherwise all child elements)
     * @param nodeName
     * @returns {IXmlElement[]}
     */
    elements(nodeName?: string): IXmlElement[];
}
