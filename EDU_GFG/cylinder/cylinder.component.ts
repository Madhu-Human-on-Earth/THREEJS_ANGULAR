import { Component, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
@Component({
  selector: 'app-cylinder',
  templateUrl: './cylinder.component.html',
  styleUrls: ['./cylinder.component.css'],
})
export class CylinderComponent implements OnInit, OnDestroy {

  private scene: THREE.Scene | undefined;
  private camera: THREE.PerspectiveCamera | undefined;
  private renderer: THREE.WebGLRenderer | undefined;
  private cylinderMesh: THREE.Mesh | undefined;
  private controls: OrbitControls | undefined;
  private gui: dat.GUI | undefined;

  private cylinderParams = {
    radiusTop: 1,
    radiusBottom: 1,
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
    this.createCylinder();
    this.addCylinderToScene();
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

  private createCylinder(): void {
    const cylinderGeometry = new THREE.CylinderGeometry(
      this.cylinderParams.radiusTop,
      this.cylinderParams.radiusBottom,
      this.cylinderParams.height,
      this.cylinderParams.radialSegments,
      this.cylinderParams.heightSegments,
      this.cylinderParams.openEnded,
      this.cylinderParams.thetaStart,
      this.cylinderParams.thetaLength
    );

    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    this.cylinderMesh = new THREE.Mesh(cylinderGeometry, material);
    if (this.scene) {
      this.scene.add(this.cylinderMesh);
    }
  }

  private addCylinderToScene(): void {
    this.scene?.add(this.cylinderMesh!);
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

    // Cylindrical parameters controller
    this.gui.add(this.cylinderParams, 'radiusTop', 0.1, 3).onChange(() => this.updateCylinder());
    this.gui.add(this.cylinderParams, 'radiusBottom', 0.1, 3).onChange(() => this.updateCylinder());
    this.gui.add(this.cylinderParams, 'height', 0.1, 5).onChange(() => this.updateCylinder());
    this.gui.add(this.cylinderParams, 'radialSegments', 3, 32, 1).onChange(() => this.updateCylinder());
    this.gui.add(this.cylinderParams, 'heightSegments', 1, 10, 1).onChange(() => this.updateCylinder());
    this.gui.add(this.cylinderParams, 'openEnded').onChange(() => this.updateCylinder());
    this.gui.add(this.cylinderParams, 'thetaStart', 0, 2 * Math.PI).onChange(() => this.updateCylinder());
    this.gui.add(this.cylinderParams, 'thetaLength', 0, 2 * Math.PI).onChange(() => this.updateCylinder());
  }

  private updateCylinder(): void {
    if (this.scene) {
      this.scene.remove(this.cylinderMesh!);

      const updatedGeometry = new THREE.CylinderGeometry(
        this.cylinderParams.radiusTop,
        this.cylinderParams.radiusBottom,
        this.cylinderParams.height,
        this.cylinderParams.radialSegments,
        this.cylinderParams.heightSegments,
        this.cylinderParams.openEnded,
        this.cylinderParams.thetaStart,
        this.cylinderParams.thetaLength
      );

      this.cylinderMesh?.geometry.dispose();
      this.cylinderMesh?.geometry.copy(updatedGeometry);

      this.scene.add(this.cylinderMesh!);
    }
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);
        if (this.cylinderMesh) {
          this.cylinderMesh.rotation.x += 0.01;
          this.cylinderMesh.rotation.y += 0.01;
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
