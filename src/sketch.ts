import P5 from "p5";
import "./styles.scss";
import Renderer from "./Renderer"
import DelaunayTriangulation from "./DelaunayTriangulation";

const sketch = (p5: P5) => {
	let delaunayTriangulation: DelaunayTriangulation;
	let shouldDrawCircumcircles = false;
	let shouldDrawVoronoi = false;

	function toggleCircumcircles(): void {
		shouldDrawCircumcircles = !shouldDrawCircumcircles;
		if (shouldDrawCircumcircles) {
			delaunayTriangulation.computeCircumcircles();
		}
	}

	function toggleVoronoi(): void {
		shouldDrawVoronoi = !shouldDrawVoronoi;
		if (shouldDrawVoronoi) {
			delaunayTriangulation.computeVoronoi();
		}
	}

	p5.setup = () => {
		const mySize = Math.min(p5.windowWidth, p5.windowHeight)-80;
		const canvas = p5.createCanvas(mySize, mySize);
		canvas.parent("sketch");

		delaunayTriangulation = new DelaunayTriangulation(mySize, new Renderer(p5));

		const btnToggleCircumCircles = p5.createButton('Click to toggle Circumcircles');
		btnToggleCircumCircles.position(p5.windowWidth/2-200, 60);
		btnToggleCircumCircles.mousePressed(toggleCircumcircles);

		const btnToggleVoronoiRegions = p5.createButton('Click to toggle Voronoi regions');
		btnToggleVoronoiRegions.position(p5.windowWidth/2, 60);
		btnToggleVoronoiRegions.mousePressed(toggleVoronoi);
	};

	p5.draw = () => {
		p5.background(0);
		delaunayTriangulation.render({shouldDrawCircumcircles, shouldDrawVoronoi});
	};

	p5.mouseClicked = () => {
		if (p5.mouseButton == p5.LEFT) {
		  delaunayTriangulation.addPoint(p5.mouseX, p5.mouseY);
		}
	}
};

new P5(sketch);
