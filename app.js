import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import mongoose from 'mongoose';

import {database} from './config';
import graphqlSchema from './schema/index';
import graphqlResolvers from './resolvers/index';
import isAuth from './middlewares/is-auth';

var app = express();



// Using Middlewares
app.use(bodyParser.json());


app.use(isAuth);

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
}))

//Connect db to the application

mongoose.connect(`mongodb://localhost:27017/${database}`, { useNewUrlParser: true })
    .then(() => {
        app.listen(3333, () => {
            console.log("Server is up and running");
        })
    }).catch(err => {
        console.log(err);
    })