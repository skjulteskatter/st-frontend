export interface IXMLSerializable {
    SerializeToXML(document: XMLDocument, args: Object): Node;
}
