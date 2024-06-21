// import * as THREE from 'three';

// 			import Stats from 'three/addons/libs/stats.module.js';
// 			import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// 			import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 			import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
// 			import { MMDLoader } from 'three/addons/loaders/MMDLoader.js';
//       import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
// 			import { MMDAnimationHelper } from 'three/addons/animation/MMDAnimationHelper.js';

// 			let stats;

// 			let escBol = false;

// 			let mesh, camera, scene, renderer, effect;
// 			let helper, ikHelper, physicsHelper;

// 			const clock = new THREE.Clock();

// 			function degrees_to_radians(degrees) {
// 				var pi = Math.PI;
// 				return degrees * (pi / 180);
// 			}

// 			Ammo().then( function ( AmmoLib ) {

// 				Ammo = AmmoLib;

// 				init();
// 				animate();

// 			} );


// 			function init() {

// 				const container = document.createElement( 'div' );
// 				document.body.appendChild( container );
// 				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20000);
// 				camera.rotation.order = 'YXZ';
// 				camera.position.z = 30;	
// 				camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), degrees_to_radians(90));

// 				container.addEventListener( 'mousedown', () => {
// 					document.body.requestPointerLock();
	
// 					// mouseTime = performance.now();

// 					console.log('Pointer lock requested');
	
// 				} );

// 				document.addEventListener('pointerlockchange', () => {
// 					if (document.pointerLockElement === document.body) {
// 							console.log('Pointer lock is active');
// 					} else {
// 							console.log('Pointer lock is not active');
// 					}
// 			});

// 				document.addEventListener( 'keydown', ( event ) => {
// 					var x = event.key;
// 					if (x == "Escape") {
// 						document.exitPointerLock();
// 						console.log('Pointer lock exit requested');
// 					}
	
// 				} );
	
// 				document.body.addEventListener( 'mousemove', ( event ) => {
// 					console.log(escBol)
	
// 					if ( document.pointerLockElement === document.body) {
// 						camera.rotation.y -= event.movementX / 500;
// 						camera.rotation.x -= event.movementY / 500;
// 						console.log(`Camera rotated: x=${camera.rotation.x}, y=${camera.rotation.y}`);
// 					} else{
// 						console.log('Pointer is not locked, camera not rotating');
// 					}
	
// 				} );

// 				// scene

// 				scene = new THREE.Scene();
// 				scene.background = new THREE.Color( 0xffffff );

// 				// const gridHelper = new THREE.PolarGridHelper( 30, 0 );
// 				// gridHelper.position.y = - 10;
// 				// scene.add( gridHelper );

//         // const light = new THREE.PointLight( 0xff0000, 1, 100 );
//         // light.position.set( 50, 50, 50 );
//         // scene.add( light );

//         // const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
//         // scene.add( light );

//         // const spotLight = new THREE.SpotLight( 0xffffff );
//         // spotLight.position.set( 0, 1, 1 ).normalize();
//         // // spotLight.map = new THREE.TextureLoader().load( url );

//         // spotLight.castShadow = true;

//         // spotLight.shadow.mapSize.width = 1024;
//         // spotLight.shadow.mapSize.height = 1024;

//         // spotLight.shadow.camera.near = 500;
//         // spotLight.shadow.camera.far = 4000;
//         // spotLight.shadow.camera.fov = 30;

//         // scene.add( spotLight );

// 				const ambient = new THREE.AmbientLight( 0xaaaaaa, 5);
// 				scene.add( ambient );

// 				// const directionalLight = new THREE.DirectionalLight( 0xffffff, 5);
// 				// directionalLight.position.set( -1, 1, 1 ).normalize();
//         // // directionalLight.target.position.set( 0, -10, 1 ).normalize();
// 				// scene.add( directionalLight );

// 				var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
//         directionalLight.position.set( 3, 10, 10 );
//         directionalLight.castShadow = true;
//         directionalLight.shadow.camera.top = 20;
//         directionalLight.shadow.camera.bottom = -20;
//         directionalLight.shadow.camera.left = - 20;
//         directionalLight.shadow.camera.right = 20;
//         directionalLight.shadow.camera.near = 0.1;
//         directionalLight.shadow.camera.far = 40;
//         directionalLight.castShadow = true;
//         scene.add(directionalLight);

//         let mixer;

// 				var loader = new FBXLoader();
// 				loader.load( 'resources/belobogTrainStationFinished.fbx', function ( object ) {

// 					mixer = new THREE.AnimationMixer( object );

// 					object.animations.forEach( animation => {
//             		var action = mixer.clipAction( animation ).play();
//             		action.play();
//           } );

// 					object.traverse( function ( child ) {

// 						if ( child.isMesh ) {

// 							child.castShadow = true;
// 							child.receiveShadow = true;

// 						}

// 					} );
// 					object.scale.set(0.1,0.1,0.1);
// 					scene.add( object );

// 				} );

