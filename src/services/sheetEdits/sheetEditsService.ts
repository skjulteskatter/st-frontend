import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
    DocumentData,
} from "firebase/firestore";
import { firebaseApp, a } from "@/services/auth";
import type { SheetEdit, SheetEdits } from "./types";

function fromFirestore(id: string, data: DocumentData): SheetEdits {
    return {
        id,
        ownerId: data.ownerId,
        fileId: data.fileId,
        name: data.name,
        baseHash: data.baseHash,
        edits: data.edits ?? [],
        createdAt: (data.createdAt as Timestamp).toDate(),
        updatedAt: (data.updatedAt as Timestamp).toDate(),
    };
}

class SheetEditsService {
    // Created on first use: this module is imported (via the router) before auth.ts has initialized firebaseApp
    private get editsRef() {
        return collection(getFirestore(firebaseApp), "sheetEdits");
    }

    get userId(): string | undefined {
        return a.currentUser?.uid;
    }

    /** Anyone with the id can read a set of edits; there is no listing of other users' edits. */
    async get(id: string): Promise<SheetEdits | null> {
        const snapshot = await getDoc(doc(this.editsRef, id));
        return snapshot.exists() ? fromFirestore(snapshot.id, snapshot.data()) : null;
    }

    /** The current user's edits of a sheet music file, newest first. */
    async listMine(fileId: string): Promise<SheetEdits[]> {
        const userId = this.userId;
        if (!userId) return [];

        const snapshot = await getDocs(query(this.editsRef, where("ownerId", "==", userId), where("fileId", "==", fileId)));
        return snapshot.docs
            .map((d) => fromFirestore(d.id, d.data()))
            .sort((x, y) => y.updatedAt.getTime() - x.updatedAt.getTime());
    }

    async create(fileId: string, name: string, baseHash: string, edits: SheetEdit[]): Promise<string> {
        const userId = this.userId;
        if (!userId) throw new Error("You must be logged in to edit sheet music.");

        const now = Timestamp.now();
        const ref = await addDoc(this.editsRef, {
            ownerId: userId,
            fileId,
            name,
            baseHash,
            edits,
            createdAt: now,
            updatedAt: now,
        });
        return ref.id;
    }

    async update(id: string, changes: { name: string; baseHash: string; edits: SheetEdit[] }): Promise<void> {
        await updateDoc(doc(this.editsRef, id), { ...changes, updatedAt: Timestamp.now() });
    }

    async delete(id: string): Promise<void> {
        await deleteDoc(doc(this.editsRef, id));
    }
}

export const sheetEditsService = new SheetEditsService();
