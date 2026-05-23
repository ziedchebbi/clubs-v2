"use client";

import { useState } from "react";
import { Inbox } from "lucide-react";
import AnnonceCard from "@/components/student/AnnonceCard";
import FeedEventCard from "@/components/student/FeedEventCard";

type AnnonceItem = {
  type: "annonce";
  createdAt: string;
  data: {
    id: string;
    content: string;
    createdAt: string;
    author: { name: string; image: string | null };
    club: { id: string; name: string };
    _count: { comments: number };
  };
};

type EventItem = {
  type: "event";
  createdAt: string;
  data: {
    id: string;
    title: string;
    content: string | null;
    startsAt: string | null;
    createdAt: string;
    organizer: { name: string; image: string | null };
    club: { id: string; name: string } | null;
  };
};

type FeedTabsProps = {
  items: (AnnonceItem | EventItem)[];
};

export default function FeedTabs({ items }: FeedTabsProps) {
  const [activeTab, setActiveTab] = useState<"all" | "event" | "annonce">(
    "all",
  );

  const eventCount = items.filter((i) => i.type === "event").length;
  const annonceCount = items.filter((i) => i.type === "annonce").length;

  const filtered =
    activeTab === "all" ? items : items.filter((i) => i.type === activeTab);

  const tabs = [
    { key: "all" as const, label: "All", count: items.length },
    { key: "event" as const, label: "Events", count: eventCount },
    { key: "annonce" as const, label: "Announcements", count: annonceCount },
  ];

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 relative z-10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={
                isActive
                  ? "px-4 py-2.5 text-sm font-semibold text-[#F5A623] border-b-2 border-[#F5A623] transition-colors"
                  : "px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              }
            >
              {tab.label}{" "}
              <span
                className={
                  isActive
                    ? "bg-[#FFF8EC] text-[#F5A623] text-xs rounded-full px-1.5 py-0.5 ml-1"
                    : "bg-gray-100 text-gray-500 text-xs rounded-full px-1.5 py-0.5 ml-1"
                }
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feed List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Inbox className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">Nothing here yet</p>
          <p className="text-gray-300 text-sm mt-1">
            Check back later or join more clubs
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) =>
            item.type === "annonce" ? (
              <AnnonceCard key={item.data.id} item={item.data} />
            ) : (
              <FeedEventCard key={item.data.id} item={item.data} />
            ),
          )}
        </div>
      )}
    </div>
  );
}
