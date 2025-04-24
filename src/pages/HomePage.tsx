import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, CheckCircle, Users, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="container-custom mx-auto py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Create Professional Documents in Minutes
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Transform your business with beautifully designed document templates
                that are easy to customize and ready to use.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link to="/dashboard" className="btn bg-white text-primary-700 hover:bg-gray-100">
                  Browse Templates
                </Link>
                <Link to="/auth/signup" className="btn bg-accent-500 text-white hover:bg-accent-600">
                  Create Free Account
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="bg-white rounded-lg shadow-xl p-6 transform rotate-3 z-10">
                  <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                    <FileText className="h-20 w-20 text-primary-600 opacity-50" />
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                  </div>
                </div>
                <div className="absolute top-10 -left-10 bg-white rounded-lg shadow-xl p-6 transform -rotate-6">
                  <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                    <FileText className="h-16 w-16 text-accent-500 opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Document Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our collection of professionally designed templates for every business need
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.id} to="/dashboard" className="group">
                <div className="bg-white rounded-lg shadow-card group-hover:shadow-card-hover p-6 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center text-primary-600 font-medium">
                    View templates <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-16 bg-white">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create professional documents in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Thousands of businesses trust our document generation platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-card">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-accent-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-gray-600 font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="bg-primary-900 text-white py-16">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that use our platform to create professional documents in minutes.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/dashboard" className="btn bg-white text-primary-800 hover:bg-gray-100">
              Browse Templates
            </Link>
            <Link to="/auth/signup" className="btn bg-accent-500 text-white hover:bg-accent-600">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Sample data
const categories = [
  {
    id: 1,
    name: 'Legal Documents',
    description: 'Contracts, agreements, and legal forms for your business needs.',
    icon: FileText
  },
  {
    id: 2,
    name: 'Business Reports',
    description: 'Professional reports, presentations, and business proposals.',
    icon: FileText
  },
  {
    id: 3,
    name: 'HR Templates',
    description: 'Employment contracts, policies, and HR documentation.',
    icon: Users
  },
  {
    id: 4,
    name: 'Financial Documents',
    description: 'Invoices, financial reports, and budget templates.',
    icon: FileText
  },
  {
    id: 5,
    name: 'Marketing Materials',
    description: 'Presentations, brochures, and marketing proposals.',
    icon: FileText
  },
  {
    id: 6,
    name: 'Certificates',
    description: 'Professional certificates, awards, and recognition documents.',
    icon: CheckCircle
  }
];

const steps = [
  {
    title: 'Choose a Template',
    description: 'Browse our extensive library of professional templates designed for various business needs.'
  },
  {
    title: 'Fill in Your Details',
    description: 'Use our intuitive form to enter your specific information and customize the document.'
  },
  {
    title: 'Download & Use',
    description: 'Generate your document in PDF or Word format, ready to use immediately.'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Small Business Owner',
    content: 'This platform has saved me countless hours creating professional documents for my clients. The templates are beautiful and so easy to customize.'
  },
  {
    name: 'Michael Chen',
    role: 'Legal Consultant',
    content: 'I use this for all my client contracts. The document generation is fast and the templates are legally sound. Highly recommended!'
  },
  {
    name: 'Emily Rodriguez',
    role: 'HR Manager',
    content: 'Managing HR documents has never been easier. The template quality is excellent and our employees love how professional everything looks.'
  }
];

export default HomePage;