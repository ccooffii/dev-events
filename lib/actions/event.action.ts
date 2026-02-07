'use server';

import Event from '@/database/event.model';
import { connectToDatabase } from "@/lib/mongodb";

export const getEventBySlug = async (slug: string) => {
    try {
        await connectToDatabase();
        return await Event.findOne({ slug }).lean();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch event');
    }
}

export const getAllEvents = async () => {
    try {
        await connectToDatabase();
        return await Event.find().sort({ createdAt: -1 }).lean();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch events');
    }
}

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectToDatabase();
        const event = await Event.findOne({ slug });

        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean();
    } catch {
        return [];
    }
}