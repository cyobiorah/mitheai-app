import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { collectionsApi } from "../../api/collectionsApi";
import CollectionModal from "./CollectionModal";
import { useAuth } from "../../store/hooks";
import toast from "react-hot-toast";

const Collections = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any | null>(
    null
  );

  useEffect(() => {
    fetchCollections();
  }, [user?.organizationId]);

  const handleCreateCollection = async (formData: any) => {
    try {
      await collectionsApi.create(formData);
      toast.success("Collection created successfully");
    } catch (err: any) {
      console.log({ err });
      setError(err.message);
    } finally {
      setShowModal(false);
      setLoading(false);
      fetchCollections();
    }
  };

  const handleUpdateCollection = async (formData: any, id: string) => {
    try {
      await collectionsApi.update(id, formData);
      toast.success("Collection updated successfully");
    } catch (err: any) {
      console.log({ err });
      setError(err.message);
    } finally {
      setShowModal(false);
      setLoading(false);
      fetchCollections();
    }
  };

  const fetchCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await collectionsApi.listOrg(user?.organizationId!);
      setCollections(response.data);
    } catch (err: any) {
      console.log({ err });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteCollection = async (id: string) => {
    setLoading(true);

    try {
      await collectionsApi.remove(id);
      toast.success("Collection deleted successfully");
    } catch (err: any) {
      console.log({ err });
      setError(err.message);
    } finally {
      setLoading(false);
      fetchCollections();
    }
  };

  const handleModalSubmit = async (formData: any, id?: string) => {
    if (id) {
      await handleUpdateCollection(formData, id);
    } else {
      await handleCreateCollection(formData);
    }
    setShowModal(false);
    setLoading(false);
    fetchCollections();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          Collections
        </h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md font-medium transition"
          onClick={() => {
            setShowModal(true);
            setSelectedCollection(null);
          }}
        >
          <PlusIcon className="h-5 w-5" />
          New Collection
        </button>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="text-gray-500 dark:text-gray-300">Loading...</div>
      )}
      {error && <div className="text-red-500 dark:text-red-400">{error}</div>}

      {/* Collections List */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {collections.length === 0 ? (
            <div className="col-span-full text-gray-500 dark:text-gray-300">
              No collections yet.
            </div>
          ) : (
            collections.map((col: any) => (
              <div
                key={col._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-6 flex flex-col"
              >
                {/* Optional: Cover image */}
                {col.coverImage && (
                  <img
                    src={col.coverImage}
                    alt={col.name}
                    className="h-32 w-full object-cover rounded mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">{col.name}</h2>
                {col.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {col.description}
                  </p>
                )}
                {/* Placeholder for actions: View, Edit, Delete */}
                <div className="mt-auto flex gap-2">
                  <button className="text-primary-500 hover:underline">
                    View
                  </button>
                  <button
                    className="text-gray-500 hover:underline"
                    onClick={() => {
                      setSelectedCollection(col);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDeleteCollection(col._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <CollectionModal
          onClose={() => setShowModal(false)}
          //   onSubmit={(formData: any) => handleCreateCollection(formData)}
          onSubmit={handleModalSubmit}
          initialData={selectedCollection}
        />
      )}
    </div>
  );
};

export default Collections;
