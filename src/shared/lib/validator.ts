const emailRegexp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const cyrillicRegexp = /^[-а-яА-ЯёЁ\s]+$/;

const phoneRegexp = /^7\d{10}$/;

export type Validation = {
  name: string;
  params?: object;
  message: string;
};

export const isInvalidPhoneNumber = (value: string): boolean => {
  const digits = value.replace(/\D/g, '');

  // Преобразуем 8 в 7 для единообразия
  const normalized = digits.replace(/^8/, '7');

  // Проверяем, что начинается с 7 и всего 11 цифр
  return !phoneRegexp.test(normalized);
};

const isEmpty = (value: unknown): boolean => {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  );
};

const isInRange = (
  value: number,
  params: { min: number; max: number },
): boolean => {
  const { min, max } = params;
  return Number(value) < min || Number(value) > max;
};

const isEmail = (value: string): boolean => {
  return !(typeof value === 'string' && emailRegexp.test(value.toLowerCase()));
};

const isEqualTo = (
  value: unknown,
  params: { compareValue: unknown },
): boolean => {
  return value === params.compareValue;
};

const isCyrillic = (value: string, _params = {}): boolean => {
  return typeof value === 'string' && cyrillicRegexp.test(value);
};

export const Validator = {
  isEmpty,
  isInRange,
  isEmail,
  isEqualTo,
  isCyrillic,
  isInvalidPhoneNumber,
};
