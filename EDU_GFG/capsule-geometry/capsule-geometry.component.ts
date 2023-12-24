import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

@Component({
  selector: 'app-capsule-geometry',
  templateUrl: './capsule-geometry.component.html',
  styleUrls: ['./capsule-geometry.component.css']
})
export class CapsuleGeometryComponent implements OnInit, OnDestroy {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private capsule: THREE.Mesh | undefined;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;
  private controls: OrbitControls;
  private gui: dat.GUI;
  initialCapsuleParams: any;
  material: any;

  constructor(private ngZone: NgZone) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Create AmbientLight
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambientLight);

    // Create Directional Light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(this.directionalLight);

    // Create controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.maxPolarAngle = Math.PI / 2;

    // GUI setup
    this.gui = new dat.GUI();
    this.initialCapsuleParams = {
      radius: 1,
      length: 4,
      capSegments: 8,
      radialSegments: 16
    };
    this.material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.5
    });
  }

  ngOnInit(): void {
    this.addEventListeners();
    this.setupCapsule();
    this.setupGUI();
    this.animate();
    window.addEventListener('resize', () => this.onWindowResize());
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.onWindowResize());
    this.gui.destroy();
  }

  private addEventListeners(): void {
    this.renderer.domElement.addEventListener('mousedown', (event) => {
      event.preventDefault();
      const mouseX = event.clientX - this.renderer.domElement.offsetLeft;
      const mouseY = event.clientY - this.renderer.domElement.offsetTop;

      const vector = new THREE.Vector3(mouseX, mouseY, 0);
      const distance = this.camera.position.distanceTo(vector);

      if (this.capsule) {
        this.capsule.position.x = (mouseX / distance) * 2 - 1;
        this.capsule.position.y = (mouseY / distance) * 2 - 1;
      }
    });

    window.addEventListener('resize', () => this.onWindowResize());
  }

  private setupCapsule(): void {
    const capsuleGeometry = new THREE.CapsuleGeometry(
      this.initialCapsuleParams.radius,
      this.initialCapsuleParams.length,
      this.initialCapsuleParams.capSegments,
      this.initialCapsuleParams.radialSegments
    );

    this.capsule = new THREE.Mesh(capsuleGeometry, this.material);
    this.scene.add(this.capsule);
  }

  private setupGUI(): void {
    const capsuleFolder = this.gui.addFolder('Capsule Settings');
    capsuleFolder.add(this.initialCapsuleParams, 'radius', 0.1, 5).onChange(() => this.updateCapsuleGeometry());
    capsuleFolder.add(this.initialCapsuleParams, 'length', 0.1, 10).onChange(() => this.updateCapsuleGeometry());
    capsuleFolder
      .add(this.initialCapsuleParams, 'capSegments', 3, 20)
      .step(1)
      .onChange(() => this.updateCapsuleGeometry());
    capsuleFolder
      .add(this.initialCapsuleParams, 'radialSegments', 3, 20)
      .step(1)
      .onChange(() => this.updateCapsuleGeometry());
    // wireframe
    capsuleFolder.add(this.material, 'wireframe');
    capsuleFolder.open();
  }

  private updateCapsuleGeometry(): void {
    if (this.capsule && this.capsule.geometry) {
      this.capsule.geometry.dispose();
      this.capsule.geometry = new THREE.CapsuleGeometry(
        this.initialCapsuleParams.radius,
        this.initialCapsuleParams.length,
        this.initialCapsuleParams.capSegments,
        this.initialCapsuleParams.radialSegments
      );
    }
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        requestAnimationFrame(animateFn);

        // Rotate the capsule
        if (this.capsule) {
          this.capsule.rotation.x += 0.01;
          this.capsule.rotation.y += 0.01;
        }

        // Update controls
        this.controls.update();

        // Render the scene
        this.renderer.render(this.scene, this.camera);
      };

      animateFn();
    });
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}