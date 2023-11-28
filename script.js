import * as THREE from "./3lib.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS2DRenderer.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 2000);
camera.position.set(0.5, 0.5, 1).setLength(14);
let renderer = new THREE.WebGLRenderer({
  physicallyCorrectLights: true,
  antialias: true
});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);


let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild( labelRenderer.domElement );

window.addEventListener("resize", onWindowResize);

let controls = new OrbitControls(camera, labelRenderer.domElement);
controls.enablePan = false;
controls.minDistance = 6;
controls.maxDistance = 15;
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.0;

let globalUniforms = {
  time: { value: 0 }
};

let rad = 5;
const shellGeometry = new THREE.SphereBufferGeometry(rad + 0.2, 64, 64);
const textureLoader1 = new THREE.TextureLoader();
const texture3D1 = textureLoader1.load('./map2.jpeg'); 
const shellMaterial = new THREE.MeshBasicMaterial({
  map: texture3D1,
  transparent: false,
})
const shell = new THREE.Mesh(shellGeometry, shellMaterial);
scene.add(shell);


const sphereRadius = rad + 0.2; // Radius of the shell sphere
const numInstances = 1000000;

const test1 = new THREE.PlaneGeometry(0.045, 0.045);
const test2 = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.8,
  // blending: THREE.NormalBlending,
  side: THREE.DoubleSide,
});

const test3 = new THREE.InstancedMesh(test1, test2, numInstances);
scene.add(test3);


const instancedMatrix = new THREE.Matrix4();
const distributionPoints = customBrickWallDistribution(numInstances);

function customBrickWallDistribution(samples) {
  const points = [];
  const rows = Math.ceil(Math.sqrt(samples)); // Number of rows in the "brick wall"
  const cols = Math.ceil(samples / rows); // Number of columns in the "brick wall"

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const u = (j / (cols - 1)) * 2 * Math.PI; // parametric variable u
      const v = (i / (rows - 1)) * Math.PI; // parametric variable v

      // Convert spherical coordinates to Cartesian coordinates
      const x = Math.cos(u) * Math.sin(v) * sphereRadius;
      const y = Math.sin(u) * Math.sin(v) * sphereRadius;
      const z = Math.cos(v) * sphereRadius;

      points.push(new THREE.Vector3(x, y, z));
    }
  }

  return points;
}

for (let i = 0; i < numInstances; i++) {
  const position = distributionPoints[i];
  instancedMatrix.makeTranslation(position.x, position.y, position.z);
  const normal = position.clone().normalize();
  instancedMatrix.lookAt(new THREE.Vector3(), normal, new THREE.Vector3(0, 1, 0));
  test3.setMatrixAt(i, instancedMatrix);
}


let galaxyGeometry = new THREE.SphereGeometry(100, 32, 32);
let galaxyMaterial = new THREE.MeshBasicMaterial({
  side: THREE.BackSide
});
let galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
const textureLoader2 = new THREE.TextureLoader();
// Load Galaxy Textures
textureLoader2.crossOrigin = true;
textureLoader2.load(
  './Background.jpg',
  function(texture) {
    galaxyMaterial.map = texture;
    scene.add(galaxy);
  }
);
  const db = firebase.firestore();
  
var list = await db.collection("users")
  .get();

  console.log(list.docs.length);
  const markerCount = 30;
  let labelDiv = document.getElementById("markerLabel");
let closeBtn = document.getElementById("closeButton");
closeBtn.addEventListener("pointerdown", event => {
  labelDiv.classList.add("hidden");
})
let clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  let t = clock.getElapsedTime();
  globalUniforms.time.value = t;
  renderer.shadowMap.enabled = false;
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
});
console.log("errors")
function onWindowResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  labelRenderer.setSize(innerWidth, innerHeight);
}