/**
 * @jest-environment jsdom
 */

import {expect} from '@jest/globals';
import p5 from "p5";
import Mesh2D, { BOUNDARY } from '../../src/Mesh2D';

let twoTriangles: Mesh2D;
function InitTwoTriangles()
{
    /*
    0--1
    |\ |
    | \|
    3--2
    */
    twoTriangles = new Mesh2D()
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
}
beforeEach(() => {
    InitTwoTriangles();
});

afterEach(() => {
    InitTwoTriangles();
})

describe("Mesh2D", () => {
    describe("buildOTable", () => {
        it ("should build o-table", () => {
            twoTriangles.buildOTable();
            expect(twoTriangles.opposites).toStrictEqual([-1, 4, -1, -1, 1, -1]);
        })
    })

    it ("provides helper method to access underlying data by cornerId", () => {
        expect(twoTriangles.getVertexId(0)).toBe(0);
        expect(twoTriangles.getVertexId(1)).toBe(1);
        expect(twoTriangles.getVertexId(2)).toBe(2);
        expect(twoTriangles.getVertexId(3)).toBe(2);
        expect(twoTriangles.getVertexId(4)).toBe(3);
        expect(twoTriangles.getVertexId(5)).toBe(0);
        
        expect(twoTriangles.getNextCornerId(0)).toBe(1);
        expect(twoTriangles.getNextCornerId(1)).toBe(2);
        expect(twoTriangles.getNextCornerId(2)).toBe(0);
        expect(twoTriangles.getNextCornerId(3)).toBe(4);
        expect(twoTriangles.getNextCornerId(4)).toBe(5);
        expect(twoTriangles.getNextCornerId(5)).toBe(3);

        expect(twoTriangles.getPreviousCornerId(0)).toBe(2);
        expect(twoTriangles.getPreviousCornerId(1)).toBe(0);
        expect(twoTriangles.getPreviousCornerId(2)).toBe(1);
        expect(twoTriangles.getPreviousCornerId(3)).toBe(5);
        expect(twoTriangles.getPreviousCornerId(4)).toBe(3);
        expect(twoTriangles.getPreviousCornerId(5)).toBe(4);

        twoTriangles.buildOTable();
        expect(twoTriangles.getOppositeCornerId(0)).toBe(BOUNDARY);
        expect(twoTriangles.getOppositeCornerId(1)).toBe(4);
        expect(twoTriangles.getOppositeCornerId(2)).toBe(BOUNDARY);
        expect(twoTriangles.getOppositeCornerId(3)).toBe(BOUNDARY);
        expect(twoTriangles.getOppositeCornerId(4)).toBe(1);
        expect(twoTriangles.getOppositeCornerId(5)).toBe(BOUNDARY);

        expect(twoTriangles.getGeometry(0)).toStrictEqual(new p5.Vector(0,0));
        expect(twoTriangles.getGeometry(1)).toStrictEqual(new p5.Vector(0,1));
        expect(twoTriangles.getGeometry(2)).toStrictEqual(new p5.Vector(1,1));
        expect(twoTriangles.getGeometry(3)).toStrictEqual(new p5.Vector(1,1));
        expect(twoTriangles.getGeometry(4)).toStrictEqual(new p5.Vector(1,0));
        expect(twoTriangles.getGeometry(5)).toStrictEqual(new p5.Vector(0,0));
    });
});