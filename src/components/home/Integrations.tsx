import { TwitterIcon, InstagramIcon, LinkedinIcon, FacebookIcon } from "lucide-react";

interface SocialPlatform {
  name: string;
  icon: React.ReactNode;
  color: string;
  comingSoon?: boolean;
}

export default function Integrations() {
  const platforms: SocialPlatform[] = [
    { 
      name: "Twitter", 
      icon: <TwitterIcon className="h-6 w-6" />, 
      color: "bg-[#1DA1F2]" 
    },
    { 
      name: "Instagram", 
      icon: <InstagramIcon className="h-6 w-6" />, 
      color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400" 
    },
    { 
      name: "LinkedIn", 
      icon: <LinkedinIcon className="h-6 w-6" />, 
      color: "bg-[#0A66C2]" 
    },
    { 
      name: "Facebook", 
      icon: <FacebookIcon className="h-6 w-6" />, 
      color: "bg-[#1877F2]" 
    },
    { 
      name: "Threads", 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01c-.017-2.319 1.128-4.041 3.13-4.712 1.07-.338 2.108-.314 3.134-.018 3.14.904 5.019 2.9 6.496 5.817.144.284.346.731.402.888.32-.887 1.069-2.863 1.926-4.243 1.186-2.614 2.674-4.126 4.43-4.5 1.343-.293 2.543.135 3.529 1.247 1.5 1.694 1.554 4.423.138 6.841-1.236 2.262-2.968 3.562-5.339 4.02-1.106.194-2.311.108-3.45-.248.772 2.582 1.94 4.569 4.086 6.075 1.075.758 2.3 1.242 3.648 1.444.638.106 1.254.66 1.33 1.304.088.77-.278 1.346-.928 1.736-.553.33-1.17.42-1.806.379-3.644-.207-6.519-1.765-8.851-4.641-1.055-1.367-1.744-2.897-2.266-4.532-.683-2.084-.927-4.199-.971-6.373h.025c-.051-1.303-.906-2.18-2.012-2.072-1.535.189-1.453 1.68-1.426 2.783.06 2.558.762 4.92 2.14 7.06 1.767 2.81 4.494 4.255 8.022 4.248 2.201.022 4.23-.558 6.139-1.646.774-.446 1.555-.358 2.079.241.584.665.638 1.474.145 2.191-1.324 1.757-3.173 2.65-5.273 3.118-1.51.29-3.012.346-4.54.157l.037-.013Z"/>
      </svg>, 
      color: "bg-black dark:bg-white dark:text-black",
      comingSoon: true 
    },
    { 
      name: "TikTok", 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.001.595.04.88.12V9.4a6.32 6.32 0 0 0-1-.05A6.35 6.35 0 0 0 6.79 20a6.34 6.34 0 0 0 6.59-6.34V7.87a8.16 8.16 0 0 0 6.21 1.48V6.69h-.01Z"/>
      </svg>, 
      color: "bg-black dark:bg-white dark:text-black",
      comingSoon: true 
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-medium text-gray-600 dark:text-gray-300 mb-2">
            Integrates With Your Favorite Platforms
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect and manage all your social media accounts in one place, with platform-specific formatting and previews.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {platforms.map((platform) => (
            <div 
              key={platform.name} 
              className="group relative"
            >
              <div className={`flex items-center space-x-3 px-5 py-3 rounded-full ${platform.comingSoon ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-800'} shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${platform.color}`}>
                  {platform.icon}
                </div>
                <span className="font-medium">{platform.name}</span>
                
                {platform.comingSoon && (
                  <span className="ml-1 inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-300">
                    Soon
                  </span>
                )}
              </div>
              
              {/* Decorative hover effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-300 to-secondary-300 dark:from-primary-700 dark:to-secondary-700 rounded-full opacity-0 group-hover:opacity-30 blur transition duration-1000 group-hover:duration-200"></div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-block bg-gray-50 dark:bg-gray-800 rounded-full px-6 py-2 border border-gray-200 dark:border-gray-700">
            <p className="text-muted-foreground text-sm">
              More platforms coming soon. <span className="font-medium text-primary-600 dark:text-primary-400">Request your favorite!</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
