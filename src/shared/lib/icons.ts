import successSVG from '@/shared/assets/icons/success.svg';
import errorSVG from '@/shared/assets/icons/error.svg';
import logoSVG from '@/shared/assets/icons/logo.svg';

export const icons = { success: successSVG, error: errorSVG, logo: logoSVG };

export type iconType = keyof typeof icons;
