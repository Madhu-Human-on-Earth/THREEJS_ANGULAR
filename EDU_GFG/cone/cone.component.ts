import { Component, ElementRef, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-cone',
  templateUrl: './cone.component.html',
  styleUrls: ['./cone.component.css'],
})
export class ConeComponent implements OnInit, OnDestroy {

  private scene: THREE.Scene | undefined;
  private camera: THREE.PerspectiveCamera | undefined;
  private renderer: THREE.WebGLRenderer | undefined;
  private coneMesh: THREE.Mesh | undefined;
  private controls: OrbitControls | undefined;
  private gui: dat.GUI | undefined;

  private coneParams = {
    radius: 1,
    height: 2,
    radialSegments: 16,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: 2 * Math.PI,
  };

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.initThree();
    this.setupGui();
    this.createCone();
    this.addConeToScene();
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

  private createCone(): void {
    const coneGeometry = new THREE.ConeGeometry(
      this.coneParams.radius,
      this.coneParams.height,
      this.coneParams.radialSegments,
      this.coneParams.heightSegments,
      this.coneParams.openEnded,
      this.coneParams.thetaStart,
      this.coneParams.thetaLength
    );

    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    this.coneMesh = new THREE.Mesh(coneGeometry, material);
    if (this.scene) {
      this.scene.add(this.coneMesh);
    }
  }

  private addConeToScene(): void {
    this.scene?.add(this.coneMesh!);
  }

  private setCameraPosition(): void {
    this.camera?.position.set(0, 0, 5);
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

    // Cone parameters controller
    this.gui.add(this.coneParams, 'radius', 0.1, 3).onChange(() => this.updateCone());
    this.gui.add(this.coneParams, 'height', 0.1, 5).onChange(() => this.updateCone());
    this.gui.add(this.coneParams, 'radialSegments', 3, 32, 1).onChange(() => this.updateCone());
    this.gui.add(this.coneParams, 'heightSegments', 1, 10, 1).onChange(() => this.updateCone());
    this.gui.add(this.coneParams, 'openEnded').onChange(() => this.updateCone());
    this.gui.add(this.coneParams, 'thetaStart', 0, 2 * Math.PI).onChange(() => this.updateCone());
    this.gui.add(this.coneParams, 'thetaLength', 0, 2 * Math.PI).onChange(() => this.updateCone());
  }

  private updateCone(): void {
    if (this.scene) {
      this.scene.remove(this.coneMesh!);

      const updatedGeometry = new THREE.ConeGeometry(
        this.coneParams.radius,
        this.coneParams.height,
        this.coneParams.radialSegments,
        this.coneParams.heightSegments,
        this.coneParams.openEnded,
        this.coneParams.thetaStart,
        this.coneParams.thetaLength
      );

      this.coneMesh?.geometry.dispose();
      this.coneMesh?.geometry.copy(updatedGeometry);

      this.scene.add(this.coneMesh!);
    }
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);
        if (this.coneMesh && this.coneMesh.rotation) {
          this.coneMesh.rotation.x = this.coneMesh.rotation.x || 0;
          this.coneMesh.rotation.y = this.coneMesh.rotation.y || 0;
          this.coneMesh.rotation.x += 0.01;
          this.coneMesh.rotation.y += 0.01;
        }
        this.renderer?.render(this.scene!, this.camera!);
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
