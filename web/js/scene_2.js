import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { OrbitControls } from 'OrbitControls';
// import { DRACOLoader } from 'DRACOLoader';
window.onload = function() {

    function metadata(userData) {
        // console.log(userData)

        // var moved = false
        // window.onmousemove = function(e) {
        //     if (!moved) {
        //         moved = true;
        //         console.log('https://hubashovd.github.io/project_saltivka/web/video/' + userData.properties[0] + '.mp4 ')
        //         d3.select('#infoboard').html(
        //             'id ' + userData.properties[0] + '<br/>' +
        //             'addr ' + userData.properties[3] + '<br>' +
        //             'cat ' + userData.properties[4] + '<br>' +
        //             'desc ' + userData.properties[5] + '<br>' +
        //             'desc ' + userData.properties[17] + '<br>' +
        //             '<video width="400" autoplay muted><source src="https://hubashovd.github.io/project_saltivka/web/video/' + userData.properties[0] +
        //             '.mp4" type="video/mp4"></video>' + '<br>' +
        //             'photo ' + userData.properties[16] + '<br>' +
        //             'desc ' + userData.properties[12] + '<br>' +
        //             'id ' + userData.properties[0] + '<br>' +
        //             'id ' + userData.properties[0] + '<br>' +
        //             'id ' + userData.properties[0] + '<br>'
        //         )
        //     }
        // }

        d3.select('#infoboard').html(
            'id ' + userData.properties[0] + '<br/>' +
            'addr ' + userData.properties[3] + '<br>' +
            'cat ' + userData.properties[4] + '<br>' +
            'desc ' + userData.properties[5] + '<br>' +
            'desc ' + userData.properties[17] + '<br>' +
            '<video width="400" autoplay muted><source src="https://hubashovd.github.io/project_saltivka/web/video/' + userData.properties[0] +
            '.mp4" type="video/mp4"></video>' + '<br>' +
            'photo ' + userData.properties[16] + '<br>' +
            'desc ' + userData.properties[12] + '<br>' +
            'id ' + userData.properties[0] + '<br>' +
            'id ' + userData.properties[0] + '<br>' +
            'id ' + userData.properties[0] + '<br>'
        )


    }


    const canvas = document.getElementById('container');
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // console.log(window.devicePixelRatio)
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.getBoundingClientRect().width, container.getBoundingClientRect().height);
    // console.log(container.getBoundingClientRect())
    renderer.outputEncoding = THREE.sRGBEncoding;
    canvas.appendChild(renderer.domElement);

    var scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff);
    const camera = new THREE.PerspectiveCamera(45, container.getBoundingClientRect().width / container.getBoundingClientRect().height, 1, 200);
    camera.position.set(10, 22, -45);

    var light = new THREE.AmbientLight(0xffffff, 2)
    scene.add(light)

    // const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
    // scene.add( directionalLight );
    

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.update();
    controls.enablePan = true;
    controls.enableDamping = true;

    // console.log(container.getBoundingClientRect())
    const loader = new GLTFLoader();
    loader.load(
        // resource URL
        "data/threejs15.gltf",
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

            // animate();

            console.log(scene)



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

            camera.aspect = container.getBoundingClientRect().width / container.getBoundingClientRect().height;
            camera.updateProjectionMatrix();

            renderer.setSize(container.getBoundingClientRect().width, container.getBoundingClientRect().height);

        },

    );

    console.log(scene)

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }
    class PickHelper {
        constructor() {
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickedObjectSavedColor = 0;
        }
        pick(normalizedPosition, scene, camera, time) {
            // restore the color if there is a picked object
            if (this.pickedObject) {
                this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
                this.pickedObject = undefined;
            }
            console.log('pick')
            // cast a ray through the frustum
            this.raycaster.setFromCamera(normalizedPosition, camera);
            // get the list of objects the ray intersected

            try {
                var for_intersected = []
                for (let step = 0; step < 41; step++) {
                    for_intersected.push(scene.children[1].children[step])
                }
                const intersectedObjects = this.raycaster.intersectObjects(for_intersected);
                if (intersectedObjects.length) {
                    // time = 1
                    // pick the first object. It's the closest one
                    this.pickedObject = intersectedObjects[0].object;
                    metadata(this.pickedObject.userData)
                        // save its color
                    this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                    // set its emissive color to flashing red/yellow
                    // this.pickedObject.material.emissive.setHex((time * 50) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
                    this.pickedObject.material.emissive.setHex(0xFFFF00);}
            } catch {}

        }
    }
    const pickPosition = { x: 0, y: 0 };
    const pickHelper = new PickHelper();
    clearPickPosition();

    // time
    function render() {
        // console.log('render')
        // time *= 0.0001; // convert to seconds;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // cameraPole.rotation.y = time * .1;
        // , time
        // pickHelper.pick(pickPosition, scene, camera);
        // console.log(camera.position)
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    function getCanvasRelativePosition(event) {
        console.log(event)
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    function setPickPosition(event) {
        pickHelper.pick(pickPosition, scene, camera);
        console.log(event)
        const pos = getCanvasRelativePosition(event);
        pickPosition.x = (pos.x / canvas.clientWidth) * 2 - 1;
        pickPosition.y = (pos.y / canvas.clientHeight) * -2 + 1; // note we flip Y
    }

    function clearPickPosition() {
        // unlike the mouse which always has a position
        // if the user stops touching the screen we want
        // to stop picking. For now we just pick a value
        // unlikely to pick something
        pickPosition.x = -100000;
        pickPosition.y = -100000;
    }
    // window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('click', setPickPosition);
    window.addEventListener('touchend', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);

    window.addEventListener('touchstart', (event) => {
        // prevent the window from scrolling
        event.preventDefault();
        setPickPosition(event.touches[0]);
    }, { passive: false });

    window.addEventListener('touchmove', (event) => {
        setPickPosition(event.touches[0]);
    });

    window.addEventListener('touchend', clearPickPosition);

    // function animate() {

    //     requestAnimationFrame(animate);

    //     // required if controls.enableDamping or controls.autoRotate are set to true
    //     controls.update();

    //     render()

    //     renderer.render(scene, camera);

    // }
}