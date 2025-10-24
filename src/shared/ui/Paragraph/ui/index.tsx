import type { ReactNode } from 'react';
import React from 'react';
import './paragraph.scss';

interface ParagraphPropsI {
  children: string | ReactNode;
  level: 1 | 2 | 3 | 4 | 5;
  mode?: 'default' | 'link' | 'error';
  className?: string;
}

/*
  children - Текст который автоматически будет нужного размера либо компонент вручную;
  level: Размер текст от большего к меньшему;
  mode?: Передаем в случае нестандартного текста, например link;
  className?: Переопределение стилей;
*/

export const Paragraph: React.FC<ParagraphPropsI> = ({ ...props }) => {
  const { level, children, mode = 'default', className = '' } = props;

  return (
    <p
      className={`paragraph paragraph_level-${level} ${className} ${mode ? `paragraph_${mode}` : ''}`}
    >
      {children}
    </p>
  );
};
