export function randomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

export function randomName(length: number): string {
  const name = randomString(length);
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function generateFullName() {
  return {
    firstName: randomName(6),
    middleName: randomName(5),
    lastName: randomName(6),
  };
}