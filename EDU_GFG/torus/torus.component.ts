
import { Component, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-torus',
  templateUrl: './torus.component.html',
  styleUrls: ['./torus.component.css'],
})
export class TorusComponent implements OnInit, OnDestroy {
  private scene: THREE.Scene | undefined;
  private camera: THREE.PerspectiveCamera | undefined;
  private renderer: THREE.WebGLRenderer | undefined;
  private torusMesh: THREE.Mesh | undefined;
  private gui: dat.GUI | undefined;
  private controls: OrbitControls | undefined;

  private torusParams = {
    radius: 5,
    tube: 2,
    radialSegments: 16,
    tubularSegments: 100,
    arc: Math.PI * 2,
  };
 

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.initThree();
    this.setupGui();
    this.createTorus();
    this.addTorusToScene();
    this.setCameraPosition();
    this.addOrbitControls();
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
    this.camera.position.z = 10;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Add resize listener
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private createTorus(): void {
    const torusGeometry = new THREE.TorusGeometry(
      this.torusParams.radius,
      this.torusParams.tube,
      this.torusParams.radialSegments,
      this.torusParams.tubularSegments,
      this.torusParams.arc
    );

    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    this.torusMesh = new THREE.Mesh(torusGeometry, material);
    if (this.scene) {
      this.scene.add(this.torusMesh);
    }
  }

  private addTorusToScene(): void {
    this.scene?.add(this.torusMesh!);
  }

  private setCameraPosition(): void {
    this.camera?.position.set(0, 0, 15);
  }

  private addOrbitControls(): void {
    if (this.camera) {
      this.controls = new OrbitControls(this.camera, this.renderer!.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.25;
      this.controls.screenSpacePanning = false;
      this.controls.maxPolarAngle = Math.PI / 2;
    }
  }

  private setupGui(): void {
    // GUI setup
    this.gui = new dat.GUI();

    // Torus parameters controller
    this.gui.add(this.torusParams, 'radius', 1, 10).onChange(() => this.updateTorus());
    this.gui.add(this.torusParams, 'tube', 0.1, 5).onChange(() => this.updateTorus());
    this.gui.add(this.torusParams, 'radialSegments', 3, 32, 1).onChange(() => this.updateTorus());
    this.gui.add(this.torusParams, 'tubularSegments', 3, 100, 1).onChange(() => this.updateTorus());
    this.gui.add(this.torusParams, 'arc', 0, Math.PI * 2).onChange(() => this.updateTorus());
  }

  private updateTorus(): void {
    if (this.scene) {
      this.scene.remove(this.torusMesh!);

      const updatedGeometry = new THREE.TorusGeometry(
        this.torusParams.radius,
        this.torusParams.tube,
        this.torusParams.radialSegments,
        this.torusParams.tubularSegments,
        this.torusParams.arc
      );

      this.torusMesh?.geometry.dispose();
      this.torusMesh?.geometry.copy(updatedGeometry);

      this.scene.add(this.torusMesh!);
    }
  }

  
  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);
        if (this.torusMesh) {
          this.torusMesh.rotation.x += 0.01;
          this.torusMesh.rotation.y += 0.01;
        }
        this.controls?.update();
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
