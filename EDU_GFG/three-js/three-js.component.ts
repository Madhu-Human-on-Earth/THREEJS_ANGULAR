// three-js.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-three-js',
  templateUrl: './three-js.component.html',
  styleUrls: ['./three-js.component.css']
})
export class ThreeJsComponent {
  isSidenavOpen: boolean = true;
sidenav: any;

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  // searchInput: string = ''; // to store the search input value

  // onSearch(): void {
    // Implement your search logic here using this.searchInput
    // console.log('Search Query:', this.searchInput);
    // You can perform actions like making an API call or updating the UI based on the search input.
  // }
}
