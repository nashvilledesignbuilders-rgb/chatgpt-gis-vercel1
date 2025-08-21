// Minimal test handler for Vercel
export default function handler(req, res) {
  res.status(200).json({ status: "ok", message: "Parcel API route is working" });
}
