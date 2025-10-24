import type { ReactElement } from 'react';

export interface ButtonPropsI {
  disabled?: boolean;
  className?: string;
  onClick: (event: unknown) => void;
  custom?: boolean;
  color?: 'default' | 'red' | 'green';
  style?: 'primary' | 'secondary';
  children: ReactElement | string;
}
/*

  disabled?: Ставит кнопку в disabled состояние если передан;
  className?: Переопределение стилей;
  onClick: Коллбэк на нажатие кнопки;
  custom?: Если передан - то займет весь контейнер;
  style?: primary - яркая кнопка, главная. secondary - тусклая, второстепенная;
  children: Строка автоматически приводимая к нужным стилям, либо вручную компонент;

 */
