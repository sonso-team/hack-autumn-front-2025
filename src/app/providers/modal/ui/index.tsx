import React, { useRef, useState } from 'react';
import type { ModalConfigI, ModalProviderPropsI } from '../types';
import { ModalContext } from '@/shared/lib/modalContext';
import { Modal } from '@/widgets/Modal';

const ModalProvider: React.FC<ModalProviderPropsI> = ({ children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [config, setConfig] = useState<ModalConfigI>({});

  const showModal = (config: ModalConfigI): void => {
    setConfig(config);
    dialogRef?.current.showModal();
  };

  const hideModal = (): void => {
    // Добавляем класс для анимации закрытия
    dialogRef.current.classList.add('closing');

    // Ждём окончания анимации
    setTimeout(() => {
      dialogRef.current?.close(); // Закрываем диалог
      dialogRef.current?.classList.remove('closing');
    }, 500); // соответствует длительности анимации
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        ref={dialogRef}
        {...config}
      />
    </ModalContext.Provider>
  );
};

export default ModalProvider;
