import {
  Action,
  Ctx,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { TaskService } from './task.service';
import { actionButtons } from 'src/app.buttons';
import { Context } from '../context.interface';
import { showList } from 'src/app.utils';
import { validate } from 'class-validator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Update()
export class TaskUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly taskService: TaskService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi, friend! 👋');
    await ctx.replyWithHTML(
      '<b>What do you want to do? 🧙‍♂️</b>',
      actionButtons(),
    );
  }

  @Action('create')
  async create(ctx: Context) {
    ctx.session.type = 'create';
    await ctx.replyWithHTML('<b>Write your task: </b>');
  }

  @Action('list')
  async findAll(ctx: Context) {
    const todos = await this.taskService.findAll();

    await ctx.reply(showList(todos), actionButtons());
  }

  @Action('done')
  async doneTask(ctx: Context) {
    ctx.session.type = 'done';
    await ctx.reply('Write task ID');
  }

  @Action('edit')
  async update(ctx: Context) {
    ctx.session.type = 'edit';
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      'Write task ID and new task: \n\n' + '<i>Format: 1.New task name</i>',
    );
  }

  @Action('delete')
  async deleteTask(ctx: Context) {
    ctx.session.type = 'delete';
    await ctx.reply('Write task ID');
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'create') {
      const dto = new CreateTaskDto();
      dto.name = message;

      const errors = await validate(dto);
      if (errors.length > 0) {
        await ctx.reply(
          'Task name must be a non-empty string up to 30 characters!',
        );
        return;
      }

      const todos = await this.taskService.create(dto);

      await ctx.reply(showList(todos), actionButtons());
      ctx.session.type = null;
    }

    if (ctx.session.type === 'done') {
      const taskId = Number(message);
      if (!Number.isInteger(taskId) || isNaN(taskId)) {
        await ctx.reply('Invalid task number');
        return;
      }

      const todos = await this.taskService.doneTask(taskId);
      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('No such task found');
        return;
      }

      await ctx.reply(showList(todos), actionButtons());
      ctx.session.type = null;
    }

    if (ctx.session.type === 'edit') {
      const [id, name] = message.split('.');
      if (!id || !name) {
        await ctx.reply('Format: 1.Edit task name');
        return;
      }

      const dto = new UpdateTaskDto();

      dto.name = name;

      const errors = await validate(dto);
      if (errors.length > 0) {
        await ctx.reply(
          'Task name must be a non-empty string up to 30 characters!',
        );
        return;
      }

      const todos = await this.taskService.update(Number(id), dto);

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('No such task found');
        return;
      }

      await ctx.reply(showList(todos), actionButtons());
      ctx.session.type = null;
    }

    if (ctx.session.type === 'delete') {
      const todos = await this.taskService.remove(Number(message));

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('No such task found');
        return;
      }

      await ctx.reply(showList(todos), actionButtons());
      ctx.session.type = null;
    }
  }
}
