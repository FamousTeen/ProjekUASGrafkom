// import './style.css'
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/Addons.js';
// import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
// import { MMDLoader } from 'three/addons/loaders/MMDLoader.js';
// import { MMDAnimationHelper } from 'three/addons/animation/MMDAnimationHelper.js';
// import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);


// //setup Scene and Camera
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight , 0.1,1000);
// camera.position.set(0,0,100);
// camera.lookAt(0,0,0);

// // Orbit Controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 5, 0);
// controls.update();

// //Geometry
// // const points = [];
// // points.push(new THREE.Vector3(-1,0,0));
// // points.push(new THREE.Vector3(0,1,0));
// // points.push(new THREE.Vector3(1,0,0));
// // var linegeometry = new THREE.BufferGeometry().setFromPoints(points);
// // var linematerial = new THREE.LineBasicMaterial({color:0xffffff});
// // var line = new THREE.Line(linegeometry,linematerial);
// // scene.add(line);

// // // var geometry = new THREE.BoxGeometry(1,1,1);
// // // var material = new THREE.MeshBasicMaterial({color: 0x00FF00});
// // // var cube = new THREE.Mesh(geometry,material);
// // // scene.add(cube);

// // var points_custom = [-1,-1,1,1,-1,1,-1,1,1,-1,1,1,1,-1,1,1,1,1,1,-1,1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,1,1,-1,1,-1,-1,-1,-1,-1,1,1,-1,1,1,-1,-1,-1,-1,-1,1,-1,-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,-1,-1,-1,1,-1,1,1,1,1,-1,-1,1,-1,1,1,1,1,1,1,-1,1,-1,-1,1,1,1,-1,1,-1,-1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1,-1]
// // var geometry = new THREE.BufferGeometry();
// // geometry.setAttribute(
// //   'position', 
// //   new THREE.BufferAttribute(new Float32Array(points_custom) , 3)

// // );

// // var material = new THREE.MeshBasicMaterial({color: 0xFF0000});
// // var custom_cube = new THREE.Mesh(geometry, material);
// // scene.add(custom_cube);

// // LIGHT
// // Directional Light
// var color = 0xFFFFFF;
// var light = new THREE.DirectionalLight(color, 5);
// light.position.set(0, 10, 0);
// light.target.position.set(-5, 0, 0);
// scene.add(light);
// scene.add(light.target);


// // Hemisphere Light
// //                                sky color, ground color, intensity
// light = new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 5);
// scene.add(light);

// // Point Light
// //                           color, intensity
// // light = new THREE.PointLight(0xFFFF00, 50);
// // light.position.set(10, 10, 0);
// // scene.add(light);

// // Spot Light
// // light = new THREE.SpotLight(0xFF0000, 50);
// // light.position.set(10, 10, 0);
// // scene.add(light);

// // // CUBE
// // {
// // var cubeGeo = new THREE.BoxGeometry(4, 4, 4);
// // var cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
// // var mesh = new THREE.Mesh(cubeGeo, cubeMat);
// // mesh.position.set(5, 3.5, 0);
// // scene.add(mesh);
// // }
// // // SPHERE
// // {
// // var sphereGeo = new THREE.SphereGeometry(3, 32, 16);
// // var sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
// // var mesh = new THREE.Mesh(sphereGeo, sphereMat);
// // mesh.position.set(-4, 5, 0);
// // scene.add(mesh);
// // }
// // Geometry
// const objects = [];

// // instantiate a loader
// // var loader = new OBJLoader();

// // model

// // on progress
// const onProgress = function ( xhr ) {

//   if ( xhr.lengthComputable ) {

//     const percentComplete = xhr.loaded / xhr.total * 100;
//     console.log( percentComplete.toFixed( 2 ) + '% downloaded' );

//   }

// };

// // MTL LOADER
// // load a resource
// // new MTLLoader()
// // 					.setPath( 'resources/' )
// // 					.load( 'magic_book_OBJ.mtl', function ( materials ) {

// // 						materials.preload();

// // 						new OBJLoader()
// // 							.setMaterials( materials )
// // 							.setPath( 'resources/' )
// // 							.load( 'magic_book_OBJ.obj', function ( object ) {

// // 								object.position.y = 1;
// // 								// object.scale.setScalar( 0.01 );
// // 								scene.add( object );

// // 							}, onProgress );

// // 					} );

// 				let mixer;

// 					// model
// 				var loader = new FBXLoader();
// 				loader.load( 'resources/Silver wolf/silverWolfAnimationTesting3.fbx', function ( object ) {

// 					mixer = new THREE.AnimationMixer( object );

// 					// var action = mixer.clipAction( object.animations[ 0 ] );
// 					// action.play();

// 					object.animations.forEach( animation => {
// 						var action = mixer.clipAction( animation ).play();
// 						action.play();
// 				 } );

// 					object.traverse( function ( child ) {

// 						if ( child.isMesh ) {

// 							child.castShadow = true;
// 							child.receiveShadow = true;

// 						}

// 					} );

// 					scene.add( object );

// 				} );

// 					// model
// 				// var loader = new FBXLoader();
// 				// loader.load( 'resources/beachFinished2.fbx', function ( object ) {

// 				// 	mixer = new THREE.AnimationMixer( object );

// 				// 	// var action = mixer.clipAction( object.animations[ 0 ] );
// 				// 	// action.play();

// 				// 	object.animations.forEach( animation => {
// 				// 		var action = mixer.clipAction( animation ).play();
// 				// 		action.play();
// 				//  } );

// 				// 	object.traverse( function ( child ) {

// 				// 		if ( child.isMesh ) {

// 				// 			child.castShadow = true;
// 				// 			child.receiveShadow = true;

// 				// 		}

// 				// 	} );

// 				// 	scene.add( object );

// 				// } );

// // MMD Loader
// // Instantiate a loader
// // Instantiate a helper
// // var helper = new MMDAnimationHelper();

// // // Load MMD resources and add to helper
// // new MMDLoader().loadWithAnimation(
// // 	'models/mmd/miku_v2.pmd',
// // 	'models/mmd/wavefile_v2.vmd',
// // 	function ( mmd ) {

// // 		helper.add( mmd.mesh, {
// // 			animation: mmd.animation,
// // 			physics: true
// // 		} );

// // 		scene.add( mmd.mesh );

// // 		// new THREE.AudioLoader().load(
// // 		// 	'audios/mmd/song.mp3',
// // 		// 	function ( buffer ) {

// // 		// 		const listener = new THREE.AudioListener();
// // 		// 		const audio = new THREE.Audio( listener ).setBuffer( buffer );

// // 		// 		listener.position.z = 1;

// // 		// 		scene.add( audio );
// // 		// 		scene.add( listener );

// // 		// 	}

// // 		// );

// // 	}
// // );

// // PLANE  
// {
// var planetGeo = new THREE.PlaneGeometry(40, 40);
// var planetMat = new THREE.MeshPhongMaterial({color: '#8AC'});
// var mesh = new THREE.Mesh(planetGeo, planetMat);
// mesh.rotation.x = Math.PI * -0.5;
// scene.add(mesh);
// }

// var time_prev = 0;
// function animate(time){
//   var dt = time - time_prev;
//   dt *= 0.1;

//   objects.forEach((obj)=>{
//     obj.rotation.z += dt * 0.01;
//   });

  

//   // custom_cube.rotation.x += 0.01 * dt;
//   // custom_cube.rotation.y += 0.01 * dt;



//   renderer.render(scene,camera);  

//   time_prev = time;
//   requestAnimationFrame(animate);
// }

// requestAnimationFrame(animate);