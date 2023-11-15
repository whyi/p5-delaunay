import { Vector } from "p5";

interface IMesh2D {
    numberOfVertices: number;
    numberOfTriangles: number;
    numberOfCorners: number;
    vertices: Array<Vector>;
    corners: Array<number>;
    opposites: Array<number>;
    buildOTable: () => void;
    GetGeometry:(cornerId: number) => Vector;
    GetVertexId:(cornerId: number) => number;
    GetOppositeCornerId:(cornerId: number) => number;
    GetNextCornerId:(cornerId: number) => number;
    GetPreviousCornerId:(cornerId: number) => number;
}

export {IMesh2D}