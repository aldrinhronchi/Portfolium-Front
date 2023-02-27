import { Component, NgModule } from '@angular/core';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})


export class ProjectsComponent {

  sector: any;

 projects: string[] = [
  'crud',
  'curriculum',
  'utils',
  'locadora',
  'filosofos',
  'controlefinanceiro',
  'pokedex',
  '',
  ''
];

  ngOnInit() {
  }
  changeModal(index: number) {
    console.log(index);
    switch (index) {
      case 0:
      {
        this.sector = this.projects[index];
        break;
      }
      case 1:
      {
        this.sector = this.projects[index];
        break;
      }
      case 2:
      {
        this.sector = this.projects[index];
        break;
      }
      default: {
        this.sector = '';
        break;
      }


    }
}
}
