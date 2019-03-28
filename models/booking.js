import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: "Event"
    }
}, {
        timestamps: true
    });

export default mongoose.model('Booking', bookingSchema);