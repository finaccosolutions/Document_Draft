import React, { useState } from 'react';
import { UserCircle, Mail, Phone, Key, Save, FileText, Download, Eye } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    jobTitle: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock recent documents
  const recentDocuments = [
    { 
      id: 1, 
      name: 'Employment Contract - John Smith',
      template: 'Basic Employment Contract',
      created: '2025-04-10',
      type: 'pdf',
    },
    { 
      id: 2, 
      name: 'NDA - Project Alpha',
      template: 'Non-Disclosure Agreement',
      created: '2025-04-08',
      type: 'docx',
    },
    { 
      id: 3, 
      name: 'Consulting Agreement - ABC Corp',
      template: 'Consulting Agreement',
      created: '2025-04-05',
      type: 'pdf',
    },
  ];
  
  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    showToast('Profile updated successfully', 'success');
    setIsSaving(false);
    setIsEditing(false);
  };
  
  const handleDownloadDocument = (documentId: number) => {
    showToast('Document downloaded successfully', 'success');
  };
  
  const handleViewDocument = (documentId: number) => {
    // This would open document in new tab or viewer
    window.open('#', '_blank');
  };
  
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Profile Info */}
          <div className="md:w-1/3">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  <UserCircle className="w-16 h-16" />
                </div>
                
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-600">{profile.jobTitle || 'User'}</p>
                
                <div className="w-full mt-6">
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{profile.email}</span>
                      </div>
                      {profile.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                      {profile.company && (
                        <div className="flex items-center text-sm">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{profile.company}</span>
                        </div>
                      )}
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-4" 
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={profile.company}
                          onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={profile.jobTitle}
                          onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button 
                          className="flex-1"
                          onClick={handleSaveProfile}
                          isLoading={isSaving}
                          icon={<Save className="h-4 w-4" />}
                        >
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    icon={<Key className="h-4 w-4" />}
                  >
                    Change Password
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:border-red-600" 
                    onClick={logout}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right Column - Recent Documents & Activity */}
          <div className="md:w-2/3">
            {/* Recent Documents */}
            <Card className="mb-6 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Documents</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {recentDocuments.length > 0 ? (
                  recentDocuments.map((doc) => (
                    <div key={doc.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-md ${
                          doc.type === 'pdf' 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <span>Created on {doc.created}</span>
                            <span className="mx-2">•</span>
                            <span>Template: {doc.template}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="p-1 text-gray-400 hover:text-gray-600"
                          onClick={() => handleViewDocument(doc.id)}
                          title="View Document"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-gray-600"
                          onClick={() => handleDownloadDocument(doc.id)}
                          title="Download Document"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <h3 className="text-sm font-medium text-gray-900">No documents yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Once you create documents, they'll appear here.
                    </p>
                  </div>
                )}
              </div>
              
              {recentDocuments.length > 0 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-right">
                  <Button variant="outline" size="sm">View All Documents</Button>
                </div>
              )}
            </Card>
            
            {/* Usage Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-4xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600 mt-1">Documents Created</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-4xl font-bold text-green-600">2</div>
                  <div className="text-sm text-gray-600 mt-1">Templates Used</div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-4xl font-bold text-yellow-600">5</div>
                  <div className="text-sm text-gray-600 mt-1">Downloads</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Account Status</h4>
                <div className="bg-gray-100 h-2.5 rounded-full w-full">
                  <div className="bg-blue-600 h-2.5 rounded-full w-1/4"></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Free tier: 25% of 20 documents monthly limit used
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button 
                  className="w-full sm:w-auto"
                >
                  Upgrade to Premium
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;