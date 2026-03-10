import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppContext } from "../custom-hooks/context";
import { faAdd, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GroupFeildsType } from "react-weekly-planning/definitions";

export default function AddGroupDialog({ groupToEdit }: { groupToEdit?: GroupFeildsType }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [tasksText, setTasksText] = useState("");
  const [color, setColor] = useState("#01a3c0");
  const { groups, setGroups, tasks } = useAppContext();

  useEffect(() => {
    if (groupToEdit && open) {
      setLabel(groupToEdit.label || "");
      setTasksText(groupToEdit.tasks.join(", "));
      setColor((groupToEdit.color as string) || "#01a3c0");
    }
  }, [groupToEdit, open]);

  const handleAction = () => {
    if (!label.trim()) {
      toast("Please enter a group name");
      return;
    }
    const tasksArray = tasksText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (tasksArray.length === 0) {
      toast("Please add at least one task");
      return;
    }

    if (groupToEdit) {
      // Logic for editing: check if removed tasks are being used
      const removedTasks = groupToEdit.tasks.filter((t: string) => !tasksArray.includes(t));
      const usedRemovedTasks = removedTasks.filter((rt: string) =>
        tasks.some(task => task.groupId === groupToEdit.id && task.task === rt)
      );

      if (usedRemovedTasks.length > 0) {
        toast.error(`Cannot remove tasks: ${usedRemovedTasks.join(", ")} because they are currently used in the calendar.`);
        return;
      }

      setGroups(groups.map(g => g.id === groupToEdit.id ? { ...g, label, tasks: tasksArray, color } : g));
      toast("Group updated successfully");
    } else {
      const newGroup = {
        id: Date.now().toString(),
        label,
        imageUrl: "",
        tasks: tasksArray,
        type: "custom",
        color,
      };
      setGroups((prev) => [...prev, newGroup]);
      toast("Group created successfully");
    }

    setOpen(false);
    if (!groupToEdit) {
      setLabel("");
      setTasksText("");
    }
  };

  const handleDeleteGroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!groupToEdit) return;

    const hasTasks = tasks.some(t => t.groupId === groupToEdit.id);
    if (hasTasks) {
      toast.error("Cannot delete group because it has tasks assigned in the calendar.");
      return;
    }

    if (confirm(`Are you sure you want to delete the group "${groupToEdit.label}"?`)) {
      setGroups(groups.filter(g => g.id !== groupToEdit.id));
      setOpen(false);
      toast("Group deleted successfully");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {groupToEdit ? (
          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-gray-400" />
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="ml-4 gap-2 hover:bg-black hover:text-white">
            <FontAwesomeIcon icon={faAdd} className="w-3 h-3" />
            Add Group
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{groupToEdit ? "Edit Group" : "Create New Group"}</DialogTitle>
          <DialogDescription>
            {groupToEdit ? "Modify group details and tasks." : "Add a new activity group and assign tasks to it."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <label className="text-sm font-medium">Group Name</label>
            <input
              className="mt-1 w-full border rounded-md p-2 text-sm"
              placeholder="e.g. Work, Study"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Tasks (comma-separated)
            </label>
            <input
              className="mt-1 w-full border rounded-md p-2 text-sm"
              placeholder="e.g. Development, Meeting, Review"
              value={tasksText}
              onChange={(e) => setTasksText(e.target.value)}
            />
          </div>

          <div className="flex gap-2 mt-2">
            <Button onClick={handleAction} className="flex-1">
              {groupToEdit ? "Update Group" : "Create Group"}
            </Button>
            {groupToEdit && (
              <Button onClick={handleDeleteGroup} variant="destructive" size="icon">
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
