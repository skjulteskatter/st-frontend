import { MidiInstrument } from "../../MusicalScore/VoiceData/Instructions/ClefInstruction";
export interface IInstrument {
    Id: number;
    Audible: boolean;
    Solo: boolean;
    Mute: boolean;
    Visible: boolean;
    Highlight: boolean;
    Following: boolean;
    PitchMonitor: boolean;
    Name: string;
    Volume: number;
    MidiInstrumentId: MidiInstrument;
    InstrumentParameterChanged: any;
    setInstrumentParameter(parameter: any, value: Object): void;
}
