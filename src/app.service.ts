import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async getAll() {
    return this.taskRepository.find();
  }

  async getById(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  async doneTask(id: number) {
    const task = await this.getById(id);
    if (!task) return null;

    task.isCompleted = !task.isCompleted;
    return this.taskRepository.save(task);
  }

  async editTask(id: number, name: string) {
    const task = await this.getById(id);
    if (!task) return null;

    task.name = name;
    return this.taskRepository.save(task);
  }

  async deleteTask(id: number) {
    const task = await this.getById(id);
    if (!task) return null;

    return this.taskRepository.delete({ id });
  }
}
