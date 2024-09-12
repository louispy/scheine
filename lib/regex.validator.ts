import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidRegexConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    try {
      new RegExp(value); // Try to create a RegExp with the provided string
      return true; // If it's valid, return true
    } catch (e) {
      return false; // If invalid, return false
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `The string ${args.value} is not a valid regular expression`; // Default error message
  }
}

export function IsValidRegex(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidRegexConstraint,
    });
  };
}
