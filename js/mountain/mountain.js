function rads(deg) {
	return deg * Math.PI / 180.0;
}

class Camera {
	constructor(lookfrom, lookat, lookup) {
		this.lookfrom = lookfrom;
		this.lookup = lookup;
		this.lookat = lookat;
		this.front = vec3.create();
		this.right = vec3.create();
		this.up = vec3.create();
		this.moveSpeed = 2.5;
		this.zoomSpeed = 1.0;
		this.invertZoom = false;
		this.invertDragX = false;
		this.invertDragY = false;
		this.updateVectors();
	}

	updateVectors() {
		vec3.subtract(this.front, this.lookat, this.lookfrom);
		vec3.normalize(this.front, this.front);

		vec3.cross(this.right, this.front, this.lookup)
		vec3.normalize(this.right, this.right);

		vec3.cross(this.up, this.right, this.front)
		vec3.normalize(this.up, this.up);
	}

	handleMouse(xoffset, yoffset) {
		xoffset *= this.moveSpeed;
		yoffset *= this.moveSpeed;

		if(this.invertDragX) {
			xoffset = -xoffset;
		}
		if(this.invertDragY) {
			yoffset = -yoffset;
		}

		const tmp = vec3.create();
		vec3.copy(tmp, this.lookfrom);

		vec3.rotateY(tmp, tmp, this.lookat, rads(xoffset));
		vec3.subtract(tmp, tmp, this.lookat);
		const rotation = mat4.create();
		mat4.rotate(rotation, rotation, rads(yoffset), this.right);
		vec3.transformMat4(tmp, tmp, rotation);
		vec3.add(tmp, tmp, this.lookat);

		const tmp2 = vec3.create();
		vec3.subtract(tmp2, this.lookat, tmp);
		vec3.normalize(tmp2, tmp2);
		if(Math.abs(vec3.dot(tmp2, vec3.fromValues(0, 1, 0))) < 0.9) {
			vec3.copy(this.lookfrom, tmp);
		}

		this.updateVectors();
	}

	zoom(dzoom) {
		dzoom *= this.zoomSpeed;
		if(this.invertZoom) {
			dzoom = -dzoom;
		}
		const tmp = vec3.fromValues(this.front[0] * dzoom, this.front[1] * dzoom, this.front[2] * dzoom);
		vec3.add(tmp, this.lookfrom, tmp);
		const dist = vec3.distance(tmp, this.lookat);

		const tmp2 = vec3.create();
		vec3.copy(tmp2, tmp);
		vec3.subtract(tmp2, this.lookat, tmp2);
		vec3.normalize(tmp2, tmp2);

		const tmp3 = vec3.create();
		vec3.copy(tmp3, this.lookfrom);
		vec3.subtract(tmp3, this.lookat, tmp3);
		vec3.normalize(tmp3, tmp3);

		const flipped = vec3.dot(tmp2, tmp3);

		if (dist > 1 && dist < 50.0 && flipped > 0) {
			vec3.copy(this.lookfrom, tmp);
		}
		this.updateVectors();
	}


	mat() {
		const view = mat4.create();
		const tmp = vec3.create();
		vec3.add(tmp, this.lookfrom, this.front)
		return mat4.lookAt(view, this.lookfrom, tmp, this.up);
	}
}

main();

function setupMouseHandlers(camera) {
	const canvas = document.getElementById("glCanvas");
	var lastx = 0;
	var lasty = 0;
	canvas.addEventListener('mousedown', function(e) {
		camera.clicking = true;
		lastx = e.x;
		lasty = e.y;
	});
	canvas.addEventListener('mouseup', function(e) {
		camera.clicking = false;
	});
	canvas.addEventListener('mousemove', function(e) {
		if(camera.clicking) {
			var dx = e.x - lastx;
			var dy = e.y - lasty;

			camera.handleMouse(dx, dy);

			lastx = e.x;
			lasty = e.y;
		}
	});
	canvas.addEventListener('wheel', function(e) {
		camera.zoom(e.deltaY);
		e.preventDefault();
	});
}

function setupInputHandlers(camera) {
	document.getElementById('invertDragX').addEventListener('change', function(e) {
		camera.invertDragX = e.target.checked;
	});
	document.getElementById('invertDragY').addEventListener('change', function(e) {
		camera.invertDragY = e.target.checked;
	});
	document.getElementById('invertZoom').addEventListener('change', function(e) {
		camera.invertZoom= e.target.checked;
	});
}

