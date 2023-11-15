import { Vector } from "p5";
import { IMesh2D } from "./IMesh2D";

export default class Mesh2D implements IMesh2D {
	numberOfVertices: number = 0;
	numberOfTriangles: number = 0;
	numberOfCorners: number = 0;
	vertices: Vector[] = [];
	corners: number[] = [];
	opposites: number[] = [];

	constructor() {
	}

	buildOTable!: () => void;
	getGeometry!: (cornerId: number) => Vector;
	getVertexId!: (cornerId: number) => number;
	getOppositeCornerId!: (cornerId: number) => number;
	getNextCornerId!: (cornerId: number) => number;
	getPreviousCornerId!: (cornerId: number) => number;
}
