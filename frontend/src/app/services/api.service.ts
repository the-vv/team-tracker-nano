import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
}

export interface Assignment {
  id: string;
  userId: string;
  taskText: string;
  startDate: string;
  endDate: string;
}

export interface CreateAssignmentDto {
  userId: string;
  taskText: string;
  startDate: string;
  endDate: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:3000';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/users`);
  }

  createUser(name: string): Observable<User> {
    return this.http.post<User>(`${this.base}/users`, { name });
  }

  updateUser(id: string, name: string): Observable<User> {
    return this.http.put<User>(`${this.base}/users/${id}`, { name });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/users/${id}`);
  }

  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.base}/assignments`);
  }

  createAssignment(data: CreateAssignmentDto): Observable<Assignment> {
    return this.http.post<Assignment>(`${this.base}/assignments`, data);
  }

  updateAssignment(id: string, data: Partial<CreateAssignmentDto>): Observable<Assignment> {
    return this.http.put<Assignment>(`${this.base}/assignments/${id}`, data);
  }

  deleteAssignment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/assignments/${id}`);
  }
}
