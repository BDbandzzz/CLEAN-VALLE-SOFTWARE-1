export const USER_ROLE_IDS = Object.freeze({
  STUDENT: 1,
  TEACHER: 2,
  OPERATOR: 3,
  MANAGER: 4,
  ADMIN: 5,
});

export const ELEMENT_STATE_IDS = Object.freeze({
  ACTIVE: 1,
  INACTIVE: 2,
  CLOSED: 3,
});

export const REPORT_STATUS_IDS = Object.freeze({
  PENDING: 1,
  IN_REVIEW: 2,
  ASSIGNED: 3,
  IN_PROGRESS: 4,
  RESOLVED: 5,
  REJECTED: 6,
});

export const RESOLUTION_REVIEW_STATUS_IDS = Object.freeze({
  SUBMITTED: 1,
  APPROVED: 2,
  DISCARDED: 3,
});

export const REPORT_STORAGE_BUCKETS = Object.freeze({
  REPORT_PHOTOS: 'report-photos',
  RESOLUTION_PHOTOS: 'resolution-photos',
});
