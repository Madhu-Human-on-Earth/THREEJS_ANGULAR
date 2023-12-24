// contact-form.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {

 
  name: string = '';
  email: string = '';
  phone: string = '';
  message: string = '';
  formSubmitted: boolean = false;
  
  onSubmit() {
    if (!this.name || !this.email || !this.message) {
      alert('Please fill in all required fields.');
      return;
    }
  
    // Perform form submission logic here
    console.log('Form submitted:', {
      name: this.name,
      email: this.email,
      phone: this.phone,
      message: this.message
    });
  
    this.formSubmitted = true;
  }
  

 
}
