import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    const profiles = await this.db.profiles.findMany();
    return profiles
  })

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await this.db.profiles.findOne({
        key: 'id',
        equals: request.params.id
      });

      if (!profile) {
        throw this.httpErrors.notFound()
      }

      return profile
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const memberType = await this.db.memberTypes.findOne({
        key: "id",
        equals: request.body.memberTypeId,
      });

      if (memberType === null) {
        throw this.httpErrors.badRequest("Member type not found");
      }

      const userAlreadyHasAProfile = await this.db.profiles.findOne({
        key: "userId",
        equals: request.body.userId,
      });

      if (userAlreadyHasAProfile) {
        throw this.httpErrors.badRequest("User already has a profile");
      }

      const newProfile = await this.db.profiles.create(request.body);
      return newProfile
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await this.db.profiles.findOne({
        key: 'id',
        equals: request.params.id
      });

      if (!profile) {
        throw this.httpErrors.badRequest('Profile not found')
      }

      const deletedProfile = await this.db.profiles.delete(request.params.id);
      return deletedProfile;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const patchedProfile = await this.db.profiles.change(
          request.params.id,
          request.body
        );
        return patchedProfile;
      } catch (e: any) {
        throw this.httpErrors.badRequest(e);
      }
    }
  );
};

export default plugin;
