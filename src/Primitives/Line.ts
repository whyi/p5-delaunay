import { Vector } from "p5";

export default class Line {
    public start!: Vector;
    public end!: Vector;

    constructor(start: Vector, end: Vector) {
        this.start = start;
        this.end = end;
    }
}
