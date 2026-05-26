export function calculateAqiqahDate(birthDate) {
  const result = new Date(birthDate);
  result.setDate(result.getDate() + 7);
  return result;
}
