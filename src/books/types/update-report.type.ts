export type UpdateReport = {
  dueDate?: Date | string;
  returnedDate?: Date | string | null;
  hasReturned?: boolean;
  hasApproved?: boolean;
  approverId?: number;
};
