import type { Job } from '../mock/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function getJobs(): Promise<Job[]> {
  if (USE_MOCK) return import('../mock/jobs').then(m => m.jobs);
  return fetch('/api/pim/jobs').then(r => r.json());
}

export async function getJobById(id: string): Promise<Job | undefined> {
  if (USE_MOCK) {
    const { jobs } = await import('../mock/jobs');
    return jobs.find(j => j.id === id);
  }
  return fetch(`/api/pim/jobs/${id}`).then(r => r.json());
}

export async function getJobsByUser(userId: string): Promise<Job[]> {
  if (USE_MOCK) {
    const [{ jobs }, { users }] = await Promise.all([
      import('../mock/jobs'),
      import('../mock/users'),
    ]);
    const user = users.find(u => u.id === userId);
    if (!user) return [];
    return jobs.filter(j => user.assignedJobIds.includes(j.id));
  }
  return fetch(`/api/pim/jobs?userId=${userId}`).then(r => r.json());
}

export async function getJobsByStatus(status: Job['status']): Promise<Job[]> {
  if (USE_MOCK) {
    const { jobs } = await import('../mock/jobs');
    return jobs.filter(j => j.status === status);
  }
  return fetch(`/api/pim/jobs?status=${encodeURIComponent(status)}`).then(r => r.json());
}
