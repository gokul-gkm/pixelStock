
export async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const ext = blob.type.split("/")[1] ?? "jpg";
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${filename.replace(/[^a-z0-9_\-. ]/gi, "_")}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch(error) {
    console.error("Download failed:", error);
  }
}
