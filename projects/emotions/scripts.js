var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 0;
camera.position.x = 5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

var ambLight = new THREE.AmbientLight(0x404040, 1.0);

var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(11, 0%, 100%)'), 1.0);
keyLight.position.set(-100, 50, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(11, 0%, 100%)'), 0.75);
fillLight.position.set(100, 50, 100);

var backLight = new THREE.HemisphereLight(0xffffff, 1.0);
backLight.position.set(100, 50, -100);

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);
scene.add(ambLight);
scene.background = new THREE.Color('rgb(247, 210, 105)');

var mtlLoader = new THREE.MTLLoader();
mtlLoader.setTexturePath('assets/');
mtlLoader.setPath('assets/');
mtlLoader.load('emotions3.mtl', function (materials) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('assets/');
    objLoader.load('emotions3.obj', function (object) {

        scene.add(object);
        object.position.y -= 1;

    });

});

var animate = function () {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render(scene, camera);
};

animate();