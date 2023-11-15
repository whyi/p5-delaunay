import P5 from "p5";

export abstract class GeometricOperations {
    public static cross2D(U: P5.Vector, V: P5.Vector): number {
        return U.x*V.y - U.y*V.x;
    }

    public static isLeftTurn(A: P5.Vector, B: P5.Vector, C: P5.Vector): boolean {
        const v1 = new P5.Vector(B.x-A.x, B.y-A.y, 0);
        const v2 = new P5.Vector(C.x-B.x, C.y-B.y, 0);
    
        return GeometricOperations.cross2D(v1, v2) > 0;
    }
}