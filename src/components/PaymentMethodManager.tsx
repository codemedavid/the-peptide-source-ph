import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, CreditCard, Upload } from 'lucide-react';
import { usePaymentMethods, PaymentMethod } from '../hooks/usePaymentMethods';
import ImageUpload from './ImageUpload';

interface PaymentMethodManagerProps {
  onBack: () => void;
}

const PaymentMethodManager: React.FC<PaymentMethodManagerProps> = ({ onBack }) => {
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, refetchAll } = usePaymentMethods();
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    account_number: '',
    account_name: '',
    qr_code_url: '',
    active: true,
    sort_order: 0
  });

  React.useEffect(() => {
    refetchAll();
  }, []);

  const handleAddMethod = () => {
    const nextSortOrder = Math.max(...paymentMethods.map(m => m.sort_order), 0) + 1;
    setFormData({
      id: '',
      name: '',
      account_number: '',
      account_name: '',
      qr_code_url: '',
      active: true,
      sort_order: nextSortOrder
    });
    setCurrentView('add');
  };

  const handleEditMethod = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      id: method.id,
      name: method.name,
      account_number: method.account_number,
      account_name: method.account_name,
      qr_code_url: method.qr_code_url,
      active: method.active,
      sort_order: method.sort_order
    });
    setCurrentView('edit');
  };

  const handleDeleteMethod = async (id: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      try {
        await deletePaymentMethod(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete payment method');
      }
    }
  };

  const handleSaveMethod = async () => {
    if (!formData.id || !formData.name || !formData.account_number || !formData.account_name || !formData.qr_code_url) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate ID format (kebab-case)
    const idRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    if (!idRegex.test(formData.id)) {
      alert('Payment method ID must be in kebab-case format (e.g., "gcash", "bank-transfer")');
      return;
    }

    try {
      if (editingMethod) {
        await updatePaymentMethod(editingMethod.id, formData);
      } else {
        await addPaymentMethod(formData);
      }
      setCurrentView('list');
      setEditingMethod(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save payment method');
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingMethod(null);
  };

  const generateIdFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      id: currentView === 'add' ? generateIdFromName(name) : formData.id
    });
  };

  // Form View (Add/Edit)
  if (currentView === 'add' || currentView === 'edit') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-amber-50 to-amber-100">
        <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b-2 border-pink-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-14 md:h-16 gap-2">
              <div className="flex items-center space-x-2 md:space-x-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-1 md:space-x-2 text-pink-600 hover:text-pink-700 transition-colors duration-200 group"
                >
                  <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm md:text-base">Back</span>
                </button>
                <h1 className="text-base md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">
                  {currentView === 'add' ? '✨ Add Payment Method' : '✏️ Edit Payment Method'}
                </h1>
              </div>
              <div className="flex space-x-2 md:space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-2 md:px-4 py-1.5 md:py-2 border-2 border-gray-300 rounded-lg md:rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-1 md:space-x-2 text-xs md:text-sm"
                >
                  <X className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
                <button
                  onClick={handleSaveMethod}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 md:py-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 border-2 border-pink-100">
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Payment Method Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="input-field text-sm md:text-base"
                  placeholder="e.g., GCash, Maya, Bank Transfer"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Method ID *</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="input-field text-sm md:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="kebab-case-id"
                  disabled={currentView === 'edit'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {currentView === 'edit' 
                    ? 'Method ID cannot be changed after creation'
                    : 'Use kebab-case format (e.g., "gcash", "bank-transfer")'
                  }
                </p>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Account Number/Phone *</label>
                <input
                  type="text"
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  className="input-field text-sm md:text-base"
                  placeholder="09XX XXX XXXX or Account: 1234-5678-9012"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Account Name *</label>
                <input
                  type="text"
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                  className="input-field text-sm md:text-base"
                  placeholder="The Peptide Source PH"
                />
              </div>

              <div>
                <ImageUpload
                  currentImage={formData.qr_code_url}
                  onImageChange={(imageUrl) => setFormData({ ...formData, qr_code_url: imageUrl || '' })}
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Sort Order</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                  className="input-field text-sm md:text-base"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first in the checkout
                </p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 md:w-5 md:h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-xs md:text-sm font-semibold text-gray-700">Active Payment Method</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-amber-50 to-amber-100">
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b-2 border-pink-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16 gap-2">
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-1 md:space-x-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-xs md:text-sm font-medium">Dashboard</span>
              </button>
              <h1 className="text-base md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">Payment Methods</h1>
            </div>
            <button
              onClick={handleAddMethod}
              className="flex items-center space-x-1 md:space-x-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Plus className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm font-medium">Add Payment Method</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 md:py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl overflow-hidden border-2 border-pink-100">
          <div className="p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Payment Methods</h2>
            
            {paymentMethods.length === 0 ? (
              <div className="text-center py-6 md:py-8">
                <CreditCard className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4 text-sm md:text-base">No payment methods found</p>
                <button
                  onClick={handleAddMethod}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg md:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm md:text-base"
                >
                  Add First Payment Method
                </button>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 md:p-4 border-2 border-pink-100 rounded-lg md:rounded-xl hover:bg-pink-50/50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <img
                          src={method.qr_code_url}
                          alt={`${method.name} QR Code`}
                          className="w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 border-pink-200 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base">{method.name}</h3>
                        <p className="text-xs md:text-sm text-gray-600 truncate">{method.account_number}</p>
                        <p className="text-xs md:text-sm text-gray-500 truncate">Account: {method.account_name}</p>
                        <p className="text-[10px] md:text-xs text-gray-400 truncate">ID: {method.id} • Order: #{method.sort_order}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 md:space-x-3 w-full sm:w-auto justify-end">
                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                        method.active 
                          ? 'bg-pink-100 text-pink-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {method.active ? 'Active' : 'Inactive'}
                      </span>
                      
                      <button
                        onClick={() => handleEditMethod(method)}
                        className="p-1.5 md:p-2 text-pink-600 hover:text-pink-700 hover:bg-pink-100 rounded-lg md:rounded-xl transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteMethod(method.id)}
                        className="p-1.5 md:p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg md:rounded-xl transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodManager;