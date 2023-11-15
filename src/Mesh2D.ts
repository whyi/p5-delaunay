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

	GetGeometry!: (cornerId: number) => Vector;
	buildOTable!: () => void;
	GetVertexId!: (cornerId: number) => number;
	GetOppositeCornerId!: (cornerId: number) => number;
	GetNextCornerId!: (cornerId: number) => number;
	GetPreviousCornerId!: (cornerId: number) => number;
}
