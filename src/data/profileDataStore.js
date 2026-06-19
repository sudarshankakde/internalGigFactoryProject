const PROFILE_DOCUMENTS_KEY = 'gigfactory-profile-documents';

const readJson = (key, fallback) => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getAllProfileDocuments = () => readJson(PROFILE_DOCUMENTS_KEY, []);

export function getProfileDocuments(userId) {
  return getAllProfileDocuments().filter((doc) => String(doc.userId) === String(userId));
}

export function addProfileDocument(userId, document) {
  const docs = getAllProfileDocuments();
  const nextDoc = { id: Date.now(), userId, ...document };
  const updated = [nextDoc, ...docs];
  writeJson(PROFILE_DOCUMENTS_KEY, updated);
  return nextDoc;
}

export function deleteProfileDocument(documentId) {
  const docs = getAllProfileDocuments();
  const updated = docs.filter((doc) => String(doc.id) !== String(documentId));
  writeJson(PROFILE_DOCUMENTS_KEY, updated);
}

