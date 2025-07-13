import { Markup } from 'telegraf';

export function actionButtons() {
  // // adds buttons at the bottom of the screen
  // return Markup.keyboard(
  //   [
  //     Markup.button.callback('📝 Add task', 'create'),
  //     Markup.button.callback('📑 To-do list', 'list'),
  //     Markup.button.callback('✅ Done', 'done'),
  //     Markup.button.callback('✏ Edit', 'edit'),
  //     Markup.button.callback('🗑 Delete', 'delete'),
  //   ],
  //   { columns: 2 },
  // );

  // adds buttons below the text
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('📝 Add task', 'create'),
      Markup.button.callback('📑 To-do list', 'list'),
      Markup.button.callback('✅ Done', 'done'),
      Markup.button.callback('✏ Edit', 'edit'),
      Markup.button.callback('🗑 Delete', 'delete'),
    ],
    {
      columns: 2,
    },
  );
}
