import { IAppointmentType } from '../IAppointment';
import AppError from '../../utils/AppError';

export class ConsultationAppointment implements IAppointmentType {
  getTypeName(): string {
    return 'consultation';
  }

  getDefaultDurationMinutes(): number {
    return 30;
  }

  getRequiredMetadataKeys(): string[] {
    return ['symptoms'];
  }

  validate(metadata: Record<string, unknown>): void {
    if (!metadata.symptoms) {
      throw new AppError(
        'Consultation appointments require symptoms to be provided.',
        400
      );
    }
  }
}