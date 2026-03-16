import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, User, Assignment, CreateAssignmentDto } from '../../services/api.service';

@Component({
  selector: 'app-assignment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignment-form.component.html',
  styleUrl: './assignment-form.component.scss'
})
export class AssignmentFormComponent implements OnInit {
  @Input() existingAssignment?: Assignment;
  @Input() users: User[] = [];
  @Input() prefillUserId?: string;
  @Input() prefillDate?: string;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly api = inject(ApiService);

  userId: string | null = null;
  taskText = '';
  startDate = '';
  endDate = '';
  saving = false;
  error = '';

  ngOnInit(): void {
    if (this.existingAssignment) {
      this.userId = this.existingAssignment.userId;
      this.taskText = this.existingAssignment.taskText;
      this.startDate = this.existingAssignment.startDate;
      this.endDate = this.existingAssignment.endDate;
    } else {
      if (this.prefillUserId != null) {
        this.userId = this.prefillUserId;
      }
      if (this.prefillDate) {
        this.startDate = this.prefillDate;
        this.endDate = this.prefillDate;
      }
    }
  }

  get isEditMode(): boolean {
    return !!this.existingAssignment;
  }

  submit(): void {
    this.error = '';
    if (!this.userId || !this.taskText.trim() || !this.startDate || !this.endDate) {
      this.error = 'All fields are required.';
      return;
    }
    if (this.endDate < this.startDate) {
      this.error = 'End date must be on or after start date.';
      return;
    }

    this.saving = true;
    const payload: CreateAssignmentDto = {
      userId: this.userId!,
      taskText: this.taskText.trim(),
      startDate: this.startDate,
      endDate: this.endDate
    };

    const req = this.isEditMode
      ? this.api.updateAssignment(this.existingAssignment!.id, payload)
      : this.api.createAssignment(payload);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.saved.emit();
      },
      error: () => {
        this.saving = false;
        this.error = 'Failed to save. Please try again.';
      }
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
