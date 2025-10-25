import successSVG from '@/shared/assets/icons/success.svg';
import errorSVG from '@/shared/assets/icons/error.svg';
import logoSVG from '@/shared/assets/icons/logo.svg';
import notFoundSVG from '@/shared/assets/icons/notFound.svg';
import wipSVG from '@/shared/assets/icons/wip.svg';

export const icons = {
  success: successSVG,
  error: errorSVG,
  logo: logoSVG,
  notFound: notFoundSVG,
  wip: wipSVG,
};

export type iconType = keyof typeof icons;
