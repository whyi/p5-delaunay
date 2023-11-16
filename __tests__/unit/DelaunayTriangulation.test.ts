/**
 * @jest-environment jsdom
 */

import {expect} from '@jest/globals';
import P5, { Vector } from "p5";
import DelaunayTriangulation from '../../src/DelaunayTriangulation';
import { BOUNDARY } from '../../src/Mesh2D';

let twoTriangles: DelaunayTriangulation = new DelaunayTriangulation(1);
const flipCornerSpy = jest.spyOn(DelaunayTriangulation.prototype, 'flipCorner')
const buildOTableSpy = jest.spyOn(DelaunayTriangulation.prototype, 'buildOTable')
const isDelaunaySpy = jest.spyOn(DelaunayTriangulation.prototype, 'isDelaunay');

function clearMocks() {
  flipCornerSpy.mockClear();
  buildOTableSpy.mockClear();
  isDelaunaySpy.mockClear();
}

describe('DelaunayTriangulation', () => {
  describe("addPoint", () => {
    it ("creates a new point from x,y coordiante and add it to gemoetry table", () => {
      twoTriangles.addPoint(0.1, 0.1);
      expect(twoTriangles.vertices[twoTriangles.vertices.length-1]).toStrictEqual(new P5.Vector(0.1, 0.1));
      expect(twoTriangles.numberOfVertices).toBe(5);
    })

    it ("newly added point creates 2 more triangles by splitting the existing one into 3", () => {
      const previousNumberOfCorners = twoTriangles.numberOfCorners;
      const previousNumberOfTriangles = twoTriangles.numberOfTriangles;

      twoTriangles.addPoint(0.1, 0.1);

      expect(twoTriangles.numberOfCorners).toBe(previousNumberOfCorners+6);
      expect(twoTriangles.numberOfTriangles).toBe(previousNumberOfTriangles+2);
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
    beforeEach(() => clearMocks());
    afterEach(() => clearMocks());

    it ("recursively flipCorners", () => {
      const dirtyCorners:number[] = [0,1,2];
      twoTriangles.fixMesh(dirtyCorners);
      expect(flipCornerSpy.mock.calls.length).toBeGreaterThanOrEqual(3);
    })
  })

  describe("flipCorner", () => {
    beforeEach(() => clearMocks());
    afterEach(() => clearMocks());

    it ("immediately returns when given a boundary", () => {
      twoTriangles.flipCorner(BOUNDARY);
      
      expect(flipCornerSpy).toBeCalledTimes(1);
      expect(buildOTableSpy).toBeCalledTimes(0);
      expect(isDelaunaySpy).toBeCalledTimes(0);
    })

    it ("buid O Table and returns if opposite of given corner is a boundary", () => {
      twoTriangles.flipCorner(2);
      
      expect(flipCornerSpy).toBeCalledTimes(1);
      expect(buildOTableSpy).toBeCalledTimes(1);
      expect(isDelaunaySpy).toBeCalledTimes(0);
    })

    it ("does not process if given corner already satisfy Delaunay property", () => {
      // https://tasks.illustrativemathematics.org/content-standards/tasks/1687
      twoTriangles = new DelaunayTriangulation(4)
      twoTriangles.vertices = [
        new P5.Vector(0,0),
        new P5.Vector(3,1),
        new P5.Vector(1,3),
        new P5.Vector(-2,2)
      ];

      twoTriangles.flipCorner(4);
      
      expect(flipCornerSpy).toBeCalledTimes(1);
      expect(buildOTableSpy).toBeCalledTimes(2);
      expect(isDelaunaySpy).toBeCalledTimes(1);
    })

    it ("recursively flip corners if given corner doesn't satisfy Delaunay property", () => {
      twoTriangles = new DelaunayTriangulation(4)
      twoTriangles.vertices = [
        new P5.Vector(0,0),
        new P5.Vector(0.5,0.5),
        new P5.Vector(1,0.5),
        new P5.Vector(0.5,0)
      ];

      twoTriangles.flipCorner(4);

      expect(flipCornerSpy).toBeCalledTimes(3);
      expect(buildOTableSpy).toBeCalledTimes(6);
      expect(isDelaunaySpy).toBeCalledTimes(1);
    })
  })

  describe("isDelaunay", () => {
    it ("returns true if opposite corner is outside of circumcircle's radius", () => {    
      // https://tasks.illustrativemathematics.org/content-standards/tasks/1687
      twoTriangles = new DelaunayTriangulation(4)
      twoTriangles.vertices = [
        new P5.Vector(0,0),
        new P5.Vector(3,1),
        new P5.Vector(1,3),
        new P5.Vector(-2,2)
      ];
      twoTriangles.buildOTable();
      expect(twoTriangles.isDelaunay(4)).toBe(true);
    })

    it ("returns false if opposite corner is inside of circumcircle's radius", () => {
      twoTriangles = new DelaunayTriangulation(1)

      // Modify initial mock to make a very skewed triangles
      twoTriangles.vertices = [
        new P5.Vector(0,0),
        new P5.Vector(0.5,0.5),
        new P5.Vector(1,0.5),
        new P5.Vector(0.5,0)
      ];
      twoTriangles.buildOTable();
      expect(twoTriangles.isDelaunay(4)).toBe(false);
    })
  })

  describe("computeCircumcenters", () => {
    it ("calculates circumcenters and radius", () => {
      twoTriangles = new DelaunayTriangulation(1)

      expect(twoTriangles.hasCircumcircles).toBe(false);
      twoTriangles.computeCircumcenters();
      expect(twoTriangles.hasCircumcircles).toBe(true);
    })
  })
});