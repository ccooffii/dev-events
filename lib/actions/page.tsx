import React from 'react';
import { getEventBySlug } from '@/lib/actions/event.action';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// 定义页面参数类型
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EventDetails({ params }: Props) {
  // 在 Next.js 15+ 中 params 是一个 Promise，需要 await
  const { slug } = await params;
  
  const event = await getEventBySlug(slug);

  if (!event) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 顶部图片 */}
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-10">
          <Image 
            src={event.image} 
            alt={event.title} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
             <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-black uppercase bg-[#5dfeca] rounded-full">
                {event.mode}
             </span>
             <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{event.title}</h1>
             <p className="text-xl text-gray-300 flex items-center gap-2">
                <span>📅 {event.date}</span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span>🕒 {event.time}</span>
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-[#5dfeca] mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed text-lg">{event.overview}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#5dfeca] mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed">{event.description}</p>
            </section>

            <section>
               <h2 className="text-2xl font-bold text-[#5dfeca] mb-4">Agenda</h2>
               <ul className="space-y-3">
                  {event.agenda.map((item: string, index: number) => (
                    <li key={index} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#5dfeca]/20 text-[#5dfeca] font-bold text-sm">{index + 1}</span>
                        <span className="text-gray-200">{item}</span>
                    </li>
                  ))}
               </ul>
            </section>
          </div>

          {/* 右侧侧边栏 */}
          <div className="space-y-6">
             <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="text-xl font-bold text-white">Event Details</h3>
                <div className="space-y-3 text-gray-400">
                   <div className="flex justify-between"><span>Organizer</span> <span className="text-white">{event.organizer}</span></div>
                   <div className="flex justify-between"><span>Venue</span> <span className="text-white">{event.venue}</span></div>
                   <div className="flex justify-between"><span>Location</span> <span className="text-white">{event.location}</span></div>
                   <div className="flex justify-between"><span>Audience</span> <span className="text-white">{event.audience}</span></div>
                </div>
                <button className="w-full py-3 mt-4 rounded-xl bg-[#5dfeca] text-black font-bold text-lg hover:bg-[#5dfeca]/90 transition-all shadow-[0_0_20px_rgba(93,254,202,0.3)]">
                   Book Now
                </button>
             </div>

             <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                   {event.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 text-sm rounded-full bg-white/10 text-gray-300 border border-white/5">
                         #{tag}
                      </span>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}