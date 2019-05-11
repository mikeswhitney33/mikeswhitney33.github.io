const vsSource = `
	attribute vec4 aVertexPosition;

	uniform mat4 model;
	uniform mat4 projection;

	varying vec2 pt;

	void main() {

		vec4 point = projection * model * aVertexPosition;
		pt = aVertexPosition.xy;

		gl_Position = point;
	}
`;

const fsSource = `

	varying highp vec2 pt;

	uniform highp float radius;

	void main() {
		highp float dist = distance(pt, vec2(0, 0));
		highp vec3 color;
		highp float alpha = 0.0;

		// 0, 46.7, 74.5
		if(dist < radius) {
			color = vec3(0.2, 0.6, 1.0);
			alpha = 1.0;
		}
		gl_FragColor = vec4(color, alpha);
	}
`;