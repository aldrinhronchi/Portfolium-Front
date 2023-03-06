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
        this.sector = this.projects[index];
}
}
