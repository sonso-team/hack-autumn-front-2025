import type React from 'react';
import { Button } from '@/shared/ui/Button';
import './button-grande.scss';

const ButtonGrande: React.FC<{
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  imgUrl: string;
  bottomText: string;
}> = ({ className, onClick, imgUrl, bottomText }) => {
  return (
    <Button
      className={`${className} buttGrande`}
      onClick={onClick}
    >
      <>
        <img src={imgUrl} />
        <h3>{bottomText}</h3>
      </>
    </Button>
  );
};

export default ButtonGrande;
