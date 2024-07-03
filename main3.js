import * as THREE from "three";
import { Player, PlayerController, ThirdPersonCamera } from "./player.js";
import { Player2, PlayerController2, ThirdPersonCamera2 } from "./player2.js";
import { Player3, PlayerController3, ThirdPersonCamera3 } from "./player3.js";
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

import * as CANNON from 'cannon-es'; 


class Main{
    static WindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    static init(){
        document.body.style.overflow = 'hidden';
        var canvReference = document.getElementById("canvas");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
        this.renderer = new THREE.WebGLRenderer({antialias: true, canvas:canvReference});
        this.isValidBox = false;
        this.prevPosition = null;
        // kasih shadow
        // this.renderer.shadowMap.enabled = true;  
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        const textureLoader = new THREE.TextureLoader();
        this.scene.background = textureLoader.load("resources_3person/Background/background.jpg")
        this.renderer.shadowMap.enabled = true;
        var mesh = null;

        window.addEventListener('resize', () => {
            Main.WindowResize();
          }, false);

        const groundGeo = new THREE.PlaneGeometry(46, 25);
        const groundMat = new THREE.MeshBasicMaterial({
            color: 0xffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0
        });

        this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
        this.scene.add(this.groundMesh);

        const groundGeo2 = new THREE.PlaneGeometry(70, 50);
        const groundMat2 = new THREE.MeshBasicMaterial({
            color: 0xffff,
            side: THREE.DoubleSide,
            wireframe: true,
            transparent: true,
            opacity: 0
        });

        this.groundMesh2 = new THREE.Mesh(groundGeo2, groundMat2);
        this.scene.add(this.groundMesh2);

        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.81, 0)
        });
        this.world.broadphase = new CANNON.NaiveBroadphase();
        
        this.timeStep = 1/60;

        this.groundBody = new CANNON.Body({
            shape: new CANNON.Plane(),
            type: CANNON.Body.STATIC
        });
        this.world.addBody(this.groundBody);
        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
        this.groundBody.position.y += 0.5;
        this.groundBody.position.z -= 0.75;

        this.groundBody2 = new CANNON.Body({
            shape: new CANNON.Plane(),
            type: CANNON.Body.STATIC
        });

        this.world.addBody(this.groundBody2);
        this.groundBody2.quaternion.setFromEuler(Math.PI / 2, 0, 0)
        this.groundBody2.position.y -= 12.5;
        this.groundBody2.position.z -= 0.75;

        const boxGeo2 = new THREE.BoxGeometry(45, 2, 7);
        const boxGeo3 = new THREE.BoxGeometry(37.5, 2, 7);
        const boxGeo4 = new THREE.BoxGeometry(29, 2, 5);
        const boxMat = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: false,
            transparent: true,
            opacity: 0,
            depthTest: false,
            depthWrite: false
        })

        this.boxMesh2 = new THREE.Mesh(boxGeo2, boxMat);
        // this.boxMesh2.material = null;
        this.scene.add(this.boxMesh2);

        this.boxMesh3 = new THREE.Mesh(boxGeo3, boxMat);
        // this.boxMesh3.material = null;
        this.scene.add(this.boxMesh3);

        this.boxMesh4 = new THREE.Mesh(boxGeo4, boxMat);
        this.scene.add(this.boxMesh4);

        this.boxBody2 = new CANNON.Body({ 
            mass: 0,  
            shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
            position: new CANNON.Vec3(1, 2, 8),
            type: CANNON.Body.STATIC
        });

        this.boxBody3 = new CANNON.Body({ 
            mass: 0,  
            shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
            position: new CANNON.Vec3(1, 2, 1.5),
            type: CANNON.Body.STATIC
        });

        this.boxBody4 = new CANNON.Body({ 
            mass: 0,  
            shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
            position: new CANNON.Vec3(1, 2, -9.5),
            type: CANNON.Body.STATIC
        });


        this.world.addBody(this.boxBody2);

        this.world.addBody(this.boxBody3);

        this.world.addBody(this.boxBody4);


        const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );

        const loader = new GLTFLoader();
		loader.setDRACOLoader( dracoLoader );
        loader.setPath( 'resources_3person/Town/' );
        loader.load( 'fantasy.glb', (gltf) => {
            gltf.scene.traverse(function(child) {
                if (child.isMesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                }
            })
            this.scene.add( gltf.scene );
            // render();

        }, undefined, (error) => {
            console.error("An error happened while loading the GLTF model", error);
        });

        // Ambient Light
        var ambientLight = new THREE.AmbientLight(0x8A2BE2,2);
        this.scene.add(ambientLight);

        // Directional Light
        var directionalLight = new THREE.DirectionalLight(0xFDB813, 6);
        directionalLight.position.set( -10.4401, 10, 4.6822);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        directionalLight.shadow.camera.left = - 20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 40;
        // directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
        // this.scene.add( helper );

        // this.scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));

        this.scene.add(directionalLight.target);

        // ThirdPersonCamera
        this.player = new Player(
            new ThirdPersonCamera(
                this.camera, new THREE.Vector3(-5, 2, 0), new THREE.Vector3(0, 0, 0), false, false, false, []
            ),
            new PlayerController(),
            this.scene,
            5, 
            false, 
            false,
            this.world
        );

        // this.player2 = new Player2(
        //     new ThirdPersonCamera2(
        //         this.camera, new THREE.Vector3(-5, 2, 0), new THREE.Vector3(0, 0, 0), false, false, false, []
        //     ),
        //     new PlayerController2(),
        //     this.scene,
        //     5, 
        //     false, 
        //     false
        // );   

        // this.player3 = new Player3(
        //     new ThirdPersonCamera3(
        //         this.camera, new THREE.Vector3(-5, 2, 0), new THREE.Vector3(0, 0, 0), false, false, false, []
        //     ),
        //     new PlayerController3(),
        //     this.scene,
        //     5, 
        //     false, 
        //     false
        // );   

        this.activePlayer = this.player;

        this.onKeyDown = function(event) {
            switch (event.keyCode) {
                case 49: // Key '1'
                    this.activePlayer.camera1 = true;
                    this.activePlayer.camera2 = false;
                    this.activePlayer.camera.cameraBool = true;
                    this.activePlayer.camera.cameraBool2 = false;
                    break;
                case 50: // Key '2'
                    this.activePlayer.camera1 = false;
                    this.activePlayer.camera2 = true;
                    this.activePlayer.camera.cameraBool = false;
                    this.activePlayer.camera.cameraBool2 = true;
                    break;
                // case 66: // Key 'b'
                //     if (this.activePlayer === this.player) {
                //         this.activePlayer = this.player2;
                //     } else {
                //         this.activePlayer = this.player;
                //     }
                //     break;
                // case 78: // Key 'n'
                //     if (this.activePlayer === this.player) {
                //         this.activePlayer = this.player3;
                //     } else {
                //         this.activePlayer = this.player;
                //     }
                //     break;
            }
            }

        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
    }

    static render(dt) { 
        this.activePlayer.update(dt);

        this.world.step(dt);

        this.groundMesh.position.copy(this.groundBody.position);
        this.groundMesh.quaternion.copy(this.groundBody.quaternion);

        this.groundMesh2.position.copy(this.groundBody2.position);
        this.groundMesh2.quaternion.copy(this.groundBody2.quaternion);

        // this.boxMesh.position.copy(this.boxBody.position);
        // this.boxMesh.quaternion.copy(this.boxBody.quaternion);

        this.boxMesh2.position.copy(this.boxBody2.position);
        this.boxMesh2.quaternion.copy(this.boxBody2.quaternion);

        this.boxMesh3.position.copy(this.boxBody3.position);
        this.boxMesh3.quaternion.copy(this.boxBody3.quaternion);

        this.boxMesh4.position.copy(this.boxBody4.position);
        this.boxMesh4.quaternion.copy(this.boxBody4.quaternion);

        this.renderer.render(this.scene, this.camera);
    }
}

var clock = new THREE.Clock();
Main.init();
function animate() {
    Main.render(clock.getDelta());
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);