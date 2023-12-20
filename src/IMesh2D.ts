import { Vector } from "p5";

export default interface IMesh2D {

    // number of vertices, vertices.length
    get numberOfVertices(): number;

    // readonly access to the vertices that holds 2d coordinates (g-table)
    get vertices(): Array<Vector>;

    // number of triangles, corners.length * 3
    get numberOfTriangles(): number;

    // number of corners
    get numberOfCorners(): number;

    // readonly access to the corner table
    get corners(): Array<number>;

    // readonly access to the opposite table
    get opposites(): Array<number>;

    buildOTable:() => void;
    getGeometry:(cornerId: number) => Vector;
    getVertexId:(cornerId: number) => number;
    getOppositeCornerId:(cornerId: number) => number;
    getNextCornerId:(cornerId: number) => number;
    getPreviousCornerId:(cornerId: number) => number;
}