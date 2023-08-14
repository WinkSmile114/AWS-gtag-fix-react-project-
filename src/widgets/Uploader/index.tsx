import './index.css';
import UploaderIcon from '../../common-icons/upload.svg';
import React, {
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import TrashIcon from '../../common-icons/trash.svg';
import BmpIcon from './icons/bmp-icon.svg';
import CsvIcon from './icons/csv-icon.svg';
import JpgIcon from './icons/jpg-icon.svg';
import PdfIcon from './icons/pdf-icon.svg';
import PngIcon from './icons/png-icon.png';
import DefaultFileIcon from './icons/default-file-icon.svg';
import Loader from '../Loader';
import { useDropzone } from 'react-dropzone';
import { MessageContext } from '../../context';

interface UploaderProps {
  instructionsText: string;
  inputChangeHandler: (files: Array<any>) => any;
  uploadedFiles?: string[];
  deleteFile: (fileName: string) => any;
  getLatestUploadedFiles: Function;
}

export default (props: UploaderProps) => {
  const [showLoader, setShowLoader] = useState(false);
  const messageContext = useContext(MessageContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const onUploadInputChange = (e: any) => {
    const filesObject = e.target.files;
    if (!filesObject) {
      return;
    }

    const objLength = filesObject.length;
    let filesArray = [];
    if (objLength && objLength > 0) {
      for (let i = 0; i < objLength; i++) {
        filesArray.push(filesObject[i]);
      }
    }
    setShowLoader(true);

    props
      .inputChangeHandler(filesArray)
      .then(() => setShowLoader(false));
  };

  const deleteFile = async (uploadedFile: any) => {
    setShowLoader(true);
    props.deleteFile(uploadedFile);
    props.getLatestUploadedFiles();
    setTimeout(() => {
      // props.getLatestUploadedFiles().then(()=>setShowLoader(false))
      setShowLoader(false);
    }, 3000);
  };

  const onDrop = useCallback((acceptedFiles) => {
    onUploadInputChange({ target: { files: acceptedFiles } });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const uploadedFilesDisplay = !props.uploadedFiles
    ? ''
    : props.uploadedFiles.map((uploadedFile) => {
        let iconSource;
        let fileNameSections = uploadedFile.split('.');
        const fileExtension =
          fileNameSections[fileNameSections.length - 1].toLowerCase();
        switch (fileExtension) {
          case 'jpg':
            iconSource = JpgIcon;
            break;
          case 'jpeg':
            iconSource = JpgIcon;
            break;
          case 'bmp':
            iconSource = BmpIcon;
            break;
          case 'pdf':
            iconSource = PdfIcon;
            break;
          case 'csv':
            iconSource = CsvIcon;
            break;
          case 'png':
            iconSource = PngIcon;
            break;
          default:
            iconSource = DefaultFileIcon;
        }

        return (
          <div key={uploadedFile} className="uploaded-file">
            <div className="icon-and-filename">
              <img
                className="file-icon"
                src={iconSource}
                width={25}
                height={25}
              ></img>
              <span className="uploaded-file-name">
                {uploadedFile}{' '}
              </span>
            </div>
            <img
              className="trash-icon"
              src={TrashIcon}
              onClick={() => deleteFile(uploadedFile)}
              //onClick={() => props.deleteFile(uploadedFile)}
              width={23}
              height={33}
            ></img>
          </div>
        );
      });

  if (showLoader) {
    return <Loader />;
  }

  return (
    <div className="upload-wrapper" {...getRootProps()}>
      <div
        className="upload-container"
        onClick={() => {
          if (inputRef && inputRef.current) {
            inputRef.current.click();
          }
          messageContext.clearMessages();
        }}
      >
        <div id="icon-upload-wrapper">
          <img src={UploaderIcon} width="35" height="33" />
        </div>
        <label id="upload-label">
          <input
            {...getInputProps()}
            ref={inputRef}
            id="uploadInput"
            type="file"
            accept=".pdf"
            name="myFiles"
            onChange={(e) => {
              onUploadInputChange(e);
              //uploadFiles()
            }}
            multiple
          />
          {props.instructionsText}
        </label>
      </div>

      {uploadedFilesDisplay}
    </div>
  );
};
