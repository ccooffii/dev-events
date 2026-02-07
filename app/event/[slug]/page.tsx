import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.action";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const EventDetailItem = ({ icon, alt, label } : { icon: string; alt: string; label: string }) => {
  return (
    <div>
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label} </p>
    </div>
  )
}

const EventAgenda = ({ agendaItems } : { agendaItems: string[] }) => {
  return (
    <div>
      <h2>Agenda</h2>
      <ul>
        {agendaItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

const EventTags = ({ tags } : { tags: string[] }) => {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag, index) => (
        <div key={index} className="pill">
          {tag}
        </div>
      ))}
    </div>
  )
}

const EventDetailsPage = async ({ params } : {params: Promise<{slug: string}>}) => {
  
  const { slug } = await params;
  
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  
  const { event: { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } } = await request.json();

  if(!description) return notFound();

  const bookings : number = 0;
  
  const similarEvents : IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>

      <div className="details">
        <div className="content">
          <Image src={image} alt="Event Banner" width={800} height={800} className="banner" />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem icon="/calendar.svg" alt="Date" label={date} />
            <EventDetailItem icon="/clock.svg" alt="Time" label={time} />
            <EventDetailItem icon="/pin.svg" alt="Location" label={location} />
            <EventDetailItem icon="/mode.svg" alt="Mode" label={mode} />
            <EventDetailItem icon="/audience.svg" alt="Audience" label={audience} />
          </section>

          <EventAgenda agendaItems={JSON.parse(agenda[0])} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={JSON.parse(tags[0])} />

        </div>

          <aside className="booking">
            <div className="signup-card">
              <h2>Book Your Spot</h2>
              {
                bookings > 0 ? (
                  <p>
                    Join {bookings} people who have booked for this event. Don&apos;t miss out on an amazing experience!
                  </p>
                ) : (
                  <p>
                    Be the first to book for this event and secure your spot! Don&apos;t miss out on an amazing experience!
                  </p>
                )
              }
              <BookEvent />
            </div>
          </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events You Might Like</h2>
        <div className="events">
          {
            similarEvents.length > 0 ? similarEvents.map((event : IEvent, index: number) => (
                <EventCard key={index} {...event} />
            )) : (
              <p>No similar events found.</p>
            )
          }
        </div>
      </div>
    </section>   
  )
}

export default EventDetailsPage