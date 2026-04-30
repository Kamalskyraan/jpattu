export default function generateReferralCode(name, userId) {
  const input = name + userId;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // Force 32-bit integer
  }

  const base36 = Math.abs(hash).toString(36).padEnd(10, "usw");
  return base36.slice(0, 8);
}
