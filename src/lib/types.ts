export type Doctor = {
  id: string;
  name: string;
  department: string;
  title: string;
};

export type Department = {
  id: string;
  name: string;
};

export type Schedule = {
  id: string;
  date: string; // ISO format string YYYY-MM-DD
  departmentId: string;
  doctorIds: string[];
};
