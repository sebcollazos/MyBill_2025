from django.contrib.auth import get_user_model

import graphene
from graphene_django import DjangoObjectType


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class Query(graphene.ObjectType):
    me = graphene.Field(UserType)
    users = graphene.List(UserType)

    def resolve_users(self, info):
        """
        Example:
            query {
              users {
                id
                username
                email
              }
            }
        """
        return get_user_model().objects.all()

    def resolve_me(self, info):
        """
        Just works with Authorization header, obtained after login
        Example:
            query {
                me {
                    id
                    username
                    email
                }
            }
        """
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        return user


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, password, email):
        """
        Example:
            mutation {
                createUser(
                    username: "myusername",
                    password: "MyP4s$w0rd",
                    email: "info@info.com"
                ) {
                  user {
                    id
                    username
                    password
                    email
                  }
                }
            }
        """
        user = get_user_model()(
            username=username,
            email=email,
        )
        user.set_password(password)
        user.save()

        return CreateUser(user=user)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
