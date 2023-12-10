import P5 from "p5";
import Mesh2D, { BOUNDARY } from "./Mesh2D";
import GeometricOperations from "./GeometricOperations";
import Voronoi from "./Voronoi";

interface Triangle {
	a: P5.Vector;
	b: P5.Vector;
	c: P5.Vector;
};

export default class DelaunayTriangulation extends Mesh2D {
	private __circumcenters: P5.Vector[] = [];
    private __voronoi: Array<Voronoi> = new Array<Voronoi>();
	private __circumcircleRadius: number[] = [];
    private __P5Instance: P5 | undefined;
    public hasCircumcircles: boolean = false;
    public hasVoronoi: boolean = false;
    public static TOLERANCE: number = 1;
    private __currentCorner: number = 0;

    constructor(screenSize: number, p5Instance?: P5) {
        super();

        if (p5Instance) {
            this.__P5Instance = p5Instance;
        }
        DelaunayTriangulation.TOLERANCE = Number.EPSILON * screenSize;
        this.initTriangles(screenSize);
    }
      
    private initTriangles(screenSize: number) {
        this.vertices = [
            new P5.Vector(0,0),
            new P5.Vector(0,screenSize),
            new P5.Vector(screenSize,screenSize),
            new P5.Vector(screenSize,0)
        ];
        this.numberOfVertices = 4;
        this.corners = [0,1,2,2,3,0];
        this.numberOfTriangles = 2;
        this.numberOfCorners = 6;
        this.buildOTable();
    }

    public computeCircumcenters(): void {
        this.hasCircumcircles = false;
    
        this.__circumcenters = [];
        this.__circumcircleRadius = [];
        for (let i = 0; i < this.numberOfTriangles; ++i) {
            const cornerId = i*3;
            const triangle = this.getTriangleVerticesFromCornerId(cornerId);
            const circumcenter = GeometricOperations.circumcenter(triangle.a, triangle.b, triangle.c);
            this.__circumcenters.push(circumcenter);
            this.__circumcircleRadius.push(triangle.a.dist(circumcenter));
        }
    
        this.hasCircumcircles = true;
    }

    public computeVoronoi(): void {
        this.hasVoronoi = false;
    
        this.__voronoi = [];
        
        // traverse, circle around each corner
        for (let i = 0; i < this.numberOfCorners; ++i) {
            const voronoi = new Voronoi();
            let current = i;

            while (1) {
                const ptCurrent: P5.Vector = this.getGeometry(current);
                const ptPrevious: P5.Vector = this.getGeometry(this.getPreviousCornerId(current));
                const ptNext: P5.Vector = this.getGeometry(this.getNextCornerId(current));
                
                const ptMidEdge1: P5.Vector = GeometricOperations.midVector(ptCurrent, ptPrevious);
                const ptMidEdge2: P5.Vector = GeometricOperations.midVector(ptCurrent, ptNext);
    
                const vecMidEdge1 = new P5.Vector(ptPrevious.x - ptCurrent.x, ptPrevious.y - ptCurrent.y);
                GeometricOperations.leftTurn(vecMidEdge1);
    
                const vecMidEdge2 = new P5.Vector(ptNext.x - ptCurrent.x, ptNext.y - ptCurrent.y);
                GeometricOperations.leftTurn(vecMidEdge2);
    
                const fact = 1024;
                
                const AA = new P5.Vector(ptMidEdge1.x+vecMidEdge1.x*fact, ptMidEdge1.y+vecMidEdge1.y*fact);
                const BB = new P5.Vector(ptMidEdge1.x-vecMidEdge1.x*fact, ptMidEdge1.y-vecMidEdge1.y*fact);
                const CC = new P5.Vector(ptMidEdge2.x+vecMidEdge2.x*fact, ptMidEdge2.y+vecMidEdge2.y*fact);
                const DD = new P5.Vector(ptMidEdge2.x-vecMidEdge2.x*fact, ptMidEdge2.y-vecMidEdge2.y*fact);
                
                const voronoiPoint: P5.Vector = GeometricOperations.intersection(AA, BB, CC, DD);
                
                voronoi.voronoi.push(voronoiPoint);
                current = this.getOppositeCornerId(this.getPreviousCornerId(current));
                if (current == BOUNDARY || this.getOppositeCornerId(current) == BOUNDARY) {
                    // We won't process anything to do with boundary
                    voronoi.voronoi = [];
                    break;
                }
    
                if (current == i) {
                    break;
                }
            }

            if (voronoi.voronoi.length > 0) {
                this.__voronoi.push(voronoi);
            }
        }

        //console.log(`# of voronoi : ${this.__voronoi.length}`);
        this.hasVoronoi = true;
    }

    public isDuplicated(newPoint: P5.Vector): boolean {
        // refactor to use quadtree later on.
        return this.vertices.some((p) => p.dist(newPoint) <= DelaunayTriangulation.TOLERANCE);
    }

    public addPoint(x: number, y: number): void {
        const newPoint = new P5.Vector(x, y);

        if (this.isDuplicated(newPoint)) {
            return;
        }

        this.vertices.push(newPoint);
        ++this.numberOfVertices;

        let currentNumberOfTriangles = this.numberOfTriangles;

        for (let triangleIndex = 0; triangleIndex < currentNumberOfTriangles; ++triangleIndex) {
          if (this.isInTriangle(triangleIndex, newPoint)) {
            const A = triangleIndex*3;
            const B = A+1;
            const C = A+2;
      
            this.corners.push(this.corners[B]);
            this.corners.push(this.corners[C]);
            this.corners.push(this.numberOfVertices-1);
      
            this.corners.push(this.corners[C]);
            this.corners.push(this.corners[A]);
            this.corners.push(this.numberOfVertices-1);
      
            this.corners[C] = this.numberOfVertices-1;
            
            const dirtyCorner1 = C;
            const dirtyCorner2 = this.numberOfTriangles*3+2;
            const dirtyCorner3 = this.numberOfTriangles*3+5;

            this.numberOfTriangles += 2;
            this.numberOfCorners += 6;
            this.fixMesh([dirtyCorner1, dirtyCorner2, dirtyCorner3]);
            break;
          }
        }
        this.computeVoronoi();
    }

