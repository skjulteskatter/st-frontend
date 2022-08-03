import { LyricsVerse } from "@/classes/lyrics";
import { PresentationControl, Settings } from "@/classes/presentation";
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";
import { ISong, LyricsContent } from "songtreasures-api";
import { firebaseApp } from "./auth";

export type VContributor = {
    id: string;
    name: string;
}

export type VLyrics = {
    id: string;
    languageKey: string;
    verses: {
        [key: string]: LyricsVerse;
    };
}

export type PresentationDocument = {
    song: ISong,
    lyrics: VLyrics,
    settings: Settings,
    contributors: VContributor[]
}

export default class EventListener {
    private firestore = getFirestore(firebaseApp);
    private doc;
    private control;
    constructor(control: PresentationControl, userId: string) {
        this.control = control;
        this.doc = doc(this.firestore, "presentation", userId);
    }


    public initListener() {
        onSnapshot(this.doc, (doc) => {
            for (const hook of this.listeners) {
                hook(doc.data() as PresentationDocument);
            }
        }, (err) => {
            console.log(err)
            setTimeout(location.reload, 5000);
        });
    }

    private listeners: ((options: PresentationDocument) => void)[] = [];
    public registerHook(hook: (options: PresentationDocument) => void) {
        this.listeners.push(hook);
    }

    public commit() {
        const document: PresentationDocument = {
            contributors: this.control.rawContributors?.map(i => ({id: i.id, name: i.name})) ?? [],
            lyrics: {
                id: this.control.rawLyrics?.id ?? "",
                verses: this.control.rawLyrics?.verses ?? {},
                languageKey: this.control.rawLyrics?.languageKey ?? "en",
            },
            song: this.control.rawSong as ISong,
            settings: this.control.Settings as Settings,
        };

        setDoc(this.doc, document);
    }

    public async getState() {
        return (await getDoc(this.doc)).data() as PresentationDocument;
    }
}
