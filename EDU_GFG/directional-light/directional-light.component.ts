import { Component, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

@Component({
  selector: 'app-directional-light',
  templateUrl: 'directional-light.component.html',
  styleUrls: ['directional-light.component.css']
})
export class DirectionalLightComponent implements OnInit, OnDestroy {

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;
  private sphere!: THREE.Mesh;
  private torusKnot!: THREE.Mesh;
  private ambientLight!: THREE.AmbientLight;
  private directionalLight!: THREE.DirectionalLight;
  private controls!: OrbitControls;
  private gui!: dat.GUI;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.initThree();
    this.createScene();
    this.createLights();
    this.createObjects();
    this.setupGui();
    this.setupOrbitControls();
    this.animate();
    window.addEventListener('resize', () => this.onWindowResize());
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.onWindowResize());
    this.gui.destroy();
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
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambientLight);
  }

  private createLights(): void {
    // Create Directional Light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(this.directionalLight);
  }

  private createObjects(): void {
    // Create a Cube with MeshStandardMaterial
    const cubeGeometry = new THREE.BoxGeometry();
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      metalness: 0.5,
      roughness: 0.5,
    });
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.scene.add(this.cube);

    // Create a Sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      metalness: 0.5,
      roughness: 0.5,
    });
    this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.sphere.position.set(2, 0, 0);
    this.scene.add(this.sphere);

    // Create a TorusKnot
    const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
    const torusKnotMaterial = new THREE.MeshStandardMaterial({
      color: 0xff69b4,
      metalness: 0.5,
      roughness: 0.5,
    });
    this.torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
    this.torusKnot.position.set(-2, 0, 0);
    this.scene.add(this.torusKnot);
  }

  private setupGui(): void {
    // GUI setup
    this.gui = new dat.GUI();

    // AmbientLight color controller
    const ambientLightColor = { color: this.ambientLight.color.getHex() };
    const directionalLightColor = { color: this.directionalLight.color.getHex() };
    const cubeColor = { color: (this.cube.material as THREE.MeshStandardMaterial).color.getHex() };
    const sphereColor = { color: (this.sphere.material as THREE.MeshStandardMaterial).color.getHex() };
    const torusKnotColor = { color: (this.torusKnot.material as THREE.MeshStandardMaterial).color.getHex() };

    const lightFolder = this.gui.addFolder('Lights');
    lightFolder.addColor(ambientLightColor, 'color').onChange(() => {
      this.ambientLight.color.set(ambientLightColor.color);
    });
    lightFolder.addColor(directionalLightColor, 'color').onChange(() => {
      this.directionalLight.color.set(directionalLightColor.color);
    });

    const cubeFolder = this.gui.addFolder('Cube Material');
    cubeFolder.addColor(cubeColor, 'color').onChange(() => {
      (this.cube.material as THREE.MeshStandardMaterial).color.set(cubeColor.color);
    });

    const sphereFolder = this.gui.addFolder('Sphere Material');
    sphereFolder.addColor(sphereColor, 'color').onChange(() => {
      (this.sphere.material as THREE.MeshStandardMaterial).color.set(sphereColor.color);
    });

    const torusKnotFolder = this.gui.addFolder('TorusKnot Material');
    torusKnotFolder.addColor(torusKnotColor, 'color').onChange(() => {
      (this.torusKnot.material as THREE.MeshStandardMaterial).color.set(torusKnotColor.color);
    });
  }

  private setupOrbitControls(): void {
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

        // Rotate the objects
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        this.sphere.rotation.x += 0.01;
        this.sphere.rotation.y += 0.01;
        this.torusKnot.rotation.x += 0.01;
        this.torusKnot.rotation.y += 0.01;

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
