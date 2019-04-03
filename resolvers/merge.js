import User from '../models/user';
import Event from '../models/event';
import { dateToStringHelper } from '../helpers/date';

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
        return transformEvent(event);
    })
}


const singleEvent = async eventId => {
    let createdEvent = await Event.findById(eventId);
    return transformEvent(createdEvent);
}

const transformEvent = event => {
    return {
        ...event._doc,
        date: dateToStringHelper(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}

module.exports = {
    user,
    events,
    singleEvent,
    transformEvent
}