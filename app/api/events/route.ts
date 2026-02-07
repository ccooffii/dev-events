import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/database";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
    try {

        await connectToDatabase();

        const formData = await req.formData();

        let event;

        try {

            event = Object.fromEntries(formData.entries());

        } catch (e) {

            return NextResponse.json({ message: 'Invalid form data' }, { status: 400 });
        }

        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ message: 'Image File is required' }, { status: 400 });
        }

        const tags = JSON.parse(formData.get('tags') as string);
        const agenda = JSON.parse(formData.get('agenda') as string);

        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'events' }, (error, result) => {
                if (error) {
                    reject(error);
                }
                    resolve(result);
                }).end(buffer);
        });
        event.image = (uploadResult as {secure_url: string}).secure_url;

        const createdEvent = await Event.create({...event, tags: tags, agenda: agenda});

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectToDatabase();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (error) {

        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });

    }
}