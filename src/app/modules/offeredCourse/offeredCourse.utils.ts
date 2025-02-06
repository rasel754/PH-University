import { TSchedule } from './offeredCourse.interface';

export const hasTimeConflict = (
  assignedSchedule: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (let schedule of assignedSchedule) {
    const existinStartTime = new Date(`2003-03-08T${schedule.startTime}`);
    const existinEndTime = new Date(`2003-03-08T${schedule.endTime}`);
    const newStartTime = new Date(`2003-03-08T${newSchedule.startTime}`);
    const newEndTime = new Date(`2003-03-08T${newSchedule.startTime}`);

    if (newStartTime > existinEndTime && newEndTime > existinStartTime) {
      return true;
    }
  }

  return false;
};
