import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

const NotificationSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Control how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your account
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Disable
              </Button>
              <Button size="sm">Enable</Button>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div>
              <h4 className="font-medium">Post Publishing</h4>
              <p className="text-sm text-muted-foreground">
                Get notified when your posts are published
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Disable
              </Button>
              <Button size="sm">Enable</Button>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div>
              <h4 className="font-medium">Team Invitations</h4>
              <p className="text-sm text-muted-foreground">
                Receive notifications about team invites
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Disable
              </Button>
              <Button size="sm">Enable</Button>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div>
              <h4 className="font-medium">Account Security</h4>
              <p className="text-sm text-muted-foreground">
                Get alerts about account activity
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Disable
              </Button>
              <Button size="sm">Enable</Button>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Weekly Summary Email
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline">Daily</Button>
            <Button>Weekly</Button>
            <Button variant="outline">Monthly</Button>
            <Button variant="outline">Never</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;
