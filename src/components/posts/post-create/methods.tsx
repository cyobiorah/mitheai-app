import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Loader2, X } from "lucide-react";
import { getSocialIcon } from "../../../lib/utils";
import { SelectItem } from "../../ui/select";

export function MediaLinksInput({
  mediaLinks,
  newMediaLink,
  setNewMediaLink,
  addMediaLink,
  removeMediaLink,
}: {
  readonly mediaLinks: string[];
  readonly newMediaLink: string;
  readonly setNewMediaLink: (v: string) => void;
  readonly addMediaLink: () => void;
  readonly removeMediaLink: (link: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="font-medium" htmlFor="media-link">
        Media
      </label>
      <div className="flex gap-2">
        <Input
          placeholder="Add image or video URL"
          value={newMediaLink}
          onChange={(e) => setNewMediaLink(e.target.value)}
          id="media-link"
        />
        <Button type="button" onClick={addMediaLink} size="sm">
          Add
        </Button>
      </div>

      {mediaLinks.length > 0 && (
        <div className="mt-2 space-y-2">
          {mediaLinks.map((link, index) => (
            <div
              key={`${link}-${index}`}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <div className="truncate flex-1">{link}</div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeMediaLink(link)}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AccountSelection({ socialAccounts, field, isFetching }: any) {
  if (isFetching) {
    return <p>Loading accounts...</p>;
  }

  if (socialAccounts.length === 0) {
    return (
      <div className="text-center p-2 border rounded-md bg-muted">
        <p className="text-muted-foreground">No social accounts connected</p>
        <Button variant="link" size="sm" asChild className="mt-1">
          <a href="/dashboard/accounts">Connect an account</a>
        </Button>
      </div>
    );
  }

  return (
    <>
      {socialAccounts.map((account: any) => (
        <div
          key={account._id}
          className="flex items-center space-x-2 border p-2 rounded-md"
        >
          <input
            type="radio"
            id={account._id}
            checked={field.value === account._id}
            onChange={() => field.onChange(account._id)}
            className="h-4 w-4"
          />
          <label
            htmlFor={account._id}
            className="flex items-center space-x-2 text-sm cursor-pointer"
          >
            <i className={`${getSocialIcon(account.platform)} text-lg`}></i>
            <span>{account?.metadata?.username ?? account.accountName}</span>
          </label>
        </div>
      ))}
    </>
  );
}

export function PostStatusControls({ field }: any) {
  return (
    <div className="flex space-x-2">
      <Button
        type="button"
        variant={field.value === "scheduled" ? "default" : "outline"}
        onClick={() => field.onChange("scheduled")}
        size="sm"
      >
        Schedule
      </Button>
      <Button
        type="button"
        variant={field.value === "published" ? "default" : "outline"}
        onClick={() => field.onChange("published")}
        size="sm"
      >
        Post Now
      </Button>
    </div>
  );
}

export const getCollectionDisplay = (
  isFetchingCollections: boolean,
  collections: any
) => {
  if (isFetchingCollections) {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (collections.count > 0) {
    return collections.data.map((collection: any) => (
      <SelectItem key={collection._id} value={collection._id}>
        {collection.name}
      </SelectItem>
    ));
  }

  return (
    <SelectItem value="none" disabled>
      No collections available
    </SelectItem>
  );
};
