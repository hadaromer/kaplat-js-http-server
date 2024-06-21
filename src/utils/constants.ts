export const MIN_YEAR = 1940;

export const MAX_YEAR = 2100;

export const GENRES = [
  'SCI_FI',
  'NOVEL',
  'HISTORY',
  'MANGA',
  'ROMANCE',
  'PROFESSIONAL',
];

export const CASE_SENSITIVE_ROUTES = [
  { method: 'get', path: '/books/health' },
  { method: 'get', path: '/books/total' },
  { method: 'get', path: '/books' },
  { method: 'post', path: '/book' },
  { method: 'get', path: '/book' },
  { method: 'put', path: '/book' },
  { method: 'delete', path: '/book' },
  { method: 'get', path: '/logs/level' },
  { method: 'put', path: '/logs/level' },
];
