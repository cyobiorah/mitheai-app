import { useLocation } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";

export default function WaitlistForm() {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const referredBy = urlSearchParams.get("ref");

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
      <form
        action="https://formspree.io/f/mrbqgbll"
        method="POST"
        className="space-y-4"
      >
        <div>
          <Input type="text" name="name" placeholder="Your name" required />
        </div>
        <div>
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <Input
            type="text"
            name="organization"
            placeholder="Your company or team (optional)"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            name="subscribeToNewsletter"
            id="subscribeToNewsletter"
            className="w-4 h-4"
          />
          <label
            htmlFor="subscribeToNewsletter"
            className="text-sm font-medium text-gray-600 dark:text-gray-300 "
          >
            Keep me updated with news and product updates
          </label>
        </div>
        <Button type="submit" className="w-full">
          Join Waitlist
        </Button>
      </form>

      {referredBy && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You've been referred by a friend. You'll both get early access
            priority!
          </p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
        <p className="mb-4">
          After joining, share with friends to move up the list!
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            size="icon"
            variant="outline"
            className="text-[#1DA1F2] border-[#1DA1F2] bg-transparent hover:bg-[#1DA1F2] hover:text-white"
            aria-label="Share on Twitter"
          >
            <i className="ri-twitter-fill text-lg"></i>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="text-[#0A66C2] border-[#0A66C2] bg-transparent hover:bg-[#0A66C2] hover:text-white"
            aria-label="Share on LinkedIn"
          >
            <i className="ri-linkedin-fill text-lg"></i>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="text-[#4267B2] border-[#4267B2] bg-transparent hover:bg-[#4267B2] hover:text-white"
            aria-label="Share on Facebook"
          >
            <i className="ri-facebook-fill text-lg"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
