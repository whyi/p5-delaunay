/**
 * @jest-environment jsdom
 */

import {expect} from '@jest/globals';
import p5 from "p5";
import DelaunayTriangulation from '../../src/DelaunayTriangulation';

let twoTriangles: DelaunayTriangulation;
function InitTwoTriangles()
{
    /*
    0--1
    |\ |
    | \|
    3--2
    */
    twoTriangles = new DelaunayTriangulation()
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

describe('DelaunayTriangulation', () => {
  describe("addPoint", () => {
    it ("creates a new point and add it to gemoetry table", () => {

    })
  })

  describe("isInTriangle", () => {
    it ("returns true when given point is in triangle", () => {

    })

    it ("returns false when given point is not in triangle", () => {

    })
  })

  describe("fixMesh", () => {
    it ("recursively flipCorners", () => {

    })
  })

});