import { DatePicker } from "antd";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { Dispatch, memo, SetStateAction } from "react";
import {
  updateCalendarDateWithOffset,
  updateOffsetWithDateCalendar,
} from "react-weekly-planning/lib/utils";

// Actions component
type ActionsPropsType = {
  setCalendarDate: Dispatch<SetStateAction<Date>>;
  calendarDate: Date;
  setCalendarOffset: Dispatch<SetStateAction<number>>;
  calendarOffset: number;
};

const Actions = ({
  setCalendarDate,
  calendarDate,
  setCalendarOffset,
  calendarOffset,
}: ActionsPropsType) => {
    
  const handleChangeCalendarDate = (value: dayjs.Dayjs) => {
    setCalendarDate(value.toDate());
    const newOffset = updateOffsetWithDateCalendar(value.toDate());
    setCalendarOffset(newOffset);
  };

  const handleChangeOffset = (offset: number) => {
    const newOffset = calendarOffset + offset;
    const newCalendarDate = updateCalendarDateWithOffset(offset, calendarDate);
    setCalendarOffset(newOffset);
    setCalendarDate(newCalendarDate);
  };

  function weekFormat(value: dayjs.Dayjs) {
    const startOfWeek = value.startOf("week").format("DD MMM YYYY");
    const endOfWeek = value.endOf("week").format("DD MMM YYYY");
    return `${startOfWeek} - ${endOfWeek}`;
  }

  return (
    <div className="w-full h-[50px] flex p-2 items-center justify-between">
      <DatePicker
        value={dayjs(calendarDate)}
        onChange={handleChangeCalendarDate}
        picker="week"
        format={weekFormat}
      />
      <div className="w-auto h-auto flex gap-2">
        <Button
          className="bg-[#f2f8fb]"
          onClick={() => handleChangeOffset(-7)}
          variant="secondary"
        >
          Previous week
        </Button>
        <Button
          className="bg-[#f2f8fb]"
          onClick={() => handleChangeOffset(+7)}
          variant="secondary"
        >
          Next week
        </Button>
      </div>
    </div>
  );
};

export default memo(
  Actions,
  (
    prevProps: Readonly<ActionsPropsType>,
    nextProps: Readonly<ActionsPropsType>
  ) =>
    prevProps.calendarDate === nextProps.calendarDate &&
    prevProps.calendarOffset === nextProps.calendarOffset
);
