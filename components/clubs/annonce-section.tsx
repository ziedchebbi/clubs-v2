"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnnonceCard from "../ui/annonce-card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import LoadingSpinner from "../ui/loading-spinner";
import ErrorMessage from "../ui/error-message";

type Annonce = {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string | null; image: string | null };
  _count: { commentaires: number };
};

type AnnonceSectionProps = {
  clubId: string;
  userRole: 'PRESIDENT' | 'MEMBER' | null;
};

export default function AnnonceSection({ clubId, userRole }: AnnonceSectionProps) {
  const router = useRouter();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAnnonceContent, setNewAnnonceContent] = useState("");

  useEffect(() => {
    const fetchAnnonces = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/clubs/${clubId}/annonces`);
      if (res.ok) {
        const { data } = await res.json();
        setAnnonces(data);
      } else {
        setError("Failed to load announcements. You must be a member to view them.");
      }
      setIsLoading(false);
    };
    fetchAnnonces();
  }, [clubId]);

  const handlePostAnnonce = async () => {
    if (!newAnnonceContent.trim()) return;
    const res = await fetch(`/api/clubs/${clubId}/annonces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newAnnonceContent }),
    });
    if (res.ok) {
      setNewAnnonceContent("");
      router.refresh(); // Re-fetches data on the server
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {userRole === 'PRESIDENT' && (
        <div className="space-y-2">
          <Textarea
            placeholder="Post a new announcement..."
            value={newAnnonceContent}
            onChange={(e) => setNewAnnonceContent(e.target.value)}
          />
          <Button onClick={handlePostAnnonce}>Post Annonce</Button>
        </div>
      )}
      {annonces.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        annonces.map((annonce) => (
          <AnnonceCard
            key={annonce.id}
            id={annonce.id}
            content={annonce.content}
            createdAt={annonce.createdAt}
            author={annonce.author}
            commentCount={annonce._count.commentaires}
          />
        ))
      )}
    </div>
  );
}
