import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User, UserRole } from './users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Event Permit and Venue Booking System')
    .setDescription(
      'A digital platform for venue discovery, booking requests, and event permit applications in Rwanda. Supports role-based workflows: Organizers, Venue Managers, and Authorities.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth', // This name will be used in @ApiBearerAuth
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCss: `
      .swagger-ui .topbar { background-color: #2c3e50; }
      .swagger-ui .info { margin: 50px 0; }
      .swagger-ui .info hgroup.main { margin: 0 0 20px; }
      .swagger-ui .auth-wrapper { display: flex; justify-content: flex-end; }
      .swagger-ui .auth-btn-wrapper { padding: 10px 0; }
    `,
    customSiteTitle: 'Event Permit System - API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      syntaxHighlight: { activated: true, theme: 'arta' },
      tryItOutEnabled: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const dataSource = app.get(DataSource);

  await seedAdmin(dataSource);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

async function seedAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const adminEmail = 'admin@example.com'; // Change if you want
  const existingAdmin = await userRepository.findOneBy({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10); // Change password in production!

    const admin = userRepository.create({
      username: 'admin',
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.AUTHORITY,
    });

    await userRepository.save(admin);
    console.log('✅ Admin user created automatically:', adminEmail);
    console.log('   Password: admin123 (change it immediately in production!)');
  } else {
    console.log('👤 Admin user already exists:', adminEmail);
  }
}
