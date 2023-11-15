import P5 from "p5";
import "./styles.scss";

import DelaunayTriangulation from "./DelaunayTriangulation";

const sketch = (p5: P5) => {
	let delaunayTriangulation: DelaunayTriangulation;
	let shouldDrawCircumcircles = false;

	function toggleCircumcircles(): void {
		shouldDrawCircumcircles = !shouldDrawCircumcircles;
		if (shouldDrawCircumcircles) {
			delaunayTriangulation.computeCircumcenters();
		}
	}

	p5.setup = () => {
		const mySize = Math.min(p5.windowWidth, p5.windowHeight)-80;
		const canvas = p5.createCanvas(mySize, mySize);
		canvas.parent("sketch");

		delaunayTriangulation = new DelaunayTriangulation(mySize, p5);

		const button = p5.createButton('Click to toggle Circumcircles');
		button.position(p5.windowWidth/2-120, 60);
		button.mousePressed(toggleCircumcircles);
	};

	p5.draw = () => {
		p5.background(0);
		delaunayTriangulation.drawTriangles();
		if (shouldDrawCircumcircles) {
			delaunayTriangulation.drawCircumcircles();
		}
	};

	p5.mouseClicked = () => {
		if (p5.mouseButton == p5.LEFT) {
		  delaunayTriangulation.addPoint(p5.mouseX, p5.mouseY);
		}
	  }
};

new P5(sketch);
