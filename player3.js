import * as THREE from "three";
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import gsap from 'gsap';

export class Player3 {
    constructor(camera, controller, scene, speed, isCamera1, isCamera2) {
        this.camera = camera;
        this.controller = controller;
        this.scene = scene;
        this.speed = speed;
        this.camera1 = isCamera1;
        this.camera2 = isCamera2;
        this.state = "idle";
        this.rotationVector = new THREE.Vector3(0, 0, 0);
        this.rotationVector2 = new THREE.Vector3(0, 0, 0);
        this.animations = {};
        this.lastRotation = 0;

        if (this.camera instanceof ThirdPersonCamera3) {
            this.camera.setup(new THREE.Vector3(0, 0, 0), this.rotationVector, this.controller.scaleX);
        }

        this.loadModel();
    }

    loadModel() {
        var loader = new FBXLoader();
        loader.setPath('./resources_3person/Knight/Monster king/');
        loader.load('Mutant Breathing Idle.fbx', (fbx) => {
            fbx.scale.setScalar(0.007);
            fbx.traverse(c => {
                c.castShadow = true;
            });
            this.mesh = fbx;
            this.scene.add(this.mesh);
            this.mesh.rotation.y += Math.PI / 2;
            this.mesh.position.z -= 7;
            this.mesh.position.y += 0.4;
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
            loader.setPath('./resources_3person/Knight/Monster king/');
            loader.load('Mutant Breathing Idle.fbx', (fbx) => { onLoad('idle', fbx) });

            loader.load('Mutant Breathing Idle.fbx', (fbx) => { onLoad('run', fbx) });

            loader.load('Mutant Swiping attack.fbx', (fbx) => { onLoad('attack', fbx) });

            loader.load('Mutant Roaring celebration.fbx', (fbx) => { onLoad('win', fbx) });
            
            loader.load('Mutant Flexing Muscles.fbx', (fbx) => { onLoad('lose', fbx) });
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

            this.lastRotation = this.mesh.rotation.y;

            console.log(this.state)

            if (this.controller.atk == true) {
                if (this.animations['attack']) {
                    if (this.state != "attack") {
                        this.mixer.stopAllAction();
                        this.state = "attack";
                    }
                    this.mixer.clipAction(this.animations['attack'].clip).play();
                }
            } else if (this.controller.win == true) {
                if (this.animations['win']) {
                    if (this.state != "win") {
                        this.mixer.stopAllAction();
                        this.state = "win";
                    }
                    this.mixer.clipAction(this.animations['win'].clip).play();
                }
            } 
            else if (this.controller.lose == true) {
                if (this.animations['lose']) {
                    if (this.state != "lose") {
                        this.mixer.stopAllAction();
                        this.state = "lose";
                    }
                    this.mixer.clipAction(this.animations['lose'].clip).play();
                }
            } 
            else if (direction.x == 0 && direction.z == 0) {
                if(this.state != "attack" || this.state != "win") {
                    if (this.animations['idle']) {
                        if (this.state != "idle") {
                            this.mixer.stopAllAction();
                            this.state = "idle";
                        }
                        this.mixer.clipAction(this.animations['idle'].clip).play();
                    }
                }
            } else if (!(direction.x == 0) || !(direction.z == 0)) {
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
                // dtMouse.y = dtMouse.y / Math.PI;

                this.rotationVector.y += dtMouse.x * dt * 100;
                // this.rotationVector.z += dtMouse.y * dt * 100;
            }

            if (this.controller.arrowUp) {
                this.rotationVector2.x += dt;
            }

            if (this.controller.arrowDown) {
                this.rotationVector2.x -= dt;
            }

            if (this.controller.arrowRight) {
                this.rotationVector2.z -= dt;
            }

            if (this.controller.arrowLeft) {
                this.rotationVector2.z += dt;
            }

            if (this.controller.rotateYLeft) {
                this.rotationVector2.y += dt;
            }

            if (this.controller.rotateYRight) {
                this.rotationVector2.y -= dt;
            }

            var forwardVector = new THREE.Vector3(1, 0, 0);
            var rightVector = new THREE.Vector3(0, 0, 1);
            var upVector = new THREE.Vector3(0, 1, 0);
            // forwardVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationVector.y);
            rightVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationVector.y);

            this.mesh.position.add(forwardVector.multiplyScalar(dt * this.speed * direction.x));
            this.mesh.position.add(rightVector.multiplyScalar(dt * this.speed * direction.z));
            this.mesh.position.add(upVector.multiplyScalar(dt * this.speed * direction.y));

            if (this.camera1) {
                this.camera.setup(this.mesh.position, this.rotationVector, this.controller.scaleX);
            } else if (this.camera2) {
                // this.camera.setup(this.mesh.position, this.rotationVector2, this.controller.scaleX);
                // buat scene 4
                this.camera.setup(new THREE.Vector3(1, 5, 0), this.rotationVector2, this.controller.scaleX);
            }

            if (this.mixer) {
                this.mixer.update(dt);
            }
        }
    }
}

