export const TITLE_MIN = 1;
export const TITLE_MAX = 200;
export const BODY_MIN = 1;
export const BODY_MAX = 10000;

export function validatePostInput(input: { title: string; body: string }) {
  const title = input.title.trim();
  const body = input.body.trim();
  const errors: string[] = [];

  if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
    errors.push(`Title must be between ${TITLE_MIN} and ${TITLE_MAX} characters.`);
  }

  if (body.length < BODY_MIN || body.length > BODY_MAX) {
    errors.push(`Body must be between ${BODY_MIN} and ${BODY_MAX} characters.`);
  }

  return {
    title,
    body,
    errors,
  };
}
