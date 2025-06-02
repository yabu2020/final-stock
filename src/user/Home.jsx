import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white py-4 px-8 fixed w-full z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/stocklogo.png" alt="Logo" className="h-10 w-10 rounded-full" />
            <h1 className="text-2xl font-bold">Stock Management System</h1>
          </div>
          <div className="flex space-x-6 items-center">
            <a href="#home" className="hover:text-blue-300 transition duration-300">
              Home
            </a>
            <a href="#about-us" className="hover:text-blue-300 transition duration-300 transform hover:scale-105">
              About Us
            </a>
            <a href="#features" className="hover:text-blue-300 transition duration-300 transform hover:scale-105">
              Features
            </a>
            <a href="#contact-us" className="hover:text-blue-300 transition duration-300 transform hover:scale-105">
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
      <section className="relative bg-gray-900 text-white pt-32 pb-32 min-h-[80vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gray-900"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 data-aos="fade-up" data-aos-duration="1500" className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Welcome to Stock Management
            </h2>
            <p data-aos="fade-up" data-aos-delay="200" className="text-xl md:text-2xl mb-12 text-gray-300 leading-relaxed">
              Streamline your inventory and manage your stock efficiently with our advanced tools. Gain real-time visibility and control over your business operations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4" data-aos="zoom-in" data-aos-delay="400">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-md font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-700 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse z-0"></div>
        <div className="container mx-auto relative z-10 px-4 md:px-12 space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div data-aos="zoom-in">
              <img src="/stock.jpeg" alt="Warehouse Inventory" className="rounded-lg shadow-xl border border-gray-700 hover:border-indigo-500 transition duration-300 w-full h-80 object-cover" />
            </div>
            <div className="space-y-6">
              <h3 data-aos="fade-up" className="text-4xl font-bold text-white">About Us</h3>
              <div className="flex items-start space-x-4" data-aos="fade-right">
                <div className="bg-indigo-600 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m9-6a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  We develop user-friendly inventory solutions tailored for small to mid-sized businesses, focusing on reliability and efficiency.
                </p>
              </div>
              <div className="flex items-start space-x-4" data-aos="fade-left">
                <div className="bg-indigo-600 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4-4h.01M21 12.34A9.958 9.958 0 0012 2a9.958 9.958 0 00-9 5.34M3 12.34A9.958 9.958 0 0012 22a9.958 9.958 0 009-5.66" />
                  </svg>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Our team focused on creating a scalable and secure solution that balances usability with functionality, making stock management more efficient and less error-prone.
                </p>
              </div>
              <div className="flex items-start space-x-4" data-aos="fade-up">
                <div className="bg-indigo-600 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17a1 1 0 002 0v-6a1 1 0 00-2 0v6zM5 17a1 1 0 002 0V9a1 1 0 00-2 0v8zM17 17a1 1 0 002 0v-3a1 1 0 00-2 0v3z" />
                  </svg>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Currently supporting multiple demo clients with real-time data logging, role-based permissions, and streamlined stock workflows.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div data-aos="zoom-in">
              <img src="/stockk.avif" alt="Inventory System UI" className="rounded-lg shadow-xl border border-gray-700 hover:border-indigo-500 transition duration-300 w-full h-auto object-cover" />
            </div>
            <div className="space-y-6">
              <h3 data-aos="fade-up" className="text-4xl font-bold text-white">Streamlined Dashboard</h3>
              <div className="flex items-start space-x-4" data-aos="fade-right">
                <div className="bg-indigo-600 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m9-6a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Our dashboard offers real-time inventory visibility, actionable insights, and intuitive navigation — built to reduce training time and operational friction.
                </p>
              </div>
              <div className="flex items-start space-x-4" data-aos="fade-left">
                <div className="bg-indigo-600 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Built with modern design principles to offer clarity, reduce cognitive load, and support rapid decision-making.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 data-aos="fade-up" className="text-3xl font-bold text-white mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Real-Time Tracking",
                description: "Monitor your inventory in real-time with our advanced tracking system.",
                icon: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
              },
              {
                title: "Role-Based Access",
                description: "Provide access to different users based on their roles and responsibilities.",
                icon: <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-.5a5.5 5.5 0 00-5.05-5.48A10 10 0 0012 2z" />,
              },
              {
                title: "Detailed Reports",
                description: "Generate comprehensive reports to analyze your stock performance.",
                icon: <path d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h4l2 2h6a2 2 0 012 2v12a2 2 0 01-2 2z" />,
              },
              {
                title: "Alerts",
                description: "Get notified when stock levels are low or when items need restocking.",
                icon: <path d="M13 16h-1v-4h-1m4-4h.01M12 2a10 10 0 00-9.95 9.02A5.5 5.5 0 002 16.5V17h20v-.5a5.5 5.5 0 00-5.05-5.48A10 10 0 0012 2z" />,
              },
              {
                title: "Payment Integration",
                description: "Seamlessly integrate payment gateways to process transactions directly within the system.",
                icon: <path d="M17 9V7a4 4 0 00-8 0v2m1 4h6m-3 4v2m-8-2h1m12 0h1M5 13V9h14v4H5z" />,
              },
              {
                title: "Custom Dashboards",
                description: "Create personalized dashboards to visualize your data effectively.",
                icon: <path d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zM3 21h8v-6H3v6zM13 3v6h8V3h-8z" />,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:shadow-xl hover:border-indigo-500 hover:bg-gray-700 transform hover:-translate-y-1 hover:text-white transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-indigo-600 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {feature.icon}
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center">{feature.title}</h3>
                <p className="text-gray-300 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact-us" className="bg-gray-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/stocklogo.png" alt="Logo" className="h-10 w-10 rounded-full" />
              <span className="text-xl font-bold">Stock</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Powerful stock and inventory tools to help your business stay efficient and grow faster.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition"
              >
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.89h-2.33v6.99C18.34 21.19 22 17.06 22 12.07z" />
                </svg>
              </a>
              <a
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition"
              >
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.59-2.46.69a4.28 4.28 0 001.88-2.37 8.48 8.48 0 01-2.7 1.03 4.26 4.26 0 00-7.26 3.89 12.1 12.1 0 01-8.8-4.46 4.26 4.26 0 001.32 5.68A4.21 4.21 0 012.8 9.7v.05a4.26 4.26 0 003.42 4.18 4.27 4.27 0 01-1.93.07 4.27 4.27 0 003.98 2.96A8.55 8.55 0 012 19.54a12.07 12.07 0 006.55 1.92c7.87 0 12.18-6.52 12.18-12.18 0-.18 0-.36-.01-.54A8.73 8.73 0 0022.46 6z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {["Home", "About Us", "Features", "Terms of Service", "Privacy Policy"].map((label) => (
                <li key={label}>
                  <a href={`#${label.toLowerCase().replace(/ /g, "-")}`} className="hover:text-blue-400 transition transform hover:translate-x-1">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M16 12H8m0 0l4-4m-4 4l4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>support@stockmanagement.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 5h12M9 3v2m6 4v10m-3 3l3-3m0 0l3 3m-3-3v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>+251 923240624</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Stock Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;