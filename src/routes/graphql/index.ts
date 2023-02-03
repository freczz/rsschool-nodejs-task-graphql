import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema } from 'graphql';
import { createLoaders } from './dataloader';
import { graphqlBodySchema } from './schema';
import { querySchemaPart } from './schema-parts';
import { ERROR_MESSAGES } from '../../constants/';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const { query, variables } = request.body;

      if (!query) {
        throw fastify.httpErrors.badRequest(ERROR_MESSAGES.queryRequired);
      }

      const schema = new GraphQLSchema({
        query: querySchemaPart
      });

      return graphql({
        schema: schema,
        source: query!,
        variableValues: variables,
        contextValue: {
          db: fastify.db,
          loaders: createLoaders(fastify.db)
        },
      });
    }
  );
};

export default plugin;
