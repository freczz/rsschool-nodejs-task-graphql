import { GraphQLString, GraphQLInt, GraphQLObjectType } from "graphql";

export const GraphQLMemberType = new GraphQLObjectType({
  name: 'memberTypes',
  fields: () => ({
    id: { type: GraphQLString },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  })
});
