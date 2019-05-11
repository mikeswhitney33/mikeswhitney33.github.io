const SCALE_FACTOR = 0.5;

const G = [0.0, 12000 * -9.8]; // external (gravitational) forces
const REST_DENS = 1000.0; // rest density
const GAS_CONST = 2000.0; // const for equation of state
const H = 16.0; // kernel radius
const HSQ = H*H; // radius^2 for optimization
const MASS = 65.0; // assume all particles have the same mass
const VISC = 250.0; // viscosity constant
const DT = 0.0008; // integration timestep

// smoothing kernels defined in Müller and their gradients
const POLY6 = 315.0/(65.0*Math.PI*Math.pow(H, 9.0));
const SPIKY_GRAD = -45.0/(Math.PI*Math.pow(H, 6.0));
const VISC_LAP = 45.0/(Math.PI*Math.pow(H, 6.0));

// simulation parameters
const EPS = H; // boundary epsilon
const BOUND_DAMPING = -0.5;

// interaction
const MAX_PARTICLES = 2500;
const DAM_PARTICLES = 500;
const BLOCK_PARTICLES = 250;

// rendering projection parameters
const WINDOW_WIDTH = 640;
const WINDOW_HEIGHT = 360;
const VIEW_WIDTH = 1.5*WINDOW_WIDTH;
const VIEW_HEIGHT = 1.5*WINDOW_HEIGHT;

const ASPECT_RATIO = (VIEW_WIDTH > VIEW_HEIGHT) ? VIEW_WIDTH / VIEW_HEIGHT : VIEW_HEIGHT / VIEW_WIDTH;
const RAD_SCALE = 5.0;
// console.log("aspect ratio " + ASPECT_RATIO);