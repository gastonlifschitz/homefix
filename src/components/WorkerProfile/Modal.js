import './modal.css';
import React, { useState } from 'react';

const Modal = ({ show, children }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return <div className={showHideClassName}>{children}</div>;
};

export default Modal;
