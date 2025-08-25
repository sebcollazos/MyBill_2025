import graphene
import graphql_jwt

import apps.links.schema as links
import apps.links.schema_relay as link_relay
import apps.users.schema as users


class Query(
          users.Query,
          links.Query,
          link_relay.RelayQuery,
          graphene.ObjectType
      ):
    pass


class Mutation(
          users.Mutation,
          links.Mutation,
          link_relay.RelayMutation,
          graphene.ObjectType
      ):
    """
    Example:
        mutation {
          tokenAuth (username: "myuser", password: "MyP4s$w0rd"){
            token
          }
        }

        mutation {
          verifyToken (token: "eyJ0eXAiOiJKV1QiLCJ....") {
            payload
          }
        }
    """
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(
            query=Query,
            mutation=Mutation,
         )
