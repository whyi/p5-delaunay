/**
 * @jest-environment jsdom
 */

import {expect, jest, test} from '@jest/globals';
import p5 from "p5";
import { GeometricOperations } from '../../src/GeometricOperations';

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
                expect(result).toBe(v2.x*v1.y - v2.y*v1.x);
            });
        })
    })
});