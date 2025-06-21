import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurriculumData } from '../../../../models/curriculum.model';

@Component({
  selector: 'app-curriculum-form-modal',
  templateUrl: './curriculum-form-modal.component.html',
  styleUrls: ['./curriculum-form-modal.component.css'],
  standalone: false
})
export class CurriculumFormModalComponent implements OnInit {
  @Input() curriculum: CurriculumData | null = null;
  @Output() save = new EventEmitter<CurriculumData>();
  @Output() cancel = new EventEmitter<void>();

  curriculumForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.curriculumForm = this.formBuilder.group({
      PersonalInfo: this.formBuilder.group({
        Name: ['', [Validators.required]],
        Title: ['', [Validators.required]],
        Description: [''],
        Location: [''],
        Phone: [''],
        Email: ['', [Validators.email]],
        ProfileImage: [''],
        YearsExperience: [0],
        ProjectsCompleted: [0],
        HappyClients: [0],
        Certifications: [0],
        LinkedInUrl: [''],
        GitHubUrl: [''],
        PortfolioUrl: ['']
      }),
      Skills: [[]],
      Experiences: [[]],
      Education: [[]],
      Certifications: [[]],
      Services: [[]]
    });
  }

  ngOnInit(): void {
    if (this.curriculum) {
      this.curriculumForm.patchValue(this.curriculum);
    }
  }

  onSubmit(): void {
    if (this.curriculumForm.invalid) {
      return;
    }

    const curriculum: CurriculumData = {
      ...this.curriculumForm.value
    };

    this.save.emit(curriculum);
  }

  onCancel(): void {
    this.cancel.emit();
  }
} 