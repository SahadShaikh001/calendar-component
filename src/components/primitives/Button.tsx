// src/components/primitives/Button.tsx
import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...rest }) => {
  const base = 'px-3 py-1.5 rounded text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2';
  const styles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-300',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300',
    ghost: 'bg-transparent text-neutral-900 hover:bg-neutral-50 focus-visible:ring-neutral-200',
  }[variant];

  return (
    <button className={clsx(base, styles, className)} {...rest}>
      {children}
    </button>
  );
};
