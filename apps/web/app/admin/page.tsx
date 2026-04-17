"use client";

import { useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import { useRouter } from "next/navigation";
import { youtubeEmbedSrc } from "../../lib/youtube";

type Area = { x: number; y: number; width: number; height: number };
type Point = { x: number; y: number };

type Tab = "gallery" | "events" | "sermons" | "magazines" | "announcements";

type GalleryItem = { _id: string; title: string; imageUrl: string; order: number };
type EventItem = {
  _id: string;
  title: string;
  description: string;
  date: string;
  imageUrls: string[];
  imageUrl?: string;
  order: number;
};
type SermonItem = { _id: string; title: string; description: string; youtubeUrl: string; order: number };
type MagazineItem = {
  _id: string;
  title: string;
  description: string;
  month: string;
  thumbnailUrl: string;
  pdfUrl: string;
  order: number;
};
type AnnouncementItem = {
  _id: string;
  title: string;
  description: string;
  pinned: boolean;
  order: number;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6661";

const resolveImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
};

const tabBtn = (active: boolean) =>
  ({
    border: 0,
    textAlign: "left" as const,
    padding: "0.65rem 0.85rem",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
    background: active ? "var(--primary)" : "#f1f5f9",
    color: active ? "#ffffff" : "var(--text)"
  }) satisfies React.CSSProperties;

export default function AdminPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("gallery");

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [sermons, setSermons] = useState<SermonItem[]>([]);
  const [magazines, setMagazines] = useState<MagazineItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [magazineMonth, setMagazineMonth] = useState("");
  const [announcementPinned, setAnnouncementPinned] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [zoom, setZoom] = useState(1);

  const [galleryPage, setGalleryPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const [sermonsPage, setSermonsPage] = useState(1);
  const [magazinesPage, setMagazinesPage] = useState(1);
  const [announcementsPage, setAnnouncementsPage] = useState(1);
  const pageSize = 5;

  const previewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : ""), [imageFile]);
  const totalGalleryPages = Math.max(1, Math.ceil(gallery.length / pageSize));
  const totalEventsPages = Math.max(1, Math.ceil(events.length / pageSize));
  const totalSermonsPages = Math.max(1, Math.ceil(sermons.length / pageSize));
  const totalMagazinesPages = Math.max(1, Math.ceil(magazines.length / pageSize));
  const totalAnnouncementsPages = Math.max(1, Math.ceil(announcements.length / pageSize));
  const pagedGallery = gallery.slice((galleryPage - 1) * pageSize, galleryPage * pageSize);
  const pagedEvents = events.slice((eventsPage - 1) * pageSize, eventsPage * pageSize);
  const pagedSermons = sermons.slice((sermonsPage - 1) * pageSize, sermonsPage * pageSize);
  const pagedMagazines = magazines.slice((magazinesPage - 1) * pageSize, magazinesPage * pageSize);
  const pagedAnnouncements = announcements.slice(
    (announcementsPage - 1) * pageSize,
    announcementsPage * pageSize
  );

  const showImageTools = activeTab === "gallery" || activeTab === "events" || activeTab === "magazines";

  useEffect(() => {
    const localToken = localStorage.getItem("admin_token");
    if (!localToken) {
      router.replace("/admin/login");
      return;
    }
    setToken(localToken);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (galleryPage > totalGalleryPages) setGalleryPage(totalGalleryPages);
  }, [galleryPage, totalGalleryPages]);

  useEffect(() => {
    if (eventsPage > totalEventsPages) setEventsPage(totalEventsPages);
  }, [eventsPage, totalEventsPages]);

  useEffect(() => {
    if (sermonsPage > totalSermonsPages) setSermonsPage(totalSermonsPages);
  }, [sermonsPage, totalSermonsPages]);

  useEffect(() => {
    if (magazinesPage > totalMagazinesPages) setMagazinesPage(totalMagazinesPages);
  }, [magazinesPage, totalMagazinesPages]);

  useEffect(() => {
    if (announcementsPage > totalAnnouncementsPages) setAnnouncementsPage(totalAnnouncementsPages);
  }, [announcementsPage, totalAnnouncementsPages]);

  const authHeaders = (t = token) => ({
    Authorization: `Bearer ${t}`
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [galleryRes, eventRes, sermonRes, magRes, announcementRes] = await Promise.all([
        fetch(`${apiBase}/api/gallery`, { cache: "no-store" }),
        fetch(`${apiBase}/api/events`, { cache: "no-store" }),
        fetch(`${apiBase}/api/sermons`, { cache: "no-store" }),
        fetch(`${apiBase}/api/magazines`, { cache: "no-store" }),
        fetch(`${apiBase}/api/announcements`, { cache: "no-store" })
      ]);
      const [galleryData, eventData, sermonData, magData, announcementData] = await Promise.all([
        galleryRes.json(),
        eventRes.json(),
        sermonRes.json(),
        magRes.json(),
        announcementRes.json()
      ]);
      setGallery(Array.isArray(galleryData) ? galleryData : []);
      setEvents(Array.isArray(eventData) ? eventData : []);
      setSermons(Array.isArray(sermonData) ? sermonData : []);
      setMagazines(Array.isArray(magData) ? magData : []);
      setAnnouncements(Array.isArray(announcementData) ? announcementData : []);
    } finally {
      setLoading(false);
    }
  };

  const getCroppedBlob = async () => {
    if (!previewUrl || !croppedAreaPixels) return null;
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = previewUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );
    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
  };

  const uploadImage = async () => {
    if (!token) throw new Error("Missing admin token");
    if (!imageFile) return imageUrl;

    const croppedBlob = await getCroppedBlob();
    const fileToUpload = croppedBlob || imageFile;
    const form = new FormData();
    form.append("image", fileToUpload, imageFile.name || "upload.jpg");
    const res = await fetch(`${apiBase}/api/upload`, {
      method: "POST",
      headers: authHeaders(),
      body: form
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.imageUrl as string;
  };

  const uploadPdfToServer = async (file: File) => {
    if (!token) throw new Error("Missing admin token");
    const form = new FormData();
    form.append("pdf", file);
    const res = await fetch(`${apiBase}/api/upload/pdf`, {
      method: "POST",
      headers: authHeaders(),
      body: form
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message || "PDF upload failed");
    }
    const data = await res.json();
    return data.pdfUrl as string;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEventDate("");
    setYoutubeUrl("");
    setMagazineMonth("");
    setAnnouncementPinned(false);
    setPdfUrl("");
    setPdfFile(null);
    setEditingId(null);
    setImageFile(null);
    setImageUrl("");
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
  };

  const saveCurrent = async () => {
    if (!token || !title.trim()) return;

    try {
      if (activeTab === "gallery") {
        const uploadedImageUrl = await uploadImage();
        const payload = { title, imageUrl: uploadedImageUrl };
        const url = editingId ? `${apiBase}/api/gallery/${editingId}` : `${apiBase}/api/gallery`;
        const method = editingId ? "PUT" : "POST";
        await fetch(url, {
          method,
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(payload)
        });
      } else if (activeTab === "events") {
        const uploadedImageUrl = await uploadImage();
        const payload = {
          title,
          description,
          date: eventDate || new Date().toISOString(),
          imageUrls: uploadedImageUrl ? [uploadedImageUrl] : []
        };
        const url = editingId ? `${apiBase}/api/events/${editingId}` : `${apiBase}/api/events`;
        const method = editingId ? "PUT" : "POST";
        await fetch(url, {
          method,
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(payload)
        });
      } else if (activeTab === "sermons") {
        if (!youtubeUrl.trim()) {
          window.alert("YouTube URL is required.");
          return;
        }
        const payload = { title, description, youtubeUrl: youtubeUrl.trim() };
        const url = editingId ? `${apiBase}/api/sermons/${editingId}` : `${apiBase}/api/sermons`;
        const method = editingId ? "PUT" : "POST";
        await fetch(url, {
          method,
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(payload)
        });
      } else if (activeTab === "magazines") {
        if (!magazineMonth.trim()) {
          window.alert("Month is required.");
          return;
        }
        const thumb = imageFile ? await uploadImage() : imageUrl;
        const pdf = pdfFile ? await uploadPdfToServer(pdfFile) : pdfUrl;
        if (!thumb || !pdf) {
          window.alert("Thumbnail image and PDF are both required.");
          return;
        }
        const payload = {
          title,
          description,
          month: magazineMonth.trim(),
          thumbnailUrl: thumb,
          pdfUrl: pdf
        };
        const url = editingId ? `${apiBase}/api/magazines/${editingId}` : `${apiBase}/api/magazines`;
        const method = editingId ? "PUT" : "POST";
        await fetch(url, {
          method,
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(payload)
        });
      } else {
        const payload = { title, description, pinned: announcementPinned };
        const url = editingId
          ? `${apiBase}/api/announcements/${editingId}`
          : `${apiBase}/api/announcements`;
        const method = editingId ? "PUT" : "POST";
        await fetch(url, {
          method,
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(payload)
        });
      }
      resetForm();
      await loadData();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Save failed");
    }
  };

  const apiRouteForTab = (tab: Tab) => {
    if (tab === "gallery") return "gallery";
    if (tab === "events") return "events";
    if (tab === "sermons") return "sermons";
    if (tab === "magazines") return "magazines";
    return "announcements";
  };

  const deleteItem = async (id: string) => {
    const route = apiRouteForTab(activeTab);
    await fetch(`${apiBase}/api/${route}/${id}`, { method: "DELETE", headers: authHeaders() });
    await loadData();
  };

  const reorder = async (items: { _id: string }[], index: number) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    const route = apiRouteForTab(activeTab);
    await fetch(`${apiBase}/api/${route}/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ items: next.map((x) => ({ id: x._id })) })
    });
    await loadData();
  };

  const onEditGallery = (item: GalleryItem) => {
    setActiveTab("gallery");
    setEditingId(item._id);
    setTitle(item.title);
    setImageUrl(item.imageUrl);
    setImageFile(null);
  };

  const onEditEvent = (item: EventItem) => {
    setActiveTab("events");
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setEventDate(item.date ? item.date.slice(0, 10) : "");
    setImageUrl(item.imageUrls?.[0] || item.imageUrl || "");
    setImageFile(null);
  };

  const onEditSermon = (item: SermonItem) => {
    setActiveTab("sermons");
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setYoutubeUrl(item.youtubeUrl);
  };

  const onEditMagazine = (item: MagazineItem) => {
    setActiveTab("magazines");
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setMagazineMonth(item.month);
    setImageUrl(item.thumbnailUrl);
    setPdfUrl(item.pdfUrl);
    setImageFile(null);
    setPdfFile(null);
  };

  const onEditAnnouncement = (item: AnnouncementItem) => {
    setActiveTab("announcements");
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setAnnouncementPinned(item.pinned);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const formHeading =
    activeTab === "gallery"
      ? "Gallery image"
      : activeTab === "events"
        ? "Event"
        : activeTab === "sermons"
          ? "Sermon"
          : activeTab === "magazines"
            ? "Magazine"
            : "Announcement";

  const sermonPreview = youtubeEmbedSrc(youtubeUrl);

  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-start" }}>
      <nav className="card" style={{ width: "100%", maxWidth: 220, padding: "1rem", display: "grid", gap: "0.45rem" }}>
        <p style={{ margin: "0 0 0.35rem", fontWeight: 800, fontSize: "0.95rem" }}>Content</p>
        <button type="button" style={tabBtn(activeTab === "gallery")} onClick={() => setActiveTab("gallery")}>
          Gallery
        </button>
        <button type="button" style={tabBtn(activeTab === "events")} onClick={() => setActiveTab("events")}>
          Events
        </button>
        <button type="button" style={tabBtn(activeTab === "sermons")} onClick={() => setActiveTab("sermons")}>
          Sermons
        </button>
        <button type="button" style={tabBtn(activeTab === "magazines")} onClick={() => setActiveTab("magazines")}>
          Magazines
        </button>
        <button
          type="button"
          style={tabBtn(activeTab === "announcements")}
          onClick={() => setActiveTab("announcements")}
        >
          Announcements
        </button>
        <button
          type="button"
          className="btn secondary"
          onClick={logout}
          style={{ border: 0, marginTop: "0.5rem" }}
        >
          Logout
        </button>
      </nav>

      <div style={{ flex: "1 1 360px", minWidth: 0, display: "grid", gap: "1rem" }}>
        <section className="card">
          <h1 style={{ marginTop: 0 }}>Admin Panel</h1>
          <p className="muted">
            Manage gallery, events, sermons (YouTube), magazines (PDF + cover), and announcements.
            Images support crop and optimization; PDFs up to 25&nbsp;MB.
          </p>
        </section>

        <section className="card">
          <h2 style={{ marginTop: 0 }}>{editingId ? `Edit ${formHeading}` : `Create ${formHeading}`}</h2>
          <div className="grid grid-2">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            {activeTab === "events" ? (
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            ) : null}
            {activeTab === "magazines" ? (
              <input type="month" value={magazineMonth} onChange={(e) => setMagazineMonth(e.target.value)} />
            ) : null}
          </div>
          {activeTab === "events" || activeTab === "sermons" || activeTab === "magazines" ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={activeTab === "sermons" ? "Description (optional)" : "Description"}
              rows={4}
              style={{ marginTop: "0.75rem", width: "100%" }}
            />
          ) : null}
          {activeTab === "announcements" ? (
            <>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Announcement details (optional)"
                rows={3}
                style={{ marginTop: "0.75rem", width: "100%" }}
              />
              <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem" }}>
                <input
                  type="checkbox"
                  checked={announcementPinned}
                  onChange={(e) => setAnnouncementPinned(e.target.checked)}
                />
                Pin this announcement
              </label>
            </>
          ) : null}
          {activeTab === "sermons" ? (
            <input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="YouTube URL (watch, youtu.be, embed, or shorts)"
              style={{ marginTop: "0.75rem", width: "100%", padding: "0.65rem", borderRadius: 10, border: "1px solid #cbd5e1" }}
            />
          ) : null}
          {activeTab === "sermons" && sermonPreview ? (
            <div style={{ marginTop: "0.75rem", borderRadius: 12, overflow: "hidden", aspectRatio: "16/9", maxWidth: 480 }}>
              <iframe
                title="Preview"
                src={sermonPreview}
                style={{ width: "100%", height: "100%", border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : null}
          {showImageTools ? (
            <div style={{ marginTop: "0.75rem" }}>
              <label className="muted" style={{ display: "block", marginBottom: "0.35rem" }}>
                {activeTab === "magazines" ? "Cover thumbnail" : "Image"}
              </label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </div>
          ) : null}
          {activeTab === "magazines" ? (
            <div style={{ marginTop: "0.75rem" }}>
              <label className="muted" style={{ display: "block", marginBottom: "0.35rem" }}>
                PDF file
              </label>
              <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
              {pdfUrl && !pdfFile ? (
                <p className="muted" style={{ marginTop: "0.35rem", fontSize: "0.85rem", marginBottom: 0 }}>
                  Current PDF:{" "}
                  <a href={resolveImageUrl(pdfUrl)} target="_blank" rel="noreferrer">
                    open
                  </a>
                </p>
              ) : null}
            </div>
          ) : null}
          {showImageTools && previewUrl ? (
            <>
              <div
                style={{
                  position: "relative",
                  height: 260,
                  marginTop: "0.75rem",
                  borderRadius: 12,
                  overflow: "hidden"
                }}
              >
                <Cropper
                  image={previewUrl}
                  crop={crop}
                  zoom={zoom}
                  onCropChange={setCrop}
                  onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
                  onZoomChange={setZoom}
                  aspect={activeTab === "magazines" ? 3 / 4 : 16 / 9}
                />
              </div>
              <label style={{ display: "block", marginTop: "0.5rem" }}>
                Zoom
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </label>
            </>
          ) : null}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            <button className="btn" type="button" onClick={saveCurrent} style={{ border: 0 }}>
              {editingId ? "Update" : "Create"}
            </button>
            <button className="btn secondary" type="button" onClick={resetForm} style={{ border: 0 }}>
              Reset
            </button>
          </div>
        </section>

        <section className="card">
          <h2 style={{ marginTop: 0 }}>
            {activeTab === "gallery"
              ? "Gallery items"
              : activeTab === "events"
                ? "Events"
                : activeTab === "sermons"
                  ? "Sermons"
                : activeTab === "magazines"
                  ? "Magazines"
                  : "Announcements"}
          </h2>
          {loading ? <p className="muted">Loading...</p> : null}
          <div style={{ marginTop: "1rem", overflowX: "auto" }}>
            {activeTab === "gallery" ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Image</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Title</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedGallery.map((item) => {
                    const originalIndex = gallery.findIndex((g) => g._id === item._id);
                    return (
                      <tr key={item._id}>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>
                          {item.imageUrl ? (
                            <img
                              src={resolveImageUrl(item.imageUrl)}
                              alt={item.title}
                              style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 8 }}
                            />
                          ) : (
                            <span className="muted">No image</span>
                          )}
                        </td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>{item.title}</td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>
                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                            <button type="button" onClick={() => onEditGallery(item)}>
                              Edit
                            </button>
                            <button type="button" onClick={() => reorder(gallery, originalIndex)}>
                              Up
                            </button>
                            <button type="button" onClick={() => deleteItem(item._id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : null}

            {activeTab === "events" ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Image</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Title</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Date</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Description</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedEvents.map((item) => {
                    const originalIndex = events.findIndex((e) => e._id === item._id);
                    return (
                      <tr key={item._id}>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>
                          {item.imageUrls?.[0] || item.imageUrl ? (
                            <img
                              src={resolveImageUrl(item.imageUrls?.[0] || item.imageUrl)}
                              alt={item.title}
                              style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 8 }}
                            />
                          ) : (
                            <span className="muted">No image</span>
                          )}
                        </td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>{item.title}</td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9", maxWidth: 300 }}>
                          <span className="muted">{item.description}</span>
                        </td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>
                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                            <button type="button" onClick={() => onEditEvent(item)}>
                              Edit
                            </button>
                            <button type="button" onClick={() => reorder(events, originalIndex)}>
                              Up
                            </button>
                            <button type="button" onClick={() => deleteItem(item._id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : null}

            {activeTab === "sermons" ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Title</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>YouTube</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Description</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedSermons.map((item) => {
                    const originalIndex = sermons.findIndex((s) => s._id === item._id);
                    return (
                      <tr key={item._id}>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>{item.title}</td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9", maxWidth: 220 }}>
                          <a href={item.youtubeUrl} target="_blank" rel="noreferrer" className="muted">
                            link
                          </a>
                        </td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9", maxWidth: 280 }}>
                          <span className="muted">{item.description}</span>
                        </td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>
                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                            <button type="button" onClick={() => onEditSermon(item)}>
                              Edit
                            </button>
                            <button type="button" onClick={() => reorder(sermons, originalIndex)}>
                              Up
                            </button>
                            <button type="button" onClick={() => deleteItem(item._id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : null}

            {activeTab === "magazines" ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Cover</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Title</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Month</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Description</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedMagazines.map((item) => {
                    const originalIndex = magazines.findIndex((m) => m._id === item._id);
                    return (
                      <tr key={item._id}>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>
                          <img
                            src={resolveImageUrl(item.thumbnailUrl)}
                            alt={item.title}
                            style={{ width: 56, height: 72, objectFit: "cover", borderRadius: 8 }}
                          />
                        </td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>{item.title}</td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>{item.month}</td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9", maxWidth: 260 }}>
                          <span className="muted">{item.description}</span>
                        </td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>
                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                            <button type="button" onClick={() => onEditMagazine(item)}>
                              Edit
                            </button>
                            <button type="button" onClick={() => reorder(magazines, originalIndex)}>
                              Up
                            </button>
                            <button type="button" onClick={() => deleteItem(item._id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : null}
            {activeTab === "announcements" ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Title</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Pinned</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Description</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #e2e8f0" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedAnnouncements.map((item) => {
                    const originalIndex = announcements.findIndex((a) => a._id === item._id);
                    return (
                      <tr key={item._id}>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>{item.title}</td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>
                          {item.pinned ? "Yes" : "No"}
                        </td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9", maxWidth: 280 }}>
                          <span className="muted">{item.description}</span>
                        </td>
                        <td style={{ padding: "0.6rem", borderBottom: "1px solid #f1f5f9" }}>
                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                            <button type="button" onClick={() => onEditAnnouncement(item)}>
                              Edit
                            </button>
                            <button type="button" onClick={() => reorder(announcements, originalIndex)}>
                              Up
                            </button>
                            <button type="button" onClick={() => deleteItem(item._id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : null}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.8rem" }}>
            {activeTab === "gallery" ? (
              <>
                <button type="button" onClick={() => setGalleryPage((p) => Math.max(1, p - 1))} disabled={galleryPage === 1}>
                  Prev
                </button>
                <span className="muted">
                  Page {galleryPage} / {totalGalleryPages}
                </span>
                <button
                  type="button"
                  onClick={() => setGalleryPage((p) => Math.min(totalGalleryPages, p + 1))}
                  disabled={galleryPage >= totalGalleryPages}
                >
                  Next
                </button>
              </>
            ) : null}
            {activeTab === "events" ? (
              <>
                <button type="button" onClick={() => setEventsPage((p) => Math.max(1, p - 1))} disabled={eventsPage === 1}>
                  Prev
                </button>
                <span className="muted">
                  Page {eventsPage} / {totalEventsPages}
                </span>
                <button
                  type="button"
                  onClick={() => setEventsPage((p) => Math.min(totalEventsPages, p + 1))}
                  disabled={eventsPage >= totalEventsPages}
                >
                  Next
                </button>
              </>
            ) : null}
            {activeTab === "sermons" ? (
              <>
                <button type="button" onClick={() => setSermonsPage((p) => Math.max(1, p - 1))} disabled={sermonsPage === 1}>
                  Prev
                </button>
                <span className="muted">
                  Page {sermonsPage} / {totalSermonsPages}
                </span>
                <button
                  type="button"
                  onClick={() => setSermonsPage((p) => Math.min(totalSermonsPages, p + 1))}
                  disabled={sermonsPage >= totalSermonsPages}
                >
                  Next
                </button>
              </>
            ) : null}
            {activeTab === "magazines" ? (
              <>
                <button
                  type="button"
                  onClick={() => setMagazinesPage((p) => Math.max(1, p - 1))}
                  disabled={magazinesPage === 1}
                >
                  Prev
                </button>
                <span className="muted">
                  Page {magazinesPage} / {totalMagazinesPages}
                </span>
                <button
                  type="button"
                  onClick={() => setMagazinesPage((p) => Math.min(totalMagazinesPages, p + 1))}
                  disabled={magazinesPage >= totalMagazinesPages}
                >
                  Next
                </button>
              </>
            ) : null}
            {activeTab === "announcements" ? (
              <>
                <button
                  type="button"
                  onClick={() => setAnnouncementsPage((p) => Math.max(1, p - 1))}
                  disabled={announcementsPage === 1}
                >
                  Prev
                </button>
                <span className="muted">
                  Page {announcementsPage} / {totalAnnouncementsPages}
                </span>
                <button
                  type="button"
                  onClick={() => setAnnouncementsPage((p) => Math.min(totalAnnouncementsPages, p + 1))}
                  disabled={announcementsPage >= totalAnnouncementsPages}
                >
                  Next
                </button>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
