import React, { forwardRef } from 'react';
import './selector.scss';
import { Paragraph } from '../../Paragraph';
import type { SelectorProps, SelectorRef } from '../model';
import { useSelector } from '../api';
import { icons } from '@/shared/lib/icons';

export const Selector = forwardRef<SelectorRef, SelectorProps>(
  ({ label, options, onChange }, ref) => {
    const { setIsOpen, handleSelect, isOpen, selected, internalRef } =
      useSelector(ref, onChange);
    return (
      <div className="selector">
        <div
          className="selector__label"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Paragraph level={2}>{label}</Paragraph>
          <button
            className={`selector__button ${isOpen ? 'selector__button_open' : ''}`}
          >
            <img
              src={icons.success}
              alt="select"
            />
          </button>
        </div>
        {isOpen && (
          <ul className="selector__list">
            {options.map((option) => (
              <li
                key={option.key}
                className="selector__item"
                onClick={() => handleSelect(option)}
              >
                {option.value}
                {selected?.key === option.key && (
                  <img
                    src={icons.success}
                    alt="select"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
        <input
          type="hidden"
          ref={internalRef}
          value={selected?.key || ''}
        />
      </div>
    );
  },
);
