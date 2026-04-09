import { IAppointmentType } from '../IAppointment';

export class GeneralAppointment implements IAppointmentType {
  getTypeName(): string {
    return 'general';
  }

  getDefaultDurationMinutes(): number {
    return 30;
  }

  getRequiredMetadataKeys(): string[] {
    return [];
  }

  validate(_metadata: Record<string, unknown>): void {
    // General appointments have no required metadata
  }
}