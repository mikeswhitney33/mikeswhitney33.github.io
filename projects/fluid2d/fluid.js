var gl;
var particles = [];

class Particle {
	constructor(x, y) {
		this.x = [x, y];
		this.v = [0, 0];
		this.f = [0, 0];
		this.rho = 0;
		this.p = 0;
	}
}

class Shader {
	constructor(vsSource, fsSource) {
		this.program = initShaderProgram(gl, vsSource, fsSource);
	}

	use() {
		gl.useProgram(this.program);
	}

	setAttrib(buffer, attrib, numComponents, type=gl.FLOAT, normalize=false, stride=0, offset=0) {
		const attribLoc = gl.getAttribLocation(this.program, attrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(
		    attribLoc,
		    numComponents,
		    type,
		    normalize,
		    stride,
		    offset);
		gl.enableVertexAttribArray(
		    attribLoc);
	}

	setMat4(m, uName) {
		gl.uniformMatrix4fv(gl.getUniformLocation(this.program, uName), false, m);
	}
	setFloat(val, uName) {
		gl.uniform1f(gl.getUniformLocation(this.program, uName), val);
	}
}

class Square {
	constructor(shader, radius) {
		this.shader = shader;
		this.buffer = Square.initBuffers();
		this.radius = radius;
	}

	draw(positions) {
		this.shader.setAttrib(this.buffer, "aVertexPosition", 2);
		this.shader.use();

		const fieldOfView = 45 * Math.PI / 180;
		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		const zNear = 0.1;
		const zFar = 100.0;
		const projection = mat4.create();
		mat4.perspective(projection, fieldOfView, aspect, zNear, zFar);
		this.shader.setMat4(projection, "projection");
		this.shader.setFloat(this.radius, "radius");

		for(var i = 0;i < positions.length;i++) {
			const model = mat4.create();
			const pos = [RAD_SCALE * ASPECT_RATIO * ((positions[i].x[0] - VIEW_WIDTH/2)/VIEW_WIDTH),
				RAD_SCALE * ((positions[i].x[1] - VIEW_HEIGHT/2)/VIEW_HEIGHT),
				-6];
			mat4.translate(model, model, pos);
			mat4.scale(model, model, [this.radius, this.radius, 1]);
			this.shader.setMat4(model, "model");

			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}
	}

	static initBuffers() {
		const positionBuffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		const positions = [
			1.0,  1.0,
			-1.0,  1.0,
			1.0, -1.0,
			-1.0, -1.0,
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
		return positionBuffer;
	}
}

main();

function init_dam() {
	for(var y = EPS; y < VIEW_HEIGHT - EPS * 2.0; y += H) {
		for(var x = VIEW_WIDTH/3; x <= 2*VIEW_WIDTH/3; x += H) {
			if(particles.length < DAM_PARTICLES) {
				var jitter = Math.random();
				particles.push(new Particle(x+jitter, y));
			}
		}
	}
}

function computeDensityPressure() {
	for(var i = 0;i < particles.length;i++) {
		particles[i].rho = 0.0;
		for(var j = 0;j < particles.length;j++) {
			const rij = vec2.create();
			vec2.subtract(rij, particles[j].x, particles[i].x);
			const r2 = vec2.dot(rij, rij);
			if(r2 < HSQ) {
				particles[i].rho += MASS * POLY6 * Math.pow(HSQ-r2, 3.0);
			}
		}
		particles[i].p = GAS_CONST * (particles[i].rho - REST_DENS)
	}
}

function computeForces() {
	for(var i = 0;i < particles.length;i++) {
		var fpress = [0, 0], fvisc = [0, 0];
		for(var j = 0;j < particles.length;j++) {
			if(i == j){
				continue;
			}
			const rij = vec2.create();
			vec2.subtract(rij, particles[j].x, particles[i].x);
			var r = Math.sqrt(vec2.dot(rij, rij));

			if(r < H) {
				fpress[0] += -(rij[0]/r)*MASS*(particles[i].p + particles[j].p) / (2.0 * particles[j].rho) * SPIKY_GRAD * Math.pow(H-r, 2.0);
				fpress[1] += -(rij[1]/r)*MASS*(particles[i].p + particles[j].p) / (2.0 * particles[j].rho) * SPIKY_GRAD * Math.pow(H-r, 2.0);
				fvisc[0] += VISC*MASS * (particles[j].v[0] - particles[i].v[0]) / particles[j].rho * VISC_LAP * (H-r);
				fvisc[1] += VISC*MASS * (particles[j].v[1] - particles[i].v[1]) / particles[j].rho * VISC_LAP * (H-r);
			}
		}
		const fgrav = vec2.create();
		fgrav[0] = G[0] * particles[i].rho;
		fgrav[1] = G[1] * particles[i].rho;
		particles[i].f[0] = fpress[0] + fvisc[0] + fgrav[0];
		particles[i].f[1] = fpress[1] + fvisc[1] + fgrav[1];
	}
}

function integrate() {
	for(var i = 0;i < particles.length;i++) {
		particles[i].v[0] += DT * particles[i].f[0] / particles[i].rho;
		particles[i].v[1] += DT * particles[i].f[1] / particles[i].rho;
		particles[i].x[0] += DT * particles[i].v[0];
		particles[i].x[1] += DT * particles[i].v[1];
		if(particles[i].x[0] - EPS < 0.0) {
			particles[i].v[0] *= BOUND_DAMPING;
			particles[i].x[0] = EPS;
		}
		if(particles[i].x[0] + EPS > VIEW_WIDTH) {
			particles[i].v[0] *= BOUND_DAMPING;
			particles[i].x[0] = VIEW_WIDTH - EPS;
		}
		if(particles[i].x[1] - EPS < 0.0) {
			particles[i].v[1] *= BOUND_DAMPING;
			particles[i].x[1] =  EPS;
		}
		if(particles[i].x[1] + EPS > VIEW_HEIGHT) {
			particles[i].v[1] *= BOUND_DAMPING;
			particles[i].x[1] = VIEW_HEIGHT - EPS;
		}
	}
}


function update() {
	computeDensityPressure();
	computeForces();
	integrate();
}


function main() {
	const canvas = document.querySelector('#glCanvas');
	gl = canvas.getContext('webgl', {alpha: true});

	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	var squares = []

	const shader = new Shader(vsSource, fsSource);

	const square = new Square(shader, .25);

	init_dam();

	var then = 0;
	function render(now) {
		now *= 0.001;
		const deltaTime = now - then;
		then = now;

		update();

		gl.clearColor(0.9, 0.9, 0.9, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.depthFunc(gl.LEQUAL);


		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		square.draw(particles)
		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}



