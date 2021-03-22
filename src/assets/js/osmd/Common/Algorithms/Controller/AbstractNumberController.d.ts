export interface AbstractNumberController {
    CurrentValue(): number;
    setDirectly(newValue: number): void;
    setExpectedValue(newValue: number): void;
    startControlling(): void;
    stopControlling(): void;
}
