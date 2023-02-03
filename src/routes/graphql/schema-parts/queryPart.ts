import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import {
  GraphQLUser,
  GraphQLProfile,
  GraphQLPost,
  GraphQLMemberType,
  GraphQLUserWithMainData,
  GraphQLUserWithFollowingAndProfile,
  GraphQLUserWithFollowingAndPosts,
  GraphQLUserWithFollowingAndFollowers
} from '../schema-types';
import { ERROR_MESSAGES } from '../../../constants/';

export const querySchemaPart = new GraphQLObjectType({
  name: 'query',
  fields: () => ({
    allUsers: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (_obj, _args, context) => {
        const users = await context.db.users.findMany();
        return users;
      }
    },
    allProfiles: {
      type: new GraphQLList(GraphQLProfile),
      resolve: async (_obj, _args, context) => {
        const profiles = await context.db.profiles.findMany();
        return profiles;
      }
    },
    allPosts: {
      type: new GraphQLList(GraphQLPost),
      resolve: async (_obj, _args, context) => {
        const posts = await context.db.posts.findMany();
        return posts;
      }
    },
    allMemberTypes: {
      type: new GraphQLList(GraphQLMemberType),
      resolve: async (_obj, _args, context) => {
        const memberTypes = await context.db.memberTypes.findMany();
        return memberTypes;
      }
    },
    user: {
      type: GraphQLUser,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_obj, args, context) => {
        const user = await context.db.users.findOne({
          key: 'id',
          equals: args.id
        });

        if (!user) {
          throw context.httpErrors.notFound(ERROR_MESSAGES.userNotFound);
        }

        return user;
      }
    },
    profile: {
      type: GraphQLProfile,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_obj, args, context) => {
        const profile = await context.db.profiles.findOne({
          key: 'id',
          equals: args.id
        });

        if (!profile) {
          throw context.httpErrors.notFound(ERROR_MESSAGES.profileNotFound);
        }

        return profile;
      }
    },
    post: {
      type: GraphQLPost,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_obj, args, context) => {
        const post = await context.db.posts.findOne({
          key: 'id',
          equals: args.id
        });

        if (!post) {
          throw context.httpErrors.notFound(ERROR_MESSAGES.postNotFound);
        }

        return post;
      }
    },
    memberType: {
      type: GraphQLMemberType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_obj, args, context) => {
        const memberType = await context.db.memberTypes.findOne({
          key: 'id',
          equals: args.id
        });

        if (!memberType) {
          throw context.httpErrors.notFound(ERROR_MESSAGES.memberTypeNotFound);
        }

        return memberType;
      }
    },
    usersWithMainData: {
      type: new GraphQLList(GraphQLUserWithMainData),
      resolve: async (_obj, _args, context) => {
        const users = await context.db.users.findMany();
        return users;
      }
    },
    userWithMainData: {
      type: GraphQLUserWithMainData,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_obj, args, context) => {
        const user = await context.db.users.findOne({
          key: 'id',
          equals: args.id
        });

        if (!user) {
          throw context.httpErrors.notFound(ERROR_MESSAGES.userNotFound);
        }

        return user;
      }
    },
    usersWithFollowingAndProfile: {
      type: new GraphQLList(GraphQLUserWithFollowingAndProfile),
      resolve: async (_obj, _args, context) => {
        const users = await context.db.users.findMany();
        return users;
      }
    },
    userWithFollowingAndPosts: {
      type: GraphQLUserWithFollowingAndPosts,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_obj, args, context) => {
        const user = await context.db.users.findOne({
          key: 'id',
          equals: args.id
        });

        if (!user) {
          throw context.httpErrors.notFound(ERROR_MESSAGES.userNotFound);
        }

        return user;
      }
    },
    userWithFollowingAndFollowers: {
      type: new GraphQLList(GraphQLUserWithFollowingAndFollowers),
      resolve: async (_obj, _args, context) => {
        const users = await context.db.users.findMany();
        return users;
      }
    }
  })
});
