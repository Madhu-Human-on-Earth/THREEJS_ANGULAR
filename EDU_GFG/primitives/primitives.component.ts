import { Component, ElementRef, AfterViewInit, OnDestroy, OnInit, ViewChild, NgZone } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-primitives',
  templateUrl: './primitives.component.html',
  styleUrls: ['./primitives.component.css']
})
export class PrimitivesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  cube!: THREE.Mesh;
  controls!: OrbitControls;
  // ...

  constructor(@Inject(NgZone) private ngZone: NgZone) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initThree();
      this.createCube();
      this.addCubeToScene();
      this.setCameraPosition();
      this.addOrbitControls();
      this.animate();
    });
  }

  ngOnDestroy(): void {
    // Clean up resources if needed
  }

  private initThree(): void {
    if (this.rendererContainer && this.rendererContainer.nativeElement) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    }
  }

  private createCube(): void {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
  }

  private addCubeToScene(): void {
    this.scene.add(this.cube);
  }

  private setCameraPosition(): void {
    this.camera.position.z = 5;
  }

  private addOrbitControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.maxPolarAngle = Math.PI / 2;
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      };
      animateFn();
    });
  }

  onResize(event: Event): void {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    this.camera.aspect = newWidth / newHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(newWidth, newHeight);
  }
}
