/* -----------
Three.js demo
Visualizing 100 Meteorite Landings. 
Data from NASA's Open Data Portal.(https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh)
----------- */

// Load the CSV with d3-request

// import * as THREE from 'three';

let dataLoaded = false;
let meteorites;
const meshes = [];
const material = new THREE.MeshLambertMaterial({ color: 0xff0000, side: 2, shading: THREE.FlatShading });

// Convert range function
const convertRange = (value, r1, r2) => {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
};

// Load the data
d3.csv("../data/Meteorite_Landings.csv", function(data) {

    console.log(data)
        // meteorites = data;
    for (let i = 0; i < 2; i++) {
        const radius = convertRange(25, [558, 60000000], [2, 15]);
        const tube = convertRange(25, [558, 60000000], [0.4, 4]);
        const geometry = new THREE.TorusGeometry(radius, tube, 16, 100);
        meshes.push(new THREE.Mesh(geometry, material));
    }


    // Scene Configurations
    const WIDTH = 640;
    const HEIGHT = 580;
    const VIEW_ANGLE = 45;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    // Scene, camera, canvas, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    const canvas = document.getElementById("container");
    console.log(canvas)
    const renderer = new THREE.WebGLRenderer();

    camera.position.z = 300;
    scene.add(camera);
    renderer.setSize(WIDTH, HEIGHT);

    // Light
    const light = new THREE.PointLight(0xffffff, 1.2);
    light.position.set(0, 0, 6);
    scene.add(light);

    // API Key for Mapboxgl. Get one here:
    // https://www.mapbox.com/studio/account/tokens/
    const key = 'pk.eyJ1IjoiZGVueXMtaHViYXNob3YiLCJhIjoiY2thZTV3MmJhMDVzaDJ4cXBiaGRpN3poMiJ9.Es8QkZLX1Pok_M9m7DO5dA'

    const options = {
        lat: 0,
        lng: 0,
        zoom: 2,
        pitch: 50,
    }

    const mappa = new Mappa('MapboxGL', key);
    const myMap = mappa.tileMap(options);
    myMap.overlay(canvas);
    myMap.onChange(update);

    function update() {
        if (dataLoaded) {
            meshes.forEach((mesh, item) => {
                // console.log(mesh)
                const pos = myMap.latLngToPixel(meteorites[item].lat, meteorites[item].lng);
                const vector = new THREE.Vector3();
                vector.set((pos.x / WIDTH) * 2 - 1, -(pos.y / HEIGHT) * 2 + 1, 0.5);
                vector.unproject(camera);
                const dir = vector.sub(camera.position).normalize();
                const distance = -camera.position.z / dir.z;
                const newPos = camera.position.clone().add(dir.multiplyScalar(distance));

                mesh.position.set(newPos.x, newPos.y, newPos.z);
                scene.add(mesh);
            })
        }
    }

    // Animate loop
    const animate = () => {
        requestAnimationFrame(animate);
        if (dataLoaded) {
            meshes.forEach((mesh) => {
                mesh.rotation.x += 0.01;
                mesh.rotation.y += 0.01;
            })
        }
        renderer.render(scene, camera);
    };

    animate();
});