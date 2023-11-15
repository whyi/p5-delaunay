import { Vector } from "p5";
import { IMesh2D } from "./IMesh2D";

const BOUNDARY=-1

interface Triplet {
	a: number;
	b: number;
	c: number;
};

function compareTriples(lhs:Triplet, rhs:Triplet): number {
	if (lhs.a < rhs.a)
		return 1;

	if (lhs.a == rhs.a && lhs.b < rhs.b)
		return 1;

	if (lhs.a == rhs.a && lhs.b == rhs.b && lhs.c < rhs.c)
		return 1;

	return -1;
  }

export default class Mesh2D implements IMesh2D {
	numberOfVertices: number = 0;
	numberOfTriangles: number = 0;
	numberOfCorners: number = 0;
	vertices: Vector[] = [];
	corners: number[] = [];
	opposites: number[] = [];

	constructor() {
	}

	buildOTable(): void {
		this.opposites = Array(this.numberOfCorners).fill(BOUNDARY);

		const triples: Triplet[] = [];

		for (let i = 0; i < this.numberOfCorners; ++i) {
		  const nextCorner = this.getVertexId(this.getNextCornerId(i));
		  const previousCorner = this.getVertexId(this.getPreviousCornerId(i));
		  triples.push({
				a: Math.min(nextCorner,previousCorner),
				b: Math.max(nextCorner,previousCorner),
				c: i
			});
		}
		
		triples.sort(compareTriples);
		
		// just pair up the stuff
		for (let i = 0; i < this.numberOfCorners-1; ++i) {
		  const t1 = triples[i];
		  const t2 = triples[i+1];

		  if (t1.a == t2.a && t1.b == t2.b) {
			this.opposites[t1.c] = t2.c;
			this.opposites[t2.c] = t1.c;
			++i;
		  }
		}
	}

	getGeometry(cornerId: number): Vector {
		return this.vertices[this.getVertexId(cornerId)];
	}

	getVertexId(cornerId: number): number {
		return this.corners[cornerId];
	}

	getOppositeCornerId(cornerId: number): number {
		return this.opposites[cornerId];
	}

	getNextCornerId(cornerId: number): number {
		return cornerId%3 == 2? cornerId-2 : cornerId+1;
	}

	getPreviousCornerId(cornerId: number): number {
		return cornerId%3 == 0? cornerId+2 : cornerId-1;
	}
}

export {BOUNDARY}