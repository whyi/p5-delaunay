import { Vector } from "p5";
import { IMesh2D } from "./IMesh2D";

export default class Mesh2D implements IMesh2D {
	numberOfVertices!: number;
	numberOfTriangles!: number;
	numberOfCorners!: number;

	constructor() {
	}
	GetGeometry!: (cornerId: number) => Vector;
	buildOTable!: () => void;
	GetVertexId!: (cornerId: number) => number;
	GetOppositeCornerId!: (cornerId: number) => number;
	GetNextCornerId!: (cornerId: number) => number;
	GetPreviousCornerId!: (cornerId: number) => number;
}
