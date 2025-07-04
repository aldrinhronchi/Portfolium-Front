import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  standalone: false
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  goBack(): void {
    window.history.back();
  }

  goHome(): void {
    window.location.href = '/';
  }
} 