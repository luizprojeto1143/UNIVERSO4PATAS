import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { SettingsModule } from './settings/settings.module';
import { TutorsModule } from './tutors/tutors.module';
import { PatientsModule } from './patients/patients.module';
import { ClinicalModule } from './clinical/clinical.module';
import { PreventiveModule } from './preventive/preventive.module';
import { ExamsModule } from './exams/exams.module';
import { FinancialModule } from './financial/financial.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppointmentsController } from './appointments/appointments.controller';
import { AppointmentsService } from './appointments/appointments.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { CatalogModule } from './catalog/catalog.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { FiscalModule } from './fiscal/fiscal.module';
import { SignaturesModule } from './signatures/signatures.module';
import { TutorAuthModule } from './tutor-auth/tutor-auth.module';
import { TutorPortalModule } from './tutor-portal/tutor-portal.module';
import { DocumentsModule } from './documents/documents.module';
import { PipelinesModule } from './pipelines/pipelines.module';
import { HospitalizationModule } from './hospitalization/hospitalization.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AuthModule,
    PrismaModule,
    UsersModule,
    RolesModule,
    SettingsModule,
    TutorsModule,
    PatientsModule,
    AppointmentsModule,
    WaitlistModule,
    ClinicalModule,
    PreventiveModule,
    ExamsModule,
    FinancialModule,
    DashboardModule,
    CatalogModule,
    SuppliersModule,
    FiscalModule,
    SignaturesModule,
    TutorAuthModule,
    TutorPortalModule,
    DocumentsModule,
    PipelinesModule,
    HospitalizationModule,
    InventoryModule,
  ],
  controllers: [AppController, AppointmentsController],
  providers: [AppService, AppointmentsService],
})
export class AppModule {}
