import { useState, useEffect } from 'react';

const secondsTable: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['years', 60 * 60 * 24 * 365],
  ['months', 60 * 60 * 24 * 30],
  ['weeks', 60 * 60 * 24 * 7],
  ['days', 60 * 60 * 24],
  ['hours', 60 * 60],
  ['minutes', 60],
];
const rtf = new Intl.RelativeTimeFormat(undefined, {numeric: 'auto'});

type TimeAgoType = {
    bestTime: number;
    bestUnit: Intl.RelativeTimeFormatUnit;
    bestInterval: number;
}

function getTimeAgo(date: Date): TimeAgoType {
  const seconds = Math.round((date.getTime() - new Date().getTime()) / 1000);
  const absSeconds = Math.abs(seconds);
  let bestUnit: Intl.RelativeTimeFormatUnit = 'seconds', bestTime = 0, bestInterval = 0;
  for (let [unit, unitSeconds] of secondsTable) {
    if (absSeconds >= unitSeconds) {
      bestUnit = unit;
      bestTime = Math.round(seconds / unitSeconds);
      bestInterval = unitSeconds / 2;
      break;
    }
  };
  if (!bestUnit) {
    bestUnit = 'seconds';
    bestTime = Math.floor(seconds / 10) * 10;
    bestInterval = 10;
  }
  return {bestTime, bestUnit, bestInterval};
}

type TimeAgoProps = {
  isoDate: string;
}

export default function TimeAgo({ isoDate }: TimeAgoProps) {
  const date = new Date(Date.parse(isoDate));
  const { bestTime: time, bestUnit: unit, bestInterval: interval } = getTimeAgo(date);
  const [, setUpdate] = useState(0);

  useEffect(() => {
    const timerId = setInterval(
      () => setUpdate(update => update + 1),
      interval * 1000
    );
    return () => clearInterval(timerId);
  }, [interval]);

  return (
    <span title={date.toString()}>{rtf.format(time, unit)}</span>
  );
}