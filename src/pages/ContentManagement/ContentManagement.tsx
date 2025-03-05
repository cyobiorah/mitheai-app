import React, { useEffect, useState } from "react";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import {
  listTeamContent,
  listTeamCollections,
  listTeamTemplates,
  deleteContent,
  deleteCollection,
  deleteTemplate,
  getPersonalContent,
  getPersonalCollections,
} from "../../api/content";
import { ContentItem, ContentCollection, AnalysisTemplate } from "../../types";
import ContentDialog from "./ContentDialog";
import CollectionDialog from "./CollectionDialog";
import TemplateDialog from "./TemplateDialog";
import AnalyzeDialog from "./AnalyzeDialog";
import clsx from "clsx";
import { toast } from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      className="py-6"
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export default function ContentManagement() {
  const { teams, user } = useAuth();
  const currentTeam = teams[0];

  const [tabIndex, setTabIndex] = useState(0);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [collections, setCollections] = useState<ContentCollection[]>([]);
  const [templates, setTemplates] = useState<AnalysisTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null
  );
  const [selectedCollection, setSelectedCollection] =
    useState<ContentCollection | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<AnalysisTemplate | null>(null);
  const [contentToAnalyze, setContentToAnalyze] = useState<ContentItem | null>(
    null
  );

  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [analyzeDialogOpen, setAnalyzeDialogOpen] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: "content" | "collection" | "template";
    id: string;
    title: string;
  } | null>(null);

  const fetchData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      if (user.userType === "organization" && currentTeam) {
        // For organization users, fetch team content
        const [contentData, collectionsData, templatesData] = await Promise.all(
          [
            listTeamContent(currentTeam.id),
            listTeamCollections(currentTeam.id),
            listTeamTemplates(currentTeam.id),
          ]
        );
        console.log({ contentData, collectionsData, templatesData });
        setContent(contentData);
        setCollections(collectionsData);
        setTemplates(templatesData);
      } else {
        // For individual users, fetch personal content
        const [contentData, collectionsData, templatesData] = await Promise.all(
          [
            getPersonalContent(),
            getPersonalCollections(),
            listTeamTemplates("personal"), // This will return personal templates
          ]
        );
        setContent(contentData);
        setCollections(collectionsData);
        setTemplates(templatesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load content");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentTeam, user]);

  const handleTabChange = (newValue: number) => {
    setTabIndex(newValue);
  };

  const handleDeleteClick = (
    type: "content" | "collection" | "template",
    id: string,
    title: string
  ) => {
    setDeleteConfirm({
      open: true,
      type,
      id,
      title,
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const { type, id } = deleteConfirm;
      switch (type) {
        case "content":
          await deleteContent(id);
          break;
        case "collection":
          await deleteCollection(id);
          break;
        case "template":
          await deleteTemplate(id);
          break;
      }
      toast.success(`${type} deleted successfully`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error(`Error deleting ${deleteConfirm.type}:`, error);
      toast.error(`Failed to delete ${deleteConfirm.type}`);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const tabs = ["Content", "Collections", "Analysis Templates"];

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-gray-700">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => handleTabChange(index)}
              className={clsx(
                tabIndex === index
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:text-gray-400 dark:hover:text-gray-300",
                "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Tab */}
      <TabPanel value={tabIndex} index={0}>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Content Items
              </h2>
              <button
                onClick={() => {
                  setSelectedContent(null);
                  setContentDialogOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Add Content
              </button>
            </div>

            {content.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No content items found
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <ul className="divide-y divide-neutral-200 dark:divide-gray-700">
                  {content.map((item) => (
                    <li key={item.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-gray-400">{`${item.type} - ${item.status}`}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setContentToAnalyze(item);
                              setAnalyzeDialogOpen(true);
                            }}
                            className="p-2 text-neutral-400 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-lg transition-colors"
                            title="Analyze"
                          >
                            <PlayIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedContent(item);
                              setContentDialogOpen(true);
                            }}
                            className="p-2 text-neutral-400 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedContent(item);
                              setDeleteConfirm({
                                open: true,
                                type: "content",
                                id: item.id,
                                title: item.title,
                              });
                            }}
                            className="p-2 text-neutral-400 hover:text-error-600 dark:text-gray-400 dark:hover:text-error-400 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </TabPanel>

      {/* Collections Tab */}
      <TabPanel value={tabIndex} index={1}>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No collections found
            </p>
            <button
              onClick={() => {
                setSelectedCollection(null);
                setCollectionDialogOpen(true);
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Collection
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Collections
            </h2>
            <button
              onClick={() => {
                setSelectedCollection(null);
                setCollectionDialogOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Add Collection
            </button>
          </div>
        )}
        {collections.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <ul className="divide-y divide-neutral-200 dark:divide-gray-700">
              {collections.map((collection) => (
                <li key={collection.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-gray-400">{`${collection.contentIds.length} items`}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCollection(collection);
                          setCollectionDialogOpen(true);
                        }}
                        className="p-2 text-neutral-400 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete("collection", collection.id)
                        }
                        className="p-2 text-neutral-400 hover:text-error-600 dark:text-gray-400 dark:hover:text-error-400 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </TabPanel>

      {/* Templates Tab */}
      <TabPanel value={tabIndex} index={2}>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No templates found
            </p>
            <button
              onClick={() => {
                setSelectedTemplate(null);
                setTemplateDialogOpen(true);
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Template
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Analysis Templates
            </h2>
            <button
              onClick={() => {
                setSelectedTemplate(null);
                setTemplateDialogOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Add Template
            </button>
          </div>
        )}
        {templates.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <ul className="divide-y divide-neutral-200 dark:divide-gray-700">
              {templates.map((template) => (
                <li key={template.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                        {template.name}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-gray-400">
                        {template.type}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTemplate(template);
                          setTemplateDialogOpen(true);
                        }}
                        className="p-2 text-neutral-400 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete("template", template.id)}
                        className="p-2 text-neutral-400 hover:text-error-600 dark:text-gray-400 dark:hover:text-error-400 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </TabPanel>

      <ContentDialog
        open={contentDialogOpen}
        onClose={() => setContentDialogOpen(false)}
        content={selectedContent}
        onSave={fetchData}
      />

      <CollectionDialog
        open={collectionDialogOpen}
        onClose={() => setCollectionDialogOpen(false)}
        collection={selectedCollection}
        onSave={fetchData}
      />

      <TemplateDialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        template={selectedTemplate}
        onSave={fetchData}
      />

      <AnalyzeDialog
        open={analyzeDialogOpen}
        onClose={() => setAnalyzeDialogOpen(false)}
        content={contentToAnalyze}
        templates={templates}
        onAnalyze={fetchData}
      />

      <ConfirmDialog
        open={!!deleteConfirm}
        title={`Delete ${deleteConfirm?.type}`}
        message={`Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
