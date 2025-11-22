import {
  hasAtLeast1LowercaseLetter,
  hasAtLeast1Number,
  hasAtLeast1UppercaseLetter,
  hasAtLeast8Characters,
} from '@/Screens/authentication/ResetPassword';

export function handleValidation(password: string, cpassword: string): string {
  if (!hasAtLeast8Characters.test(password))
    return 'Password must be at least 8 characters';
  else if (!hasAtLeast1UppercaseLetter.test(password))
    return 'Password must contain uppercase';
  else if (!hasAtLeast1LowercaseLetter.test(password))
    return 'Password must contain lowercase';
  else if (!hasAtLeast1Number.test(password))
    return 'Password must contain a number';
  else if (password !== cpassword) return 'Password does not match';
  else return '';
}
