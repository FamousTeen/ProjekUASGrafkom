import * as THREE from "three";
import { Player, PlayerController, ThirdPersonCamera } from "./player.js";
import { Player2, PlayerController2, ThirdPersonCamera2 } from "./player2.js";
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';


class Main{
    static WindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    static init(){
        var canvReference = document.getElementById("canvas");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
        this.renderer = new THREE.WebGLRenderer({antialias: true, canvas:canvReference});

        // kasih shadow
        // this.renderer.shadowMap.enabled = true;  
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setClearColor(0x000000, 1);
        const textureLoader = new THREE.TextureLoader();
        this.scene.background = textureLoader.load("resources_3person/Background/background.jpg")

        // const cubeTextureLoader = new THREE.CubeTextureLoader();
        // this.scene.background = cubeTextureLoader.load ([
        //     "resources_3person/Background/background2.jpg",
        //     "resources_3person/Background/background2.jpg",
        //     "resources_3person/Background/background2.jpg",
        //     "resources_3person/Background/background2.jpg",
        //     "resources_3person/Background/background2.jpg",
        //     "resources_3person/Background/background2.jpg"
        // ])
        this.renderer.shadowMap.enabled = true;
        var mesh = null;

        window.addEventListener('resize', () => {
            Main.WindowResize();
          }, false);

        // //Plane
        // var plane = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb } ) );
        // plane.rotation.x = - Math.PI / 2;
        // plane.receiveShadow = true;
        // plane.castShadow = true;
        // this.scene.add( plane );

        // model
        // let mixer;

        // const loader = new FBXLoader();
        // loader.load('resources_3person/Town/test.fbx', (object) => {
        //     console.log("FBX model loaded", object);
        //     mixer = new THREE.AnimationMixer(object);

        //     object.animations.forEach(animation => {
        //         const action = mixer.clipAction(animation).play();
        //         action.play();
        //     });

        //     object.traverse((child) => {
        //         if (child.isMesh) {
        //             child.castShadow = true;
        //             child.receiveShadow = true;
        //             // child.scale.set(0.5, 0.5, 0.5)
        //             // child.scale.set(0.5, 0.5, 0.5)
        //             // child.rotation.z = -1;
        //             child.position.y = -10;
        //         }
        //     });

        //     this.scene.add(object); // Add the loaded object to the scene here

        // }, undefined, (error) => {
        //     console.error("An error happened while loading the FBX model", error);
        // });

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
            false
        );

        this.player2 = new Player2(
            new ThirdPersonCamera2(
                this.camera, new THREE.Vector3(-5, 2, 0), new THREE.Vector3(0, 0, 0), false, false, false, []
            ),
            new PlayerController2(),
            this.scene,
            5, 
            false, 
            false
        );   

        this.activePlayer = this.player;

        //Object
        // this.mesh = new THREE.Mesh(
        //     new THREE.BoxGeometry(1,1,1),
        //     new THREE.MeshPhongMaterial({color: 0xFFFF11})
        // );
        // this.scene.add(this.mesh);
        // this.mesh.castShadow = true;
        // this.mesh.receiveShadow = true;
        // this.mesh.position.set(3,0,0);

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
                case 66: // Key 'b'
                    this.switchPlayer();
                    break;
            }
        }

        this.switchPlayer = function() {
            if (this.activePlayer === this.player) {
                this.activePlayer = this.player2;
            } else {
                this.activePlayer = this.player;
            }
        }

        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
    }

    static render(dt) {
        this.activePlayer.update(dt);
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