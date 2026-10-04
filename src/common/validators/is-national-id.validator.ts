import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Validates an Iranian National ID (کد ملی) using the official checksum algorithm.
 */
export function isValidIranianNationalId(code: string | undefined | null): boolean {
  if (!code) return false;
  const clean = String(code).trim();

  // Must be exactly 10 numeric digits
  if (!/^\d{10}$/.test(clean)) {
    return false;
  }

  // Reject repeating digits like 0000000000, 1111111111, etc.
  if (/^(\d)\1{9}$/.test(clean)) {
    return false;
  }

  const check = parseInt(clean.charAt(9), 10);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i), 10) * (10 - i);
  }

  const remainder = sum % 11;
  return (
    (remainder < 2 && check === remainder) ||
    (remainder >= 2 && check === 11 - remainder)
  );
}

export function IsIranianNationalId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isIranianNationalId',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'کد ملی وارد شده نامعتبر است (Iranian national ID is invalid)',
        ...validationOptions,
      },
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (value === undefined || value === null || value === '') {
            return true; // Use @IsNotEmpty() or @IsOptional() for requiredness
          }
          return isValidIranianNationalId(value);
        },
      },
    });
  };
}
