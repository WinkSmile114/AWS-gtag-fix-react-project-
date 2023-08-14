import './index.css';

interface ModalProps {
  children: JSX.Element;
  closeModal: Function;
}

const Modal = (props: ModalProps) => {
  return (
    <div className="payro-modal">
      <div
        className="remove-alert"
        onClick={(e: any) => {
          e.stopPropagation();
          props.closeModal();
        }}
      >
        X
      </div>
      {props.children}
    </div>
  );
};

export default Modal;
