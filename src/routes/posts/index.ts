import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    const posts = await this.db.posts.findMany();
    return posts
  })

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await this.db.posts.findOne({
        key: 'id',
        equals: request.params.id
      });

      if (!post) {
        throw this.httpErrors.notFound()
      }

      return post
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const newPost = await this.db.posts.create(request.body);
        return newPost
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
    async function (request, reply): Promise<PostEntity> {
      try {
        const post = await this.db.posts.findOne({
          key: 'id',
          equals: request.params.id
        });

        if (!post) {
          throw this.httpErrors.notFound()
        }

        const deletedPost = await this.db.posts.delete(request.params.id);

        return deletedPost;
      } catch (e: any) {
        throw this.httpErrors.badRequest(e);
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const patchedPost = await this.db.posts.change(
          request.params.id,
          request.body
        );
        return patchedPost;
      } catch (e: any) {
        throw this.httpErrors.badRequest(e);
      }
    }
  );
};

export default plugin;
