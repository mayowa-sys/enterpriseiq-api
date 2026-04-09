import { IAppointmentType } from '../IAppointment';
import AppError from '../../utils/AppError';

export class LoanReviewAppointment implements IAppointmentType {
  getTypeName(): string {
    return 'loan_review';
  }

  getDefaultDurationMinutes(): number {
    return 45;
  }

  getRequiredMetadataKeys(): string[] {
    return ['loanAmount', 'accountNumber'];
  }

  validate(metadata: Record<string, unknown>): void {
    if (!metadata.loanAmount || !metadata.accountNumber) {
      throw new AppError(
        'Loan review appointments require loanAmount and accountNumber.',
        400
      );
    }

    if (typeof metadata.loanAmount !== 'number' || metadata.loanAmount <= 0) {
      throw new AppError('loanAmount must be a positive number.', 400);
    }
  }
}