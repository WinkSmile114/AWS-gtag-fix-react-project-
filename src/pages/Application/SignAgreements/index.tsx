import { useHistory } from 'react-router-dom';
import { getCurrentAuthUser } from '../../../auth/utils/auth-utils';
import { useEffect, useState } from 'react';
import TitleSection from '../../../Header/title-section';
import { getClient } from '../../../api-utils/general-utils';
import {
  GetAccountDto,
  Opportunity,
  UserObject,
} from '../../../api-utils/generated-client';
import {
  getSignatureDisclaimer,
  DocumentSection,
} from './document-utils';
import Loader from '../../../widgets/Loader';
import './index.scss';
import PayroButton from '../../../widgets/PayroButton';
import ActualSignature from './ActualSignature';

import checkIcon from '../../../common-icons/checkIconGreen.png';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  documentSectionsState,
  docVersionState,
  isNextButtonDisabledState,
  showDocsState,
  signatureDataUrlState,
  signedDocsState,
} from '../../../recoil-state/application-stage-states';
import {
  accountRecordState,
  opportunityState,
  userInfoState,
} from '../../../recoil-state/general-states';
import { fundingStepState } from '../../../recoil-state/request-funding-states';

interface SignAgreementsProps {
  stage?: 'onboarding' | undefined;
}

const SignAgreements = (props: SignAgreementsProps) => {
  const history = useHistory();

  const [mostRecentOpportunity, setMostRecentOpportunity] =
    useState<Opportunity>();
  const [accountInfo, setAccountInfo] = useState<GetAccountDto>();
  const [gotToEndOfText, setGotToEndOfText] =
    useState<boolean>(false);
  const [signedDocs, setSignedDocs] =
    useRecoilState<boolean>(signedDocsState);
  const [signatureDataUrl, setSignaturedataUrl] = useRecoilState<any>(
    signatureDataUrlState,
  );
  const [documentSections, setDocumentSections] = useRecoilState<
    DocumentSection[]
  >(documentSectionsState);
  const [userFullName, setUserFullName] = useState<string>();
  const [showDocs, setShowDocs] = useRecoilState(showDocsState);
  const [docVersion, setDocVersion] =
    useRecoilState<string>(docVersionState);
  const [showLoader, setShowLoader] = useState(false);
  const [userInfo, setUserInfo] =
    useRecoilState<Partial<UserObject>>(userInfoState);
  const [isNextDisabled, setIsNextDisabled] = useRecoilState(
    isNextButtonDisabledState,
  );
  const [fundingStep, setFundingStep] =
    useRecoilState(fundingStepState);
  const AccountInfo = useRecoilValue(accountRecordState);
  const opportunities = useRecoilValue(opportunityState);
  useEffect(() => {
    const getOpportunitiesAndAccountInfo = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }

      if (
        userInfo.document_signature_hash &&
        userInfo.document_signature_hash.length > 0
      ) {
        setSignedDocs(true);
      }

      if (!opportunities) return;
      setMostRecentOpportunity(opportunities[0]);
      const theDocSectionsRes =
        await client.documentsControllerGenerateDocuments();
      const theDocSections = theDocSectionsRes.data
        .contractInfo as DocumentSection[];
      setDocumentSections(theDocSections);
      setDocVersion(theDocSectionsRes.data.documentVersion);
      const authUser = await getCurrentAuthUser();
      setUserFullName(
        `${authUser.attributes.given_name}  ${authUser.attributes.family_name}`,
      );
    };

    getOpportunitiesAndAccountInfo();
  }, []);

  if (!AccountInfo || !mostRecentOpportunity) {
    return <Loader />;
  }

  if (showLoader) {
    return (
      <Loader
        message={
          props.stage == 'onboarding'
            ? 'Saving'
            : 'Submitting your application'
        }
      />
    );
  }

  const handleScroll = (element: any) => {
    const target = element.target;
    if (
      target.scrollHeight - target.scrollTop - 50 <=
      target.clientHeight
    ) {
      setGotToEndOfText(true);
    }
  };

  const theDocsPs = documentSections.map((sec) => {
    switch (sec.theTag) {
      case 'h1':
        return <h1 key={Math.random()}>{sec.theText}</h1>;
      case 'h3':
        return <h3 key={Math.random()}>{sec.theText}</h3>;
      case 'h5':
        return <h5 key={Math.random()}>{sec.theText}</h5>;
      case 'p':
        return <p key={Math.random()}>{sec.theText}</p>;
    }
  });

  const signHandler = async () => {
    setSignedDocs(true);
    setShowDocs(false);

    const client = await getClient();
    if (!client) {
      return;
    }
    setShowLoader(true);
    await client.documentsControllerSignDocuments({
      signature: signatureDataUrl,
      documentVersion: docVersion as string,
    });
    if (props.stage == 'onboarding') {
      setFundingStep('funding-amount');
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      {!showLoader && (
        <div>
          <TitleSection
            pageTitle={
              props.stage != 'onboarding' ? 'Sign Agreements' : ''
            }
            pageNumAndOutOf={props.stage != 'onboarding' ? '4/4' : ''}
            title={
              props.stage != 'onboarding'
                ? 'Sign agreements to submit your application'
                : 'Sign Agreements'
            }
          />

          {
            <div id="contract-outer-container">
              <div id="contract-wrapper">
                <div
                  id="contract-text"
                  onScroll={(e) => handleScroll(e)}
                >
                  {theDocsPs}
                </div>

                <div id="force-load-of-font">- - </div>

                {!gotToEndOfText && (
                  <div>
                    <p id="scroll-instructions">
                      {signedDocs
                        ? 'Scroll to read documents'
                        : 'Scroll and read the document to sign'}{' '}
                    </p>
                  </div>
                )}

                {gotToEndOfText && (
                  <div>
                    <div
                      id="signature-wrapper"
                      className="rounded-corner-section"
                    >
                      <p id="your-signature-label">
                        Your Generated Signature
                      </p>
                      <ActualSignature
                        fullName={userFullName as string}
                        getDataUrlCb={(theUrl: any) => {
                          setSignaturedataUrl(theUrl);
                        }}
                      />
                    </div>
                    <p id="signature-disclaimer">
                      {getSignatureDisclaimer(
                        AccountInfo.legal_name as string,
                      )}{' '}
                    </p>

                    <PayroButton
                      variant={signedDocs ? 'green' : 'green-agree'}
                      startIcon={signedDocs ? checkIcon : false}
                      disabled={
                        signedDocs
                          ? true
                          : gotToEndOfText
                          ? false
                          : true
                      }
                      customHeight="50px"
                      customWidth="width-200"
                      centered={true}
                      onClick={() =>
                        signHandler().then((res) => console.log(res))
                      }
                    >
                      {signedDocs
                        ? 'Your Signature Has Been Recorded'
                        : 'I Agree & Sign'}
                    </PayroButton>
                  </div>
                )}
              </div>
            </div>
          }

          <div id="signature-container">
            {}
            {}
          </div>

          {}
        </div>
      )}
    </>
  );
};

export default SignAgreements;
