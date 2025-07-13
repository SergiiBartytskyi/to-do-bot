import { IToDo } from './interfaces/app-interface';

export const showList = (todos: IToDo[]) =>
  `Your ToDo list: \n\n${todos.map((todo) => (todo.isCompleted ? '✔' : '❌') + ' ' + todo.name + '\n\n').join('')}`;
