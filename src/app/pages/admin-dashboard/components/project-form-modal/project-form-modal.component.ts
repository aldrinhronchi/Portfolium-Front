import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../../../../models/project.model';

@Component({
  selector: 'app-project-form-modal',
  templateUrl: './project-form-modal.component.html',
  styleUrls: ['./project-form-modal.component.css'],
  standalone: false
})
export class ProjectFormModalComponent implements OnInit {
  @Input() project: Project | null = null;
  @Output() save = new EventEmitter<Project>();
  @Output() cancel = new EventEmitter<void>();

  projectForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.projectForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(200)]],
      Description: ['', [Validators.maxLength(2000)]],
      ShortDescription: ['', [Validators.maxLength(500)]],
      Technologies: [''],
      ProjectUrl: [''],
      DemoUrl: [''],
      RepositoryUrl: [''],
      MainImage: [''],
      Category: [''],
      DisplayOrder: [0],
      IsFeatured: [false]
    });
  }

  ngOnInit(): void {
    if (this.project) {
      this.projectForm.patchValue(this.project);
    }
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      return;
    }

    const project: Project = {
      ...this.projectForm.value,
      GuidID: this.project?.GuidID
    };

    this.save.emit(project);
  }

  onCancel(): void {
    this.cancel.emit();
  }
} 