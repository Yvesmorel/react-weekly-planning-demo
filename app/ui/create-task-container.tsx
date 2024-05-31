import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { montserrat } from "@/app/ui/font";
import { Button } from "@/components/ui/button";
import {
  GroupFeildsType,
  dayInfoType,
} from "react-weekly-planning/definitions";
import { millisecondsToHours, checkDuplicates } from "react-weekly-planning";
import { UseAppContext } from "@/context/AppContext";

const CreatePlanningContainer = ({
  currentGroup,
  timeOfdayRange,
  dayInfo,
}: {
  currentGroup: GroupFeildsType;
  timeOfdayRange: number[];
  dayInfo: dayInfoType;
}) => {
  const [selectedTimeStart, setSelectedTimeStart] = useState<number>(timeOfdayRange[0]);
  const [selectedTimeEnd, setSelectedTimeEnd] = useState<number>(timeOfdayRange[1]);
  const [selectedTask, setSelectedTask] = useState<string>(currentGroup.tasks[0]);

  const { tasks, setTasks } = UseAppContext();

  const handleAddTask = () => {
    if (selectedTimeStart >= selectedTimeEnd) {
      toast("The start time cannot be greater than or equal to the end time");
      return;
    }

    if (checkDuplicates(tasks, selectedTimeStart, selectedTimeEnd, currentGroup.id)) {
      toast("Duplicates detected");
      return;
    }

    const newTask = {
      taskStart: selectedTimeStart,
      taskEnd: selectedTimeEnd,
      task: selectedTask,
      taskDate: dayInfo.day,
      groupId: currentGroup.id,
      dayIndex: dayInfo.positionDay,
      taskId: `${tasks.length}`,
    };

    setTasks([...tasks, newTask]);
    toast("Task created");
  };

  return (
    <div className={`${montserrat.className} w-full h-full flex flex-col gap-2`}>
      <Select value={selectedTask} onValueChange={setSelectedTask}>
      <p>Task</p>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Task" />
        </SelectTrigger>
        <SelectContent>
          {currentGroup.tasks.map((task: string) => (
            <SelectItem key={task} value={task}>
              {task}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedTimeStart.toString()}
        onValueChange={(value) => setSelectedTimeStart(parseInt(value))}
      >
        <p>Start time</p>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Start Time" />
        </SelectTrigger>
        <SelectContent>
          {timeOfdayRange.map((time) => (
            <SelectItem key={time} value={time.toString()}>
              {millisecondsToHours(time)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedTimeEnd.toString()}
        onValueChange={(value) => setSelectedTimeEnd(parseInt(value))}
      >
        <p>End time</p>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select End Time" />
        </SelectTrigger>
        <SelectContent>
          {timeOfdayRange.map((time) => (
            <SelectItem key={time} value={time.toString()}>
              {millisecondsToHours(time)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button className="w-full" onClick={handleAddTask}>
        Create Task
      </Button>
    </div>
  );
};

export default CreatePlanningContainer;
