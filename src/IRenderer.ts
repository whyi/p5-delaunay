import { Vector } from 'p5';
import Circle from './Circle';
import Triangle from './Triangle'
import Voronoi from './Voronoi';

export default interface IRenderer {
    drawTriangles(triangles: Array<Triangle>): void;
    drawVoronoi(voronoiRegions: Array<Voronoi>): void;
    drawCircumcircles(circumcircles: Array<Circle>): void;
    drawVertices(vertices: Array<Vector>): void;
}

