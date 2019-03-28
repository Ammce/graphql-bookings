import bcrypt from 'bcrypt';

// Default imports of Mongo Schemas
import Event from '../models/event';
import User from '../models/user';
import Booking from '../models/booking';

let customUserId = "5c9ab6d210ace82f6378b4c9";

const user = async userId => {
    let creator = await User.findById(userId)
    return {
        ...creator._doc,
        createdEvents: events
    }
}

const events = async eventIds => {
    let createdEvents = await Event.find({ _id: { $in: eventIds } })
    return createdEvents.map(event => {
        return {
            ...event._doc,
            creator: user
        }
    })
}

const singleEvent = async eventId => {
    let createdEvent = await Event.findById(eventId);
    return {
        ...createdEvent._doc,
        creator: user.bind(this, createdEvent.creator)
    }
}

export default {
    async events() {
        try {
            let allEvents = await Event.find();
            return allEvents.map(event => {
                return {
                    ...event._doc,
                    creator: user.bind(this, event.creator)
                }
            })
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
    async bookings() {
        try {
            return await Booking.find();
        } catch (error) {
            throw new Error(error);
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
            let findCreator = await User.findOneAndUpdate({ _id: customUserId }, { $push: { createdEvents: eventSaved } }, { safe: true, upsert: true });
            // if (findCreator) {
            //     findCreator.createdEvents.push(eventSaved);
            // }
            return {
                ...eventSaved._doc,
                creator: user.bind(this, findCreator._id)
            };
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
    },
    async createBooking({ eventId }) {
        try {
            let newBooking = new Booking({
                event: eventId,
                user: customUserId
            });
            let savedBooking = await newBooking.save();
            return {
                ...savedBooking._doc,
                createdAt: new Date(savedBooking._doc.createdAt).toISOString(),
                updatedAt: new Date(savedBooking._doc.updatedAt).toISOString(),
                user: user.bind(this, savedBooking.user),
                event: singleEvent.bind(this, eventId),
            }
        } catch (error) {
            throw new Error(error);
        }
    },
    async cancelBooking({ bookingId }) {
        try {
            let deletedBooking = await Booking.findById(bookingId);
            const eventId = deletedBooking._doc.event;
            let result = await Booking.deleteOne({ _id: bookingId });
            let deletedEvent = await Event.findById(eventId);
            return {
                ...deletedEvent._doc,
                creator: user.bind(this, customUserId)
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}