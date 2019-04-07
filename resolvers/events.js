import Event from '../models/event';
import User from '../models/user';
import { dateToStringHelper } from '../helpers/date';
import { transformEvent } from './merge';

export default {
    async events() {
        try {
            let allEvents = await Event.find();
            return allEvents.map(event => {
                return transformEvent(event);
            })
        } catch (e) {
            throw new Error(e);
        }
    },
    async createEvent(args, req) {
        if (!req.isAuth) {
            throw new Error("Not authenticated");
        }
        try {
            const event = new Event({
                ...args.data,
                date: dateToStringHelper(args.data.date),
                creator: req.userId
            });
            let eventSaved = await event.save();
            let findCreator = await User.findOneAndUpdate({ _id: req.userId }, { $push: { createdEvents: eventSaved } }, { safe: true, upsert: true });
            // if (findCreator) {
            //     findCreator.createdEvents.push(eventSaved);
            // }
            return transformEvent(eventSaved);
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
}