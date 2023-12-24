// import { Component } from '@angular/core';

import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
@Component({
  selector: 'app-torus-k',
  templateUrl: './torus-k.component.html',
  styleUrls: ['./torus-k.component.css']
})

export class TorusKComponent implements OnInit, OnDestroy {
  private scene: THREE.Scene | undefined;
  private camera: THREE.PerspectiveCamera | undefined;
  private renderer: THREE.WebGLRenderer | undefined;
  private torusKnotMesh: THREE.Mesh | undefined;
  private controls: OrbitControls | undefined;
  private gui: dat.GUI | undefined;

  private torusParams = {
    radius: 1,
    tube: 0.4,
    radialSegments: 100,
    tubularSegments: 16,
    p: 3,
    q: 4,
  };

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.initThree();
    this.setupGui();
    this.createTorusKnot();
    this.addTorusKnotToScene();
    this.setCameraPosition();
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
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Add resize listener
    window.addEventListener('resize', () => this.onWindowResize());

    // Setup OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  private createTorusKnot(): void {
    const torusKnotGeometry = new THREE.TorusKnotGeometry(
      this.torusParams.radius,
      this.torusParams.tube,
      this.torusParams.radialSegments,
      this.torusParams.tubularSegments,
      this.torusParams.p,
      this.torusParams.q
    );

    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    this.torusKnotMesh = new THREE.Mesh(torusKnotGeometry, material);
    if (this.scene) {
      this.scene.add(this.torusKnotMesh);
    }
  }

  private addTorusKnotToScene(): void {
    this.scene?.add(this.torusKnotMesh!);
  }

  private setCameraPosition(): void {
    this.camera?.position.set(0, 0, 5);
  }

  private setupGui(): void {
    // GUI setup
    this.gui = new dat.GUI();

    // TorusKnot parameters controller
    this.gui.add(this.torusParams, 'radius', 1, 10).onChange(() => this.updateTorusKnot());
    this.gui.add(this.torusParams, 'tube', 0.1, 5).onChange(() => this.updateTorusKnot());
    this.gui.add(this.torusParams, 'radialSegments', 3, 32, 1).onChange(() => this.updateTorusKnot());
    this.gui.add(this.torusParams, 'tubularSegments', 3, 100, 1).onChange(() => this.updateTorusKnot());
    this.gui.add(this.torusParams, 'p', 1, 10).onChange(() => this.updateTorusKnot());
    this.gui.add(this.torusParams, 'q', 1, 10).onChange(() => this.updateTorusKnot());
  }

  private updateTorusKnot(): void {
    if (this.scene) {
      this.scene.remove(this.torusKnotMesh!);

      const updatedGeometry = new THREE.TorusKnotGeometry(
        this.torusParams.radius,
        this.torusParams.tube,
        this.torusParams.radialSegments,
        this.torusParams.tubularSegments,
        this.torusParams.p,
        this.torusParams.q
      );

      this.torusKnotMesh?.geometry.dispose();
      this.torusKnotMesh?.geometry.copy(updatedGeometry);

      this.scene.add(this.torusKnotMesh!);
    }
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);

        // Rotate the torus knot
        if (this.torusKnotMesh) {
          this.torusKnotMesh.rotation.x += 0.01;
          this.torusKnotMesh.rotation.y += 0.01;
        }

        // Update controls
        if (this.controls) {
          this.controls.update();
        }

        // Render the scene
        if (this.renderer && this.scene && this.camera) {
          this.renderer.render(this.scene, this.camera);
        }
      };

      animateFn();
    });
  }

  private onWindowResize(): void {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
}
