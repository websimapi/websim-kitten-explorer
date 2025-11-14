import * as THREE from 'three';
import nipplejs from 'nipplejs';

export class PlayerController {
    constructor(scene, camera, domElement, game) {
        this.scene = scene;
        this.camera = camera;
        this.domElement = domElement;
        this.game = game;
        this.isInitialized = false;

        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.speed = 5.0;
        this.rotationSpeed = 4.0;
        
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
        };
        
        this.isMobile = 'ontouchstart' in window;
    }
    
    init() {
        const geometry = new THREE.CapsuleGeometry(0.25, 0.5, 4, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 });
        this.player = new THREE.Mesh(geometry, material);
        this.player.position.set(0, 0.5, 5);
        this.player.castShadow = true;
        this.scene.add(this.player);

        this.camera.position.set(0, 3, 8);
        this.camera.lookAt(this.player.position);
        
        this.setupControls();
        this.isInitialized = true;
    }

    setupControls() {
        if (this.isMobile) {
            this.setupMobileControls();
        } else {
            this.setupDesktopControls();
        }
    }
    
    setupDesktopControls() {
        document.addEventListener('keydown', (e) => this.onKey(e.code, true));
        document.addEventListener('keyup', (e) => this.onKey(e.code, false));
    }
    
    onKey(code, isPressed) {
        switch (code) {
            case 'KeyW': case 'ArrowUp': this.keys.forward = isPressed; break;
            case 'KeyS': case 'ArrowDown': this.keys.backward = isPressed; break;
            case 'KeyA': case 'ArrowLeft': this.keys.left = isPressed; break;
            case 'KeyD': case 'ArrowRight': this.keys.right = isPressed; break;
        }
    }

    getMovementInputFromJoystick(data) {
        const { vector } = data;
        if (!vector) {
            return { x: 0, z: 0 };
        }
        
        const moveDirection = new THREE.Vector3(0, 0, 0);

        if (vector.y > 0.1) moveDirection.z -= Math.abs(vector.y);
        if (vector.y < -0.1) moveDirection.z += Math.abs(vector.y);
        if (vector.x < -0.1) moveDirection.x -= Math.abs(vector.x);
        if (vector.x > 0.1) moveDirection.x += Math.abs(vector.x);

        return moveDirection;
    }
    
    setupMobileControls() {
        const options = {
            zone: document.getElementById('joystick-container'),
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'rgba(255, 255, 255, 0.5)',
            size: 150
        };
        const manager = nipplejs.create(options);
        
        manager.on('move', (evt, data) => {
            this.joystickInput = this.getMovementInputFromJoystick(data);
        });

        manager.on('end', () => {
            this.joystickInput = null;
        });
    }

    update(deltaTime) {
        let moveDirection = new THREE.Vector3(0, 0, 0);

        if (this.isMobile && this.joystickInput) {
            moveDirection.copy(this.joystickInput);
        } else if (!this.isMobile) {
            if (this.keys.forward) moveDirection.z -= 1;
            if (this.keys.backward) moveDirection.z += 1;
            if (this.keys.left) moveDirection.x -= 1;
            if (this.keys.right) moveDirection.x += 1;
        }
        
        moveDirection.normalize();

        if (moveDirection.length() > 0.1) {
            const targetQuaternion = new THREE.Quaternion();
            const targetAngle = Math.atan2(moveDirection.x, moveDirection.z);
            targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetAngle);
            this.player.quaternion.slerp(targetQuaternion, this.rotationSpeed * deltaTime);

            const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.player.quaternion);
            this.velocity.add(forward.multiplyScalar(this.speed * deltaTime));
        }

        // Apply friction
        this.velocity.multiplyScalar(1 - 10 * deltaTime);
        
        this.player.position.add(this.velocity);

        // Simple ground collision
        if (this.player.position.y < 0.5) {
            this.player.position.y = 0.5;
        }
        
        this.updateCamera();
    }
    
    updateCamera() {
        const offset = new THREE.Vector3(0, 2, 4);
        offset.applyQuaternion(this.player.quaternion);
        
        const cameraPosition = this.player.position.clone().add(offset);
        this.camera.position.lerp(cameraPosition, 0.1);
        
        const lookAtPosition = this.player.position.clone().add(new THREE.Vector3(0, 1, 0));
        this.camera.lookAt(lookAtPosition);
    }
}

