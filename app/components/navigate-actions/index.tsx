import { DatePicker } from "antd";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { Dispatch, memo, SetStateAction } from "react";
import {
  updateCalendarDateWithOffset,
  updateOffsetWithDateCalendar,
} from "react-weekly-planning";

// Actions component
type ActionsPropsType = {
  setCalendarDate: Dispatch<SetStateAction<Date>>;
  calendarDate: Date;
  setCalendarOffset: Dispatch<SetStateAction<number>>;
  calendarOffset: number;
  scope: "week" | "day";
};

const Actions = ({
  setCalendarDate,
  calendarDate,
  setCalendarOffset,
  calendarOffset,
  scope,
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

  const dateFormat = (value: dayjs.Dayjs) => {
    if (scope === "day") {
      return value.format("DD MMM YYYY");
    }
    const startOfWeek = value.startOf("week").format("DD MMM YYYY");
    const endOfWeek = value.endOf("week").format("DD MMM YYYY");
    return `${startOfWeek} - ${endOfWeek}`;
  };

  return (
    <div className="w-full min-h-[50px] flex flex-wrap gap-2 p-2 items-center justify-between bg-white border-b">
      <div className="flex-1 min-w-[200px]">
        <DatePicker
          value={dayjs(calendarDate)}
          onChange={handleChangeCalendarDate}
          picker="week"
          format={dateFormat}
          allowClear={false}
          className="w-full sm:w-auto"
        />
      </div>
      <div className="flex gap-2">
        <Button
          className="bg-[#f2f8fb] text-xs sm:text-sm h-8 sm:h-10"
          onClick={() => handleChangeOffset(scope === "day" ? -1 : -7)}
          variant="secondary"
        >
          {scope === "day" ? "Prev day" : "Prev week"}
        </Button>
        <Button
          className="bg-[#f2f8fb] text-xs sm:text-sm h-8 sm:h-10"
          onClick={() => handleChangeOffset(scope === "day" ? 1 : 7)}
          variant="secondary"
        >
          {scope === "day" ? "Next day" : "Next week"}
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
    prevProps.calendarOffset === nextProps.calendarOffset &&
    prevProps.scope === nextProps.scope
);
