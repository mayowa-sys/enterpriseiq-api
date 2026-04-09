export interface IAppointmentType {
  validate(metadata: Record<string, unknown>): void;
  getDefaultDurationMinutes(): number;
  getRequiredMetadataKeys(): string[];
  getTypeName(): string;
}