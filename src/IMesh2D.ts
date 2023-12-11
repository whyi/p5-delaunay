import { Vector } from "p5";

export default interface IMesh2D {
    numberOfVertices: number;
    numberOfTriangles: number;
    numberOfCorners: number;
    vertices: Array<Vector>;
    corners: Array<number>;
    opposites: Array<number>;
    buildOTable: () => void;
    getGeometry:(cornerId: number) => Vector;
    getVertexId:(cornerId: number) => number;
    getOppositeCornerId:(cornerId: number) => number;
    getNextCornerId:(cornerId: number) => number;
    getPreviousCornerId:(cornerId: number) => number;
}