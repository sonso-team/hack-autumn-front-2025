import successSVG from '@/shared/assets/icons/success.svg';
import errorSVG from '@/shared/assets/icons/error.svg';
import logoSVG from '@/shared/assets/icons/logo.svg';
import camSVG from '@/shared/assets/icons/cam.svg';
import camOnSVG from '@/shared/assets/icons/camOn.svg';
import microSVG from '@/shared/assets/icons/micro.svg';
import microOnSVG from '@/shared/assets/icons/micOn.svg';
import membersSVG from '@/shared/assets/icons/members.svg';
import chatSVG from '@/shared/assets/icons/chat.svg';
import phoneSVG from '@/shared/assets/icons/phone.svg';

export const icons = {
  success: successSVG,
  error: errorSVG,
  logo: logoSVG,
  cam: camSVG,
  camOn: camOnSVG,
  micro: microSVG,
  microOn: microOnSVG,
  chat: chatSVG,
  members: membersSVG,
  phone: phoneSVG,
};

export type iconType = keyof typeof icons;
