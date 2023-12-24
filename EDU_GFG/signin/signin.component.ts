import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { PopupComponent } from '../popup/popup.component';
import { AlertController } from '@ionic/angular';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SIGNINComponent  {
  // In your TypeScript
isEmailSubmitted = false;

constructor(@Inject(AlertController) private alertCtrl: AlertController, private http: HttpClient) {}

onSubmit(mailForm: NgForm): void {
  const mail = mailForm.value.mail;

  this.http.post('http://localhost:8090/mail', { mail: mail })
    .subscribe(
      (response: any) => {
        console.log('Mail ID created successfully:', response);
        this.isEmailSubmitted = true;
        this.displaySuccessMessage();
      },
      (error: any) => console.error('Error creating mail ID:', error)
    );
}

async displaySuccessMessage(): Promise<void> {
  const alert = await this.alertCtrl.create({
    message: 'Thank you for getting in touch! We will contact you soon.',
    buttons: ['OK']
  });
  await alert.present();
}

//   constructor(private ngZone: NgZone,private http: HttpClient,private dialog:MatDialog) {}

//   // localhost:8090/mail

//   @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

//   private scene!: THREE.Scene;
//   private camera!: THREE.PerspectiveCamera;
//   private renderer!: THREE.WebGLRenderer;
//   private controls!: OrbitControls;

//   private particles!: THREE.Points;
//   private particlesGeometry!: THREE.BufferGeometry;
//   private count: number = 50000;



//   ngAfterViewInit(): void {
//     this.initScene();
//     this.createParticles();
//     this.createRenderer();
//     this.createCamera();
//     this.createControls();
//     this.createFullscreenButton();

//     this.animate();
//   }

//   private initScene(): void {
//     this.scene = new THREE.Scene();
//   }

//   private createParticles(): void {
//     this.particlesGeometry = new THREE.BufferGeometry();
//     const positions = new Float32Array(this.count * 3);
//     const colors = new Float32Array(this.count * 3);

//     for (let i = 0; i < this.count * 3; i++) {
//       positions[i] = (Math.random() - 0.5) * 10;
//       colors[i] = Math.random();
//     }

//     this.particlesGeometry.setAttribute(
//       'position',
//       new THREE.BufferAttribute(positions, 3)
//     );
//     this.particlesGeometry.setAttribute(
//       'color',
//       new THREE.BufferAttribute(colors, 3)
//     );

//     const particleTexture = new THREE.TextureLoader().load(
//       '../assets/images/platforms/9.png'
//     );

//     const particlesMaterial = new THREE.PointsMaterial({
//       color: 'pink',
//       size: 0.1,
//       sizeAttenuation: true,
//       map: particleTexture,
//       transparent: true,
//       alphaMap: particleTexture,
//       depthWrite: false,
//       blending: THREE.AdditiveBlending,
//       vertexColors: true,
//     });

//     this.particles = new THREE.Points(
//       this.particlesGeometry,
//       particlesMaterial
//     );
//     this.scene.add(this.particles);
//   }

//   private createRenderer(): void {
//     this.renderer = new THREE.WebGLRenderer({
//       canvas: this.canvasRef.nativeElement,
//     });
//     this.renderer.setSize(window.innerWidth, window.innerHeight);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//   }

//   private createCamera(): void {
//     this.camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       100
//     );
//     this.camera.position.z = 3;
//     this.scene.add(this.camera);
//   }

//   private createControls(): void {
//     this.controls = new OrbitControls(this.camera, this.renderer.domElement);
//     this.controls.enableDamping = true;
//   }

//   private createFullscreenButton(): void {
//     const fullscreenButton = document.createElement('button');
//     fullscreenButton.textContent = 'Toggle Fullscreen';
//     fullscreenButton.style.position = 'absolute';
//     fullscreenButton.style.top = '10px';
//     fullscreenButton.style.left = '10px';
//     fullscreenButton.addEventListener('click', () => this.toggleFullscreen());
//     document.body.appendChild(fullscreenButton);
//   }

//   private toggleFullscreen(): void {
//     const canvas = this.canvasRef.nativeElement;
//     if (!document.fullscreenElement) {
//       canvas.requestFullscreen().catch((err: { message: any; }) => {
//         console.error(`Error attempting to enable full-screen mode: ${err.message}`);
//       });
//     } else {
//       document.exitFullscreen();
//     }

//     // Adjust controls after exiting fullscreen
//     setTimeout(() => {
//       this.controls?.update();
//     }, 1000);
//   }

//   @HostListener('window:resize', ['$event'])
//   onResize(event: Event): void {
//     this.camera.aspect = window.innerWidth / window.innerHeight;
//     this.camera.updateProjectionMatrix();
//     this.renderer.setSize(window.innerWidth, window.innerHeight);
//   }

  
  


//   private animate(): void {
//     this.ngZone.runOutsideAngular(() => {
//       const animateFn = () => {
//         requestAnimationFrame(animateFn);
//         if (this.particles) {
//           const elapsedTime = performance.now() / 1000;

//           for (let i = 0; i < this.count; i++) {
//             const i3 = i * 5;
//             const x = this.particlesGeometry.attributes['position'].array[i3];
//             const y = this.particlesGeometry.attributes['position'].array[i3 + 1];
//             this.particlesGeometry.attributes['position'].array[i3 + 1] = Math.cos(
//               elapsedTime + x
//             );
//           }
//           this.particlesGeometry.attributes['position'].needsUpdate = true;

//           this.controls?.update();
//           this.renderer.render(this.scene, this.camera);
//         }
//       };

//       animateFn();

     
//     });
   


//   }
     
  
// }
}