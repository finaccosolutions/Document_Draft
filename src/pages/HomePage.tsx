import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, FileDown, Edit, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage: React.FC = () => {
  // Sample categories for document templates
  const categories = [
    { id: 1, name: 'Legal Documents', count: 24, icon: <FileText className="h-10 w-10 text-blue-600" /> },
    { id: 2, name: 'Business Contracts', count: 18, icon: <FileText className="h-10 w-10 text-blue-600" /> },
    { id: 3, name: 'HR Templates', count: 15, icon: <FileText className="h-10 w-10 text-blue-600" /> },
    { id: 4, name: 'Financial Forms', count: 12, icon: <FileText className="h-10 w-10 text-blue-600" /> },
    { id: 5, name: 'Personal Documents', count: 9, icon: <FileText className="h-10 w-10 text-blue-600" /> },
    { id: 6, name: 'Education Templates', count: 7, icon: <FileText className="h-10 w-10 text-blue-600" /> },
  ];

  // Sample testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Legal Consultant',
      content: 'DocuGen has revolutionized how I prepare legal documents. What used to take hours now takes minutes, with consistently professional results.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Small Business Owner',
      content: 'As a small business owner, I don\'t have time to create professional-looking documents. DocuGen has been a game-changer for me and my team.',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'HR Director',
      content: 'The template system is incredible. We\'ve standardized all our HR documentation and improved compliance across the board.',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Create Professional Documents in Minutes
              </h1>
              <p className="mt-4 text-lg md:text-xl text-blue-100">
                Generate customized, professional documents with our intuitive document generation platform. Save time and ensure consistency with our template system.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/documents">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/#how-it-works">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-900">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute inset-0 bg-blue-500 rounded-lg transform rotate-3 opacity-20"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-xl">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Contract Agreement</h3>
                    <span className="text-sm text-blue-600">Preview</span>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="mt-6 pt-4 border-t flex justify-between">
                    <span className="text-sm text-gray-500">Document generated</span>
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <FileDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Explore Document Categories</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our extensive collection of professionally designed templates across various categories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link to={`/documents?category=${category.id}`} key={category.id}>
                <Card hover className="p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    {category.icon}
                    <h3 className="ml-3 text-xl font-semibold text-gray-900">{category.name}</h3>
                  </div>
                  <p className="text-gray-600 flex-grow">
                    Access {category.count} professional templates designed for your specific needs.
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{category.count} templates</span>
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/documents">
              <Button variant="outline" size="lg">
                View All Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Creating professional documents has never been easier. Follow these simple steps to get started.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Choose a Template</h3>
              <p className="text-gray-600">
                Browse our extensive library of professional templates and select the one that fits your needs.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Edit className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Fill in the Details</h3>
              <p className="text-gray-600">
                Customize the template with your specific information using our intuitive form interface.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileDown className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Download & Use</h3>
              <p className="text-gray-600">
                Preview your document, make any final adjustments, and download it in your preferred format.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/documents">
              <Button size="lg">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what professionals like you have to say about DocuGen.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6">
                <div className="h-32">
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </div>
                <div className="mt-6 flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Ready to Streamline Your Document Creation?</h2>
            <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of professionals who save time and ensure consistency with DocuGen.
            </p>
            <div className="mt-8">
              <Link to="/register">
                <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50">
                  Sign Up for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;