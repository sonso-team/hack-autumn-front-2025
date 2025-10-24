import React from 'react';
import type { ModalConfigI } from '@/shared/types/modal';
import { useModal } from '@/shared/lib/hooks/useModal';
import './modal.scss';
import { icons } from '@/shared/lib/icons';
import { Heading } from '@/shared/ui/Heading';
import { Button } from '@/shared/ui/Button';
import { Paragraph } from '@/shared/ui/Paragraph';

type ModalPropsI = ModalConfigI;

export const Modal = React.forwardRef<HTMLDialogElement, ModalPropsI>(
  (props, ref) => {
    const { hideModal } = useModal();
    const {
      body,
      title,
      icon,
      isPopup = true,
      primaryText = 'Продолжить',
      secondaryText = 'Закрыть',
      overrideContent,
      primaryHandler = hideModal,
      secondaryHandler = hideModal,
    } = props;

    return (
      <dialog
        className="modal"
        ref={ref}
      >
        <div className="modal__content">
          {overrideContent ? (
            React.cloneElement(overrideContent, { closeHandler: hideModal })
          ) : (
            <>
              {icon && (
                <img
                  className="modal__icon"
                  src={icons[icon]}
                  alt={icon}
                />
              )}
              <Heading level={2}>{title}</Heading>
              {body && typeof body === 'string' ? (
                <Paragraph level={2}>{body}</Paragraph>
              ) : (
                body
              )}
              <div className="modal__buttons">
                <Button
                  onClick={primaryHandler}
                  custom
                >
                  {primaryText}
                </Button>
                {!isPopup && (
                  <Button
                    onClick={secondaryHandler}
                    style="secondary"
                    custom
                  >
                    {secondaryText}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </dialog>
    );
  },
);
