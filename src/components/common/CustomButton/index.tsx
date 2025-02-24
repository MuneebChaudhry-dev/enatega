'use client';

import React from 'react';
import { Button, ButtonProps } from 'primereact/button';

type CustomButtonProps = ButtonProps & {
  variant?: 'filled' | 'inverted';
};

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'filled',
  className = '',
  children,
  ...rest
}) => {
  const baseClasses =
    'rounded-full px-4 py-2 text-sm text-black font-medium transition-colors duration-200 flex items-center gap-2';
  const filledClasses = 'bg-green-500 hover:bg-green-600';
  const invertedClasses =
    'bg-white border border-black hover:bg-black hover:text-white';
  const variantClasses = variant === 'filled' ? filledClasses : invertedClasses;

  return (
    <Button
      {...rest}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
