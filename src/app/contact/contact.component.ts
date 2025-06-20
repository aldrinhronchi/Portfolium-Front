import { Component } from '@angular/core';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css'],
    standalone: false
})
export class ContactComponent {
  phoneNumber: string = '49999995816';
  email: string = 'work.aldrinronchi@gmail.com';
  location: string = 'Santa Catarina - Brazil'

}
