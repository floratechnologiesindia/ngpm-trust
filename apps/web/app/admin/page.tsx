"use client";

import { useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import { useRouter } from "next/navigation";

type Area = { x: number; y: number; width: number; height: number };
type Point = { x: number; y: number };

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

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6661";

const resolveImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function AdminPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState<"gallery" | "events">("gallery");

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [zoom, setZoom] = useState(1);
  const [galleryPage, setGalleryPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const pageSize = 5;

  const previewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : ""), [imageFile]);
  const totalGalleryPages = Math.max(1, Math.ceil(gallery.length / pageSize));
  const totalEventsPages = Math.max(1, Math.ceil(events.length / pageSize));
  const pagedGallery = gallery.slice((galleryPage - 1) * pageSize, galleryPage * pageSize);
  const pagedEvents = events.slice((eventsPage - 1) * pageSize, eventsPage * pageSize);

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

  const authHeaders = (t = token) => ({
    Authorization: `Bearer ${t}`
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [galleryRes, eventRes] = await Promise.all([
        fetch(`${apiBase}/api/gallery`, { cache: "no-store" }),
        fetch(`${apiBase}/api/events`, { cache: "no-store" })
      ]);
      const [galleryData, eventData] = await Promise.all([galleryRes.json(), eventRes.json()]);
      setGallery(galleryData);
      setEvents(eventData);
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
    return data.imageUrl;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEventDate("");
    setEditingId(null);
    setImageFile(null);
    setImageUrl("");
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
  };

  const saveCurrent = async () => {
    if (!token || !title.trim()) return;
    const uploadedImageUrl = await uploadImage();

    if (activeTab === "gallery") {
      const payload = { title, imageUrl: uploadedImageUrl };
      const url = editingId ? `${apiBase}/api/gallery/${editingId}` : `${apiBase}/api/gallery`;
      const method = editingId ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload)
      });
    } else {
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
    }
    resetForm();
    await loadData();
  };

  const deleteItem = async (id: string) => {
    const route = activeTab === "gallery" ? "gallery" : "events";
    await fetch(`${apiBase}/api/${route}/${id}`, { method: "DELETE", headers: authHeaders() });
    await loadData();
  };

  const reorder = async (items: { _id: string }[], index: number) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    const route = activeTab === "gallery" ? "gallery" : "events";
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

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <section className="card">
        <h1>Admin Panel</h1>
        <p className="muted">
          Add, edit, delete, reorder gallery and events. Image upload supports crop, zoom and
          server optimization.
        </p>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <button className="btn" onClick={() => setActiveTab("gallery")} style={{ border: 0 }}>
            Gallery
          </button>
          <button className="btn secondary" onClick={() => setActiveTab("events")} style={{ border: 0 }}>
            Events
          </button>
          <button className="btn secondary" onClick={logout} style={{ border: 0, marginLeft: "auto" }}>
            Logout
          </button>
        </div>
      </section>

      <section className="card">
        <h2>{editingId ? "Edit Item" : `Create ${activeTab === "gallery" ? "Gallery Image" : "Event"}`}</h2>
        <div className="grid grid-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          {activeTab === "events" ? (
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          ) : null}
        </div>
        {activeTab === "events" ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event description"
            rows={4}
            style={{ marginTop: "0.75rem", width: "100%" }}
          />
        ) : null}
        <div style={{ marginTop: "0.75rem" }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>
        {previewUrl ? (
          <>
            <div style={{ position: "relative", height: 260, marginTop: "0.75rem", borderRadius: 12, overflow: "hidden" }}>
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
                onZoomChange={setZoom}
                aspect={16 / 9}
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
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button className="btn" onClick={saveCurrent} style={{ border: 0 }}>
            {editingId ? "Update" : "Create"}
          </button>
          <button className="btn secondary" onClick={resetForm} style={{ border: 0 }}>
            Reset
          </button>
        </div>
      </section>

      <section className="card">
        <h2>{activeTab === "gallery" ? "Gallery Items" : "Event Items"}</h2>
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
                          <button onClick={() => onEditGallery(item)}>Edit</button>
                          <button onClick={() => reorder(gallery, originalIndex)}>Up</button>
                          <button onClick={() => deleteItem(item._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
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
                        {(item.imageUrls?.[0] || item.imageUrl) ? (
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
                          <button onClick={() => onEditEvent(item)}>Edit</button>
                          <button onClick={() => reorder(events, originalIndex)}>Up</button>
                          <button onClick={() => deleteItem(item._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.8rem" }}>
          {activeTab === "gallery" ? (
            <>
              <button onClick={() => setGalleryPage((p) => Math.max(1, p - 1))} disabled={galleryPage === 1}>
                Prev
              </button>
              <span className="muted">
                Page {galleryPage} / {totalGalleryPages}
              </span>
              <button
                onClick={() => setGalleryPage((p) => Math.min(totalGalleryPages, p + 1))}
                disabled={galleryPage >= totalGalleryPages}
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEventsPage((p) => Math.max(1, p - 1))} disabled={eventsPage === 1}>
                Prev
              </button>
              <span className="muted">
                Page {eventsPage} / {totalEventsPages}
              </span>
              <button
                onClick={() => setEventsPage((p) => Math.min(totalEventsPages, p + 1))}
                disabled={eventsPage >= totalEventsPages}
              >
                Next
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
