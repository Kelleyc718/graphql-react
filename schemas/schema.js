import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from "graphql";

import axios from "axios";

const url = "http://localhost:3000";

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`${url}/companies/${parentValue.id}/users`)
          .then(res => {
            return res.data;
          })
          .catch(console.error);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`${url}/companies/${parentValue.companyId}`)
          .then(res => {
            return res.data;
          });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`${url}/users/${args.id}`)
          .then(res => {
            return res.data;
          })
          .catch(error => console.log(error));
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`${url}/companies/${args.id}`)
          .then(res => {
            return res.data;
          })
          .catch(error => console.log(error));
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age, companyId }) {
        return axios
          .post(`${url}/users`, { firstName, age })
          .then(res => {
            return res.data;
          })
          .catch(error => console.error);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios.delete(`${url}/users/${id}`).then(res => {
          return res.data;
        });
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
        resolve(parentValue, {id, firstName, age, companyId}) {
        return axios.patch(`${url}/users/${id}`, {id, firstName, age, companyId})
            .then(res => res.data)
            .catch(errors => console.error(errors))
        }
    }
  }
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation
});
