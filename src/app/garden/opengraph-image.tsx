import { ImageResponse } from "next/og";

// Preview card for links to the garden (and its notes) shared on LinkedIn, Slack and so on.
// Drawn here instead of using the picture at the top of the page, which is a film frame.
export const alt = "My Zettelkasten garden: small, linked notes by Sebastian Pellitero";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function GardenPreview() {
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", padding: 44 }}>
                {/* Two outlines a few pixels apart, like the paper slips on the page */}
                <div style={{ display: "flex", flexGrow: 1, border: "3px solid #1f1f1f", borderRadius: 18, padding: 7 }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            flexGrow: 1,
                            border: "1.5px solid #5c5c5c",
                            borderRadius: 12,
                            padding: "52px 60px",
                            color: "#1f1f1f",
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }}>My Zettelkasten</div>
                            <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1.1, letterSpacing: -3 }}>garden</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", color: "#5c5c5c" }}>
                            <div style={{ fontSize: 36 }}>Small, linked notes on accessibility and frontend engineering.</div>
                            <div style={{ fontSize: 30, marginTop: 14, color: "#1f1f1f" }}>Sebastian Pellitero</div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        size
    );
}
