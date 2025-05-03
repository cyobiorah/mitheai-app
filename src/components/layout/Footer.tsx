import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-white text-2xl font-bold flex items-center mb-4">
              <i className="ri-calendar-check-fill mr-1"></i>
              <span className="font-heading">Skedlii</span>
            </div>
            <p className="mb-4">
              Simplify social media management for your entire team.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-white">
                <i className="ri-twitter-fill text-lg"></i>
              </button>
              <button className="text-gray-400 hover:text-white">
                <i className="ri-linkedin-fill text-lg"></i>
              </button>
              <button className="text-gray-400 hover:text-white">
                <i className="ri-instagram-fill text-lg"></i>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/#features">
                  <span className="hover:text-white">Features</span>
                </Link>
              </li>
              <li>
                <Link to="/#solutions">
                  <span className="hover:text-white">Solutions</span>
                </Link>
              </li>
              <li>
                <Link to="/#pricing">
                  <span className="hover:text-white">Pricing</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Status
                </a>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p>&copy; {new Date().getFullYear()} Skedlii. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
