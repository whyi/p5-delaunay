/**
 * @jest-environment jsdom
 */

import {expect, jest, test} from '@jest/globals';
import p5, { Vector } from "p5";
import Mesh2D from '../../src/Mesh2D';

describe('Mesh2D', () => {
    describe("buildOTable", () => {
        it ("should build o-table", () => {
            /*
            0--1
            |\ |
            | \|
            3--2
            */
            const twoTriangles = new Mesh2D();
            twoTriangles.vertices = [
                new p5.Vector(0,0),
                new p5.Vector(0,1),
                new p5.Vector(1,1),
                new p5.Vector(1,0)
            ];
            twoTriangles.numberOfVertices = 4;
            twoTriangles.corners = [0,1,2,2,3,0];
            twoTriangles.numberOfTriangles = 2;
            twoTriangles.numberOfCorners = 6;

            expect(twoTriangles.opposites.length).toBe(0);

            twoTriangles.buildOTable();

            expect(twoTriangles.opposites).toBe([-1, 3, -1, -1, 1, -1]);
        })
    })
});