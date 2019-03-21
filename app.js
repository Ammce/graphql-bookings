import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import { buildSchema } from 'graphql'

var app = express();

// Using Middlewares
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String!): String!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events() {
            return ["Aaaaa", "Da ti dam", "Plamen od ljubavi"];
        },
        createEvent(args) {
            return args.name
        }
    },
    graphiql: true,
}))

app.get('/test', (req, res, next) => {
    console.log("IT WORKS")
    res.json({ works: "Hello" })
})

app.listen(3000, () => {
    console.log("Server is up and running");
})