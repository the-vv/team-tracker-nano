import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, User, Assignment } from './services/api.service';
import { UsersComponent } from './components/users/users.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AssignmentFormComponent } from './components/assignment-form/assignment-form.component';

type ActiveTab = 'calendar' | 'users';

interface ModalState {
  open: boolean;
  existingAssignment?: Assignment;
  prefillUserId?: string;
  prefillDate?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UsersComponent, CalendarComponent, AssignmentFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly api = inject(ApiService);

  activeTab: ActiveTab = 'calendar';
  users: User[] = [];
  assignments: Assignment[] = [];
  loading = true;

  modal: ModalState = { open: false };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.api.getUsers().subscribe({
      next: (u) => {
        this.users = u;
        this.api.getAssignments().subscribe({
          next: (a) => {
            this.assignments = a;
            this.loading = false;
          },
          error: () => { this.loading = false; }
        });
      },
      error: () => { this.loading = false; }
    });
  }

  setTab(tab: ActiveTab): void {
    this.activeTab = tab;
  }

  openAddModal(): void {
    this.modal = { open: true };
  }

  openAddForCell(event: { userId: string; date: string }): void {
    this.modal = { open: true, prefillUserId: event.userId, prefillDate: event.date };
  }

  openEditModal(assignment: Assignment): void {
    this.modal = { open: true, existingAssignment: assignment };
  }

  onModalSaved(): void {
    this.modal = { open: false };
    this.loadAll();
  }

  onModalCancelled(): void {
    this.modal = { open: false };
  }

  onUsersChanged(): void {
    this.loadAll();
  }
}
