export default function buildTree(users, rootId) {
  const userMap = {};

  // Step 1: Initialize each user with empty children
  users.forEach((user) => {
    userMap[user.user_id] = { ...user, children: [] };
  });

  let tree = userMap[rootId] || { user_id: rootId, children: [] };

  // Step 2: Build the tree
  users.forEach((user) => {
    if (user.referral_id && userMap[user.referral_id]) {
      userMap[user.referral_id].children.push(userMap[user.user_id]);
    }
  });

  return tree;
}
