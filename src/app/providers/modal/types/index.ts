import type { ReactNode, ReactElement } from 'react';
import type { iconType } from '../../../../shared/lib/icons';

export interface ModalProviderPropsI {
  children: ReactNode;
}

export interface OverrideContentPropsI {
  closeHandler?: () => void;
  [key: string]: unknown;
}

export interface ModalConfigI {
  icon?: iconType;
  title?: string;
  isPopup?: boolean;
  body?: ReactElement | string;
  primaryText?: string;
  secondaryText?: string;
  primaryHandler?: () => void;
  secondaryHandler?: () => void;
  closeOutside?: boolean;
  overrideContent?: ReactElement<OverrideContentPropsI>;
}

export interface ModalProviderContextI {
  showModal: (config: ModalConfigI) => void;
  hideModal: () => void;
}
