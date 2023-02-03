import { GraphQLList, GraphQLString, GraphQLObjectType } from "graphql";
import { GraphQLProfile, GraphQLPost, GraphQLMemberType } from "./";

export const GraphQLUser = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  })
});

export const GraphQLUserWithMainData = new GraphQLObjectType({
  name: 'userWithMainData',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    profile: {
      type: GraphQLProfile,
      resolve: async (user: any, _args: any, context: any) => {
        const profile = await context.loaders.profiles.load(user.id);
        return profile;
      },
    },
    posts: {
      type: new GraphQLList(GraphQLPost),
      resolve: async (user: any, _args: any, context: any) => {
        const posts = await context.loaders.posts.load(user.id);
        return posts;
      },
    },
    memberType: {
      type: GraphQLMemberType,
      resolve: async (user: any, _args: any, context: any) => {
        const profile = await context.loaders.profiles.load(user.id);

        let memberType = null;
        if (profile) {
          memberType = await context.loaders.memberTypes.load(
            profile.memberTypeId
          );
        }

        return memberType;
      },
    }
  })
});

export const GraphQLUserWithFollowingAndProfile = new GraphQLObjectType({
  name: 'userWithFollowingAndProfile',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    // subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    userSubscribedTo: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (user, _args, context) => {
        const subscriptions = await context.loaders.subscribedToUser.load(
          user.id
        );
        return subscriptions;
      },
    },
    profile: {
      type: GraphQLProfile,
      resolve: async (user: any, _args: any, context: any) => {
        const profile = await context.loaders.profiles.load(user.id);
        return profile;
      },
    },
  })
});

export const GraphQLUserWithFollowingAndPosts = new GraphQLObjectType({
  name: 'userWithFollowingAndPosts',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    // subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    subscribedToUser: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (user, _args, context) => {
        const subscribedToUser = await context.loaders.users.loadMany(
          user.subscribedToUserIds
        );
        return subscribedToUser;
      }
    },
    posts: {
      type: new GraphQLList(GraphQLPost),
      resolve: async (user: any, _args: any, context: any) => {
        const posts = await context.loaders.posts.load(user.id);
        return posts;
      },
    },
  })
});

export const GraphQLUserWithFollowingAndFollowers: any = new GraphQLObjectType({
  name: 'userWithFollowingAndFollowers',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    userSubscribedTo: {
      type: new GraphQLList(GraphQLUserWithFollowingAndFollowers),
      resolve: async (user, _args, context) => {
        const subscriptions = await context.loaders.subscribedToUser.load(
          user.id
        );
        return subscriptions;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(GraphQLUserWithFollowingAndFollowers),
      resolve: async (user, _args, context) => {
        const subscribedToUser = await context.loaders.users.loadMany(
          user.subscribedToUserIds
        );
        return subscribedToUser;
      }
    }
  })
});
