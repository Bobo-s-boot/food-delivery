export function normalizeImage(image, index) {
  if (typeof image !== "string" || image.trim() === "") {
    return `/img/card-${(index % 8) + 1}.png`;
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/img/")) {
    return image;
  }

  return `/img/card-${(index % 8) + 1}.png`;
}
