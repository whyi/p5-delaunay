import { Vector } from 'p5';
import Circle from './Primitives/Circle';
import Triangle from './Primitives/Triangle'
import Voronoi from './Primitives/Voronoi';

export default interface IRenderer {
    drawTriangles(triangles: Array<Triangle>): void;
    drawVoronoi(voronoiRegions: Array<Voronoi>): void;
    drawCircumcircles(circumcircles: Array<Circle>): void;
    drawVertices(vertices: Array<Vector>): void;
}

