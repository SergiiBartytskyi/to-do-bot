// import { AppService } from './app.service';
// import {
//   Action,
//   Ctx,
//   // Hears,
//   InjectBot,
//   Message,
//   On,
//   Start,
//   Update,
// } from 'nestjs-telegraf';
// import { Telegraf } from 'telegraf';
// import { actionButtons } from './app.buttons';
// import { Context } from './context.interface';
// import { IToDo } from './interfaces/app-interface';
// import { showList } from './app.utils';

// // const todos: IToDo[] = [
// //   { id: 1, name: 'Buy goods', isCompleted: false },
// //   { id: 2, name: 'Feed dog', isCompleted: false },
// //   { id: 3, name: 'Wash dishes', isCompleted: true },
// // ];

// @Update()
// export class AppUpdate {
//   constructor(
//     @InjectBot() private readonly bot: Telegraf<Context>,
//     private readonly appService: AppService,
//   ) {}

//   @Start()
//   async startCommand(ctx: Context) {
//     await ctx.reply('Hi, friend! 👋');
//     // await ctx.reply('What do you want to do? 🧙‍♂️');
//     await ctx.replyWithHTML(
//       '<b>What do you want to do? 🧙‍♂️</b>',
//       actionButtons(),
//     );
//   }

//   // Works with reply keyboard (Markup.keyboard).
//   // @Hears('📑 To-do list')
//   // async getAll(ctx: Context) {
//   //   await ctx.reply('List todo');
//   // }

//   // Works with inline buttons (Markup.inlineKeyboard).
//   @Action('create')
//   async create(ctx: Context) {
//     ctx.session.type = 'create';
//     await ctx.replyWithHTML('<b>Write your task: </b>');
//   }

//   @Action('list')
//   async getAll(ctx: Context) {
//     const todos: IToDo[] = await this.appService.getAll();
//     await ctx.reply(showList(todos));
//   }

//   @Action('done')
//   async doneTask(ctx: Context) {
//     await ctx.reply('Write task ID');
//     ctx.session.type = 'done';
//   }

//   @Action('edit')
//   async editTask(ctx: Context) {
//     ctx.session.type = 'edit';
//     await ctx.deleteMessage();
//     await ctx.replyWithHTML(
//       'Write task ID and new task: \n\n' + '<i>Format: 1 | New task name</i>',
//     );
//   }

//   @Action('delete')
//   async deleteTask(ctx: Context) {
//     await ctx.reply('Write task ID');
//     ctx.session.type = 'delete';
//   }

//   @On('text')
//   async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
//     if (!ctx.session.type) return;

//     if (ctx.session.type === 'create') {
//       const todos = await this.appService.create(message);

//       await ctx.reply(showList(todos));
//     }

//     if (ctx.session.type === 'done') {
//       const todos = await this.appService.doneTask(Number(message));
//       // const todo = todos.find((t) => t.id === Number(message));

//       if (!todos) {
//         await ctx.deleteMessage();
//         await ctx.reply('No such task found');
//         return;
//       }

//       await ctx.reply(showList(todos));
//     }

//     if (ctx.session.type === 'edit') {
//       const [taskId, taskName] = message.split(' | ');

//       const todos = await this.appService.editTask(Number(taskId), taskName);

//       if (!todos) {
//         await ctx.deleteMessage();
//         await ctx.reply('No such task found');
//         return;
//       }

//       await ctx.reply(showList(todos));
//     }

//     if (ctx.session.type === 'delete') {
//       const todos = await this.appService.deleteTask(Number(message));

//       if (!todos) {
//         await ctx.deleteMessage();
//         await ctx.reply('No such task found');
//         return;
//       }

//       await ctx.reply(showList(todos));
//     }
//   }
// }
