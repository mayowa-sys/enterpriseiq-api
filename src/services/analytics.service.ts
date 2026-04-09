import AppError from '../utils/AppError';

const ANALYTICS_URL = process.env.ANALYTICS_SERVICE_URL;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

if (!ANALYTICS_URL || !INTERNAL_API_KEY) {
  throw new Error('Analytics service configuration missing');
}

const analyticsRequest = async (
  endpoint: string,
  orgId: string,
  params: Record<string, string> = {}
): Promise<unknown> => {
  const url = new URL(`${ANALYTICS_URL}/analytics/${endpoint}`);
  url.searchParams.set('org_id', orgId);

  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      'x-internal-key': INTERNAL_API_KEY as string,
    },
  });

  if (!response.ok) {
    throw new AppError('Analytics service unavailable', 503);
  }

  const data = await response.json() as { data: unknown };
  return data.data;
};

export const getPeakHours = (orgId: string) =>
  analyticsRequest('peak-hours', orgId);

export const getNoShowRate = (orgId: string) =>
  analyticsRequest('no-show-rate', orgId);

export const getStaffUtilisation = (
  orgId: string,
  startDate?: string,
  endDate?: string
) =>
  analyticsRequest('staff-utilisation', orgId, {
    start_date: startDate || '',
    end_date: endDate || '',
  });

export const getVolumeTrend = (orgId: string) =>
  analyticsRequest('volume-trend', orgId);

export const getRevenueEstimate = (orgId: string) =>
  analyticsRequest('revenue-estimate', orgId);

export const getSummary = (orgId: string) =>
  analyticsRequest('summary', orgId);