// Pairs the desk argued about. DedupeExplorer runs causes.ts over them on every build.

type Side = { tenant: string; channel: 'app' | 'email' | 'form'; subject: string };

export const DEDUPE_CASES: { a: Side; b: Side; why: string }[] = [
  {
    why: 'app vs email, same tenant',
    a: { tenant: 'kettle.books', channel: 'app', subject: 'Wrong day on the invite' },
    b: { tenant: 'kettle.books', channel: 'email', subject: 'Client turned up on the wrong day' },
  },
  {
    why: 'same subject, same tenant, different channel',
    a: { tenant: 'alder.physio', channel: 'form', subject: 'Booking on the wrong date' },
    b: { tenant: 'alder.physio', channel: 'app', subject: 'Booking on the wrong date' },
  },
  {
    why: 'same subject, same channel, different tenant',
    a: { tenant: 'copper.studio', channel: 'form', subject: 'Date is wrong' },
    b: { tenant: 'morrow.tax', channel: 'form', subject: 'Date is wrong' },
  },
  {
    why: 'different subject, same way in',
    a: { tenant: 'pale.harbour', channel: 'form', subject: 'Month and day swapped?' },
    b: { tenant: 'alder.physio', channel: 'form', subject: 'Appointment moved by itself' },
  },
  {
    why: 'no tenant on file',
    a: { tenant: 'unknown.sender', channel: 'email', subject: 'Dates mixed up' },
    b: { tenant: 'unknown.sender', channel: 'email', subject: 'Dates mixed up' },
  },
];