export class PlayerController3 {

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
        this.arrowUp = false;
        this.arrowDown = false;

        this.rotateYLeft = false
        this.rotateYRight = false
        this.arrowLeft = false;
        this.arrowRight = false;
        this.atk = false;
        this.win = false;
        this.lose = false;
        this.scaleX = 30;
        this.deltaMousePos = new THREE.Vector2();
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
        document.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
        document.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
        document.addEventListener('mouseup', (e) => this.onMouseUp(e), false);
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.scaleX -=5;
            } else {
                this.scaleX += 5;
            }
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
            case 37: // arrow left
                event.preventDefault();
                this.arrowLeft = true;
                break;
            case 39: // arrow right
                event.preventDefault();
                this.arrowRight = true;
                break;
            case 38: // arrow up
                event.preventDefault();
                this.arrowUp = true;
                break;
            case 40: // arrow down
                event.preventDefault();
                this.arrowDown = true;
                break;
            case 79: // O key
                event.preventDefault();
                this.rotateYLeft = true;
                break;
            case 80: // P key
                event.preventDefault();
                this.rotateYRight = true;
                break;
            case 69: // E key
                event.preventDefault();
                this.atk = true;
                break;
            case 32: // Space bar
                event.preventDefault();
                this.win = true;
                break;
            case 84: // Space bar
                event.preventDefault();
                this.lose = true;
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
            case 38: // arrow up
                event.preventDefault();
                this.arrowUp = false;
                break;
            case 40: // arrow down
                event.preventDefault();
                this.arrowDown = false;
                break;
            case 37: // arrow left
                event.preventDefault();
                this.arrowLeft = false;
                break;
            case 39: // arrow right
                event.preventDefault();
                this.arrowRight = false;
                break;
            case 79: // O key
                event.preventDefault();
                this.rotateYLeft = false;
                break;
            case 80: // P key
                event.preventDefault();
                this.rotateYRight = false;
                break;
            case 69: // E key
                event.preventDefault();
                this.atk = false;
                break;
            case 32: // Space bar
                event.preventDefault();
                this.win = false;
                break;
            case 84: // T Key
                event.preventDefault();
                this.lose = false;
                break;
        }
    }
}



export class ThirdPersonCamera3 {
    constructor(camera, positionOffset, targetOffset, isCamera1, isCamera2, isSet, arrayPosition) {
        this.camera = camera;
        this.positionOffset = positionOffset;
        this.targetOffset = targetOffset;
        this.cameraBool = isCamera1;
        this.cameraBool2 = isCamera2;
        this.isSet = isSet;
        this.arrayPosition = arrayPosition;
    }

