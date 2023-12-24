

import { Component, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

@Component({
  selector: 'app-ambient',
  templateUrl: './ambient.component.html',
  styleUrls: ['./ambient.component.css']
})
export class AmbientComponent implements OnInit, OnDestroy {
  


  private scene: THREE.Scene | undefined;
  private camera: THREE.PerspectiveCamera | undefined;
  private renderer: THREE.WebGLRenderer | undefined;
  private cube: THREE.Mesh | undefined;
  private ambientLight: THREE.AmbientLight | undefined;
  private directionalLight: THREE.DirectionalLight | undefined;
  private gui: dat.GUI | undefined;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.initThree();
    this.createScene();
    this.createLights();
    this.createCube();
    this.setupGui();
    this.animate();
  }

  ngOnDestroy(): void {
    // Clean up resources
    if (this.gui) {
      this.gui.destroy();
    }
  }

  private initThree(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Add resize listener
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private createScene(): void {
    // Create AmbientLight
    if (this.scene) {
      this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(this.ambientLight);
    }
  }

  private createLights(): void {
    // Create Directional Light
    if (this.scene) {
      this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      this.directionalLight.position.set(1, 1, 1).normalize();
      this.scene.add(this.directionalLight);
    }
  }

  private createCube(): void {
    // Create a Cube with MeshStandardMaterial
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      metalness: 0.5,
      roughness: 0.5,
    });
    this.cube = new THREE.Mesh(geometry, material);
    if (this.scene) {
      this.scene.add(this.cube);
    }
  }

  private setupGui(): void {
    // GUI setup
    this.gui = new dat.GUI();

    // AmbientLight color controller
    const ambientLightColor = { color: this.ambientLight?.color.getHex() };
    const cubeColor = { color: (this.cube instanceof THREE.Mesh) ? (this.cube.material as THREE.MeshStandardMaterial).color.getHex() : 0x000000 };
    const cubeFolder = this.gui.addFolder('Cube Material');
    cubeFolder.addColor(cubeColor, 'color').onChange(() => {
      if (this.cube instanceof THREE.Mesh && cubeColor.color !== undefined) {
        (this.cube.material as THREE.MeshStandardMaterial).color.set(cubeColor.color);
      }
    });
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);

        // Rotate the cube
        if (this.cube) {
          this.cube.rotation.x += 0.01;
          this.cube.rotation.y += 0.01;
        }

        // Render the scene if renderer, scene, and camera are defined
        if (this.renderer && this.scene && this.camera) {
          this.renderer.render(this.scene, this.camera);
        }
      };

      animateFn();
    });
  }

  private onWindowResize(): void {
    if (this.camera) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }
    if (this.renderer) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
}
