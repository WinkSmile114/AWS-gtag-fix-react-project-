import { useContext, useEffect, useState } from 'react';
import { getClient } from '../../../api-utils/general-utils';
import { MessageContext } from '../../../context';
import TitleSection from '../../../Header/title-section';
import { isFeatureOn } from '../../../utils';
import Uploader from '../../../widgets/Uploader';
import './index.css';
import { useRecoilState } from 'recoil';
import { isNextButtonDisabledState } from '../../../recoil-state/application-stage-states';
import PlaidConnector from '../../../widgets/PlaidConnector';
import { isPlaidConnectedState } from '../../../recoil-state/general-states';

export interface PayroFile {
  filename: string;
}
const BankInfo = (props: any) => {
  const [statements, setStatements] = useState<any>();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useRecoilState(
    isPlaidConnectedState,
  );
  const [gotAllFinicity, setGotAllFinicity] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useRecoilState(
    isNextButtonDisabledState,
  );
  const messageContext = useContext(MessageContext);

  const finicityFeatureOn: boolean = isFeatureOn('Finicity');

  const uploadFiles = async (filesToUpload: any[]) => {
    const client = await getClient();

    if (!client) {
      return;
    }

    for (let i = 0; i < filesToUpload.length; i++) {
      let singleFile = filesToUpload[i];
      if (singleFile.size > 10_000_000) {
        messageContext.addMessage({
          level: 'error',
          message: 'File Size is limited to 10MB',
        });
        return;
      }

      try {
        const urlRes =
          await client.documentsControllerUploadStatementsUrl({
            fileName: singleFile.name,
            documentType: 'bank-statement',
          });

        const options = {
          method: 'PUT',
          body: singleFile,
          mode: 'cors',
        };
        await fetch(urlRes.data, options as RequestInit);
      } catch {
        messageContext.addMessage({
          level: 'error',
          message: 'PDF uploads only',
        });
        return 'fail';
      }
    }

    getFiles();
  };

  const deleteFile = (fileName: string) => {
    getClient().then((client) => {
      if (!client) {
        return;
      }
      client
        .documentsControllerDeleteStatement({
          fileName,
          documentType: 'bank-statement',
        })
        .then(() => {
          getFiles();
        });
    });
  };

  const getFiles = () => {
    getClient().then((client) => {
      if (!client) {
        return;
      }
      client
        .documentsControllerGetBankStatements()
        .then((res: any) => {
          setUploadedFiles(res.data as string[]);
        });
    });
  };

  useEffect(() => {
    getFiles();
  }, []);
  useEffect(() => {
    setIsNextDisabled(
      isConnected !== 'yes' && uploadedFiles.length < 1,
    );
  });

  return (
    <div>
      <TitleSection
        pageTitle="Bank Statements"
        pageNumAndOutOf="3/4"
        centered={true}
        title="Upload bank statements"
        subtitle="Last 6 months of main operating account"
      />
      {process.env.REACT_APP_SHOW_PLAID === 'yes' && (
        <PlaidConnector />
      )}

      {isConnected !== 'yes' &&
        process.env.REACT_APP_SHOW_PLAID === 'yes' && (
          <>
            <div className="horizontal-divider"></div>
            <h4 className="manual-upload-title">
              Upload Your Bank Statements Manually
            </h4>
          </>
        )}

      {isConnected !== 'yes' && (
        <>
          <Uploader
            inputChangeHandler={async (files: any) => {
              setStatements(files);
              await uploadFiles(files);
            }}
            instructionsText="Upload 6 Statements Here"
            uploadedFiles={uploadedFiles}
            deleteFile={(fileName: any) => deleteFile(fileName)}
            getLatestUploadedFiles={getFiles}
          />
        </>
      )}
    </div>
  );
};

export default BankInfo;
