import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

export const GraphQLProfile = new GraphQLObjectType({
  name: 'profiles',
  fields: () => ({
    id: { type: GraphQLString},
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    userId: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
  }),
});