    setup(target, angle, scaleX) {
        if (this.cameraBool2 == true) {
            // buat scene 1
            // angle.x = 0;
            // angle.y = 1.6747999999970211;
            // angle.z = -1.1647999999970193;
            // gsap.to(angle, {
            //     z: -0.02349999997764767,
            //     duration: 4,
            //     onUpdate: () => {
            //         this.updateCameraRotation(target, angle, scaleX);
            //     }
            // });

            
            // buat scene 2
            // angle.x = 0; 
            // angle.y = -1.4916000000014893;
            // angle.z = 0;
            // gsap.to(angle, {
            //     x: 1,
            //     duration: 10,
            //     onUpdate: () => {
            //         this.updateCameraRotation(target, angle, scaleX);
            //     }
            // });

            // buat scene 4
            // angle.x= -0.5854000000059607;
            // angle.y = -2.274600000053641;
            // angle.z = 0;
            // gsap.to(angle, {
            //     y: -3.784299999982113,
            //     duration: 10,
            //     onUpdate: () => {
            //         this.updateCameraRotation(target, angle, scaleX);
            //     }
            // });

            this.updateCameraRotation(target, angle, scaleX);
            

            // buat debug
            console.log(angle)

        } else if (this.cameraBool == true){
            var temp = new THREE.Vector3(0,0,0);
            temp.copy(this.positionOffset);
            // console.log(angle.y);
            // buat scene 3
            // angle.y = 0.6140247358370102;
            // gsap.to(angle, {
            //     y: 2.681580906429974,
            //     duration: 20,
            //     onUpdate: () => {
            //         updateScene(this.camera, this.targetOffset);
            //     }
            // });

            updateScene(this.camera, this.targetOffset);

            function updateScene(camera, targetOffset) {
                temp.applyAxisAngle(new THREE.Vector3(0,1,0), angle.y);
                temp.applyAxisAngle(new THREE.Vector3(0,0,1), angle.z);
                temp.x -= scaleX - 30;
                temp.addVectors(target, temp);
                camera.position.copy(temp);
                // console.log(this.camera.position);
                temp = new THREE.Vector3(0,0,0);
                temp.addVectors(target, targetOffset);
                camera.lookAt(temp);
            }
            
        }
    }

    updateCameraRotation(target, angle, scaleX) {
        let rotationQuaternion = new THREE.Quaternion();

        let yawQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle.y);
        let pitchQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle.x);
        let rollQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle.z);

        rotationQuaternion.multiplyQuaternions(yawQuaternion, pitchQuaternion).multiply(rollQuaternion);

        let temp = new THREE.Vector3(0, 0, 0);
        temp.copy(this.positionOffset);
        temp.z += scaleX - 20;
        temp.addVectors(target, temp);
        temp.applyQuaternion(rotationQuaternion);

        // buat scene 1 + 2
        if (!this.isSet) {
            var targetCopy = target.clone();
            this.arrayPosition[0] = targetCopy.x - 7;
            this.arrayPosition[1] = targetCopy.y - 2;
            this.arrayPosition[2] = targetCopy.z - 15;
            targetCopy.x += 1;
            targetCopy.z += 1;              
            temp.addVectors(targetCopy, temp);
            this.isSet = true;
        } else {
            var targetCopy = new THREE.Vector3(0, 0, 0);
            targetCopy.x = this.arrayPosition[0];
            targetCopy.y = this.arrayPosition[1];
            targetCopy.z = this.arrayPosition[2];
            temp.addVectors(targetCopy, temp);
        }

        // buat scene 1
        // temp.x = 22.775404204509293;
        // temp.y = 2.585568489136311;
        // temp.z = -9.797282233828415;

        // buat scene 2
        // temp.x = 2;
        // temp.y = 1;
        // temp.z = -7;

        // buat scene 4
        // temp.x = -9.960915516630351;
        // temp.y = 10;
        // temp.z = -17.01554533064061;

        this.camera.position.copy(temp);

        // console.log(this.camera.position);

        let lookAtTarget = target.clone().add(this.targetOffset);
        this.camera.lookAt(lookAtTarget);

        this.camera.quaternion.copy(rotationQuaternion);
    }
}
