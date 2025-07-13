import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
// import { TaskController } from './task.controller';
import { TaskEntity } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskUpdate } from './task.update';

const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        middlewares: [sessions.middleware()],
        token: configService.getOrThrow<string>('TG_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([TaskEntity]),
  ],
  // controllers: [TaskController],
  providers: [TaskService, TaskUpdate],
  exports: [TypeOrmModule],
})
export class TaskModule {}
