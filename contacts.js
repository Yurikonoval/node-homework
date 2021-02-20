import * as fs from "fs/promises";
import path from "path";
import shortId from "shortid";
import createDirname from "./lib/dirname.js";
import { handleError } from "./lib/handleError.js";

const { __dirname } = createDirname(import.meta.url);

const contactsPath = path.join(__dirname, "./db/contacts.json");

// TODO: задокументировать каждую функцию

async function readContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    handleError(error);
  }
}

export async function listContacts() {
  try {
    const data = await readContacts();
    console.table(data);
  } catch (error) {
    handleError(error);
  }
}

export async function getContactById(contactId) {
  try {
    const contacts = await readContacts();
    const searchContact = contacts.find((contact) => contact.id === contactId);
    console.table(searchContact);
  } catch (error) {
    handleError(error);
  }
}

export async function removeContact(contactId) {
  try {
    const contacts = await readContacts();
    const newContactList = contacts.filter(
      (contact) => contact.id !== contactId
    );
    await fs.writeFile(contactsPath, JSON.stringify(newContactList));
    console.log("Contact has been deleted");
    listContacts();
  } catch (error) {
    handleError(error);
  }
}

export async function addContact(name, email, phone) {
  try {
    const contacts = await readContacts();
    const newContacts = [...contacts, { id: shortId(), name, email, phone }];
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    console.log("Contact has been added");
    listContacts();
  } catch (error) {
    handleError(error);
  }
}
