import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AuthModule } from './auth/auth.module';
import { DomainsModule } from './domains/domains.module'; // NEW

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER || 'admin',
      password: process.env.POSTGRES_PASSWORD || 'password123',
      database: process.env.POSTGRES_DB || 'email_saas',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // use migrations in production
      ssl:
        process.env.POSTGRES_SSL === 'true'
          ? { rejectUnauthorized: false } // required for Supabase
          : false,
    }),
    UsersModule,
    CampaignsModule,
    AuthModule,
    DomainsModule, // NEW
  ],
})
export class AppModule {}