    public isInTriangle(triangleId: number, point: P5.Vector): boolean {
        const cornerId = triangleId*3;
        const triangle = this.getTriangleVerticesFromCornerId(cornerId);

        const temp = triangle.b;
        triangle.b = triangle.c;
        triangle.c = temp;

        if (GeometricOperations.isLeftTurn(triangle.a,triangle.b,point) == GeometricOperations.isLeftTurn(triangle.b,triangle.c,point) &&
            GeometricOperations.isLeftTurn(triangle.a,triangle.b,point) == GeometricOperations.isLeftTurn(triangle.c,triangle.a,point)) {
          return true;
        }
      
        return false;
    }

    public fixMesh(dirtyCorners: number[]): void {
        this.buildOTable();
  
        while (dirtyCorners.length > 0) {
          this.flipCorner(dirtyCorners[0]);
          dirtyCorners.shift();
        }
    }

    public flipCorner(cornerId: number): void {
        if (cornerId == BOUNDARY)
            return;

        this.buildOTable();    

        // boundary, do nothing..
        if (this.getOppositeCornerId(cornerId) == BOUNDARY)
            return;

        // already satisfy Delaunay property.
        if (this.isDelaunay(cornerId))
            return;

        const opposite = this.getOppositeCornerId(cornerId);
    
        this.corners[this.getNextCornerId(cornerId)] = this.corners[opposite];
        this.corners[this.getNextCornerId(opposite)] = this.corners[cornerId];
    
        this.buildOTable();
        this.flipCorner(cornerId);
        this.buildOTable();
        this.flipCorner(this.getNextCornerId(opposite));
    }

    public isDelaunay(cornerId: number): boolean {
        const triangle = this.getTriangleVerticesFromCornerId(cornerId);
        const circumcenter = GeometricOperations.circumcenter(triangle.a, triangle.b, triangle.c);
        const radius = triangle.a.dist(circumcenter);
        const oppositePoint = this.getGeometry(this.getOppositeCornerId(cornerId));

        return oppositePoint.dist(circumcenter) > radius;
    }

    /* istanbul ignore next */ 
    public drawTriangles(): void {
        if (!this.__P5Instance)
            return;

        this.__P5Instance.noFill();
        this.__P5Instance.strokeWeight(1.0);
        this.__P5Instance.stroke(0,255,0);
      
        for (let i = 0; i < this.numberOfTriangles; ++i) {
          const cornerId = i*3;
          const triangle = this.getTriangleVerticesFromCornerId(cornerId);
          this.__P5Instance.triangle(triangle.a.x, triangle.a.y, triangle.b.x, triangle.b.y, triangle.c.x, triangle.c.y);
        }
      
        this.__P5Instance.strokeWeight(5.0);
        for (let i = 0; i < this.numberOfVertices; ++i) {
          const p = this.vertices[i];
          this.__P5Instance.point(p.x, p.y);
        }
    }

    /* istanbul ignore next */ 
    public drawVoronoi(): void {
        if (!this.__P5Instance)
            return;

        this.__P5Instance.noFill();
        this.__P5Instance.strokeWeight(1.0);
        this.__P5Instance.stroke(255,255,255);

        this.__voronoi.forEach((voronoi: Voronoi) => {
            this.__P5Instance?.beginShape();
                this.__P5Instance?.colorMode(this.__P5Instance?.RGB, 255);
                this.__P5Instance?.stroke(this.__P5Instance?.color(voronoi.red, voronoi.green, voronoi.blue, 50));
                this.__P5Instance?.fill(this.__P5Instance?.color(voronoi.red, voronoi.green, voronoi.blue, 50));
                voronoi.voronoi.forEach((pt: P5.Vector) => this.__P5Instance?.vertex(pt.x, pt.y));
            this.__P5Instance?.endShape(this.__P5Instance?.CLOSE);
        });
    }

    /* istanbul ignore next */ 
    public drawCircumcircles(): void {
        if (!this.__P5Instance)
            return;

        if (this.hasCircumcircles) {
            this.__P5Instance.stroke(255,0,0);
            this.__P5Instance.noFill();
            this.__P5Instance.strokeWeight(1.0);
        
            for (let i = 3; i < this.numberOfTriangles; ++i) {
                this.__P5Instance.stroke(0,0,255);
                this.__P5Instance.fill(0,0,255);

                const circumcenter = this.__circumcenters[i];
                const radius = this.__circumcircleRadius[i]*2;

                this.__P5Instance.ellipse(circumcenter.x, circumcenter.y, 5,5);
                this.__P5Instance.stroke(255,0,0);
                this.__P5Instance.noFill();
                this.__P5Instance.ellipse(circumcenter.x, circumcenter.y, radius, radius);
            }
 
            this.__P5Instance.stroke(0,0,0);
            this.__P5Instance.noFill();
        }
    }

    private getTriangleVerticesFromCornerId(cornerId: number): Triangle {
        const pointA = this.getGeometry(cornerId);
        const pointB = this.getGeometry(this.getPreviousCornerId(cornerId));
        const pointC = this.getGeometry(this.getNextCornerId(cornerId));

        return {a: pointA, b: pointB, c: pointC};
    }
}
