import React from 'react';
import { ToastOptions } from 'react-toastify';
import Waiting from './art/waiting';

interface ProfileUpdateToastProps {
  theme: string;
}

export const createProfileUpdateToastOptions = (
  props: ProfileUpdateToastProps
): ToastOptions => {
  const { theme } = props;

  const content = (
    <>
      <p className="text-lg">Your Profile has been updated!</p>
      <br />
      <br />
      <a href="/" className="toast-link text-boring-blue">
        See your updated profile
      </a>
      <Waiting />
    </>
  );

  return {
    position: 'top-center',
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: theme === 'light' ? 'light' : 'dark',
    render: () => content,
  };
};
