// Vertex Shader
const vsSource = `
	attribute vec4 aVertexPosition;
	attribute vec3 aVertexNormal;

	uniform mat4 model;
	uniform mat4 view;
	uniform mat4 projection;

	varying highp vec3 vPosition;
	varying highp vec3 vNormal;

	void main(void) {
		gl_Position = projection * view * model * aVertexPosition;
		vPosition = (model * aVertexPosition).xyz;
		vNormal = normalize((model * vec4(aVertexNormal, 0x0)).xyz);
	}
`;

//Fragment Shader
const fsSource = `

	uniform highp vec3 uLightPos;
	uniform highp vec3 uViewPos;
	uniform highp float min_val;
	uniform highp float max_val;

	varying highp vec3 vPosition;
	varying highp vec3 vNormal;


	void main(void) {
		highp float range = max_val - min_val;
		highp float percent = min((vPosition.y - min_val) / range, 1.0);
		highp vec3 objColor = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 1.0), percent);

		highp vec3 lightColor = vec3(1, 1, 1);

		highp vec3 norm = normalize(vNormal);
		// highp vec3 objColor = vColor.rgb;
		highp float ambientStrength = 0.1;
		highp vec3 ambient = ambientStrength * lightColor;

		highp vec3 lightDir = normalize(uLightPos - vPosition);
		highp float diff = max(dot(norm, lightDir), 0.0);
		highp vec3 diffuse = diff * lightColor;

		highp float specularStrength = 0.25;
		highp vec3 viewDir = normalize(uViewPos - vPosition);
		highp vec3 reflectDir = reflect(-lightDir, norm);
		highp float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
		highp vec3 specular = specularStrength * spec * lightColor;

		highp vec3 result = (ambient + diffuse + specular) * objColor;
		gl_FragColor = vec4(result, 1.0);
		// highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
		// highp vec3 lightColor = vec3(1, 1, 1);
		// highp vec3 lightDir = normalize(uLightPos - vPosition);

		// highp float directional = max(dot(vNormal.xyz, lightDir), 0.0);

		// gl_FragColor = vColor + vec4(ambientLight + lightColor * directional, 0.0);
	}
`;