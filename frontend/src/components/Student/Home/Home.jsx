import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Info, DollarSign, Phone, Star, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Page() {
  return (
    <div className="min-h-screen bg-sky-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-full h-full text-sky-500"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xl font-bold">UniNest</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center gap-2 hover:text-sky-600">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link to="/about" className="flex items-center gap-2 hover:text-sky-600">
              <Info className="w-4 h-4" />
              About
            </Link>
            <Link to="/pricing" className="flex items-center gap-2 hover:text-sky-600">
              <DollarSign className="w-4 h-4" />
              Pricing
            </Link>
            <Link to="/contact" className="flex items-center gap-2 hover:text-sky-600">
              <Phone className="w-4 h-4" />
              Contact
            </Link>
            <Link to="/ratings" className="flex items-center gap-2 hover:text-sky-600">
              <Star className="w-4 h-4" />
              Ratings
            </Link>
            <Link to="/account" className="flex items-center gap-2 hover:text-sky-600">
              <User className="w-4 h-4" />
              My Account
            </Link>
          </div>

          <Button variant="default" className="bg-sky-500 hover:bg-sky-600">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-[calc(100vh-64px)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/80 via-sky-800/70 to-sky-700/60 backdrop-blur-[2px]" />

        <div className="relative container mx-auto px-4 pt-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-6xl font-bold text-white mb-4">UniNest</h1>
            <p className="text-3xl text-sky-100 mb-12">Find Your Boarding Place Here</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select University" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="harvard">Harvard University</SelectItem>
                  <SelectItem value="mit">MIT</SelectItem>
                  <SelectItem value="stanford">Stanford University</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="dorm">Dormitory</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500-1000">$500 - $1000</SelectItem>
                  <SelectItem value="1000-1500">$1000 - $1500</SelectItem>
                  <SelectItem value="1500-2000">$1500 - $2000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="bg-sky-500 hover:bg-sky-600 text-white px-8">
              Advanced Search
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Properties Preview */}
      <div className="relative container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Student Accommodations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              <div className="relative h-48">
                <img
                  src={`/placeholder.svg?height=400&width=600`}
                  alt={`Featured property ${item}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-sky-500 text-white px-2 py-1 rounded">Featured</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Student Apartment {item}</h3>
                <p className="text-gray-600 mb-4">Close to campus, fully furnished with modern amenities</p>
                <div className="flex justify-between items-center">
                  <span className="text-sky-600 font-bold">$800/month</span>
                  <Button variant="outline" className="hover:bg-sky-50">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
