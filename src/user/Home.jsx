import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Increase animation duration
      easing: "ease-in-out",
      once: false, // Make animations repeat on scroll
    });
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Navbar */}
      <nav id="home" className="bg-gray-800 text-white py-4 px-8">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Brand Name */}
          <div className="flex items-center space-x-2">
            <img
              src="/stocklogo.png" // Replace with your logo file in the public folder
              alt="Logo"
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-2xl font-bold">Stock Management System</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6 items-center">
            <a
              href="#home"
              className="hover:text-blue-300 transition duration-300"
            >
              Home
            </a>
            <a
              href="#about-us"
              className="hover:text-blue-300 transition duration-300 transform hover:scale-105"
            >
              About Us
            </a>
            <a
              href="#features"
              className="hover:text-blue-300 transition duration-300 transform hover:scale-105"
            >
              Features
            </a>
            <a
              href="#contact-us"
              className="hover:text-blue-300 transition duration-300 transform hover:scale-105"
            >
              Contact Us
            </a>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300 shadow-md transform hover:scale-105"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto text-center">
          <h2
            data-aos="fade-up"
            data-aos-duration="1500"
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent"
          >
            Welcome to Stock Management
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-xl mb-10 max-w-3xl mx-auto text-gray-300"
          >
            Streamline your inventory and manage your stock efficiently with our advanced tools.
          </p>
          <Link
            to="/signup"
            data-aos="zoom-in"
            data-aos-delay="400"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="py-20 bg-gray-800">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/stock.jpeg"
              alt="Warehouse Inventory Management"
              className="rounded-lg shadow-lg w-full h-auto object-cover border border-gray-700 hover:border-indigo-500 transition duration-300"
            />
          </div>
          <div>
            <h3
              data-aos="fade-up"
              className="text-3xl font-bold text-white mb-6"
            >
              About Us
            </h3>
            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-gray-300 leading-relaxed"
            >
              Our stock management system is designed to help businesses of all sizes manage their inventory efficiently. With features like real-time tracking, role-based access, and detailed reports, we ensure you have full control over your stock.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2
            data-aos="fade-up"
            className="text-3xl font-bold text-white mb-8 text-center"
          >
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">
                Real-Time Tracking
              </h3>
              <p className="text-gray-300">
                Monitor your inventory in real-time with our advanced tracking system.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">
                Role-Based Access
              </h3>
              <p className="text-gray-300">
                Provide access to different users based on their roles and responsibilities.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">
                Detailed Reports
              </h3>
              <p className="text-gray-300">
                Generate comprehensive reports to analyze your stock performance.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">
                Automated Alerts
              </h3>
              <p className="text-gray-300">
                Get notified when stock levels are low or when items need restocking.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">
                Payment Integration
              </h3>
              <p className="text-gray-300">
                Seamlessly integrate payment gateways to process transactions directly within the system.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">
                Custom Dashboards
              </h3>
              <p className="text-gray-300">
                Create personalized dashboards to visualize your data effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact-us" className="bg-gray-800 text-white py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
 
          {/* About Us */}
          <div>
            <h4 className="text-lg font-bold mb-4">About Us</h4>
            <p className="text-sm text-gray-300">
              Our stock management system is designed to help businesses streamline their inventory processes. We provide tools for real-time tracking, role-based access, and detailed reporting.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="hover:text-blue-300 transition duration-300 transform hover:scale-105"
                  >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about-us"
                  className="hover:text-blue-300 transition duration-300 transform hover:scale-105"
                  >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-blue-300 transition duration-300 transform hover:scale-105"
                  >
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <p className="text-sm text-gray-300">
              Email: support@stockmanagement.com
            </p>
            <p className="text-sm text-gray-300">
              Phone: +251 923240624
            </p>
            <div className="flex space-x-4 mt-4">
              {/* Social Media Icons */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 2C6.477 2 2 6.484 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.516-4.477-10-10-10z"
                  />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12c0 1.105-1.12 2-2.5 2S3 13.105 3 12s1.12-2 2.5-2 2.5.895 2.5 2zm7 0c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2zM15 6c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"
                  />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm">
          &copy; 2023 Stock Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;