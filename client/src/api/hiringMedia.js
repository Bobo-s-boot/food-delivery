const DB_NAME = "defilicious.hiringMedia:v1";
let database;
function openMedia() {
  if (!database) database = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore("images", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("Image storage is unavailable. Please try again."));
    request.onblocked = () => reject(new Error("Close older preview tabs and try the image upload again."));
  }).catch((error) => { database = null; throw error; });
  return database;
}
export async function saveHiringImage(file) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Choose a JPG, PNG or WebP image.");
  if (!file.size || file.size > 2 * 1024 * 1024) throw new Error("Choose an image smaller than 2 MB.");
  let bitmap;
  try { bitmap = await createImageBitmap(file); }
  catch { throw new Error("This image could not be opened. Choose another file."); }
  const width = bitmap.width, height = bitmap.height;
  bitmap.close();
  if (width > 12000 || height > 12000) throw new Error("Choose an image with dimensions below 12,000 pixels.");
  const record = { id: crypto.randomUUID(), file, name: file.name, type: file.type, width, height };
  const db = await openMedia();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction("images", "readwrite");
    transaction.objectStore("images").put(record);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(new Error("Image could not be saved. Browser storage may be full."));
    transaction.onabort = () => reject(new Error("Image upload was interrupted. Please try again."));
  });
  return record.id;
}
export async function getHiringImage(id) {
  const db = await openMedia();
  return new Promise((resolve, reject) => {
    const request = db.transaction("images").objectStore("images").get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("Image could not be loaded."));
  });
}
