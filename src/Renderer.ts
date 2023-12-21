import P5 from "p5";
import IRenderer from './IRenderer'
import Triangle from './Primitives/Triangle'
import Voronoi from "./Primitives/Voronoi";
import Circle from "./Primitives/Circle";

export default class Renderer implements IRenderer {
    private __p5Instance!: P5;

    constructor(p5Instance: P5) {
        this.__p5Instance = p5Instance;
    }
    
    public drawTriangles(triangles: Array<Triangle>): void {
        this.__p5Instance.noFill();
        this.__p5Instance.strokeWeight(1.0);
        this.__p5Instance.stroke(0,255,0);
      
        triangles.forEach((triangle: Triangle) => {
            this.__p5Instance.triangle(
                triangle.ptA.x, triangle.ptA.y,
                triangle.ptB.x, triangle.ptB.y,
                triangle.ptC.x, triangle.ptC.y);
        });
    }

    public drawVertices(vertices: Array<P5.Vector>): void {
        this.__p5Instance.strokeWeight(5.0);
        vertices.forEach((p: P5.Vector) => this.__p5Instance.point(p.x, p.y));
    }

    public drawVoronoi(voronoiRegions: Array<Voronoi>): void {
        this.__p5Instance.noFill();
        this.__p5Instance.strokeWeight(1.0);
        this.__p5Instance.stroke(255,255,255);

        voronoiRegions.forEach((voronoiRegion: Voronoi) => {
            this.__p5Instance?.beginShape();
                this.__p5Instance?.colorMode(this.__p5Instance?.RGB, 255);
                this.__p5Instance?.stroke(this.__p5Instance?.color(voronoiRegion.red, voronoiRegion.green, voronoiRegion.blue, 50));
                this.__p5Instance?.fill(this.__p5Instance?.color(voronoiRegion.red, voronoiRegion.green, voronoiRegion.blue, 50));
                voronoiRegion.vertices.forEach((pt: P5.Vector) => this.__p5Instance?.vertex(pt.x, pt.y));
            this.__p5Instance?.endShape(this.__p5Instance?.CLOSE);
        });
    }

    public drawCircumcircles(circumcircles: Array<Circle>): void {
        this.__p5Instance.noFill();
        this.__p5Instance.strokeWeight(1.0);

        circumcircles.forEach((circle: Circle) => {
            // center
            this.__p5Instance.stroke(0,0,255);
            this.__p5Instance.ellipse(circle.x, circle.y, 5, 5);

            // actual circle
            this.__p5Instance.stroke(255,0,0);
            this.__p5Instance.ellipse(circle.x, circle.y, circle.radius);
        });
    }
}
