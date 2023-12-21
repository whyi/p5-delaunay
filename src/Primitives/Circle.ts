import { Vector } from "p5";

export default class Circle {
    private __center!: Vector;
    public radius!: number;

    constructor(center: Vector, radius: number) {
        this.__center = center;
        this.radius = radius;
    }

    public get x(): number {
        return this.__center.x;
    }

    public get y(): number {
        return this.__center.y;
    }
}