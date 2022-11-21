import { MouseEventHandler } from 'react';

interface Props {
  // child: JSX.Element;
  child: any;
  width?: string;
  height?: string;
  padding?: string;
  backDropOpacity?: string;
  backgroundColor?: string;
  visible: boolean;
  onClose: MouseEventHandler<HTMLDivElement>;
  innerDivClassname?: string;
  notCloseOutsideClick?: boolean;
}

const Modal = ({
  child,
  height,
  width,
  padding,
  backDropOpacity,
  backgroundColor,
  visible,
  onClose,
  innerDivClassname,
  notCloseOutsideClick,
}: Props) => {
  const handleOnClose = (e: any) => {
    if (e.target?.id === 'modal' && !notCloseOutsideClick) onClose(e);
  };

  if (!visible) return null;
  return (
    <div
      id="modal"
      onClick={handleOnClose}
      className={`fixed inset-0 bg-black backdrop-blur-sm flex justify-center items-center ${
        backDropOpacity ?? 'bg-opacity-5'
      }`}
    >
      <div
        className={`${innerDivClassname} ${
          backgroundColor ? backgroundColor : 'bg-white'
        } rounded`}
        style={{
          height: height,
          width: width,
          padding: padding,
        }}
      >
        {child}
      </div>
    </div>
  );
};

export default Modal;
