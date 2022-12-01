export const getDeadLineTimer = ({
  mins,
  seconds,
}: {
  mins?: number;
  seconds?: number;
}): number => {
  let deadLine = new Date();
  if (mins) deadLine.setMinutes(deadLine.getMinutes() + mins);
  if (seconds) deadLine.setSeconds(deadLine.getSeconds() + seconds);
  return Date.parse(deadLine.toString());
};
