import { Vector } from "p5";

export default class Voronoi {
    public vertices: Array<Vector> = new Array<Vector>();
    // idea 1. gradient by surface area
    // idea 2. just random color
    // idea 3. mix both
    public red: number = Math.random()*255;
    public green: number = Math.random()*255;
    public blue: number = Math.random()*255;
}
