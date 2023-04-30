const Evernote = require('evernote');

const authToken = 'your-auth-token';
const client = new Evernote.Client({ token: authToken, sandbox: false });

async function getNotebookIdByName(notebookName) {
  const noteStore = client.getNoteStore();
  const notebooks = await noteStore.listNotebooks();

  const notebook = notebooks.find((nb) => nb.name === notebookName);
  if (notebook) {
    return notebook.guid;
  }
  return null;
}

async function createNoteWithTags(title, content, tags, notebookName) {
  const noteStore = client.getNoteStore();
  const note = new Evernote.Types.Note();
  note.title = title;
  note.content = `<?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
  <en-note>${content}</en-note>`;
  note.tagNames = tags;

  // Set the notebook
  const notebookId = await getNotebookIdByName(notebookName);
  if (notebookId) {
    note.notebookGuid = notebookId;
  } else {
    console.error(`Notebook "${notebookName}" not found. Creating note in the default notebook.`);
  }

  try {
    const createdNote = await noteStore.createNote(note);
    console.log('Note created:', createdNote.guid);
  } catch (error) {
    console.error('Error creating note:', error);
  }
}
