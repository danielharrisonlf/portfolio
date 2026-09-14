import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import styles from './button.module.css';

type Variant = 'outline' | 'primary' | 'quiet';

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  icon?: IconName;
  iconDir?: 'right' | 'up';
  /** Inverte as cores para uso sobre o canvas escuro do hero. */
  onCanvas?: boolean;
  className?: string;
};

type AnchorProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'> & {
    as?: 'a';
  };

type NativeButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
    as: 'button';
  };

export type ButtonProps = AnchorProps | NativeButtonProps;

export function Button({
  children,
  variant = 'outline',
  icon,
  iconDir = 'right',
  onCanvas = false,
  className,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    variant !== 'outline' ? styles[variant] : '',
    onCanvas ? styles.onCanvas : '',
    onCanvas && variant === 'primary' ? styles.onCanvasPrimary : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {children}
      {icon && <Icon name={icon} size={15} className={styles.icon} data-dir={iconDir} />}
    </>
  );

  if (rest.as === 'button') {
    const { as: _as, ...buttonProps } = rest;
    return (
      <button className={classes} {...buttonProps}>
        {content}
      </button>
    );
  }

  const { as: _as, ...anchorProps } = rest;
  return (
    <a className={classes} {...anchorProps}>
      {content}
    </a>
  );
}
