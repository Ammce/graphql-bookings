import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import { buildSchema } from 'graphql'
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import Event from './models/event';
import User from './models/user';

var app = express();

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
            creator: User!
        }

        type User {
            _id: ID!,
            email: String!,
            password: String,

        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!,
            creator: String!,
        }

        input UserInput {
            email: String!,
            password: String!,
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(data: EventInput!): Event!,
            createUser(data: UserInput): User!,
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
                let findCreator = await User.findOneAndUpdate({ _id: "5c9ab6d210ace82f6378b4c9" }, { $push: { createdEvents: eventSaved } }, { safe: true, upsert: true });
                if (findCreator) {
                    findCreator.createdEvents.push(eventSaved);
                }
                return eventSaved;
            } catch (e) {
                console.log(e);
                throw new Error(e);
            }
        },
        async createUser(args) {
            let { email, password } = args.data;
            try {
                let findUser = await User.findOne({ email: email });
                if (findUser) {
                    throw new Error("Email is already taken");
                }
                let hashedPassword = await bcrypt.hash(password, 12);
                let user = new User({
                    email,
                    password: hashedPassword
                });
                let savedUser = await user.save();
                savedUser.password = null;
                return savedUser;
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