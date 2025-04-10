import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../store/hooks";
import { createTemplate, updateTemplate } from "../../api/content";
import { AnalysisTemplate } from "../../types";

interface TemplateDialogProps {
  open: boolean;
  onClose: () => void;
  template: AnalysisTemplate | null;
  onSave: () => void;
}

type TemplateType = "sentiment" | "classification" | "extraction" | "custom";

interface FormData {
  name: string;
  description: string;
  type: TemplateType;
  config: {
    models: string[];
    parameters: Record<string, any>;
    preprocessors: string[];
    postprocessors: string[];
  };
  settings: {
    permissions: string[];
    autoApply: boolean;
    contentTypes: (
      | "article"
      | "social_post"
      | "video"
      | "image"
      | "document"
    )[];
  };
}

const contentTypeOptions = [
  { value: "article", label: "Article" },
  { value: "social_post", label: "Social Post" },
  { value: "video", label: "Video" },
  { value: "image", label: "Image" },
  { value: "document", label: "Document" },
];

const templateTypes = [
  { value: "sentiment", label: "Sentiment Analysis" },
  { value: "classification", label: "Classification" },
  { value: "extraction", label: "Data Extraction" },
  { value: "custom", label: "Custom Analysis" },
];

export default function TemplateDialog({
  open,
  onClose,
  template,
  onSave,
}: TemplateDialogProps) {
  const { teams, user } = useAuth();
  const currentTeam = teams[0];

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    type: "sentiment",
    config: {
      models: [],
      parameters: {},
      preprocessors: [],
      postprocessors: [],
    },
    settings: {
      autoApply: false,
      permissions: [],
      contentTypes: [],
    },
  });

  const [modelInput, setModelInput] = useState("");

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description || "",
        type: template.type,
        config: {
          models: template.config.models,
          parameters: template.config.parameters,
          preprocessors: template.config.preprocessors || [],
          postprocessors: template.config.postprocessors || [],
        },
        settings: {
          autoApply: template.settings.autoApply,
          permissions: template.settings.permissions,
          contentTypes: template.settings.contentTypes,
        },
      });
    }
  }, [template]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      type: e.target.value as TemplateType,
    }));
  };

  const handleContentTypesChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        contentTypes: prev.settings.contentTypes.includes(type as any)
          ? prev.settings.contentTypes.filter((t) => t !== type)
          : [...prev.settings.contentTypes, type as any],
      },
    }));
  };

  const handleAddModel = () => {
    if (
      modelInput.trim() &&
      !formData.config.models.includes(modelInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          models: [...prev.config.models, modelInput.trim()],
        },
      }));
      setModelInput("");
    }
  };

  const handleRemoveModel = (modelToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        models: prev.config.models.filter((model) => model !== modelToRemove),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeam || !user) return;

    try {
      if (template) {
        await updateTemplate(template.id, {
          ...formData,
          teamId: currentTeam._id,
          organizationId: currentTeam.organizationId,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await createTemplate({
          ...formData,
          teamId: currentTeam._id,
          organizationId: currentTeam.organizationId,
          createdAt: new Date().toISOString(),
          createdBy: user.uid,
          updatedAt: new Date().toISOString(),
        });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving template:", error);
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
                    {template ? "Edit Template" : "New Template"}
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
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-neutral-700 dark:text-gray-300"
                    >
                      Template Type
                    </label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={handleTypeChange}
                      className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
                    >
                      {templateTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300">
                      Models
                    </label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {formData.config.models.map((model) => (
                        <span
                          key={model}
                          className="inline-flex items-center rounded-full bg-primary-50 dark:bg-primary-900/50 px-2 py-1 text-xs font-medium text-primary-700 dark:text-primary-300"
                        >
                          {model}
                          <button
                            type="button"
                            onClick={() => handleRemoveModel(model)}
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
                        value={modelInput}
                        onChange={(e) => setModelInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), handleAddModel())
                        }
                        placeholder="Add a model"
                        className="block w-full rounded-l-md border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddModel}
                        className="ml-2 inline-flex items-center rounded-md border border-transparent bg-primary-600 dark:bg-primary-500 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2">
                      Content Types
                    </label>
                    <div className="space-y-2">
                      {contentTypeOptions.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.settings.contentTypes.includes(
                              option.value as any
                            )}
                            onChange={() =>
                              handleContentTypesChange(option.value)
                            }
                            className="h-4 w-4 rounded border-neutral-300 dark:border-gray-600 text-primary-600 dark:text-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400"
                          />
                          <span className="ml-2 text-sm text-neutral-700 dark:text-gray-300">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoApply"
                      checked={formData.settings.autoApply}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            autoApply: e.target.checked,
                          },
                        }))
                      }
                      className="h-4 w-4 rounded border-neutral-300 dark:border-gray-600 text-primary-600 dark:text-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400"
                    />
                    <label
                      htmlFor="autoApply"
                      className="ml-2 block text-sm text-neutral-700 dark:text-gray-300"
                    >
                      Auto-apply to new content
                    </label>
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
                      {template ? "Save Changes" : "Create Template"}
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
