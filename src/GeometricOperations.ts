import P5 from "p5";

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

        this.leftTurn(normalVector);

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

    public static circumcenter(A: P5.Vector, B: P5.Vector, C: P5.Vector): P5.Vector {
        const midAB = GeometricOperations.midVector(A,B);
        const AB = new P5.Vector(B.x-A.x, B.y-A.y);
        this.leftTurn(AB);
        AB.normalize();
        AB.mult(-1);
      
        const midBC = GeometricOperations.midVector(B,C);
        const BC = new P5.Vector(C.x-B.x, C.y-B.y);
        this.leftTurn(BC);
        BC.normalize();
        BC.mult(-1);
      
        const fact = 100;
      
        const AA = new P5.Vector(midAB.x+AB.x*fact, midAB.y+AB.y*fact);
        const BB = new P5.Vector(midAB.x-AB.x*fact, midAB.y-AB.y*fact);
        const CC = new P5.Vector(midBC.x+BC.x*fact, midBC.y+BC.y*fact);
        const DD = new P5.Vector(midBC.x-BC.x*fact, midBC.y-BC.y*fact);

        return GeometricOperations.intersection(AA, BB, CC, DD);  
      }

      private static leftTurn(v: P5.Vector): void {
        const tmp = v.x;
        v.x = -v.y;
        v.y = tmp;
      }
}