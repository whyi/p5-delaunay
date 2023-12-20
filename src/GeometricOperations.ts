import P5 from "p5";
import Line from "./Primitives/Line";
import Triangle from "./Primitives/Triangle";

export default abstract class GeometricOperations {
    public static cross2D(U: P5.Vector, V: P5.Vector): number {
        return U.x*V.y - U.y*V.x;
    }

    public static isLeftTurn(A: P5.Vector, B: P5.Vector, C: P5.Vector): boolean {
        const v1: P5.Vector = new P5.Vector(B.x-A.x, B.y-A.y);
        const v2: P5.Vector = new P5.Vector(C.x-B.x, C.y-B.y);
    
        return GeometricOperations.cross2D(v1, v2) > 0;
    }

    public static intersection(line1: Line, line2: Line): P5.Vector {
        const S: P5.Vector = line1.start;
        const SE: P5.Vector = line1.end;
        const Q: P5.Vector = line2.start;
        const QE: P5.Vector = line2.end;

        const tangent = new P5.Vector(SE.x-S.x, SE.y-S.y);

        const normalVector = new P5.Vector(QE.x-Q.x, QE.y-Q.y);
        normalVector.normalize();

        GeometricOperations.leftTurn(normalVector);

        const QS: P5.Vector = new P5.Vector(S.x-Q.x, S.y-Q.y);
        const QSDotNormal: number = QS.dot(normalVector);
        const tangentDotNormal: number = tangent.dot(normalVector);
        const t: number = -QSDotNormal/tangentDotNormal;

        if (!isFinite(t)) {
            // return an undefined vector
            return new P5.Vector(undefined, undefined);
        }

        tangent.mult(t);

        return new P5.Vector(S.x+tangent.x,S.y+tangent.y);
    }

    public static midVector(vecA: P5.Vector, vecB: P5.Vector): P5.Vector {
        return new P5.Vector((vecA.x + vecB.x)/2, (vecA.y + vecB.y)/2);
    }

    public static circumcenter(triangle: Triangle): P5.Vector {
        const midAB: P5.Vector = GeometricOperations.midVector(triangle.ptA, triangle.ptB);
        const vecAB: P5.Vector = GeometricOperations.makeLeftTurnedVectorFrom(triangle.ptA, triangle.ptB);
        const line1: Line = GeometricOperations.makeLineCoordinatesFrom(midAB, vecAB);

        const midBC: P5.Vector = GeometricOperations.midVector(triangle.ptB, triangle.ptC);
        const vecBC: P5.Vector = GeometricOperations.makeLeftTurnedVectorFrom(triangle.ptB, triangle.ptC);
        const line2: Line = GeometricOperations.makeLineCoordinatesFrom(midBC, vecBC);

        return GeometricOperations.intersection(line1, line2);
    }

    public static leftTurn(v: P5.Vector): void {
        const tmp: number = v.x;
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