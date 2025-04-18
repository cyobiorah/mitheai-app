import React, { useEffect, useState } from "react";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  deleteContent,
  deleteCollection,
  deleteTemplate,
} from "../../api/content";
import { ContentItem } from "../../types";
import ContentDialog from "./ContentDialog";
import { toast } from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";
import { useAuth } from "../../store/hooks";
import teamApi from "../../api/teamApi";

interface TabPanelProps {
  readonly children?: React.ReactNode;
  readonly index: number;
  readonly value: number;
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
  const { teams } = useAuth();
  const currentTeam: any = teams[0];

  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);

  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null
  );

  const [contentDialogOpen, setContentDialogOpen] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: "content" | "collection" | "template";
    id: string;
    title: string;
  } | null>(null);

  const fetchTeamsContent = async () => {
    setIsLoadingTeams(true);
    try {
      const tempTeamsContent = await teamApi.listTeamContent(currentTeam._id);
      setContent(tempTeamsContent);
    } catch (error: any) {
      console.log({ error });
      toast.error(`${error.message}`);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  useEffect(() => {
    // console.log({ currentTeam });
    if (currentTeam?._id) fetchTeamsContent();
  }, [currentTeam]);

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
      fetchTeamsContent(); // Refresh data
    } catch (error) {
      console.error(`Error deleting ${deleteConfirm.type}:`, error);
      toast.error(`Failed to delete ${deleteConfirm.type}`);
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="w-full">
      {/* Content Tab */}
      <TabPanel value={0} index={0}>
        {isLoadingTeams ? (
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

      <ContentDialog
        open={contentDialogOpen}
        onClose={() => setContentDialogOpen(false)}
        content={selectedContent}
        onSave={fetchTeamsContent}
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
