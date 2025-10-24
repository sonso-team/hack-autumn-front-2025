import { useImperativeHandle, useRef, useState } from 'react';
import type { Option } from '../model';

export const useSelector = (ref, onChange: () => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const internalRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => {
    return {
      value: selected?.key || '',
    };
  }, [selected]);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
    setTimeout(() => onChange?.(), 0);
  };

  return {
    isOpen,
    setIsOpen,
    internalRef,
    handleSelect,
    selected,
  };
};
