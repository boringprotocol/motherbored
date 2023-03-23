// components/Toast.tsx

import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { ToastContainer } from 'react-toastify';

const contextClass = {
  success: "bg-base-100 text-base-content border border-base-300",
  error: "bg-base-100 text-base-content border border-base-200",
  info: "bg-base-100 text-base-content border border-base-300",
  warning: "bg-base-100 text-base-content border border-base-300",
  default: "bg-base-100 text-base-content border border-base-300",
  dark: "bg-base-100 text-base-content border border-base-300",
};

interface ToastProps {
  position?: string;
  autoClose?: number;
}

const CloseButton = ({ closeToast }: { closeToast: () => void }) => (
  <i
    className=""
    onClick={closeToast}
  >
    <IoCloseOutline />
  </i>
);

const Toast: React.FC<ToastProps> = ({ autoClose = 30000 }) => {
  return (
    <ToastContainer
      toastClassName={({ type }) =>
        (contextClass[type as TypeOptions] || contextClass.default) +
        "relative flex p-4  min-h-10 rounded-sm justify-between overflow-hidden cursor-pointer"
      }
      bodyClassName={() => "text-sm block p-4"}
      position='top-center'
      closeButton={CloseButton}
      autoClose={autoClose}
    />
  );
};

export default Toast;
