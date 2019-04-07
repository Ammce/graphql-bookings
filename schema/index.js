import { buildSchema } from 'graphql'

export default buildSchema(`

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
            createdEvents: [Event!],
        }

        type Booking {
            _id: ID!,
            user: User!,
            event: Event!,
            createdAt: String!,
            updatedAt: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!,
            creator: String,
        }

        input UserInput {
            email: String!,
            password: String!,
        }

        type AuthData {
            token: String!,
            userId: ID!,
            tokenExpiration: Int!,
        }

        type RootQuery {
            events: [Event!]!,
            bookings: [Booking!]!,
            login(email: String, password: String!): AuthData!
        }

        type RootMutation {
            createEvent(data: EventInput!): Event!,
            createUser(data: UserInput): User!,
            createBooking(eventId: ID!): Booking!,
            cancelBooking(bookingId: ID!): Event!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)