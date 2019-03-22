import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import { buildSchema } from 'graphql'
import mongoose from 'mongoose';

import Event from './models/event';

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
        async events() {
            try {
                let allEvents = Event.find();
                return allEvents;
            } catch (e) {
                console.log(e);
                throw new Error(e);
            }
        },
        async createEvent(args) {
            try {
                console.log(args.data.date)
                const event = new Event({
                    ...args.data,
                    date: new Date(args.data.date)
                });
                let eventSaved = await event.save();
                console.log(eventSaved)
                return eventSaved;
            } catch (e) {
                console.log(e);
                throw new Error(e);
            }


        }
    },
    graphiql: true,
}))

//Connect db to the application

mongoose.connect(`mongodb://localhost:27017/${process.env.MONGO_DB}`, { useNewUrlParser: true })
    .then(() => {
        app.listen(3000, () => {
            console.log("Server is up and running");
        })
    }).catch(err => {
        console.log(err);
    })