import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, Assignment } from '../../services/api.service';

interface DayInfo {
  iso: string;       // YYYY-MM-DD
  label: string;     // "Mon\nMar 16"
  dayLine: string;
  dateLine: string;
}

interface CellData {
  assignment?: Assignment;
  isFree: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnChanges {
  @Input() users: User[] = [];
  @Input() assignments: Assignment[] = [];
  @Output() addRequested = new EventEmitter<{ userId: string; date: string }>();
  @Output() editRequested = new EventEmitter<Assignment>();

  days: DayInfo[] = [];
  cellMap = new Map<string, Assignment[]>();

  ngOnChanges(_changes: SimpleChanges): void {
    this.buildDays();
    this.buildCellMap();
  }

  private buildDays(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.days = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = this.toIso(d);
      const dayLine = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateLine = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      this.days.push({ iso, label: `${dayLine}\n${dateLine}`, dayLine, dateLine });
    }
  }

  private buildCellMap(): void {
    this.cellMap.clear();
    for (const a of this.assignments) {
      const start = new Date(a.startDate + 'T00:00:00');
      const end = new Date(a.endDate + 'T00:00:00');
      for (const day of this.days) {
        const d = new Date(day.iso + 'T00:00:00');
        if (d >= start && d <= end) {
          const key = `${a.userId}:${day.iso}`;
          if (!this.cellMap.has(key)) this.cellMap.set(key, []);
          this.cellMap.get(key)!.push(a);
        }
      }
    }
  }

  getCellAssignments(userId: string, iso: string): Assignment[] {
    return this.cellMap.get(`${userId}:${iso}`) ?? [];
  }

  onAddClick(userId: string, date: string, event: MouseEvent): void {
    event.stopPropagation();
    this.addRequested.emit({ userId, date });
  }

  onEditClick(a: Assignment, event: MouseEvent): void {
    event.stopPropagation();
    this.editRequested.emit(a);
  }

  private toIso(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  trackByUserId(_i: number, u: User) { return u.id; }
  trackByDayIso(_i: number, d: DayInfo) { return d.iso; }
  trackByAssignmentId(_i: number, a: Assignment) { return a.id; }
}
