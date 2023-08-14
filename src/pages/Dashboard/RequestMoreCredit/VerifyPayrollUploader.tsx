import { useContext, useEffect, useState } from 'react';
import './index.scss';
import { getClient } from '../../../api-utils/general-utils';
import Uploader from '../../../widgets/Uploader';
import Slider from '../../../widgets/RangeSlider';
import {
  getFiles,
  uploadFiles,
  deleteFile,
} from '../../RequestFunding/utils';
import { MessageContext } from '../../../context';
import {
  useRecoilValue,
  useSetRecoilState,
  useRecoilState,
} from 'recoil';

import { uploadedFilesState } from '../../../recoil-state/request-funding-states';

export default () => {
  const [uploadedFiles, setUploadedFiles] = useRecoilState(
    uploadedFilesState,
  );

  const uploadTheFiles = async (fileToUpload: any[]) => {
    const client = await getClient();
    if (client) {
      await uploadFiles(fileToUpload, client);
      const gottenFiles = await getFiles(client);
      setUploadedFiles(gottenFiles);
    }
  };

  const getNewUploadedFiles = () =>
    getClient().then((client) => {
      if (!client) {
        return;
      }
      getFiles(client).then((gottenFiles: any) =>
        setUploadedFiles(gottenFiles),
      );
    });

  useEffect(() => {
    getNewUploadedFiles();
  }, []);

  const messageContext = useContext(MessageContext);

  return (
    <div id="verify-payroll">
      <p className="verify-last-payroll-title">Verify Last Payroll</p>
      <>
        <Uploader
          inputChangeHandler={async (files: any) => {
            for (let i = 0; i < files.length; i++) {
              if (files[i].size > 10_000_000) {
                messageContext.addMessage({
                  level: 'error',
                  message: 'File Size is limited to 10MB',
                });
                return;
              }
            }
            await uploadTheFiles(files);
          }}
          instructionsText="Upload Payroll Statement"
          uploadedFiles={uploadedFiles}
          getLatestUploadedFiles={async () => {
            await getNewUploadedFiles();
          }}
          deleteFile={(fileName) => {
            getClient().then((client) => {
              if (client) {
                deleteFile(fileName, client).then((res) => {
                  getNewUploadedFiles().then((res: any) => {});
                });
              }
            });
          }}
        />
      </>
    </div>
  );
};
