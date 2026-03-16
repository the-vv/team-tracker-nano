import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentsRepository: Repository<Assignment>,
  ) {}

  findAll(filters: {
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Assignment[]> {
    const where: Record<string, unknown> = {};
    if (filters.userId) {
      where['userId'] = filters.userId;
    }
    if (filters.startDate && filters.endDate) {
      where['startDate'] = Between(filters.startDate, filters.endDate);
    }
    return this.assignmentsRepository.find({ where });
  }

  async findOne(id: string): Promise<Assignment> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
    });
    if (!assignment) {
      throw new NotFoundException(`Assignment #${id} not found`);
    }
    return assignment;
  }

  create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const assignment = this.assignmentsRepository.create(createAssignmentDto);
    return this.assignmentsRepository.save(assignment);
  }

  async update(
    id: string,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<Assignment> {
    const assignment = await this.findOne(id);
    Object.assign(assignment, updateAssignmentDto);
    return this.assignmentsRepository.save(assignment);
  }

  async remove(id: string): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentsRepository.remove(assignment);
  }
}
