import React from 'react';

// Dummy data for the arc - you can move this to a separate data file if needed
const ARC_EVENTS = [
    {
        id: 1,
        date: "Today, 10:00 AM",
        title: "RBI Announces Repo Rate Decision",
        description: "The Monetary Policy Committee unanimously decided to keep the repo rate unchanged at 6.5%.",
        isHighlight: true,
    },
    {
        id: 2,
        date: "Yesterday, 4:30 PM",
        title: "Inflation Data Released",
        description: "Core inflation showed signs of cooling, dropping to 4.2% year-on-year, creating room for the RBI's pause.",
        isHighlight: false,
    },
    {
        id: 3,
        date: "2 Days Ago",
        title: "Market Anticipation Peaks",
        description: "Bond markets rallied as investors priced in a highly probable rate pause by the central bank.",
        isHighlight: false,
    }
];

const StoryArc = () => {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2 border-gray-100">
                Story Arc: RBI Policy
            </h2>

            <div className="relative border-l-2 border-gray-200 ml-3 md:ml-4 space-y-8">
                {ARC_EVENTS.map((event, index) => (
                    <div key={event.id} className="relative pl-6 md:pl-8">
                        {/* Timeline Dot */}
                        <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ring-4 ring-white ${event.isHighlight ? 'bg-red-500' : 'bg-gray-300'
                            }`} />

                        {/* Content */}
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-1">
                                {event.date}
                            </span>
                            <h3 className={`text-lg font-bold mb-1 ${event.isHighlight ? 'text-gray-900' : 'text-gray-700'}`}>
                                {event.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {event.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoryArc;