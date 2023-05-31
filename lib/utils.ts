export function getInitials(s: string, n: number): string {
  return n === 0 ? s.substring(0, 3) : s.split("@")[0].substring(0, 3);
}
