export const validateDate = (str: string): boolean => {
  const reg = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  return !!str.match(reg);
}

const escapeValid = /([A-Z])\w+/i;

export const escape_string = (str: string): string | null => {
  let res = str.match(escapeValid)
  return res ? res[0] : null;
}