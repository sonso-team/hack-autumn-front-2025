import successSVG from '@/shared/assets/icons/success.svg';
import errorSVG from '@/shared/assets/icons/error.svg';

export const icons = { success: successSVG, error: errorSVG };

export type iconType = keyof typeof icons;
