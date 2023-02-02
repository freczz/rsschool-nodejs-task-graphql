import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<MemberTypeEntity[]> {
    const memberType = await this.db.memberTypes.findMany();
    return memberType
  })

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const memberType = await this.db.memberTypes.findOne({
        key: 'id',
        equals: request.params.id
      });

      if (!memberType) {
        throw this.httpErrors.notFound()
      }

      return memberType
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      try {
        const patchedMemberType = await this.db.memberTypes.change(
          request.params.id,
          request.body
        );
        return patchedMemberType;
      } catch (e: any) {
        throw this.httpErrors.badRequest(e);
      }
    }
  );
};

export default plugin;
