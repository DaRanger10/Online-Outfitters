function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load photo"));
    img.src = url;
  });
}

async function decodeImage(file: File): Promise<CanvasImageSource> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      try {
        return await createImageBitmap(file);
      } catch {
        // Fall through to the object-URL path for HEIC and odd camera files.
      }
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    return await loadImageFromUrl(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function sourceSize(source: CanvasImageSource): { width: number; height: number } {
  if (source instanceof HTMLImageElement) {
    return {
      width: source.naturalWidth || source.width,
      height: source.naturalHeight || source.height,
    };
  }
  if (typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap) {
    return { width: source.width, height: source.height };
  }
  const width =
    "width" in source && typeof source.width === "number" ? source.width : 0;
  const height =
    "height" in source && typeof source.height === "number" ? source.height : 0;
  return { width, height };
}

function canvasFromSource(source: CanvasImageSource): HTMLCanvasElement {
  const max = 720;
  const { width: rawWidth, height: rawHeight } = sourceSize(source);
  const sourceWidth = rawWidth > 0 ? rawWidth : 720;
  const sourceHeight = rawHeight > 0 ? rawHeight : 720;
  const scale = Math.min(1, max / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not process photo");
  }
  ctx.fillStyle = "#EDE8E1";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}

function dataUrlFromCanvas(canvas: HTMLCanvasElement): string {
  const dataUrl = canvas.toDataURL("image/jpeg", 0.68);
  if (!dataUrl.startsWith("data:image/")) {
    throw new Error("Could not process photo");
  }
  return dataUrl;
}

export async function compressImage(file: File): Promise<string> {
  const source = await decodeImage(file);
  try {
    return dataUrlFromCanvas(canvasFromSource(source));
  } finally {
    if (typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap) {
      source.close();
    }
  }
}

export function usablePhotoSrc(src: string | null | undefined): string | null {
  if (!src) return null;
  if (
    src.startsWith("data:image/") ||
    src.startsWith("blob:") ||
    src.startsWith("https://") ||
    src.startsWith("http://")
  ) {
    return src;
  }
  return null;
}

export function photoForLookItem(
  item: { id: string; photo: string | null },
  pieces: { id: string; photo: string | null }[],
): string | null {
  return usablePhotoSrc(
    pieces.find((piece) => piece.id === item.id)?.photo ?? item.photo,
  );
}
