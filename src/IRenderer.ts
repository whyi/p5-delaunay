import { Vector } from 'p5';
import Circle from './Primitives/Circle';
import Triangle from './Primitives/Triangle'
import Voronoi from './Primitives/Voronoi';

export default interface IRenderer {
    // draw triangles
    drawTriangles(triangles: Array<Triangle>): void;

    // draw voronoi (colors are randomly assigned)
    drawVoronoi(voronoiRegions: Array<Voronoi>): void;

    // draw circumcircles (with the circumcenters)
    drawCircumcircles(circumcircles: Array<Circle>): void;

    // draw vertices
    drawVertices(vertices: Array<Vector>): void;
}

