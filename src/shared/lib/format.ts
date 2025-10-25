export const maskPhoneNumber = (input: string): string => {
  const digits = input.replace(/\D/g, '').replace(/^8/, '7');

  if (digits.length === 0) {
    return '';
  }

  let result = '+7';

  if (digits.length > 1) {
    result += ' (' + digits.slice(1, 4);
    if (digits.length > 4) {
      result += ')';
    }
  }

  if (digits.length > 4) {
    result += ' ' + digits.slice(4, 7);
  }

  if (digits.length > 7) {
    result += '-' + digits.slice(7, 9);
  }

  if (digits.length > 9) {
    result += '-' + digits.slice(9, 11);
  }

  return result;
};

export const unmaskPhoneNumber = (masked: string): string => {
  const digits = masked.replace(/\D/g, '');
  return digits.startsWith('8') ? '7' + digits.slice(1) : digits;
};
