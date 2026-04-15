import type { User } from './types';

export const users: User[] = [
  {
    id: 'user-contractor-1',
    name: 'Marcus Webb',
    email: 'marcus.webb@apexroofing.com',
    role: 'contractor',
    company: 'Apex Roofing Systems',
    region: 'Midwest',
    assignedJobIds: [
      'job-riverside-commerce',
      'job-desert-ridge-medical',
      'job-atlantic-office',
      'job-pacific-industrial',
      'job-sunbelt-distribution',
    ],
  },
  {
    id: 'user-contractor-2',
    name: 'Sandra Kowalski',
    email: 'sandra.k@greentopconstruction.com',
    role: 'contractor',
    company: 'Greentop Construction Inc.',
    region: 'Northeast',
    assignedJobIds: [
      'job-greenfield-elementary',
      'job-lakeside-warehouse',
      'job-northgate-shopping',
    ],
  },
  {
    id: 'user-rep-1',
    name: 'Derek Fontaine',
    email: 'd.fontaine@carlislesyntec.com',
    role: 'rep',
    company: 'Carlisle SynTec Systems',
    region: 'Northeast',
    assignedJobIds: [
      'job-riverside-commerce',
      'job-greenfield-elementary',
      'job-lakeside-warehouse',
      'job-northgate-shopping',
    ],
  },
  {
    id: 'user-rep-2',
    name: 'Priya Nair',
    email: 'p.nair@carlislesyntec.com',
    role: 'rep',
    company: 'Carlisle SynTec Systems',
    region: 'Southwest',
    assignedJobIds: [
      'job-desert-ridge-medical',
      'job-pacific-industrial',
      'job-atlantic-office',
      'job-sunbelt-distribution',
    ],
  },
];
