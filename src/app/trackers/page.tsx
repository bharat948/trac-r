import { getTrackers } from '@/app/actions/trackers';
import TrackersClient from '@/components/trackers/TrackersClient';

export default async function TrackersPage() {
    const trackers = await getTrackers();

    return (
        <TrackersClient initialTrackers={trackers} />
    );
}
