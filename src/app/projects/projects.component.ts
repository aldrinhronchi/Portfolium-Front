import { Component, NgModule } from '@angular/core';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent {
  sector: any;
  
  ngOnInit() {
  }
  changeModal(index: number) {
    console.log(index);
    switch (index) {
      case 1:
      {
        this.sector = 'crud';
        break;
      }
      case 2:
      {
        this.sector = 'curriculum';
        break;
      }
      case 3:
      {
        this.sector = 'utils';
        break;
      }
      default: {
        this.sector = '';
        break;
      }


    }
}
}
