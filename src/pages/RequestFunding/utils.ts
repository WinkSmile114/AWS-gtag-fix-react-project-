import {
  DefaultApi,
  DraftDeal,
} from '../../api-utils/generated-client';

export const uploadFiles = async (
  filesToUpload: any[],
  client: DefaultApi,
): Promise<string> => {
  console.log('statements', filesToUpload);
  for (let i = 0; i < filesToUpload.length; i++) {
    let singleFile = filesToUpload[i];

    try {
      const urlRes =
        await client.documentsControllerUploadStatementsUrl({
          fileName: singleFile.name,
          documentType: 'payroll-statement',
        });

      console.log('url', urlRes);
      // if (urlRes.status == 201) {
      const options = {
        method: 'PUT',
        body: singleFile,
        mode: 'cors',
      };
      await fetch(urlRes.data, options as RequestInit);

      return 'success';
    } catch {
      return 'fail';
    }
  }
  return '';
};

export const deleteFile = async (
  fileName: string,
  client: DefaultApi,
) => {
  client.documentsControllerDeleteStatement({
    fileName,
    documentType: 'payroll-statement',
  });
};

export const getFiles = async (
  client: DefaultApi,
): Promise<string[]> => {
  const statementsRes =
    await client.documentsControllerGetPayrollStatements();
  return statementsRes.data;
};

export const calculateTotalPayback = (
  originalFundingAmount: number,
  selectedNumberOfWeeks: number,
) => {
  const interest =
    selectedNumberOfWeeks * 0.015 * originalFundingAmount;
  const processingFee = 150;
  return originalFundingAmount + interest + processingFee;
};
