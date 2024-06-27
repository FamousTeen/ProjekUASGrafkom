import * as THREE from "three";
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export class Player {

    constructor(camera, controller, scene, speed) {
        this.camera = camera;
        this.controller = controller;
        this.scene = scene;
        this.speed = speed;
        this.state = "idle";
        this.rotationVector = new THREE.Vector3(0, 0, 0);
        this.animations = {};
        this.lastRotation = 0;

        this.camera.setup(new THREE.Vector3(0, 0, 0), this.rotationVector, this.controller.scaleX);

        this.loadModel();
    }

    loadModel() {
        var loader = new FBXLoader();
        loader.setPath('./resources_3person/Knight/');
        loader.load('Great Sword Idle.fbx', (fbx) => {
            fbx.scale.setScalar(0.01);
            fbx.traverse(c => {
                c.castShadow = true;
            });
            this.mesh = fbx;
            this.scene.add(this.mesh);
            this.mesh.rotation.y += Math.PI / 2;

            this.mixer = new THREE.AnimationMixer(this.mesh);

            var onLoad = (animName, anim) => {
                const clip = anim.animations[0];
                const action = this.mixer.clipAction(clip);

                this.animations[animName] = {
                    clip: clip,
                    action: action,
                };
            };

            const loader = new FBXLoader();
            loader.setPath('./resources_3person/Knight/');
            loader.load('Great Sword Idle.fbx', (fbx) => { onLoad('idle', fbx) });

            loader.load('Great Sword Run.fbx', (fbx) => { onLoad('run', fbx) });

            loader.load('Great Sword Jump.fbx', (fbx) => { onLoad('jump', fbx) });

        });

    }

    update(dt) {
        if (this.mesh && this.animations) {
            this.lastRotation = this.mesh.rotation.y;
            var direction = new THREE.Vector3(0, 0, 0);

            if (this.controller.keys['forward']) {
                direction.x = 1;
                this.mesh.rotation.y = Math.PI / 2;
            }
            if (this.controller.keys['backward']) {
                direction.x = -1;
                this.mesh.rotation.y = -Math.PI / 2;
            }
            if (this.controller.keys['left']) {
                direction.z = -1;
                this.mesh.rotation.y = Math.PI;
            }
            if (this.controller.keys['right']) {
                direction.z = 1;
                this.mesh.rotation.y = 0;
            }
            if (this.controller.keys['space']) {
                direction.y = 1;
                this.mesh.position.y = 1;
            }
            else if (!(this.controller.keys['space'])) {
                direction.y = 0;
                this.mesh.position.y = -1;
            }

            this.lastRotation = this.mesh.rotation.y;
            console.log(direction.y)

            if (direction.y > 0) {
                if (this.animations['jump']) {
                    if (this.state != "jump") {
                        this.mixer.stopAllAction();
                        this.state = "jump";
                    }
                    this.mixer.clipAction(this.animations['jump'].clip).play();
                }
            }
            else if (!(direction.y > 0)) {
                if (this.state != "run") {
                    if (this.animations['idle']) {
                        if (this.state != "idle") {
                            this.mixer.stopAllAction();
                            this.state = "idle";
                        }
                        this.mixer.clipAction(this.animations['idle'].clip).play();
                    }
                }
            }

            if (direction.x == 0 && direction.z == 0) {
                if (this.state != "jump") {
                    if (this.animations['idle']) {
                        if (this.state != "idle") {
                            this.mixer.stopAllAction();
                            this.state = "idle";
                        }
                        this.mixer.clipAction(this.animations['idle'].clip).play();
                    }
                }
            }
            else if (!(direction.x == 0) || !(direction.z == 0)) {
                if (this.animations['run']) {
                    if (this.state != "run") {
                        this.mixer.stopAllAction();
                        this.state = "run";
                    }
                    this.mixer.clipAction(this.animations['run'].clip).play();
                }
            }

            if (this.controller.mouseDown) {
                var dtMouse = this.controller.deltaMousePos;
                dtMouse.x = dtMouse.x / Math.PI;
                dtMouse.y = dtMouse.y / Math.PI;

                this.rotationVector.y += dtMouse.x * dt * 100;
                this.rotationVector.z += dtMouse.y * dt * 100;

            }

            var forwardVector = new THREE.Vector3(1, 0, 0);
            var rightVector = new THREE.Vector3(0, 0, 1);
            var upVector = new THREE.Vector3(0, 1, 0);
            forwardVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationVector.y);
            rightVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationVector.y);

            this.mesh.position.add(forwardVector.multiplyScalar(dt * this.speed * direction.x));
            this.mesh.position.add(rightVector.multiplyScalar(dt * this.speed * direction.z));
            this.mesh.position.add(upVector.multiplyScalar(dt * this.speed * direction.y));

            this.camera.setup(this.mesh.position, this.rotationVector, this.controller.scaleX);

            if (this.mixer) {
                this.mixer.update(dt);
            }

        }
    }

}