// 				renderer = new THREE.WebGLRenderer( { antialias: true } );
// 				renderer.setPixelRatio( window.devicePixelRatio );
// 				renderer.setSize( window.innerWidth, window.innerHeight );
// 				renderer.shadowMap.enabled = true;
// 				container.appendChild( renderer.domElement );

// 				effect = new OutlineEffect( renderer );

// 				// STATS

// 				stats = new Stats();
// 				container.appendChild( stats.dom );

// 				// model

// 				function onProgress( xhr ) {

// 					if ( xhr.lengthComputable ) {

// 						const percentComplete = xhr.loaded / xhr.total * 100;
// 						console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

// 					}

// 				}


// 				const modelFile = 'models/mmd/Kafka/Kafka.pmx';
// 				// const vmdFiles = [ 'models/mmd/wavefile_v2.vmd' ];
//         const vmdFiles = [ 'vmd/Walk_Cycle_5.5.vmd'];

// 				helper = new MMDAnimationHelper( {
// 					afterglow: 0.0,
//           resetPhysicsOnLoop: false
// 				} );

//         loader = new MMDLoader();

// 				loader.loadWithAnimation( modelFile, vmdFiles, function ( mmd ) {

// 					mesh = mmd.mesh;
// 					// mesh.position.y = - 10;
//           mesh.scale.x = 4;
//           mesh.scale.y = 4;
//           mesh.scale.z = 4;
// 					scene.add( mesh );

// 					helper.add( mesh, {
// 						animation: mmd.animation,
// 						physics: true
// 					} );

// 					ikHelper = helper.objects.get( mesh ).ikSolver.createHelper();
// 					ikHelper.visible = false;
// 					scene.add( ikHelper );

// 					physicsHelper = helper.objects.get( mesh ).physics.createHelper();
// 					physicsHelper.visible = false;
// 					scene.add( physicsHelper );

// 				}, onProgress, null );

//         loader = new MMDLoader();

// 				loader.loadWithAnimation( 'models/mmd/trailblazer/hmc1.pmx', vmdFiles, function ( mmd ) {

// 					mesh = mmd.mesh;
// 					// mesh.position.y = - 10;
//           mesh.position.x = - 20;
// 					scene.add( mesh );

// 					helper.add( mesh, {
// 						animation: mmd.animation,
// 						physics: true
// 					} );

// 					ikHelper = helper.objects.get( mesh ).ikSolver.createHelper();
// 					ikHelper.visible = false;
// 					scene.add( ikHelper );

// 					physicsHelper = helper.objects.get( mesh ).physics.createHelper();
// 					physicsHelper.visible = false;
// 					scene.add( physicsHelper );

// 					new THREE.AudioLoader().load(
// 						'resources/mikuSong.mp3',
// 						function (buffer) {
			
// 							const listener = new THREE.AudioListener();
// 							camera.add(listener);
// 							const audio = new THREE.Audio(listener).setBuffer(buffer);;

// 							audio.setLoop(true);
// 							audio.setVolume(0.5);
// 							audio.play();
			
// 						}
			
// 					);

// 					initGui();

// 				}, onProgress, null );

// 				const controls = new OrbitControls( camera, renderer.domElement );
// 				controls.minDistance = 10;
// 				controls.maxDistance = 1000;

// 				window.addEventListener( 'resize', onWindowResize );

// 				function initGui() {

// 					const api = {
// 						'animation': true,
// 						'ik': true,
// 						'outline': true,
// 						'physics': true,
// 						'show IK bones': false,
// 						'show rigid bodies': false
// 					};

// 					const gui = new GUI();

// 					gui.add( api, 'animation' ).onChange( function () {

// 						helper.enable( 'animation', api[ 'animation' ] );

// 					} );

// 					gui.add( api, 'ik' ).onChange( function () {

// 						helper.enable( 'ik', api[ 'ik' ] );

// 					} );

// 					gui.add( api, 'outline' ).onChange( function () {

// 						effect.enabled = api[ 'outline' ];

// 					} );

// 					gui.add( api, 'physics' ).onChange( function () {

// 						helper.enable( 'physics', api[ 'physics' ] );

// 					} );

// 					gui.add( api, 'show IK bones' ).onChange( function () {

// 						ikHelper.visible = api[ 'show IK bones' ];

// 					} );

// 					gui.add( api, 'show rigid bodies' ).onChange( function () {

// 						if ( physicsHelper !== undefined ) physicsHelper.visible = api[ 'show rigid bodies' ];

// 					} );

// 				}

// 			}

// 			function onWindowResize() {

// 				camera.aspect = window.innerWidth / window.innerHeight;
// 				camera.updateProjectionMatrix();

// 				effect.setSize( window.innerWidth, window.innerHeight );

// 			}

// 			//

// 			function animate() {

// 				requestAnimationFrame( animate );

// 				stats.begin();
// 				render();
// 				stats.end();

// 			}

// 			function render() {

// 				helper.update( clock.getDelta() );
// 				effect.render( scene, camera );

// 			}