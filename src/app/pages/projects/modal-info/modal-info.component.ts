import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-modal-info',
    templateUrl: './modal-info.component.html',
    styleUrls: ['./modal-info.component.css'],
    standalone: false
})
export class ModalInfoComponent implements OnInit {
  @Input() item: any;
  img1: any = 'assets/img/nature/image1.jpg';
  img2: any = 'assets/img/nature/image2.jpg';
  img3: any = 'assets/img/nature/image3.jpg';
  altimg1: any = '...';
  altimg2: any = '...';
  altimg3: any = '...';

  imagesSlides: any[] = [this.img1, this.img2, this.img3];
  title = 'Title';
  text1 = 'Wow so much Text!';
  constructor() { }

  ngOnInit() {
  }

  changeText(aux: any) {
    switch (aux) {
      case 'crud': {
        this.img1 = 'assets/img/tech/image4.jpg';
        this.title = 'Bootleg Items CRUD';
        this.text1 = 'CRUD of Bootleg Items';
        this.altimg1 = 'alt Text for CRUD';
        break;
      }
      case 'utils': {
        this.img1 = 'assets/img/tech/image6.png';
        this.title = 'Utilities';
        this.text1 = 'Some easy app-like functions, that i use a lot!';
        this.altimg1 = 'alt Text for utils';

        break;
      }
      default: {
        this.img1 = 'assets/img/nature/image2.jpg';
        this.title = 'Title';
        this.text1 = 'Wow so much Text!';
        this.altimg1 = 'alt Text for modal';

        break;
      }
    }
  }
}