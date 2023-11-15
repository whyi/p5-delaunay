import p5 from "p5";
import Mesh2D from "./Mesh2D";

export default class DelaunayTriangulation extends Mesh2D {
    public addPoint(x:number, y:number): void {
        const newPoint = new p5.Vector(x, y);
        this.vertices.push(newPoint);
        ++this.numberOfVertices;
    }
}
