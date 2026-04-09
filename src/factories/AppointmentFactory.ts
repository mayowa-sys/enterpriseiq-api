import { IAppointmentType } from './IAppointment';
import { ConsultationAppointment } from './types/ConsultationAppointment';
import { LoanReviewAppointment } from './types/LoanReviewAppointment';
import { AccountOpeningAppointment } from './types/AccountOpeningAppointment';
import { NetworkAuditAppointment } from './types/NetworkAuditAppointment';
import { GeneralAppointment } from './types/GeneralAppointment';
import AppError from '../utils/AppError';

export class AppointmentFactory {
  private static registry: Record<string, IAppointmentType> = {
    consultation: new ConsultationAppointment(),
    loan_review: new LoanReviewAppointment(),
    account_opening: new AccountOpeningAppointment(),
    network_audit: new NetworkAuditAppointment(),
    general: new GeneralAppointment(),
  };

  static create(type: string): IAppointmentType {
    const appointmentType = this.registry[type];

    if (!appointmentType) {
      const available = Object.keys(this.registry).join(', ');
      throw new AppError(
        `Unknown appointment type: "${type}". Available types: ${available}.`,
        400
      );
    }

    return appointmentType;
  }

  static getAvailableTypes(): string[] {
    return Object.keys(this.registry);
  }
}