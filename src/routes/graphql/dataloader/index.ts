import * as DataLoader from 'dataloader';
import DB from '@utils/DB/DB';

export const createLoaders = (db: DB) => {
  return {
    users: new DataLoader((ids: any) => getUsers(db, ids)),
    profiles: new DataLoader((ids: any) => getProfiles(db, ids)),
    posts: new DataLoader((ids: any) => getPosts(db, ids)),
    memberTypes: new DataLoader((ids: any) => getMemberTypes(db, ids)),
    subscribedToUser: new DataLoader((ids: any) => getSubscribedToUser(db, ids)),
  };
};

const getUsers = async (db: DB, ids: string[]) => {
  const allUsers = await db.users.findMany();

  return ids.map((id) => allUsers.find((user) => user.id === id));
};

const getProfiles = async (db: DB, userIds: string[]) => {
  const allProfiles = await db.profiles.findMany();

  const profiles = userIds.map((id) =>
    allProfiles.find((profile) => profile.userId === id)
  );
  return profiles;
};

const getPosts = async (db: DB, userIds: string[]) => {
  const allPosts = await db.posts.findMany();

  const posts = userIds.map((id) =>
    allPosts.filter((post) => post.userId === id)
  );
  return posts;
};

const getMemberTypes = async (db: DB, userIds: string[]) => {
  const allMemberTypes = await db.memberTypes.findMany();

  const memberTypes = userIds.map((id) =>
    allMemberTypes.find((memberType) => memberType.id === id)
  );
  return memberTypes;
};

const getSubscribedToUser = async (db: DB, userIds: string[]) => {
  const allUsers = await db.users.findMany();

  const subscribedToUser = userIds.map((id) =>
    allUsers.filter((user) => user.subscribedToUserIds.includes(id))
  );
  return subscribedToUser;
};
