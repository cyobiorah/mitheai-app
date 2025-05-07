import { getSocialIcon } from "../../../lib/utils";
import { useAuth } from "../../../store/hooks";
import { format } from "date-fns";

const Preview = ({
  form,
  mediaLinks,
  socialAccounts,
}: {
  form: any;
  mediaLinks: string[];
  socialAccounts: any[];
}) => {
  const { user } = useAuth();

  return (
    <div className="border rounded-lg p-4 max-w-md">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary text-sm font-medium">
              {user?.firstName?.charAt(0) ?? user?.username?.charAt(0) ?? "U"}
            </span>
          </div>
          <div>
            <p className="font-medium">{user?.firstName ?? ""}</p>
            <p className="text-xs text-muted-foreground">
              {getScheduleText(form)}
            </p>
          </div>
        </div>

        <div className="text-sm">
          {form.watch("content") ?? (
            <span className="text-muted-foreground italic">
              No content added yet
            </span>
          )}
        </div>

        {mediaLinks.length > 0 && (
          <div className="space-y-2">
            {mediaLinks.map((link, index) => (
              <div
                key={`${link}-${index}`}
                className="border rounded-md p-2 text-xs text-muted-foreground"
              >
                Media: {link}
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-2 flex flex-wrap gap-1">
          {(() => {
            const selectedAccountId = form.watch("selectedAccount");
            const account = socialAccounts.find(
              (a: any) => a._id === selectedAccountId
            );

            if (!account) return null;

            return (
              <div
                key={account._id}
                className="text-xs bg-muted px-2 py-1 rounded-full flex items-center"
              >
                <i className={`${getSocialIcon(account.platform)} mr-1`}></i>
                <span>{account.accountName}</span>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Preview;

function getScheduleText(form: any) {
  if (form.watch("status") === "scheduled") {
    return `Scheduled for ${format(
      form.watch("scheduleTime") as Date,
      "PPP 'at' h:mm a"
    )}`;
  } else if (form.watch("status") === "published") {
    return "Publishing now";
  }
}
