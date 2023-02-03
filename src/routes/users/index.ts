import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '@utils/DB/entities/DBUsers';
import { ERROR_MESSAGES } from '../../constants/';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    const users = await this.db.users.findMany();
    return users
  })
  

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await this.db.users.findOne({
        key: 'id',
        equals: request.params.id
      });

      if (!user) {
        throw this.httpErrors.notFound()
      }

      return user
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const newUser = await this.db.users.create(request.body);
        return newUser
      } catch (e: any) {
        throw this.httpErrors.badRequest(e);
      }
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const user = await this.db.users.findOne({
          key: 'id',
          equals: request.params.id
        });

        if (!user) {
          throw this.httpErrors.notFound()
        }

        const userPosts = await this.db.posts.findMany({
          key: "userId",
          equals: request.params.id,
        });

        await Promise.all(
          userPosts.map(async (post) => {
            await this.db.posts.delete(post.id);
          })
        );

        const userProfile = await this.db.profiles.findOne({
          key: "userId",
          equals: request.params.id,
        });

        if (userProfile !== null) {
          await this.db.profiles.delete(userProfile.id);
        }

        const userFollowers = await this.db.users.findMany({
          key: "subscribedToUserIds",
          inArray: request.params.id,
        });

        await Promise.all(
          userFollowers.map(async (follower) => {
            const followerIndex = follower.subscribedToUserIds.indexOf(
              request.params.id
            );
            follower.subscribedToUserIds.splice(followerIndex, 1);

            await this.db.users.change(follower.id, {
              subscribedToUserIds: follower.subscribedToUserIds,
            });
          })
        );

        const deletedUser = await this.db.users.delete(request.params.id);

        return deletedUser;
      } catch (e: any) {
        throw this.httpErrors.badRequest(e);
      }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const currentUser = await this.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });

      const userToSubscribe = await this.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });

      if (!currentUser || !userToSubscribe) {
        throw this.httpErrors.badRequest(ERROR_MESSAGES.userNotFound);
      }

      const alreadySubscribed = currentUser.subscribedToUserIds.includes(
        request.params.id
      );

      if (alreadySubscribed) {
        return currentUser;
      }

      const isSubscribeToHimself = request.body.userId === request.params.id;

      if (isSubscribeToHimself) {
        throw this.httpErrors.badRequest(ERROR_MESSAGES.subscribingToYourself);
      }

      try {
        const patchedUser = await this.db.users.change(request.body.userId, {
          subscribedToUserIds: [
            ...currentUser.subscribedToUserIds,
            request.params.id,
          ],
        });

        return patchedUser;
      } catch (error: any) {
        throw this.httpErrors.badRequest(error);
      }
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const currentUser = await this.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });
      const userToUnsubscribe = await this.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });

      if (!currentUser || !userToUnsubscribe) {
        throw this.httpErrors.badRequest(ERROR_MESSAGES.userNotFound);
      }

      const alreadySubscribed = currentUser.subscribedToUserIds.includes(
        request.params.id
      );

      if (!alreadySubscribed) {
        throw this.httpErrors.badRequest(ERROR_MESSAGES.notFollowingUser);
      }

      const isUnsubscribeToHimself = request.body.userId === request.params.id;

      if (isUnsubscribeToHimself) {
        throw this.httpErrors.badRequest(ERROR_MESSAGES.unsubscribingToYourself);
      }

      try {
        const subscribedUserIndex = currentUser.subscribedToUserIds.indexOf(
          request.params.id
        );

        currentUser.subscribedToUserIds.splice(subscribedUserIndex, 1);

        const patchedUser = await this.db.users.change(request.body.userId, {
          subscribedToUserIds: currentUser.subscribedToUserIds,
        });

        return patchedUser;
      } catch (e: any) {
        throw this.httpErrors.badRequest(e);
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const patchedUser = await this.db.users.change(
          request.params.id,
          request.body
        );
        return patchedUser;
      } catch (e: any) {
        throw this.httpErrors.badRequest(e);
      }
    }
  );
};

export default plugin;
