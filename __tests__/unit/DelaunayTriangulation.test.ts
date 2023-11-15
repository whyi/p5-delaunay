/**
 * @jest-environment jsdom
 */

import {expect} from '@jest/globals';
import p5, { Vector } from "p5";
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
    it ("creates a new point from x,y coordiante and add it to gemoetry table", () => {
      twoTriangles.addPoint(0.1, 0.1);
      expect(twoTriangles.vertices[twoTriangles.vertices.length-1]).toStrictEqual(new p5.Vector(0.1, 0.1));
      expect(twoTriangles.numberOfVertices).toBe(5);
    })
  })

  describe("isInTriangle", () => {
    it ("returns true when given point is in triangle", () => {
      var newPoint = new Vector(0.8, 0.1);
      expect(twoTriangles.isInTriangle(0, newPoint)).toBe(false);
    })

    it ("returns false when given point is not in triangle", () => {
      var newPoint = new Vector(0.8, 0.1);
      expect(twoTriangles.isInTriangle(1, newPoint)).toBe(true);
    })
  })

  describe("fixMesh", () => {
    it ("recursively flipCorners", () => {
      const flipCornerMock = jest
      .spyOn(DelaunayTriangulation.prototype, 'flipCorner')
      .mockImplementation((dirtyCorners: number[]) => {
        console.log('mocked function');
      });

      expect(flipCornerMock).toHaveBeenCalled();
    })
  })

});