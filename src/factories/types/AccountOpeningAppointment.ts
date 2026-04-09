import { IAppointmentType } from '../IAppointment';
import AppError from '../../utils/AppError';

export class AccountOpeningAppointment implements IAppointmentType {
  getTypeName(): string {
    return 'account_opening';
  }

  getDefaultDurationMinutes(): number {
    return 60;
  }

  getRequiredMetadataKeys(): string[] {
    return ['idType', 'idNumber', 'bvn'];
  }

  validate(metadata: Record<string, unknown>): void {
    if (!metadata.idType || !metadata.idNumber || !metadata.bvn) {
      throw new AppError(
        'Account opening appointments require idType, idNumber, and bvn.',
        400
      );
    }

    const validIdTypes = ['national_id', 'drivers_license', 'passport', 'voters_card'];
    if (!validIdTypes.includes(metadata.idType as string)) {
      throw new AppError(
        `idType must be one of: ${validIdTypes.join(', ')}.`,
        400
      );
    }

    if (String(metadata.bvn).length !== 11) {
      throw new AppError('BVN must be exactly 11 digits.', 400);
    }
  }
}