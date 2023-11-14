import P5 from "p5";
import "p5/lib/addons/p5.dom";
// import "p5/lib/addons/p5.sound";	// Include if needed
import "./styles.scss";

// DEMO: A sample class implementation
import MyCircle from "./MyCircle";

// Creating the sketch itself
const sketch = (p5: P5) => {
	// DEMO: Prepare an array of MyCircle instances
	const myCircles: MyCircle[] = [];

	// The sketch setup method 
	p5.setup = () => {
		// Creating and positioning the canvas
		const canvas = p5.createCanvas(200, 200);
		canvas.parent("app");

		// Configuring the canvas
		p5.background("white");

		// DEMO: Create three circles in the center of the canvas
		for (let i = 1; i < 4; i++) {
			const p = p5.width / 4;
			const circlePos = p5.createVector(p * i, p5.height / 2);
			const size = i % 2 !== 0 ? 24 : 32;
			myCircles.push(new MyCircle(p5, circlePos, size));
		}
	};

	// The sketch draw method
	p5.draw = () => {
		// DEMO: Let the circle instances draw themselves
		myCircles.forEach(circle => circle.draw());
	};
};

new P5(sketch);
