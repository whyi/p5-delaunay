import P5 from "p5";
import Mesh2D, { BOUNDARY } from "./Mesh2D";
import GeometricOperations from "./GeometricOperations";
import Voronoi from "./Primitives/Voronoi";
import Line from "./Primitives/Line";
import Triangle from "./Primitives/Triangle";
import Circle from "./Primitives/Circle";
import IRenderer from "./IRenderer";

export default class DelaunayTriangulation extends Mesh2D {
	private __circumcenters: Array<P5.Vector> = new Array<P5.Vector>();
    private __voronoi: Array<Voronoi> = new Array<Voronoi>();
	private __circumcircleRadius: number[] = [];

    // containers to support rendering
    private __trianglesForRenderer: Array<Triangle> = new Array<Triangle>();
    private __verticesForRenderer: Array<P5.Vector> = new Array<P5.Vector>();
    private __circumcirclesForRenderer: Array<Circle> = new Array<Circle>();

    // renderer
    private __renderer!: IRenderer;

    // renderer control: check for P5 double buffering to remove later.
    private __hasCircumcircles: boolean = false;
    private __hasVoronoi: boolean = false;

    public static TOLERANCE: number = 1;

    constructor(screenSize: number, renderer: IRenderer) {
        super();
        this.__renderer = renderer;
        DelaunayTriangulation.TOLERANCE = Number.EPSILON * screenSize;
        this.initTriangles(screenSize);
    }
      
    private initTriangles(screenSize: number): void {
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

    public render(renderingParameter: { shouldDrawCircumcircles: boolean, shouldDrawVoronoi: boolean }): void {
        this.__renderer.drawTriangles(this.__trianglesForRenderer);
        this.__renderer.drawVertices(this.__verticesForRenderer);

        if (renderingParameter.shouldDrawCircumcircles && this.__hasCircumcircles) {
            this.__renderer.drawCircumcircles(this.__circumcirclesForRenderer);
        }
        
        if (renderingParameter.shouldDrawVoronoi && this.__hasVoronoi) {
            this.__renderer.drawVoronoi(this.__voronoi);
        }
    }

    public computeCircumcircles(): void {
        this.__hasCircumcircles = false;
    
        this.__circumcenters = [];
        this.__circumcircleRadius = [];
        for (let i = 0; i < this.numberOfTriangles; ++i) {
            const cornerId = i*3;
            const triangle = this.getTriangleFromCornerId(cornerId);
            const circumcenter = GeometricOperations.circumcenter(triangle);

            this.__circumcenters.push(circumcenter);
            this.__circumcircleRadius.push(triangle.ptA.dist(circumcenter));
        }
    
        this.__hasCircumcircles = true;
    }

    public computeVoronoi(): void {
        this.__hasVoronoi = false;
    
        this.__voronoi = [];
        
        // traverse, circle around each corner
        for (let i = 0; i < this.numberOfCorners; ++i) {
            const voronoi = new Voronoi();
            let current = i;

            while (1) {
                const ptCurrent: P5.Vector = this.getGeometry(current);
                const ptPrevious: P5.Vector = this.getGeometry(this.getPreviousCornerId(current));
                const ptNext: P5.Vector = this.getGeometry(this.getNextCornerId(current));

                const line1: Line = GeometricOperations.makePerpendicularLineFrom(ptCurrent, ptPrevious);
                const line2: Line = GeometricOperations.makePerpendicularLineFrom(ptCurrent, ptNext);

                const voronoiPoint: P5.Vector = GeometricOperations.intersection(line1.start, line1.end, line2.start, line2.end);
                
                voronoi.vertices.push(voronoiPoint);
                
                current = this.getOppositeCornerId(this.getPreviousCornerId(current));

                if (current == BOUNDARY || this.getOppositeCornerId(current) == BOUNDARY) {
                    // We won't process anything to do with boundary
                    voronoi.vertices = [];
                    break;
                }
    
                if (current == i) {
                    if (voronoi.vertices.length > 0) {
                        this.__voronoi.push(voronoi);
                    }
                    break;
                }
            }
        }

        this.__hasVoronoi = true;
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

        const currentNumberOfTriangles: number = this.numberOfTriangles;

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
        this.computeCircumcircles();
        this.updateRendererData();
    }

    private updateRendererData(): void {
        this.__trianglesForRenderer = [];

        for (let i = 0; i < this.numberOfTriangles; ++i) {
            const cornerId = i*3;
            const triangle = this.getTriangleFromCornerId(cornerId);
            this.__trianglesForRenderer.push(triangle)
        }

        // make a deep copy
        this.__verticesForRenderer = [...this.vertices];
        this.__circumcirclesForRenderer = this.__circumcenters.map(
            (center:P5.Vector, idx:number) => new Circle(center, this.__circumcircleRadius[idx]*2) );
    }

    public isInTriangle(triangleId: number, point: P5.Vector): boolean {
        const cornerId = triangleId*3;
        const triangle = this.getTriangleFromCornerId(cornerId);

        const temp = triangle.ptB;
        triangle.ptB = triangle.ptC;
        triangle.ptC = temp;

        if (GeometricOperations.isLeftTurn(triangle.ptA,triangle.ptB,point) == GeometricOperations.isLeftTurn(triangle.ptB,triangle.ptC,point) &&
            GeometricOperations.isLeftTurn(triangle.ptA,triangle.ptB,point) == GeometricOperations.isLeftTurn(triangle.ptC,triangle.ptA,point)) {
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
        const triangle = this.getTriangleFromCornerId(cornerId);
        const circumcenter = GeometricOperations.circumcenter(triangle);
        const radius = triangle.ptA.dist(circumcenter);
        const oppositePoint = this.getGeometry(this.getOppositeCornerId(cornerId));

        return oppositePoint.dist(circumcenter) > radius;
    }

    private getTriangleFromCornerId(cornerId: number): Triangle {
        const pointA = this.getGeometry(cornerId);
        const pointB = this.getGeometry(this.getPreviousCornerId(cornerId));
        const pointC = this.getGeometry(this.getNextCornerId(cornerId));

        return new Triangle(pointA, pointB, pointC);
    }
}
