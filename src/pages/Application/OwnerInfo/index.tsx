import { useEffect, useState } from 'react';
import { components } from '../../../api-utils/swagger-schema';
import FooterButtons from '../../../Footer/footer-buttons';
import TitleSection from '../../../Header/title-section';
import { getClient } from '../../../api-utils/general-utils';
import ContactInfo, { ContactInfoFields } from './contact-info';
import Loader from '../../../widgets/Loader';
import PayroButton from '../../../widgets/PayroButton';
import PurpleAddIcon from '../../../common-icons/pruple-add.svg';
import {
  CreateContactDto,
  GetAccountDto,
} from '../../../api-utils/generated-client';
import { v4 as uuidv4 } from 'uuid';
import { PLACEHOLDER, contactInfoToDto } from './contact-utils';
import { useContext } from 'react';
import { MessageContext } from '../../../context';
import InfoMessage from '../../../widgets/InfoMessage';
import PayroRadioButtonGroup from '../../../widgets/PayroRadioButtonGroup';
import './index.css';
import NextIcon from '../../../common-icons/next-arrow.svg';
import { Contact } from '../../../common-types';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  contactsState,
  userContactUuidState,
  userIsOwnerState,
} from '../../../recoil-state/application-stage-states';
import {
  accountRecordState,
  userInfoState,
} from '../../../recoil-state/general-states';

interface OwnerInfoProps {
  contactCrudActions: any;
  contacts: Partial<Contact>[] | null;
  setContacts: Function;
  userIsOwner: 'yes' | 'no' | undefined;
  userContactUuid: string | null;
  setUserIsOwner: Function;
}

// const noValidations = {
//     legalCompanyName: false,
//     einNumber: false,
//     companyAddressLine1: false,
//     companyCity: false,
//     companyState: false,
//     companyZip: false,
//     industryType: false,
//     website: false,
//     annualCompanyRevenue: false
// }

export default (props: OwnerInfoProps) => {
  const [accountInfo, setAccountInfo] = useRecoilState<GetAccountDto>(
    accountRecordState,
  );
  const [contacts, setContacts] =
    useRecoilState<Partial<Contact>[]>(contactsState);
  const [userContactUuid, setUserContactUuid] = useRecoilState<
    string | null
  >(userContactUuidState);
  const [userIsOwner, setUserIsOwner] =
    useRecoilState(userIsOwnerState);
  const userInfo = useRecoilValue(userInfoState);


  const contactsDisplay = contacts.map((contactInfo, idx) => (
    <ContactInfo
      key={contactInfo.uuid}
      {...contactInfo}
      uuid={contactInfo.uuid as string}
      deleteContact={() =>
        props.contactCrudActions.deleteContact(idx)
      }
      saveContact={(
        contactInfoToSave: Partial<ContactInfoFields>,
      ) => {
        props.contactCrudActions.saveContact(idx, contactInfoToSave);
      }}
      isUser={contactInfo.uuid == userContactUuid}
    />
  ));

  const isEverythingValid = (): boolean => {
    if (!contacts) {
      return false;
    }
    if (contacts.length > 1) {
      for (let i = 1; i < contacts.length; i++) {
        let nonUserOwner = contacts[i];
        let requiredFields = [
          nonUserOwner.first_name,
          nonUserOwner.last_name,
          nonUserOwner.email,
          nonUserOwner.phone,
        ];
        for (let j = 0; j < requiredFields.length; j++) {
          if (!requiredFields[j]) {
            return false;
          }
          if (requiredFields[j]!.length < 1) {
            return false;
          }
        }
      }
    }
    if (userIsOwner == 'yes') {
      return true;
    }
    if (userIsOwner == 'no' && contacts.length < 2) {
      return false;
    }
    return false;
  };
  useEffect(() => {
    let contactsCopy = [...contacts];
    if (userIsOwner == 'yes') {
      const newContactInfo = { percent_of_ownership: 100 };
      contactsCopy[0] = { ...contactsCopy[0], ...newContactInfo };
      setContacts(contactsCopy);
    }
    if (userIsOwner == 'no') {
      const newContactInfo = {
        social_security_number: '',
        percent_of_ownership: 0,
      };
      contactsCopy[0] = { ...contactsCopy[0], ...newContactInfo };
      setContacts(contactsCopy);
    }
  }, [userIsOwner]);

  if ((props.contacts ?? []).length < 1 ) {
    return <Loader />;
  }

  let allValid = isEverythingValid();

  return (
    <>
      {/* <TitleSection
                pageNumAndOutOf="2/3"
                title="Tell Us More About The Business Owner"
            />

            <div className="owner-info-body"> */}

      <PayroRadioButtonGroup
        groupLabel="Are you the official owner of the business?"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        checkedValue={userIsOwner}
        onValueChange={async (e) => {
          setUserIsOwner(e.target.value as 'yes' | 'no');
          if (e.target.value == 'no') {
            if (!contacts || contacts.length < 2) {
              props.contactCrudActions.addContact().then((_: any) => {
                console.log('added one');
              });
            }
          } else if (e.target.value == 'yes') {
            if (!contacts) {
              return;
            }
            if (
              contacts[0].uuid != userInfo.contact_uuid &&
              contacts.length > 1
            ) {
              for (let i = 1; i < contacts.length; i++) {
                props.contactCrudActions.deleteContact(i);

                console.log('deleted this one');
                console.log(i);
              }
            }
          }
        }}
        groupName="user-is-owner"
      />

      {/* <div id="skip-me"
                    onClick={() => props.updateCurrentScreen("PayrollInfo")}
                >
                    Skip to next step.  I'll tell you the rest later.
                </div> */}

      {userIsOwner == 'no' && (
        <>
          <InfoMessage
            theBackgroundColor="yellow"
            messageText="We will notify the business owner and obtain their approval prior to your account being approved for funding"
          />

          <h3 id="owner-header">{'Owner Info'}</h3>
          {contactsDisplay[0]}
          {contactsDisplay.filter((el, idx) => {
            if (idx > 0) {
              return el;
            }
          })}

          <PayroButton
            startIcon={PurpleAddIcon}
            buttonSize="small"
            variant="white"
            centered={true}
            onClick={() => props.contactCrudActions.addContact()}
          >
            Add an Owner
          </PayroButton>
        </>
      )}
    </>
  );
};
