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

    // build the opposite table
    buildOTable:() => void;

    // get vertex from a corner Id
    getGeometry:(cornerId: number) => Vector;

    // get vertexId from a corner Id
    getVertexId:(cornerId: number) => number;

    // get opposite corner Id from a corner Id
    getOppositeCornerId:(cornerId: number) => number;

    // get the next corner Id from a corner Id
    getNextCornerId:(cornerId: number) => number;

    // get the previous corner Id from a corner Id
    getPreviousCornerId:(cornerId: number) => number;
}