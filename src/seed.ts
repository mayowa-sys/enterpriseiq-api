import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Organisation from './models/Organisation';
import User from './models/User';
import Appointment from './models/Appointment';
import AuditLog from './models/AuditLog';
import RefreshToken from './models/RefreshToken';
import { AppointmentFactory } from './factories/AppointmentFactory';

dotenv.config();

const seed = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) throw new Error('MONGODB_URI not defined');

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // ── Clear existing data ─────────────────────────────────────
    console.log('Clearing existing data...');
    await Promise.all([
      Organisation.deleteMany({}),
      User.deleteMany({}),
      Appointment.deleteMany({}),
      AuditLog.deleteMany({}),
      RefreshToken.deleteMany({}),
    ]);
    console.log('Cleared.');

    // ── Create Organisation ─────────────────────────────────────
    console.log('Creating organisation...');
    const org = await Organisation.create({
      name: 'Zenith Bank Lagos',
      slug: 'zenith-bank-lagos',
      industry: 'banking',
      status: 'active',
      settings: {
        workingHours: { start: '08:00', end: '17:00' },
        timezone: 'Africa/Lagos',
        appointmentTypes: [
          { name: 'account_opening', durationMinutes: 60, priceNaira: 0 },
          { name: 'loan_review', durationMinutes: 45, priceNaira: 5000 },
          { name: 'consultation', durationMinutes: 30, priceNaira: 2000 },
          { name: 'general', durationMinutes: 30, priceNaira: 0 },
        ],
      },
    });
    console.log(`Organisation created: ${org.name}`);

    // ── Create Users ────────────────────────────────────────────
    console.log('Creating users...');

    const superAdmin = await User.create({
      orgId: null,
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@enterpriseiq.com',
      passwordHash: 'Admin2026!',
      role: 'super_admin',
    });

    const orgAdmin = await User.create({
      orgId: org._id,
      firstName: 'Org',
      lastName: 'Admin',
      email: 'admin@zenithbank.com',
      passwordHash: 'Admin2026!',
      role: 'org_admin',
    });

    const staff = await User.create({
      orgId: org._id,
      firstName: 'Chidi',
      lastName: 'Okeke',
      email: 'chidi@zenithbank.com',
      passwordHash: 'Staff2026!',
      role: 'staff',
    });

    const client = await User.create({
      orgId: org._id,
      firstName: 'Emeka',
      lastName: 'Adeleke',
      email: 'emeka@zenithbank.com',
      passwordHash: 'Client2026!',
      role: 'client',
    });

    console.log('Users created: superadmin, org admin, staff, client');

    // ── Create Appointments ─────────────────────────────────────
    console.log('Creating appointments...');

    const appointmentData = [
      {
        type: 'loan_review',
        title: 'Loan Review - Emeka Adeleke',
        status: 'completed',
        startTime: new Date('2026-04-01T10:00:00Z'),
        metadata: { loanAmount: 500000, accountNumber: '0123456789' },
      },
      {
        type: 'account_opening',
        title: 'Account Opening - Emeka Adeleke',
        status: 'completed',
        startTime: new Date('2026-04-02T09:00:00Z'),
        metadata: {
          idType: 'national_id',
          idNumber: 'AB1234567',
          bvn: '12345678901',
        },
      },
      {
        type: 'consultation',
        title: 'General Consultation - Emeka Adeleke',
        status: 'cancelled',
        startTime: new Date('2026-04-03T14:00:00Z'),
        metadata: { symptoms: 'Persistent headache and fatigue' },
      },
      {
        type: 'loan_review',
        title: 'Loan Review - Second Request',
        status: 'confirmed',
        startTime: new Date('2026-04-04T11:00:00Z'),
        metadata: { loanAmount: 1200000, accountNumber: '9876543210' },
      },
      {
        type: 'general',
        title: 'General Meeting',
        status: 'pending',
        startTime: new Date('2026-04-07T10:00:00Z'),
        metadata: {},
      },
      {
        type: 'account_opening',
        title: 'Account Opening - Second Visit',
        status: 'completed',
        startTime: new Date('2026-04-07T13:00:00Z'),
        metadata: {
          idType: 'passport',
          idNumber: 'CD9876543',
          bvn: '98765432101',
        },
      },
      {
        type: 'consultation',
        title: 'Follow-up Consultation',
        status: 'pending',
        startTime: new Date('2026-04-08T10:00:00Z'),
        metadata: { symptoms: 'Follow-up on previous visit' },
      },
      {
        type: 'loan_review',
        title: 'Loan Review - Business Expansion',
        status: 'confirmed',
        startTime: new Date('2026-04-09T15:00:00Z'),
        metadata: { loanAmount: 3000000, accountNumber: '1122334455' },
      },
    ];

    for (const data of appointmentData) {
      const appointmentType = AppointmentFactory.create(data.type);
      const durationMs =
        appointmentType.getDefaultDurationMinutes() * 60 * 1000;
      const endTime = new Date(data.startTime.getTime() + durationMs);

      await Appointment.create({
        orgId: org._id,
        title: data.title,
        type: data.type,
        clientId: client._id,
        staffId: staff._id,
        startTime: data.startTime,
        endTime,
        status: data.status,
        notes: '',
        metadata: data.metadata,
      });
    }

    console.log(`Created ${appointmentData.length} appointments`);

    // ── Done ────────────────────────────────────────────────────
    console.log('\n✅  Seed complete. Demo credentials:\n');
    console.log('  Super Admin:  superadmin@enterpriseiq.com / Admin2026!');
    console.log('  Org Admin:    admin@zenithbank.com / Admin2026!');
    console.log('  Staff:        chidi@zenithbank.com / Staff2026!');
    console.log('  Client:       emeka@zenithbank.com / Client2026!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();