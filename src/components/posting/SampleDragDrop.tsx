import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

const initialItems = [
  { id: "1", label: "Image 1", color: "#d1fae5" },
  { id: "2", label: "Image 2", color: "#bfdbfe" },
  { id: "3", label: "Image 3", color: "#fde68a" },
  { id: "4", label: "Image 4", color: "#fca5a5" },
];

const SortableItem = ({
  id,
  label,
  color,
}: {
  id: string;
  label: string;
  color: string;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: color,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-center border rounded-md p-4 cursor-grab select-none text-sm font-medium shadow-md"
    >
      {label}
    </div>
  );
};

export default function SampleDragDrop() {
  const [items, setItems] = useState(initialItems);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(items, oldIndex, newIndex);
      setItems(reordered);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">🧪 Test Drag-and-Drop</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i: any) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {items.map((item: any) => (
              <SortableItem key={item.id} {...item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
