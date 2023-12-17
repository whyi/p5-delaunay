import { Vector } from "p5";

export default class Triangle {
    public ptA!: Vector;
    public ptB!: Vector;
    public ptC!: Vector;

    constructor(ptA: Vector, ptB: Vector, ptC: Vector) {
        this.ptA = ptA;
        this.ptB = ptB;
        this.ptC = ptC;
    }
}