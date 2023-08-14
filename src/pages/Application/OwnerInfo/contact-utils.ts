import { CreateContactDto } from '../../../api-utils/generated-client';
import { ContactInfoFields } from './contact-info';

export const contactInfoToDto = (
  contactInfo: Partial<ContactInfoFields>,
) => {
  const fields = [
    'first_name',
    'last_name',
    'percent_of_ownership',
    'phone',
    'email',
    'social_security_number',
    'title',
  ];

  Object.keys(contactInfo).forEach((field) => {});

  let dtoObj: CreateContactDto = {
    first_name: contactInfo.first_name,
    last_name: contactInfo.last_name,
    percent_of_ownership: contactInfo.percent_of_ownership,
    phone: contactInfo.phone,
    email: contactInfo.email,
    social_security_number: contactInfo.social_security_number,
    title: contactInfo.title,
  };
  return dtoObj;
};

export const PLACEHOLDER = 'placeholder';
