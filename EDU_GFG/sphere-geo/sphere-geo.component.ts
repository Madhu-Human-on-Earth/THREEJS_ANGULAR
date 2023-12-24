import { Component, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-sphere-geo',
  templateUrl: './sphere-geo.component.html',
  styleUrls: ['./sphere-geo.component.css']
})
export class SphereGeoComponent  implements OnInit, OnDestroy {

  private scene: THREE.Scene | undefined;
  private camera: THREE.PerspectiveCamera | undefined;
  private renderer: THREE.WebGLRenderer | undefined;
  private sphereMesh: THREE.Mesh | undefined;
  private controls: OrbitControls | undefined;
  private gui: dat.GUI | undefined;

  private sphereParams = {
    radius: 1,
    widthSegments: 16,
    heightSegments: 8,
  };

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.initThree();
    this.setupGui();
    this.createSphere();
    this.addSphereToScene();
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

  private createSphere(): void {
    const sphereGeometry = new THREE.SphereGeometry(
      this.sphereParams.radius,
      this.sphereParams.widthSegments,
      this.sphereParams.heightSegments
    );

    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    this.sphereMesh = new THREE.Mesh(sphereGeometry, material);
    if (this.scene) {
      this.scene.add(this.sphereMesh);
    }
  }

  private addSphereToScene(): void {
    this.scene?.add(this.sphereMesh!);
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

    // Sphere parameters controller
    this.gui.add(this.sphereParams, 'radius', 0.1, 3).onChange(() => this.updateSphere());
    this.gui.add(this.sphereParams, 'widthSegments', 3, 32, 1).onChange(() => this.updateSphere());
    this.gui.add(this.sphereParams, 'heightSegments', 2, 16, 1).onChange(() => this.updateSphere());
  }

  private updateSphere(): void {
    if (this.scene) {
      this.scene.remove(this.sphereMesh!);

      const updatedGeometry = new THREE.SphereGeometry(
        this.sphereParams.radius,
        this.sphereParams.widthSegments,
        this.sphereParams.heightSegments
      );

      this.sphereMesh?.geometry.dispose();
      this.sphereMesh?.geometry.copy(updatedGeometry);

      this.scene.add(this.sphereMesh!);
    }
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);
        if (this.sphereMesh) {
          this.sphereMesh.rotation.x += 0.01;
          this.sphereMesh.rotation.y += 0.01;
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
