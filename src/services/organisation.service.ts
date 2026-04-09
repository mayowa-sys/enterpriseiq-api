import Organisation, { IOrganisation } from '../models/Organisation';
import AppError from '../utils/AppError';

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
};

export const createOrganisation = async (
  data: Partial<IOrganisation>
): Promise<IOrganisation> => {
  const slug = generateSlug(data.name as string);

  const existing = await Organisation.findOne({ slug });
  if (existing) {
    throw new AppError(
      'An organisation with this name already exists.',
      400
    );
  }

  const org = await Organisation.create({ ...data, slug });
  return org;
};

export const getAllOrganisations = async (): Promise<IOrganisation[]> => {
  return Organisation.find({ status: { $ne: 'deleted' } }).sort({
    createdAt: -1,
  });
};

export const getOrganisationById = async (
  id: string
): Promise<IOrganisation> => {
  const org = await Organisation.findById(id);
  if (!org || org.status === 'deleted') {
    throw new AppError('Organisation not found.', 404);
  }
  return org;
};

export const updateOrganisation = async (
  id: string,
  requestingOrgId: string,
  data: Partial<IOrganisation>
): Promise<IOrganisation> => {
  // Org admins can only update their own organisation
  if (id !== requestingOrgId) {
    throw new AppError(
      'You are not authorised to update this organisation.',
      403
    );
  }

  const org = await Organisation.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!org) throw new AppError('Organisation not found.', 404);
  return org;
};

export const suspendOrganisation = async (
  id: string
): Promise<IOrganisation> => {
  const org = await Organisation.findByIdAndUpdate(
    id,
    { status: 'suspended' },
    { new: true }
  );
  if (!org) throw new AppError('Organisation not found.', 404);
  return org;
};