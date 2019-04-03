import authResolver from './auth';
import bookingsResolver from './bookings';
import eventsResolver from './events';

const rootResolver = {
    ...authResolver,
    ...bookingsResolver,
    ...eventsResolver
}

export default rootResolver;