export class PlayerController {

    constructor() {
        this.keys = {
            "forward": false,
            "backward": false,
            "left": false,
            "right": false,
            "space": false
        }
        this.mousePos = new THREE.Vector2();
        this.mouseDown = false;
        this.scaleX = 0;
        this.deltaMousePos = new THREE.Vector2();
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
        document.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
        document.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
        document.addEventListener('mouseup', (e) => this.onMouseUp(e), false);
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            // Adjust scaleX based on wheel delta
            this.scaleX += Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        }, false);
    }

    onMouseDown(event) {
        this.mouseDown = true;
    }
    onMouseUp(event) {
        this.mouseDown = false;
    }
    onMouseMove(event) {
        var currentMousePos = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        this.deltaMousePos.addVectors(currentMousePos, this.mousePos.multiplyScalar(-1));
        this.mousePos.copy(currentMousePos);
    }
    onKeyDown(event) {
        switch (event.keyCode) {
            case "W".charCodeAt(0):
            case "w".charCodeAt(0):
                this.keys['forward'] = true;
                break;
            case "S".charCodeAt(0):
            case "s".charCodeAt(0):
                this.keys['backward'] = true;
                break;
            case "A".charCodeAt(0):
            case "a".charCodeAt(0):
                this.keys['left'] = true;
                break;
            case "D".charCodeAt(0):
            case "d".charCodeAt(0):
                this.keys['right'] = true;
                break;
            case " ".charCodeAt(0):
                this.keys['space'] = true;
                break;
        }
    }
    onKeyUp(event) {
        switch (event.keyCode) {
            case "W".charCodeAt(0):
            case "w".charCodeAt(0):
                this.keys['forward'] = false;
                break;
            case "S".charCodeAt(0):
            case "s".charCodeAt(0):
                this.keys['backward'] = false;
                break;
            case "A".charCodeAt(0):
            case "a".charCodeAt(0):
                this.keys['left'] = false;
                break;
            case "D".charCodeAt(0):
            case "d".charCodeAt(0):
                this.keys['right'] = false;
                break;
            case " ".charCodeAt(0):
                this.keys['space'] = false;
                break;
        }
    }
}



export class ThirdPersonCamera {
    constructor(camera, positionOffSet, targetOffSet) {
        this.camera = camera;
        this.positionOffSet = positionOffSet;
        this.targetOffSet = targetOffSet;
    }

    setup(target, angle, scaleX) {
        var temp = new THREE.Vector3(0, 0, 0);
        temp.copy(this.positionOffSet);
        temp.x += scaleX; 
        temp.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle.y);
        temp.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle.z);
        temp.addVectors(target, temp);
        this.camera.position.copy(temp);
        temp = new THREE.Vector3(0, 0, 0);
        temp.addVectors(target, this.targetOffSet);
        this.camera.lookAt(temp);
    }
}
