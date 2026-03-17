import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, User } from '../../services/api.service';

interface EditState {
  id: string;
  name: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  @Input() users: User[] = [];
  @Output() changed = new EventEmitter<void>();

  private readonly api = inject(ApiService);

  newName = '';
  adding = false;
  editState: EditState | null = null;
  deletingId: string | null = null;

  addUser(): void {
    const name = this.newName.trim();
    if (!name) return;
    this.adding = true;
    this.api.createUser(name).subscribe({
      next: () => {
        this.newName = '';
        this.adding = false;
        this.changed.emit();
      },
      error: () => { this.adding = false; }
    });
  }

  startEdit(user: User): void {
    this.editState = { id: user.id, name: user.name };
  }

  saveEdit(): void {
    if (!this.editState || !this.editState.name.trim()) return;
    this.api.updateUser(this.editState.id, this.editState.name.trim()).subscribe({
      next: () => {
        this.editState = null;
        this.changed.emit();
      }
    });
  }

  cancelEdit(): void {
    this.editState = null;
  }

  confirmDelete(user: User): void {
    if (!confirm(`Delete "${user.name}"? Their assignments will also be removed.`)) return;
    this.deletingId = user.id;
    this.api.deleteUser(user.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.changed.emit();
      },
      error: () => { this.deletingId = null; }
    });
  }

  trackById(_i: number, u: User) { return u.id; }
}
