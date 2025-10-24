import React from 'react';
import './button.scss';
import { Heading } from '../../Heading';
import type { ButtonPropsI } from '../model';

export const Button: React.FC<ButtonPropsI> = ({ ...props }) => {
  const {
    style = 'primary',
    custom = false,
    className,
    disabled = false,
    onClick,
    color = 'default',
    children,
  } = props;

  return (
    <button
      className={`button button_${style} ${custom ? 'button_custom' : ''} button_${color} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {typeof children === 'string' ? (
        <Heading level={5}>{children}</Heading>
      ) : (
        children
      )}
    </button>
  );
};
