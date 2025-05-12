export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profilePicture: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profilePicture: string;
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}