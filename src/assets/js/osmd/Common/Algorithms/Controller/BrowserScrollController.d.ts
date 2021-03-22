import { IControllerOutputListener } from "../../Interfaces/IControllerOutputListener";
import { AbstractNumberController } from "./AbstractNumberController";
export declare class BrowserScrollController implements AbstractNumberController {
    private listener;
    constructor(listener: IControllerOutputListener);
    private currentValue;
    setDirectly(newValue: number): void;
    setExpectedValue(newValue: number): void;
    CurrentValue(): number;
    startControlling(): void;
    stopControlling(): void;
}
