import { IAppointmentType } from '../IAppointment';
import AppError from '../../utils/AppError';

export class NetworkAuditAppointment implements IAppointmentType {
  getTypeName(): string {
    return 'network_audit';
  }

  getDefaultDurationMinutes(): number {
    return 90;
  }

  getRequiredMetadataKeys(): string[] {
    return ['siteId', 'issueType'];
  }

  validate(metadata: Record<string, unknown>): void {
    if (!metadata.siteId || !metadata.issueType) {
      throw new AppError(
        'Network audit appointments require siteId and issueType.',
        400
      );
    }

    const validIssueTypes = ['connectivity', 'hardware', 'software', 'security', 'performance'];
    if (!validIssueTypes.includes(metadata.issueType as string)) {
      throw new AppError(
        `issueType must be one of: ${validIssueTypes.join(', ')}.`,
        400
      );
    }
  }
}