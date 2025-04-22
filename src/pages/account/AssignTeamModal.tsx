import React from "react";
import { SocialAccount } from "../../api/social";

type AssignTeamModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (accountId: string, teamId: string) => void;
  teams: { id: string; name: string }[];
  selectedAccount?: SocialAccount | null;
};

const AssignTeamModal: React.FC<AssignTeamModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  teams,
  selectedAccount,
}) => {
  const [currentSelection, setCurrentSelection] = React.useState(
    selectedAccount?.teamId ?? ""
  );

  React.useEffect(() => {
    setCurrentSelection(selectedAccount?.teamId ?? "");
  }, [selectedAccount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4">Assign Account to a Team</h2>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {teams.map((team) => (
            <label
              key={team.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200"
            >
              <input
                type="radio"
                name="team"
                value={team.id}
                checked={currentSelection === team.id}
                onChange={() => setCurrentSelection(team.id)}
                className="accent-blue-600"
              />
              <span className="text-sm">{team.name}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(selectedAccount?._id!, currentSelection);
            }}
            disabled={!currentSelection}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Confirm
          </button>
        </div>

        {/* Close button (optional) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AssignTeamModal;
