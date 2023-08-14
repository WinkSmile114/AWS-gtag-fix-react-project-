import PayroInput from '../../../widgets/PayroInput';
import PayroButton from '../../../widgets/PayroButton';

import './contact-info.css';

import { PLACEHOLDER } from './contact-utils';
import { useContext } from 'react';
import { MessageContext } from '../../../context';

import { Contact } from '../../../common-types';
import { useRecoilState } from 'recoil';
import {
  contactsState,
  userIsOwnerState,
} from '../../../recoil-state/application-stage-states';

export interface ContactInfoFields {
  first_name?: string;
  last_name?: string;
  percent_of_ownership?: number;
  phone?: string;
  email?: string;
  uuid: string;
  social_security_number?: string;
  title?: string;
  isUser: boolean;
}

export interface ContactInfoProps extends ContactInfoFields {
  deleteContact: () => any;
  saveContact: (contactInfoToSave: Partial<ContactInfoFields>) => any;
}

export default (props: ContactInfoProps) => {
  const [contacts, setContacts] =
    useRecoilState<Partial<Contact>[]>(contactsState);

  const [userIsOwner, setUserIsOwner] =
    useRecoilState(userIsOwnerState);

  const hasOwnershipPercent =
    props.percent_of_ownership && props.percent_of_ownership > 0;

  const messageContext = useContext(MessageContext);

  const contactInfo = { ...props };

  const getSocialSecurityAsNumbersArray = (
    ssNum: string | undefined,
  ): Array<number | undefined> | undefined => {
    if (!ssNum) {
      return;
    }
    return ssNum.split('').map((el) => {
      if (el == '?') {
        return undefined;
      } else {
        return parseInt(el);
      }
    });
  };
  const isTenNumbers = /^[0-9]{10}$/;

  return (
    <div className="contact-form-wrapper">
      {!contactInfo.isUser && (
        <div className="owner-info-name-inputs">
          <PayroInput
            required
            value={
              props.first_name != PLACEHOLDER ? props.first_name : ''
            }
            id="first-name"
            label="First Name"
            variant="standard"
            placeholder="First Name"
            onChange={(eventValue: any) => {
              const newContactInfo = { first_name: eventValue };

              props.saveContact(newContactInfo);
            }}
            onBlurFunction={(e: any) => {}}
            error={!props.first_name || props.first_name?.length < 1}
          />

          <PayroInput
            required
            value={
              props.last_name != PLACEHOLDER ? props.last_name : ''
            }
            id="last-name"
            label="Last Name"
            variant="standard"
            placeholder="Last Name"
            onChange={(eventValue: any) => {
              const newContactInfo = { last_name: eventValue };

              props.saveContact(newContactInfo);
            }}
            onBlurFunction={(e: any) => {}}
            error={!props.last_name || props.last_name?.length < 1}
          />
        </div>
      )}

      {!contactInfo.isUser && (
        <div className="form-field">
          <PayroInput
            required
            value={props.email}
            id="email"
            label="Email"
            variant="standard"
            placeholder="example@domain.com"
            onChange={(eventValue: any) => {
              const newContactInfo = { email: eventValue };

              props.saveContact(newContactInfo);
            }}
            onBlurFunction={(e: any) => {}}
            error={
              !props.email ||
              props.email.length < 5 ||
              props.email.indexOf('@') < 1 ||
              props.email.indexOf('.') < 3
            }
          />

          <PayroInput
            required
            value={props.phone?.replaceAll('+1', '')}
            id="phone"
            label="Phone"
            variant="standard"
            isPhone={true}
            placeholder="Phone Number"
            onChange={(eventValue: any) => {
              const newContactInfo = { phone: eventValue };

              props.saveContact(newContactInfo);
            }}
            onBlurFunction={(e: any) => {
              // const newContactInfo = { phone: e.target.value.replaceAll('-', '') }
              // //props.setContactInfo(newContactInfo)
              // props.saveContact(newContactInfo)
            }}
            //error={!props.phone || !(isTenNumbers.test(props.phone))}
          />
        </div>
      )}

      {!contactInfo.isUser && (
        <PayroButton
          variant="white"
          disabled={contacts?.length == 2}
          onClick={() => props.deleteContact()}
        >
          Remove Owner
        </PayroButton>
      )}

      {(!contactInfo.isUser || userIsOwner === 'yes') && (
        <div className="form-field">
          {/* <PayroInput
                        // onChange={(e: any) => props.setContactInfo({ ...contactInfo, social_security_number: e })}
                        required
                        value={props.social_security_number}
                        id="social-security"
                        label="Social Security Number"
                        variant="standard"

                        onBlurFunction={(e: any) => {
                            const newContactInfo = {social_security_number: e.target.value}
                            //props.setContactInfo(newContactInfo)
                            props.saveContact(newContactInfo)
                        }}
                    /> */}
          {/* <div className="form-field">
                    <PayroInput
                        key={`${contactInfo.uuid}-ssn`}
                        // onChange={(e: any) => props.setContactInfo({ ...contactInfo, percent_of_ownership: e })}
                        value={contactInfo.social_security_number ?? undefined}
                        id="percent-ownership"
                        label="Social Security Number"
                        isSocialSecurity={true}
                        type="text"

                        onBlurFunction={(e: any) => {
                            const newContactInfo = { social_security_number: e.target.value.replaceAll('-', '') }
                            props.saveContact(newContactInfo)
                        }}
                    />
                </div> */}
          {/* <div className="social-security-wrapper">

                        <span className="input-label"> Social Security Number</span>
                        <FiniteNumbersGroup
                            key={`${contactInfo.uuid}-ssn`}
                            customKeyPrefix={contactInfo.uuid}
                            amountOfInputs={9}
                            isSocialSecurity={true}
                            originalVal={contactInfo.social_security_number ?? undefined}
                            onChangeFunction={(e: any) => {
                                console.log('i am the new e', e)
                                console.log(' I got blurred')
                                const newContactInfo: Partial<ContactInfoFields> = {
                                    social_security_number: e.toString()
                                }
                               props.saveContact(newContactInfo)
                            }} />
                    </div> */}
        </div>
      )}

      {/*
            (!contactInfo.isUser || props.userIsOwner === 'yes') &&
                <div className="form-field">
                    <PayroInput
                        // onChange={(e: any) => props.setContactInfo({ ...contactInfo, percent_of_ownership: e })}
                        value={props.percent_of_ownership}
                        id="percent-ownership"
                        label="Percentage Of Ownership"
                        type="number"

                        onBlurFunction={(e: any) => {
                            let newVal
                            try {
                                newVal = parseInt(e.target.value)
                            } catch (err) {
                                newVal = 0
                            }
                            const newContactInfo = { percent_of_ownership: newVal }
                            props.saveContact(newContactInfo)
                        }}
                    />
                </div>
                    */}
      {/* {(contactInfo.isUser && props.userIsOwner === "no") &&
                <div className="form-field">
                    <PayroInput
                        required
                        value={props.title}
                        id="contact-title"
                        label="Title"
                        variant="standard"
                        placeholder="CFO, CTO..."

                        onBlurFunction={(e: any) => {
                            console.log('I am being blurred')
                            const newContactInfo = { title: e.target.value }                        //props.setContactInfo(newContactInfo)                   props.saveContact(newContactInfo)
                        }}
                    />
                </div>
            } */}
    </div>
  );
};
