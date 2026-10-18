import type { BandSyncSongCoordinator } from "@/composables/useBandSyncSongCoordinator";

let activeCoordinator: BandSyncSongCoordinator | null = null;

export function registerBandSyncCoordinator(
    coordinator: BandSyncSongCoordinator | null,
): void {
    activeCoordinator = coordinator;
}

export async function resyncBandSyncToLeader(): Promise<void> {
    await activeCoordinator?.resyncToLeader();
}
