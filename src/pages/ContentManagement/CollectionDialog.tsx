import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../store/hooks";
import { createCollection, updateCollection } from "../../api/content";
import { ContentCollection } from "../../types";

interface CollectionDialogProps {
  open: boolean;
  onClose: () => void;
  collection: ContentCollection | null;
  onSave: () => void;
}

interface FormData {
  name: string;
  description: string;
  metadata: {
    tags: string[];
    customFields: Record<string, any>;
  };
  settings: {
    permissions: string[];
  };
}

export default function CollectionDialog({
  open,
  onClose,
  collection,
  onSave,
}: CollectionDialogProps) {
  const { teams, user } = useAuth();
  const currentTeam = teams[0];

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    metadata: {
      tags: [],
      customFields: {},
    },
    settings: {
      permissions: [],
    },
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name,
        description: collection.description || "",
        metadata: {
          tags: collection.metadata.tags,
          customFields: collection.metadata.customFields,
        },
        settings: {
          permissions: collection.settings.permissions,
        },
      });
    }
  }, [collection]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.metadata.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          tags: [...prev.metadata.tags, tagInput.trim()],
        },
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        tags: prev.metadata.tags.filter((tag) => tag !== tagToRemove),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeam || !user) return;

    try {
      if (collection) {
        await updateCollection(collection.id, {
          ...formData,
          teamId: currentTeam.id,
          organizationId: currentTeam.organizationId,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await createCollection({
          ...formData,
          teamId: currentTeam.id,
          organizationId: currentTeam.organizationId,
          contentIds: [],
          createdAt: new Date().toISOString(),
          createdBy: user.uid,
          updatedAt: new Date().toISOString(),
        });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving collection:", error);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 dark:bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-medium text-neutral-900 dark:text-white">
                    {collection ? "Edit Collection" : "New Collection"}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-neutral-400 hover:text-neutral-500 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-neutral-700 dark:text-gray-300"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleTextChange}
                      required
                      className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-neutral-700 dark:text-gray-300"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleTextChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300">
                      Tags
                    </label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {formData.metadata.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-primary-50 dark:bg-primary-900/50 px-2 py-1 text-xs font-medium text-primary-700 dark:text-primary-300"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="mt-1 flex">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), handleAddTag())
                        }
                        placeholder="Add a tag"
                        className="block w-full rounded-l-md border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="ml-2 inline-flex items-center rounded-md border border-transparent bg-primary-600 dark:bg-primary-500 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md border border-transparent bg-primary-600 dark:bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2"
                    >
                      {collection ? "Save Changes" : "Create Collection"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
