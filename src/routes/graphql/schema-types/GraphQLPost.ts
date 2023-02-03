import { GraphQLObjectType, GraphQLString } from "graphql";

export const GraphQLPost = new GraphQLObjectType({
  name: 'posts',
  fields: () => ({
    id: { type: GraphQLString},
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});
