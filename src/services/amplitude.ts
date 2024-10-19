import {init, setUserId, track } from '@amplitude/analytics-browser';
import {LogLevel} from "@amplitude/analytics-types";

const AMPLITUDE_API_KEY = 'b912f060cbdf8cc54a183c2c75472e7c';

export const initializeAmplitude = () => {
    init(AMPLITUDE_API_KEY, {
        defaultTracking:{
            sessions:true,
            pageViews: true,
            formInteractions:true
        },
        logLevel: LogLevel.Debug,
    });

};

export const logEvent = (eventName: string, eventProperties?: Record<string, any>) => {
    track(eventName, eventProperties);
};

export const setAmplitudeUserId = (userId: string) => {
    setUserId(userId);
};
