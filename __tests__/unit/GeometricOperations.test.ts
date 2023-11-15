/**
 * @jest-environment jsdom
 */

import {expect} from '@jest/globals';
import p5 from "p5";
import GeometricOperations from '../../src/GeometricOperations';

describe('GeometricOperations', () => {
    describe("Cross product", () => {
        const unitVectors = [
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: 1, y: 1, z: 0 },
            { x: 1, y: 1, z: 1 },
            { x: 0, y: 1, z: 0 },
            { x: 0, y: 1, z: 1 },
            { x: 0, y: 0, z: 1 }
          ];
      
        it.each(unitVectors) ("should compute cross product only of 2D components ($x, $y, $z)", ({x, y, z}) => {
            const v1 = new p5.Vector(x,y,z);
            unitVectors.map(v => new p5.Vector(v.x, v.y, v.z)).forEach(v2 => {
                const result = GeometricOperations.cross2D(v1, v2);
                expect(result).toBe(v1.x*v2.y - v1.y*v2.x);
            });
        })
    })

    describe("isLeftTurn", () => {
        it ("returns true when points A, B and C are turning left", () => {
            /*
                  C
                   \ 
                    \
            A--------B
            */
            const pointA = new p5.Vector(0,0);
            const pointB = new p5.Vector(1,0);
            const pointC = new p5.Vector(0.75,0.75);
            const result = GeometricOperations.isLeftTurn(pointA, pointB, pointC);
            expect(result).toBe(true);
        })

        it ("returns false when points A, B and C are turning right", () => {
            /*
            A--------B
                    /
                   /
                  C
            */
            const pointA = new p5.Vector(0,0);
            const pointB = new p5.Vector(1,0);
            const pointC = new p5.Vector(0.75,-0.75);
            const result = GeometricOperations.isLeftTurn(pointA, pointB, pointC);
            expect(result).toBe(false);
        })
    })

    describe("intersection", () => {
        it ("returns intersecting point of the 4 vectors(S, SE, Q, QE)", () => {
            /*
                   QE
                   |
            S------+-----SE
                   |
                   Q
            */
            const vecS = new p5.Vector(0,5);
            const vecSE = new p5.Vector(10,5);
            const vecQ = new p5.Vector(5,10);
            const vecQE = new p5.Vector(5,0);
            const result = GeometricOperations.intersection(vecS, vecSE, vecQ, vecQE);
            expect(result).toStrictEqual(new p5.Vector(5,5));
        })

        it ("returns undefined point when 4 vectors(S, SE, Q, QE) don't intersect", () => {
            /*
            S------------SE

            Q------------QE
            */
            const vecS = new p5.Vector(0,0);
            const vecSE = new p5.Vector(10,0);
            const vecQ = new p5.Vector(0,5);
            const vecQE = new p5.Vector(10,5);
            const result = GeometricOperations.intersection(vecS, vecSE, vecQ, vecQE);
            expect(result).toStrictEqual(new p5.Vector(undefined,undefined));
        })

        it ("returns intersecting point of the 4 vectors(S, SE, Q, QE) (case2)", () => {
            /*
            QE
            |
            S------------SE
            |
            Q
            */
            const vecS = new p5.Vector(0,0);
            const vecSE = new p5.Vector(10,0);
            const vecQ = new p5.Vector(0,5);
            const vecQE = new p5.Vector(0,-5);
            const result = GeometricOperations.intersection(vecS, vecSE, vecQ, vecQE);
            expect(result).toStrictEqual(vecS);
        })
    })

    describe("midVector", () => {
        it ("return middle point of 2 vectors", () => {
            const v1 = new p5.Vector(0,0);
            const v2 = new p5.Vector(1,1);
            const result = GeometricOperations.midVector(v1, v2);
            expect(result).toStrictEqual(new p5.Vector((v1.x+v2.x)/2, (v1.y+v2.y)/2));
        })
    })

    describe("circumcenter", () => {
        it ("return circumcenter of the triangle ABC's circumcircle", () => {
            /*
            https://www.wolframalpha.com/input?i=circumcenter+of+a+triangle+0%2C0+0%2C1+0.5%2C1

                A
                | \ _____<<<here's the circumcenter
                |  \
                B---C
            */
            const pointA = new p5.Vector(0,0);
            const pointB = new p5.Vector(0,1);
            const pointC = new p5.Vector(0.5,1);
            const result = GeometricOperations.circumcenter(pointA, pointB, pointC);
            expect(result).toStrictEqual(new p5.Vector(0.25,0.5));
        })
    })
});