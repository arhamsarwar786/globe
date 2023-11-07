import * as THREE from "https://unpkg.com/three@0.149.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer, CSS2DObject } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS2DRenderer.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 2000);
camera.position.set(0.9, 0.5, 1).setLength(14);
let renderer = new THREE.WebGLRenderer({
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
controls.autoRotateSpeed *= 0.95;

let globalUniforms = {
  time: { value: 0 }
};

let rad = 5;
const initialShellOpacity = 1.9; // Initial shell opacity
const shellGeometry = new THREE.SphereBufferGeometry(rad + 0.2, 64, 64);
const textureLoader1 = new THREE.TextureLoader();
const texture3D1 = textureLoader1.load(imgData7); 
const shellMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  opacity: 1,
  map: texture3D1,
  transparent: true,
  shininess: 0.0,
})

const shell = new THREE.Mesh(shellGeometry, shellMaterial);
scene.add(shell);

// Create ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.03);
scene.add(ambientLight);

// Create a hemisphere light
// const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.0001);
// scene.add(hemisphereLight);

// Example of adding directional lights to the scene
const directionalLights = [];

// Add directional lights from different angles
const light1 = new THREE.DirectionalLight(0xffffff, 0.1);
light1.position.set(0, 0, 10); // Adjust the light direction
directionalLights.push(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 0.1);
light2.position.set(10, 0, 0); // Adjust the light direction
directionalLights.push(light2);

const light3 = new THREE.DirectionalLight(0xffffff, 0.1);
light3.position.set(0, 10, 0); // Adjust the light direction
directionalLights.push(light3);

const light4 = new THREE.DirectionalLight(0xffffff, 0.1);
light4.position.set(-10, 0, 0); // Adjust the light direction
directionalLights.push(light4);

const light5 = new THREE.DirectionalLight(0xffffff, 0.1);
light5.position.set(0, -10, 0); // Adjust the light direction
directionalLights.push(light5);

// Add the lights to the scene
for (const light of directionalLights) {
  scene.add(light);
}

let galaxyGeometry = new THREE.SphereGeometry(100, 32, 32);
let galaxyMaterial = new THREE.MeshBasicMaterial({
  side: THREE.BackSide
});
let galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
const textureLoader = new THREE.TextureLoader();
// Load Galaxy Textures
textureLoader.crossOrigin = true;
textureLoader.load(
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/starfield.png',
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

addRandomSpotlights(140, Math.PI / 15);

function addSpotLight(x,y,z){
  const spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( x,y,z );
  spotLight.castShadow = false;
  spotLight.intensity = 1;
  spotLight.angle = Math.PI / 15;
  spotLight.penumbra = 0.06; 
   spotLight.distance = 10;
  const helper = new THREE.SpotLightHelper(spotLight);
  // scene.add(helper);
  
  scene.add( spotLight );
  
}

function addRandomSpotlights(numSpotlights) {
  const minRadius = 0.5; // Minimum radius
  const maxRadius = 0.5; // Maximum radius
  const minSize = 0.2; // Minimum spotlight size
  const maxSize = 0.2; // Maximum spotlight size

  for (let i = 0; i < numSpotlights; i++) {
    // Generate random positions outside the globe's surface
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;
    const size = Math.random() * (maxSize - minSize) + minSize;
    const theta = Math.random() * Math.PI * 2; // Random angle
    const phi = Math.random() * Math.PI; // Random elevation angle

    // Calculate the spotlight positions outside the globe
    const globeRadius = 5; // Globe radius
    const x = (globeRadius + radius) * Math.sin(phi) * Math.cos(theta);
    const y = (globeRadius + radius) * Math.sin(phi) * Math.sin(theta);
    const z = (globeRadius + radius) * Math.cos(phi);

    addSpotLight(x, y, z, size);
  }
}

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