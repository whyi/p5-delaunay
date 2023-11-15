import p5 from "p5";
import Mesh2D from "./Mesh2D";
import GeometricOperations from "./GeometricOperations";

export default class DelaunayTriangulation extends Mesh2D {
    public addPoint(x:number, y:number): void {
        const newPoint = new p5.Vector(x, y);
        this.vertices.push(newPoint);
        ++this.numberOfVertices;
    }

    public isInTriangle(triangleId:number, point:p5.Vector): boolean {
        const cornerId = triangleId*3;
        const pointA = this.getGeometry(cornerId);
        const pointB = this.getGeometry(this.getNextCornerId(cornerId));
        const pointC = this.getGeometry(this.getPreviousCornerId(cornerId));
        
        if (GeometricOperations.isLeftTurn(pointA,pointB,point) == GeometricOperations.isLeftTurn(pointB,pointC,point) &&
            GeometricOperations.isLeftTurn(pointA,pointB,point) == GeometricOperations.isLeftTurn(pointC,pointA,point)) {
          return true;
        }
      
        return false;
    }
}
