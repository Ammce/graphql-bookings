import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import mongoose from 'mongoose';

import { database } from './config';
import graphqlSchema from './schema/index';
import graphqlResolvers from './resolvers/index';
import isAuth from './middlewares/is-auth';

var app = express();



// Using Middlewares
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
}))

//Connect db to the application

mongoose.connect(`mongodb://localhost:27017/${database}`, { useNewUrlParser: true })
    .then(() => {
        app.listen(8000, () => {
            console.log("Server is up and running");
        })
    }).catch(err => {
        console.log(err);
    })