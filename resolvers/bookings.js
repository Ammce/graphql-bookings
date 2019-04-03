
// Default imports of Mongo Schemas
import Event from '../models/event';
import Booking from '../models/booking';
import { dateToStringHelper } from '../helpers/date';
import { user, singleEvent } from './merge';

let customUserId = "5c9ab6d210ace82f6378b4c9";

const transformEvent = event => {
    return {
        ...event._doc,
        date: dateToStringHelper(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        createdAt: dateToStringHelper(booking._doc.createdAt),
        updatedAt: dateToStringHelper(booking._doc.updatedAt),
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
    }
}

export default {
    async bookings() {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch (error) {
            throw new Error(error);
        }
    },
    async createBooking({ eventId }) {
        try {
            let newBooking = new Booking({
                event: eventId,
                user: customUserId
            });
            let savedBooking = await newBooking.save();
            return transformBooking(savedBooking);
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
            return transformEvent(deletedEvent);
        } catch (error) {
            throw new Error(error);
        }
    }
}