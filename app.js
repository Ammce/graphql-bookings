import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import { buildSchema } from 'graphql'
import mongoose from 'mongoose';

var app = express();

const events = [];

// Using Middlewares
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(data: EventInput!): Event!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events() {
            return events;
        },
        createEvent(args) {
            const event = {
                _id: Math.random().toString(),
                ...args.data
            }
            events.push(event);
            return event;
        }
    },
    graphiql: true,
}))

//Connect db to the application

mongoose.connect('mongodb://localhost:27017/graphql-events', { useNewUrlParser: true })
    .then(() => {
        app.listen(3000, () => {
            console.log("Server is up and running");
        })
    }).catch(err => {
        console.log(err);
    })