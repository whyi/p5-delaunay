import P5 from "p5";

export abstract class GeometricOperations {
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

        // left turn
        const tmp = normalVector.x;
        normalVector.x = -normalVector.y;
        normalVector.y = tmp;

        const QS = new P5.Vector(S.x-Q.x, S.y-Q.y);
        const QSDotNormal = QS.dot(normalVector);
        const tangentDotNormal = tangent.dot(normalVector);
        const t = -QSDotNormal/tangentDotNormal;

        if (!isFinite(t)) {
            // return an undefined vector
            return new P5.Vector();
        }

        tangent.mult(t);

        return new P5.Vector(S.x+tangent.x,S.y+tangent.y);
    }
}