import { useEffect, useState, useContext } from 'react';
import PayroInput from '../../../widgets/PayroInput';
import TitleSection from '../../../Header/title-section';

import {
  CreateContactDto,
  GetAccountDto,
  UserObject,
} from '../../../api-utils/generated-client/';
import Loader from '../../../widgets/Loader';
import './index.css';
import StatesAbbreviations from './states';
import PayroSelect from '../../../widgets/PayroSelect';

import { MessageContext } from '../../../context';
import OwnerInfo from '../OwnerInfo';
import { v4 as uuidv4 } from 'uuid';
import { PLACEHOLDER } from '../OwnerInfo/contact-utils';
import { ContactInfoFields } from '../OwnerInfo/contact-info';
import { Contact } from '../../../common-types';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  isNextButtonDisabledState,
  contactsState,
  userIsOwnerState,
  userContactUuidState,
} from '../../../recoil-state/application-stage-states';
import {
  accountRecordState,
  allAccountUsersContactInfoState,
  userInfoState,
} from '../../../recoil-state/general-states';
import { getClient } from '../../../api-utils/general-utils';

const noValidations = {
  legalCompanyName: false,
  einNumber: false,
  companyAddressLine1: false,
  companyCity: false,
  companyState: false,
  companyZip: false,
  industryType: false,
  website: false,
  annualCompanyRevenue: false,
};

