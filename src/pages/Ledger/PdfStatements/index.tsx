import { useContext, useEffect, useState } from 'react';
import downloadIcon from '../../../common-icons/download-file-icon.svg';
import './index.scss';
import { getClient } from '../../../api-utils/general-utils';
import { MessageContext } from '../../../context';

interface PdfProps {
  repaymentUuid: string;
}
const PdfStatements = (props: PdfProps) => {
  //const [url, setUrl] = useState<string>();
  const [clientState, setClient] = useState<any>();
  const messageContext = useContext(MessageContext);

  useEffect(() => {
    const getData = async () => {
      const client = await getClient();
      if (!client) {
        return;
      }
      setClient(client);
    };
    getData();
  }, []);

  const onDownloadClick = async () => {
    const urlresult =
      await clientState.documentsControllerGetPdfStatement(
        props.repaymentUuid,
      );
    if (urlresult.data == '') {
      messageContext.addMessage({
        level: 'info',
        message:
          // eslint-disable-next-line max-len
          'We are unable to download your statement at this time. Please contact support with any questions 1-833-271-4499.',
      });
      // navigate to the URL if it exists
    } else {
      window.location.href = urlresult.data;
    }
  };

  return (
    <>
      <div>
        <a onClick={() => onDownloadClick()}>
          <img className="download-icon" src={downloadIcon} />
        </a>
      </div>
    </>
  );
};
export default PdfStatements;
