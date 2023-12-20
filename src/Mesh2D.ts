import { Vector } from "p5";
import IMesh2D from "./IMesh2D";

const BOUNDARY=-1

type Triplet = {
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
	protected _numberOfVertices: number = 0;
	protected _numberOfTriangles: number = 0;
	protected _numberOfCorners: number = 0;
	protected _vertices: Array<Vector> = new Array<Vector>();
	protected _corners: Array<number> = new Array<number>();
	protected _opposites: Array<number> = new Array<number>();

	public buildOTable(): void {
		this._opposites = Array(this.numberOfCorners).fill(BOUNDARY);

		const triples: Array<Triplet> = new Array<Triplet>();

		for (let i = 0; i < this.numberOfCorners; ++i) {
			const nextCorner: number = this.getVertexId(this.getNextCornerId(i));
			const previousCorner: number = this.getVertexId(this.getPreviousCornerId(i));
			triples.push({
				a: Math.min(nextCorner, previousCorner),
				b: Math.max(nextCorner, previousCorner),
				c: i
			});
		}
		
		triples.sort(compareTriples);
		
		// just pair up the stuff
		for (let i = 0; i < this.numberOfCorners-1; ++i) {
			const t1: Triplet = triples[i];
			const t2: Triplet = triples[i+1];

			if (t1.a == t2.a && t1.b == t2.b) {
				this.opposites[t1.c] = t2.c;
				this.opposites[t2.c] = t1.c;
				++i;
			}
		}
	}

	public get numberOfVertices(): number {
		return this._numberOfVertices;
	}

	public get vertices(): Array<Vector> {
		return this._vertices;
	}

	public get numberOfTriangles(): number {
		return this._numberOfTriangles;
	}

	public get numberOfCorners(): number {
		return this._numberOfCorners;
	}

	public get corners(): Array<number> {
		return this._corners;
	}

	public get opposites(): Array<number> {
		return this._opposites;
	}

	public getGeometry(cornerId: number): Vector {
		return this.vertices[this.getVertexId(cornerId)];
	}

	public getVertexId(cornerId: number): number {
		return this.corners[cornerId];
	}

	public getOppositeCornerId(cornerId: number): number {
		return this.opposites[cornerId];
	}

	public getNextCornerId(cornerId: number): number {
		return cornerId%3 == 2? cornerId-2 : cornerId+1;
	}

	public getPreviousCornerId(cornerId: number): number {
		return cornerId%3 == 0? cornerId+2 : cornerId-1;
	}
}

export {BOUNDARY}