const CompanyInfo = () => {
  const [gotAccountInfo, setGotAccountInfo] = useState(false);

  const [contacts, setContacts] =
    useRecoilState<Partial<Contact>[]>(contactsState);
  const [userContactUuid, setUserContactUuid] = useRecoilState<
    string | null
  >(userContactUuidState);
  const [userIsOwner, setUserIsOwner] =
    useRecoilState(userIsOwnerState);
  const messageContext = useContext(MessageContext);
  const [validationsToShow, setValidationsToShow] =
    useState<any>(noValidations);
  const [isNextDisabled, setIsNextDisabled] = useRecoilState(
    isNextButtonDisabledState,
  );
  const [AccountInfo, setAccountInfo] = useRecoilState<GetAccountDto>(
    accountRecordState,
  );
  const cognitoUserInfo = useRecoilValue(userInfoState);
  useEffect(() => {
    const initializeCompanyAndContacts = async () => {
      setGotAccountInfo(true);

      setUserContactUuid(cognitoUserInfo.contact_uuid!);
      const client = await getClient();
      if (!client) {
        return;
      }
      const contactsRes = await client.contactsControllerFindAll();
      const allContacts = contactsRes.data as Contact[];

      let allAccountUsersContactInfoCopy = allContacts;

      if (allAccountUsersContactInfoCopy.length > 1) {
        //make user first contact and anyone brand new last
        allAccountUsersContactInfoCopy.sort(
          (a: Contact, b: Contact) => {
            if (a.uuid == userContactUuid) {
              return -1;
            }
            if (b.uuid == userContactUuid) {
              return 1;
            }
            return 1;
          },
        );
      }

      setContacts(allAccountUsersContactInfoCopy);

      allAccountUsersContactInfoCopy.forEach((contact) => {
        if (
          contact.uuid == cognitoUserInfo.contact_uuid &&
          typeof contact.percent_of_ownership != 'undefined'
        ) {
          if (contact.percent_of_ownership === 100) {
            setUserIsOwner('yes');
          } else if (contact.percent_of_ownership === 0) {
            setUserIsOwner('no');
          }
        }
      });
    };
    initializeCompanyAndContacts();
  }, []);

  if (!contacts) {
    return <Loader />;
  }

  const contactCrudActions = {
    addContact: async (
      fromRadioButtonNonOwnerSelection?: boolean,
    ) => {
      if (fromRadioButtonNonOwnerSelection && contacts.length > 1) {
        return;
      }
      let newContact: CreateContactDto = {
        uuid: uuidv4(),
        first_name: PLACEHOLDER,
        last_name: PLACEHOLDER,
      };
      const newContactInState: Partial<Contact> = {
        uuid: newContact.uuid as string,
        first_name: newContact.first_name as string,
        last_name: newContact.last_name as string,
        percent_of_ownership: 100,
      };
      try {
        setContacts([...contacts, newContactInState]);
      } catch (err) {
        console.log(err);
      }
    },

    saveContact: async (
      contactIndex: number,
      contactInfoToSave: Partial<ContactInfoFields>,
    ): Promise<string> => {
      let contactsCopy = [...contacts];
      contactsCopy[contactIndex] = {
        ...contactsCopy[contactIndex],
        ...contactInfoToSave,
      };
      setContacts(contactsCopy);

      return 'success';
    },

    deleteContact: async (indexOfContactToRemove: number) => {
      const copyOfContacts = [...contacts];
      copyOfContacts.splice(indexOfContactToRemove, 1);
      setContacts(copyOfContacts);
    },
  };

  const validationFunctions: { [key: string]: boolean } = {
    legalCompanyName:
      !AccountInfo?.legal_name || AccountInfo?.legal_name.length < 1,
    einNumber:
      !AccountInfo?.federal_tax_id_no ||
      (!/\d\d\d\d\d\d\d\d\d$/.test(AccountInfo?.federal_tax_id_no) &&
        !/\d\d-\d\d\d\d\d\d\d$/.test(AccountInfo?.federal_tax_id_no)),
    companyAddressLine1:
      !AccountInfo?.legal_address ||
      AccountInfo?.legal_address.length < 1,
    companyCity:
      !AccountInfo?.legal_address_city ||
      AccountInfo?.legal_address_city.length < 1,
    companyState:
      !AccountInfo?.legal_address_state ||
      AccountInfo?.legal_address_state.length < 1,
    companyZip:
      !AccountInfo?.legal_address_zip ||
      AccountInfo?.legal_address_zip.length < 4,
  };
  const isEverythingValid = (): boolean => {
    if (userIsOwner == 'yes') {
      return true;
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

    if (userIsOwner == 'no' && contacts.length < 2) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    let allValid =
      Object.keys(validationFunctions).every(
        (fieldName) => !validationFunctions[fieldName],
      ) && isEverythingValid();
    setIsNextDisabled(!allValid);
  });

  if (!gotAccountInfo || !contacts) {
    return <Loader />;
  }

  if (!AccountInfo) {
    return <div>We are experiencing technical difficulies</div>;
  }

  return (
    <div>
      <TitleSection
        pageTitle="About Company"
        pageNumAndOutOf="1/4"
        title="Tell us more about your company"
      />
      <div>
        <div>
          <PayroInput
            onFocus={() =>
              setValidationsToShow({
                ...validationsToShow,
                legalCompanyName: false,
              })
            }
            onBlurFunction={() =>
              setValidationsToShow({
                ...validationsToShow,
                legalCompanyName: true,
              })
            }
            error={
              validationsToShow.legalCompanyName &&
              validationFunctions.legalCompanyName
            }
            onChange={(e: any) =>
              setAccountInfo({ ...AccountInfo, legal_name: e })
            }
            required
            value={AccountInfo.legal_name}
            placeholder="Legal Company Name"
            id="legal-company-name"
            label="Legal Company Name"
            variant="standard"
          />
        </div>
        <div>
          <PayroInput
            onFocus={() =>
              setValidationsToShow({
                ...validationsToShow,
                einNumber: false,
              })
            }
            onBlurFunction={() =>
              setValidationsToShow({
                ...validationsToShow,
                einNumber: true,
              })
            }
            error={
              validationsToShow.einNumber &&
              validationFunctions.einNumber
            }
            onChange={(e: any) =>
              setAccountInfo({ ...AccountInfo, federal_tax_id_no: e })
            }
            required
            helperText={
              validationFunctions.einNumber ? '9 digits required' : ''
            }
            value={AccountInfo.federal_tax_id_no?.replaceAll('-', '')}
            isEinNumber={true}
            id="ein-number"
            label="EIN Number"
            placeholder="EIN"
            variant="standard"
          />
        </div>
        <div>
          <PayroInput
            onFocus={() =>
              setValidationsToShow({
                ...validationsToShow,
                companyAddressLine1: false,
              })
            }
            onBlurFunction={() =>
              setValidationsToShow({
                ...validationsToShow,
                companyAddressLine1: true,
              })
            }
            error={
              validationsToShow.companyAddressLine1 &&
              validationFunctions.companyAddressLine1
            }
            onChange={(e: any) =>
              setAccountInfo({ ...AccountInfo, legal_address: e })
            }
            required
            value={AccountInfo.legal_address}
            id="companyAddressLine1"
            label="Company Address"
            placeholder="Company Address"
            variant="standard"
          />
        </div>
        <div id="city-state-zip">
          <div>
            <PayroInput
              onFocus={() =>
                setValidationsToShow({
                  ...validationsToShow,
                  companyCity: false,
                })
              }
              onBlurFunction={() =>
                setValidationsToShow({
                  ...validationsToShow,
                  companyCity: true,
                })
              }
              error={
                validationsToShow.companyCity &&
                validationFunctions.companyCity
              }
              onChange={(e: any) =>
                setAccountInfo({
                  ...AccountInfo,
                  legal_address_city: e,
                })
              }
              required
              value={AccountInfo.legal_address_city}
              id="companyCity"
              label="City"
              variant="standard"
            />
          </div>
          <div id="company-state-wrapper">
            <PayroSelect
              selectName="company-state"
              placeholderText=""
              onSelect={(e: any) =>
                setAccountInfo({
                  ...AccountInfo,
                  legal_address_state: e.target.value,
                })
              }
              label="State"
              options={StatesAbbreviations}
              defaultSelectedValue={AccountInfo.legal_address_state}
            />
          </div>
          <div>
            <PayroInput
              onFocus={() =>
                setValidationsToShow({
                  ...validationsToShow,
                  companyZip: false,
                })
              }
              onBlurFunction={() =>
                setValidationsToShow({
                  ...validationsToShow,
                  companyZip: true,
                })
              }
              error={
                validationsToShow.companyZip &&
                validationFunctions.companyZip
              }
              onChange={(e: any) =>
                setAccountInfo({
                  ...AccountInfo,
                  legal_address_zip: e,
                })
              }
              required
              value={AccountInfo.legal_address_zip}
              id="the-company-zip"
              label="Zip"
              autoComplete="zip"
              variant="standard"
            />
          </div>
        </div>
      </div>
      <div></div>
      <OwnerInfo
        userIsOwner={userIsOwner}
        setUserIsOwner={setUserIsOwner}
        userContactUuid={userContactUuid}
        contacts={contacts}
        setContacts={setContacts}
        contactCrudActions={contactCrudActions}
      />
    </div>
  );
};
export default CompanyInfo;
