export type AccountStatus = 'approved' | 'declined';

export interface Contact {
  uuid: string;
  accountid: string;
  email: string;
  is_applicant: boolean;
  first_name: string;
  last_name: string;
  percent_of_ownership: number;
  phone: string;
  social_security_number: string;
  title: string;
}
