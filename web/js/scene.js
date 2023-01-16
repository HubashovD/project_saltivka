import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { OrbitControls } from 'OrbitControls';
// import { DRACOLoader } from 'DRACOLoader';
window.onload = function() {

    // var width = window.innerWidth
    // var height = window.innerWidth
    // var canvas = document.getElementById('container')
    const container = document.getElementById('container');


    // canvas.setAttribute('width', width);
    // canvas.setAttribute('height', height);
    // const renderer = new THREE.WebGLRenderer();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    var scene = new THREE.Scene()
    scene.background = new THREE.Color(0xbfe3dd);
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(20, 30, 10);

    var light = new THREE.AmbientLight(0xffffff, 2)
    scene.add(light)

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.update();
    controls.enablePan = true;
    controls.enableDamping = true;


    const loader = new GLTFLoader();
    loader.load(
        // resource URL
        "data/threejs4.gltf",
        // called when the resource is loaded
        function(gltf) {

            const model = gltf.scene;
            model.position.set(1, 1, 0);
            model.scale.set(0.01, 0.01, 0.01);
            scene.add(model);

            // scene.add(gltf.scene);
            renderer.render(scene, camera);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            animate();

            console.log(scene.children)



        },
        // called while loading is progressing
        function(xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function(error) {

            console.log('An error happened');

        },


        window.onresize = function() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

        });


    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onPointerMove(event) {

        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // console.log(pointer.x, pointer.y)

    }

    function render() {
        // console.log('render')
        // update the picking ray with the camera and pointer position
        raycaster.setFromCamera(pointer, camera);

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children);
        intersects[0].object.material.color.set(0xff0000);
        // for (let i = 0; i < intersects.length; i++) {

        //     intersects[i].object.material.color.set(0xff0000);
        //     console.log(intersects)
        // }

        // console.log(intersects)

        renderer.render(scene, camera);

    }

    window.addEventListener('pointermove', onPointerMove);

    window.requestAnimationFrame(render);

    function animate() {

        requestAnimationFrame(animate);

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        render()

        renderer.render(scene, camera);

    }





}