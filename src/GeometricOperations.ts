import P5 from "p5";
import Line from "./Primitives/Line";
import Triangle from "./Primitives/Triangle";

export default abstract class GeometricOperations {
    public static cross2D(U: P5.Vector, V: P5.Vector): number {
        return U.x*V.y - U.y*V.x;
    }

    public static isLeftTurn(A: P5.Vector, B: P5.Vector, C: P5.Vector): boolean {
        const v1 = new P5.Vector(B.x-A.x, B.y-A.y);
        const v2 = new P5.Vector(C.x-B.x, C.y-B.y);
    
        return GeometricOperations.cross2D(v1, v2) > 0;
    }

    public static intersection(S: P5.Vector, SE: P5.Vector, Q: P5.Vector, QE: P5.Vector): P5.Vector {
        const tangent = new P5.Vector(SE.x-S.x, SE.y-S.y);

        const normalVector = new P5.Vector(QE.x-Q.x, QE.y-Q.y);
        normalVector.normalize();

        GeometricOperations.leftTurn(normalVector);

        const QS = new P5.Vector(S.x-Q.x, S.y-Q.y);
        const QSDotNormal = QS.dot(normalVector);
        const tangentDotNormal = tangent.dot(normalVector);
        const t = -QSDotNormal/tangentDotNormal;

        if (!isFinite(t)) {
            // return an undefined vector
            return new P5.Vector(undefined, undefined);
        }

        tangent.mult(t);

        return new P5.Vector(S.x+tangent.x,S.y+tangent.y);
    }

    public static midVector(A: P5.Vector, B: P5.Vector): P5.Vector {
        return new P5.Vector((A.x + B.x)/2, (A.y + B.y)/2);
    }

    public static circumcenter(triangle: Triangle): P5.Vector {
        const midAB = GeometricOperations.midVector(triangle.ptA, triangle.ptB);
        const vecAB = GeometricOperations.makeLeftTurnedVectorFrom(triangle.ptA, triangle.ptB);
        const line1 = GeometricOperations.makeLineCoordinatesFrom(midAB, vecAB);

        const midBC = GeometricOperations.midVector(triangle.ptB, triangle.ptC);
        const vecBC = GeometricOperations.makeLeftTurnedVectorFrom(triangle.ptB, triangle.ptC);
        const line2 = GeometricOperations.makeLineCoordinatesFrom(midBC, vecBC);

        return GeometricOperations.intersection(line1.start, line1.end, line2.start, line2.end);  
    }

    public static leftTurn(v: P5.Vector): void {
        const tmp = v.x;
        v.x = -v.y;
        v.y = tmp;
    }

    // Returns a pair of coordinates (start and end) of an elongated line constructed from the point and vector
    // that vector passes through the point
    public static makeLineCoordinatesFrom(point: P5.Vector, vector: P5.Vector, howLong: number = 100): Line {
        const xFactor: number = vector.x*howLong;
        const yFactor: number = vector.y*howLong;

        return new Line(
            new P5.Vector(point.x+xFactor, point.y+yFactor),
            new P5.Vector(point.x-xFactor, point.y-yFactor)
        )
    }

    public static makePerpendicularLineFrom(pointA: P5.Vector, pointB: P5.Vector): Line {
        const ptMidAB: P5.Vector = GeometricOperations.midVector(pointA, pointB);
        const vecAB = new P5.Vector(pointB.x - pointA.x, pointB.y - pointA.y);
        GeometricOperations.leftTurn(vecAB);
        
        return GeometricOperations.makeLineCoordinatesFrom(ptMidAB, vecAB, 1024);
    }

    private static makeLeftTurnedVectorFrom(pointA: P5.Vector, pointB: P5.Vector): P5.Vector {
        const vec = new P5.Vector(pointB.x-pointA.x, pointB.y-pointA.y);
        GeometricOperations.leftTurn(vec);
        vec.normalize();
        vec.mult(-1);

        return vec;
    }
}