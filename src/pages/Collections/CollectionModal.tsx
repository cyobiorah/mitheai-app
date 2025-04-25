import { useState } from "react";

interface CollectionModalProps {
  onClose: () => void;
  onSubmit: (formData: any, id?: string) => void;
  initialData?: {
    _id?: string;
    name: string;
    description?: string;
    coverImage?: string;
  } | null;
}

const CollectionModal = ({
  onClose,
  onSubmit,
  initialData,
}: CollectionModalProps) => {
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    coverImage: initialData?.coverImage ?? "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("Name is required.");
      return;
    }

    try {
      onSubmit(
        {
          name: form.name,
          description: form.description,
          coverImage: form.coverImage,
        },
        initialData?._id
      );
    } catch (err: any) {
      console.log({ err });
      setFormError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit" : "Create"} Collection
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="border rounded px-3 py-2"
            placeholder="Collection Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            className="border rounded px-3 py-2"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Cover Image URL (optional)"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          />
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-60"
            >
              {initialData ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
              onClick={() => onClose()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionModal;
