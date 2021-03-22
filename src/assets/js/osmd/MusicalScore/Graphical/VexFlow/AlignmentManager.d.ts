import { StaffLine } from "../StaffLine";
export declare class AlignmentManager {
    private parentStaffline;
    private rules;
    constructor(staffline: StaffLine);
    alignDynamicExpressions(): void;
    /**
     * Get distance between two bounding boxes
     * @param a First bounding box
     * @param b Second bounding box
     */
    private getDistance;
    /**
     * Get overlap of two bounding boxes
     * @param a First bounding box
     * @param b Second bounding box
     */
    private getOverlap;
}
