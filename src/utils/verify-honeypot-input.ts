import { asyncDelay } from './async-delay';

export async function verifyHoneypotInput(
  formData: FormData,
  delay: number = 3000,
) {
  await asyncDelay(delay);

  const niceInputValue = formData.get('dateUpdatedAt');

  console.log(formData);

  const isBot =
    niceInputValue === null ||
    (typeof niceInputValue === 'string' && niceInputValue.trim() !== '');

  return isBot;
}
