import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { Repository } from 'typeorm';
import { IToDo } from 'src/interfaces/app-interface';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskEntity[]> {
    const { name } = createTaskDto;

    const newTask: IToDo = this.taskRepository.create({ name });

    await this.taskRepository.save(newTask);

    return this.findAll();
  }

  async findAll() {
    return this.taskRepository.find({ order: { id: 'ASC' } });
  }

  async doneTask(id: number) {
    const task = await this.findOne(id);
    if (!task) return null;

    task.isCompleted = !task.isCompleted;
    await this.taskRepository.save(task);
    return this.findAll();
  }

  async findOne(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const { name } = updateTaskDto;
    if (!name) return null;

    const task = await this.findOne(id);
    if (!task) return null;

    task.name = name;
    await this.taskRepository.save(task);
    return this.findAll();
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    if (!task) return null;

    await this.taskRepository.delete({ id });
    return this.findAll();
  }
}
