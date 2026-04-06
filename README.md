# React Weekly Planning Demo

A professional, high-performance weekly scheduling and planning interface built with React and Tailwind CSS.

---

## ⚡ Quick Start (Minimalist Example)

To get started quickly, you need to wrap your application with the `CalendarTaskContextProvider` and use the `Calendar` component.

```tsx
import { Calendar, CalendarTaskContextProvider, useCalendarTaskContext } from "react-weekly-planning";

// A sub-component to access the context with useCalendarTaskContext()
const MyCalendarContent = () => {
  const { addTask } = useCalendarTaskContext();

  return (
    <Calendar
      groups={myGroups} // Array of groups
      date={new Date()} // Today's date
      weekOffset={0}      // Current week
      handleDragTask={() => {}} // Crucial: must be defined to enable internal drag-and-drop
      
      // Simple task creation trigger
      addTaskRender={({ currentGroup, dayInfo }) => (
        <button 
          onClick={() => {
            const newTask = {
              id: "new-task-id", // Should be generated using uuidv4()
              task: "Meeting",
              taskStart: dayInfo.start,
              taskEnd: dayInfo.end,
              taskDate: dayInfo.day,
              groupId: currentGroup.id,
              dayIndex: dayInfo.positionDay,
              taskExpiryDate: new Date(Date.now() + 86400000),
            };
            addTask(newTask);
          }}
          className="w-full h-full opacity-0 hover:opacity-100 bg-blue-100 transition-opacity"
        >
          + Add Task
        </button>
      )}
    />
  );
};

// Root component that provides the context required by useCalendarTaskContext()
const MyCalendarApp = () => (
  <CalendarTaskContextProvider>
    <MyCalendarContent />
  </CalendarTaskContextProvider>
);

export default MyCalendarApp;
```

---

## 🛠️ Calendar Component Reference

The `Calendar` component is the core of the library. It is highly customizable through the following properties.

### ⚙️ Configuration Props

| Prop | Description |
| :--- | :--- |
| **`className`** | Custom CSS classes (e.g., Tailwind) for the main container. |
| **`taskContainerStyle`** | Inline CSS for the task container (borders, z-index, radii). |
| **`groupsColsStyle`** | Inline CSS for the groups column (e.g., width). |
| **`dayClassName`** | CSS classes applied to each day cell. |
| **`groups`** | The array of group data to be displayed. |
| **`date`** | The reference date for the current view. |
| **`weekOffset`** | Number of weeks to offset from the reference date. |

### 🎨 Custom Rendering (Render Props)

| Prop | Description |
| :--- | :--- |
| **`groupsHeadRender`** | Customize the header of the groups column. |
| **`groupRender`** | Define how each individual group row is rendered. |
| **`taskRender`** | Define how each task is displayed in the calendar. |
| **`addTaskRender`** | Customize the "add task" interaction (e.g., a trigger for a modal). |

### 🖱️ Event Handling (Drag & Drop)

| Prop | Description |
| :--- | :--- |
| **`handleDragTask`** | Called when a task drag begins. **Must be defined to enable D&D.** |
| **`handleDragTaskEnd`** | Called when a task is dropped after dragging. |

> [!TIP]
> **Drag & Drop Activation**: The internal `drop` logic in the `Calendar` component specifically checks for the existence of `handleDragTask`. To enable drag-and-drop, you must provide this prop, even if it is an empty function: `handleDragTask={() => {}}`.

---

## 📁 Task Creation & Management

This project uses specific components and logic to manage modern task lifecycle operations.

### Component Breakdown

#### `AddTaskTrigger`
An interactive overlay for empty slots that:
- Opens a creation dialog on click.
- Visualizes drop targets during drag-and-drop.
- Provides a **context menu** for **Paste** operations.

#### `CreatePlanningContainer`
The form component inside the creation dialog:
- Validates time ranges and checks for duplicates.
- Uses `addTask` to persist the new task to the calendar context.

### Task Object Structure (`handleAddTask`)

When creating a task, the task object should follow this structure before calling `addTask(newTask)`:

| Property | Type | Description |
| :--- | :--- | :--- |
| **`id`** | `string` | Unique identifier (e.g., `uuidv4()`). |
| **`taskStart`** | `number` | Start time (milliseconds). |
| **`taskEnd`** | `number` | End time (milliseconds). |
| **`task`** | `string` | The title/content of the task. |
| **`taskDate`** | `Date` | The specific day of the task. |
| **`groupId`** | `string` | The associated group ID. |
| **`dayIndex`** | `number` | Position index of the day in the week. |
| **`taskExpiryDate`** | `Date` | **Crucial expiration timestamp.** |

> [!IMPORTANT]
> **Warning on Expiration**: If `taskExpiryDate` is **missing** or **already passed**, the task may disappear from the UI immediately after creation. Ensure it is set to a future date (e.g., 24 hours from creation).

---

## 🚀 Development

### Installation & Setup

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
