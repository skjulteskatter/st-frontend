import { MidiInstrument } from "../../MusicalScore/VoiceData/Instructions/ClefInstruction";
import { IInstrument } from "./IInstrument";
export interface ISettableInstrument extends IInstrument {
    Audible: boolean;
    Solo: boolean;
    Mute: boolean;
    Visible: boolean;
    Following: boolean;
    PitchMonitor: boolean;
    Highlight: boolean;
    Volume: number;
    MidiInstrumentId: MidiInstrument;
    setVoiceAudible(voiceId: number, audible: boolean): void;
    setStaffAudible(staffId: number, audible: boolean): void;
    setVoiceFollowing(voiceId: number, follow: boolean): void;
    setStaffFollow(staffId: number, follow: boolean): void;
    setVoicePitchMonitor(voiceId: number, pitchMonitor: boolean): void;
    setStaffPitchMonitor(staffId: number, pitchMonitor: boolean): void;
}