function main() {
	const canvas = document.querySelector("#glCanvas");
	const gl = canvas.getContext("webgl");

	if(gl === null) {
		alert("Unable to initialize WebGL.  Your browser or machine may not support it.");
		return;
	}

	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
		},
		uniformLocations: {
			projection: gl.getUniformLocation(shaderProgram, 'projection'),
			view: gl.getUniformLocation(shaderProgram, 'view'),
			model: gl.getUniformLocation(shaderProgram, 'model'),
			lightPos: gl.getUniformLocation(shaderProgram, 'uLightPos'),
			viewPos: gl.getUniformLocation(shaderProgram, 'uViewPos'),
			min_val: gl.getUniformLocation(shaderProgram, 'min_val'),
			max_val: gl.getUniformLocation(shaderProgram, 'max_val'),
		},
	};

	var n = document.getElementById('NSlider').value;
	document.getElementById('n-value').innerHTML = Math.pow(2, n) + 1;

	var range = document.getElementById('RangeSlider').value;
	document.getElementById('range-value').innerHTML = range;
	var buffers = initBuffers(gl, n, range);

	document.getElementById('NSlider').addEventListener('change', function(e) {
		n = e.target.value;
		document.getElementById('n-value').innerHTML = Math.pow(2, n) + 1;
		buffers = initBuffers(gl, n, range);
	});
	document.getElementById('RangeSlider').addEventListener('change', function(e) {
		range = e.target.value;
		document.getElementById('range-value').innerHTML = range;
		buffers = initBuffers(gl, n, range);
	});
	document.getElementById('reRenderBtn').addEventListener('click', function(e) {
		buffers = initBuffers(gl, n, range);
	});

	var then = 0;
	var camera = new Camera(vec3.fromValues(0, 2, 5), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
	setupMouseHandlers(camera);
	setupInputHandlers(camera);


	function render(now) {
		now *= 0.001;
		const deltaTime = now - then;
		then = now;

		drawScene(gl, programInfo, buffers, camera, deltaTime);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

function drawScene(gl, programInfo, buffers, camera, deltaTime) {
	gl.clearColor(0.49, 0.75, 0.93, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	/* ======================================================

		Setting up Matrices

	======================================================= */

	const fieldOfView = 45 * Math.PI / 180;
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;
	const projection = mat4.create();
	mat4.perspective(projection, fieldOfView, aspect, zNear, zFar);

	const view = camera.mat();

	const model = mat4.create();

	const lightPos = vec3.fromValues(1.0, 1.0, 1.0);

	/* ======================================================

		Binding Buffers

	======================================================= */

	// Position
	{
		const numComponents = 3;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;

		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition,numComponents, type, normalize, stride, offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
	}

	// Normal
	{
		const numComponents = 3;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
		gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, numComponents, type, normalize, stride, offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
	}

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

	/* ======================================================

		Setting up Matrices

	======================================================= */

	gl.useProgram(programInfo.program);

	gl.uniformMatrix4fv(programInfo.uniformLocations.projection, false, projection);
	gl.uniformMatrix4fv(programInfo.uniformLocations.view, false, view);
	gl.uniformMatrix4fv(programInfo.uniformLocations.model, false, model);

	gl.uniform3fv(programInfo.uniformLocations.viewPos, camera.lookfrom);
	gl.uniform3fv(programInfo.uniformLocations.lightPos, lightPos);
	gl.uniform1f(programInfo.uniformLocations.min_val, buffers.min_val);
	gl.uniform1f(programInfo.uniformLocations.max_val, buffers.max_val);



	/* ======================================================

		Drawing

	======================================================= */
	{
		const vertexCount = buffers.num_components;
		const type = gl.UNSIGNED_SHORT;
		const offset = 0;
		gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	}
}

function initBuffers(gl, n, range) {
	var mesh_positions = [];
	var indices = [];
	var normals = [];
	// const n = 6;
	const size = Math.pow(2, n) + 1;

	function toIndex(i, j) {
		return i * size + j;
	}

	const grid = new Array(size*size).fill(0);

 	// var range = 3.0;

 	function rand(min, max) {
 		return min + Math.random() * (max - min);
 	}

 	function squareStep(sideLength, halfSide) {
 		for(var x = 0;x < size - 1;x+=sideLength) {
 			for(var y = 0;y < size -1; y += sideLength) {
 				const avg = (grid[toIndex(x, y)] +
 					grid[toIndex(x+sideLength, y)] +
 					grid[toIndex(x, y+sideLength)] +
 					grid[toIndex(x+sideLength, y+sideLength)]) / 4.0;
 				grid[toIndex(x+halfSide, y+halfSide)] = avg + rand(-range, range);
 			}
 		}
 	}

 	function diamondStep(sideLength, halfSide) {
 		for(var x = 0;x < size - 1;x+=halfSide) {
 			for(var y = (x + halfSide) % sideLength; y < size - 1;y += sideLength) {
 				const avg = (
 					grid[toIndex((x - halfSide + size-1)%(size-1), y)] +
 					grid[toIndex((x + halfSide) % (size - 1), y)] +
 					grid[toIndex(x, (y + halfSide) % (size - 1))] +
 					grid[toIndex(x, (y - halfSide + size - 1 ) % (size - 1))]) / 4.0;
 				grid[toIndex(x, y)] = avg + rand(-range, range);
 				if(x == 0) {
 					grid[toIndex(size-1, y)] = avg;
 				}
 				if(y == 0) {
 					grid[toIndex(x, size-1)] = avg;
 				}
 			}
 		}
 	}

 	for(var sideLength = size - 1;sideLength >= 2;sideLength /= 2, range /= 2) {
 		var halfSide = sideLength / 2;
 		squareStep(sideLength, halfSide);
 		diamondStep(sideLength, halfSide);
 	}


	function toVal(x) {
		return 4 * ((x - size / 2) / size);
	}

	function getVec3(i, j) {
		const x = vec3.fromValues(toVal(i), grid[toIndex(i, j)], toVal(j));
		return x;
	}

	function addVert(verts, i, j) {
		if(i >= 0 && i < size && j >= 0 && j < size) {
			verts.push(getVec3(i, j));
		}
	}

	function calcNorm(a, b, c) {
		const u = vec3.create();
		const v = vec3.create();
		vec3.subtract(u, b, a);
		vec3.subtract(v, c, a);
		const norm = vec3.create();
		vec3.cross(norm, u, v);
		return norm;
	}

	function avgVec3(vecs) {
		const avg = vec3.create();
		for(var i = 0;i < vecs.length;i++) {
			vec3.add(avg, avg, vecs[i]);
		}
		avg[0] /= vecs.length;
		avg[1] /= vecs.length;
		avg[2] /= vecs.length;
		return avg;
	}


	function inBounds(i, j) {
		return i >= 0 && j >= 0 && i < size && j < size;
	}


	for(var i = 0;i < size;i++) {
		for(var j = 0;j < size;j++) {
			/*
				a-b-c
				|\|\|
				d-e-f
				|\|\|
				g-h-i
			*/
			// A
			mesh_positions.push(toVal(i));
			mesh_positions.push(grid[toIndex(i, j)]);
			mesh_positions.push(toVal(j));
			var norms = []
			// ABE
			if(inBounds(i-1, j-1) && inBounds(i-1, j) && inBounds(i, j)) {
				norms.push(calcNorm(getVec3(i-1, j-1), getVec3(i-1, j), getVec3(i, j)));
			}
			// AED
			if(inBounds(i-1, j-1) && inBounds(i, j) && inBounds(i, j-1)) {
				norms.push(calcNorm(getVec3(i-1, j-1), getVec3(i, j), getVec3(i, j-1)));
			}
			// BFE
			if(inBounds(i-1, j) && inBounds(i, j+1) && inBounds(i, j)) {
				norms.push(calcNorm(getVec3(i-1, j), getVec3(i, j+1), getVec3(i, j)));
			}
			// DEH
			if(inBounds(i, j-1) && inBounds(i, j) && inBounds(i+1, j)) {
				norms.push(calcNorm(getVec3(i, j-1), getVec3(i, j), getVec3(i+1, j)));
			}
			// EIH
			if(inBounds(i, j) && inBounds(i+1, j+1) && inBounds(i+1, j)) {
				norms.push(calcNorm(getVec3(i, j), getVec3(i+1, j+1), getVec3(i+1, j)));
			}
			// EFI
			if(inBounds(i, j) && inBounds(i, j+1) && inBounds(i+1, j+1)) {
				norms.push(calcNorm(getVec3(i, j), getVec3(i, j+1), getVec3(i+1, j+1)));
			}
			const avgNorm = avgVec3(norms);
			vec3.normalize(avgNorm, avgNorm);
			normals = normals.concat([avgNorm[0], avgNorm[1], avgNorm[2]]);


			if(i + 1 < size && j + 1 < size) {
				indices.push(toIndex(i, j));
				indices.push(toIndex(i + 1, j));
				indices.push(toIndex(i + 1, j + 1));

				indices.push(toIndex(i, j));
				indices.push(toIndex(i, j+1));
				indices.push(toIndex(i + 1, j + 1));
			}
		}
	}

	const posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh_positions), gl.STATIC_DRAW);


	const normBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	return {
		position: posBuffer,
		normal: normBuffer,
		indices: indexBuffer,
		num_components: indices.length,
		min_val: Math.min.apply(null, grid),
		max_val: Math.max.apply(null, grid),
	};
}
