import { PresentationBase } from "./base";

class PresentationViewer extends PresentationBase {
    public init() {
        this.initialize("viewer");
    }
}

export const viewer = new PresentationViewer();
