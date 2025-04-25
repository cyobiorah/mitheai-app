import { useEffect, useState } from "react";
import { collectionsApi } from "../../api/collectionsApi";
import { useAuth } from "../../store/hooks";

interface CollectionPickerModalProps {
  collectionData: {
    show: boolean;
    collectionsId: string;
    contentId: string;
  };
  onClose: () => void;
  onSelect: (collectionId: string, contentId: string, type: string) => void;
}

const CollectionPickerModal: React.FC<CollectionPickerModalProps> = ({
  collectionData,
  onClose,
  onSelect,
}) => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(
    collectionData.collectionsId ?? ""
  );

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await collectionsApi.listOrg(user?.organizationId!);
        setCollections(response.data);
      } catch (err: any) {
        console.log({ err });
        setError("Failed to load collections.");
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, [user?.organizationId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      onSelect(selected, collectionData.contentId, "socialposts");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Add to Collection</h2>
        {loading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {collections.length === 0 && (
                <div className="text-gray-500">No collections found.</div>
              )}
              {collections.map((col) => (
                <label
                  key={col._id}
                  className={`flex items-center gap-2 cursor-pointer rounded px-2 py-1 ${
                    selected === col._id
                      ? "bg-primary-50 dark:bg-primary-900"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="collection"
                    value={col._id}
                    checked={selected === col._id}
                    onChange={() => setSelected(col._id)}
                    className="accent-primary-500"
                    required
                  />
                  <span className="font-medium">{col.name}</span>
                  {col.description && (
                    <span className="text-xs text-gray-500 ml-2">
                      {col.description}
                    </span>
                  )}
                </label>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-60"
                disabled={!selected}
              >
                Add
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CollectionPickerModal;
