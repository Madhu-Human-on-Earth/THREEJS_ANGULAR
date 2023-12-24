import { Component, OnInit, Renderer2 } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Router, RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.css']
}) 
export class MainComponentComponent implements OnInit{
  // renderer: any;
  constructor(private router: Router,private renderer: Renderer2) {}

  navigateToInstallation() {
    this.router.navigate(['/installation']);
  }
 

  ngOnInit(): void {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      this.renderer.listen(tooltipTriggerEl, 'mouseover', () => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
    });
  }

  isNavbarCollapsed = false;

}