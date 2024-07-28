import { useEffect, useState } from "react";

interface ClockProps {
    timezone: string;
}

function Clock({ timezone }: ClockProps) {
    const [time, setTime] = useState('');

    const getTime = (timeZone: string): string => {
        try {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false
            });
            return formatter.format(now);
        } catch (error) {
            console.error('Invalid timeZone:', error);
            return 'Invalid timeZone';
        }
    };

    useEffect(() => {
        const updateTime = () => setTime(getTime(timezone));

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [timezone]);

    return <h4>{time}</h4>;
}

export default Clock;