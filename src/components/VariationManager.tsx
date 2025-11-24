import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Package } from 'lucide-react';
import type { Product, ProductVariation } from '../types';
import { useMenu } from '../hooks/useMenu';

interface VariationManagerProps {
  product: Product;
  onClose: () => void;
}

const VariationManager: React.FC<VariationManagerProps> = ({ product, onClose }) => {
  const { addVariation, deleteVariation } = useMenu();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [newVariation, setNewVariation] = useState({
    name: '',
    quantity_mg: 5.0,
    price: product.base_price,
    stock_quantity: 0
  });

  const handleAddVariation = async () => {
    if (!newVariation.name || newVariation.price <= 0 || newVariation.quantity_mg <= 0) {
      alert('Please fill in all fields correctly');
      return;
    }

    try {
      setIsProcessing(true);
      const result = await addVariation({
        product_id: product.id,
        name: newVariation.name,
        quantity_mg: newVariation.quantity_mg,
        price: newVariation.price,
        stock_quantity: newVariation.stock_quantity
      });

      if (result.success) {
        setNewVariation({
          name: '',
          quantity_mg: 5.0,
          price: product.base_price,
          stock_quantity: 0
        });
        setIsAdding(false);
        alert('Variation added successfully!');
      } else {
        alert(result.error || 'Failed to add variation');
      }
    } catch (error) {
      alert('Failed to add variation');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteVariation = async (id: string, name: string) => {
    if (!confirm(`Delete ${name} variation? This cannot be undone.`)) return;

    try {
      setIsProcessing(true);
      const result = await deleteVariation(id);
      if (result.success) {
        alert('Variation deleted successfully!');
      } else {
        alert(result.error || 'Failed to delete variation');
      }
    } catch (error) {
      alert('Failed to delete variation');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Package className="w-6 h-6" />
                Manage Size Variations
              </h2>
              <p className="text-pink-100 mt-1">Product: {product.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Current Variations */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              Current Sizes
              <span className="text-sm font-normal text-gray-500">
                ({product.variations?.length || 0} variations)
              </span>
            </h3>

            {!product.variations || product.variations.length === 0 ? (
              <div className="bg-pink-50 border-2 border-dashed border-pink-300 rounded-xl p-6 md:p-8 text-center">
                <Package className="w-10 h-10 md:w-12 md:h-12 text-pink-400 mx-auto mb-3" />
                <p className="text-gray-700 font-medium text-sm md:text-base">No size variations yet</p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Add your first size option below</p>
              </div>
            ) : (
              <div className="space-y-3">
                {product.variations.map((variation) => (
                  <div
                    key={variation.id}
                    className="bg-gradient-to-r from-pink-50 to-amber-50 border-2 border-pink-200 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      <div>
                        <div className="text-[10px] md:text-xs text-gray-500 mb-1">Size Name</div>
                        <div className="font-bold text-gray-900 text-sm md:text-base">{variation.name}</div>
                      </div>
                      <div>
                        <div className="text-[10px] md:text-xs text-gray-500 mb-1">Quantity</div>
                        <div className="font-semibold text-gray-700 text-sm md:text-base">{variation.quantity_mg}mg</div>
                      </div>
                      <div>
                        <div className="text-[10px] md:text-xs text-gray-500 mb-1">Price</div>
                        <div className="font-semibold text-pink-600 text-sm md:text-base">₱{variation.price.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] md:text-xs text-gray-500 mb-1">Stock</div>
                        <div className="font-semibold text-gray-700 text-sm md:text-base">{variation.stock_quantity} units</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteVariation(variation.id, variation.name)}
                      disabled={isProcessing}
                      className="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete variation"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Variation */}
          <div className="border-t-2 border-gray-200 pt-6">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg mb-4"
            >
              <Plus className="w-5 h-5" />
              {isAdding ? 'Cancel' : 'Add New Size'}
            </button>

            {isAdding && (
              <div className="bg-white border-2 border-pink-300 rounded-xl p-6 space-y-4">
                <h4 className="font-bold text-gray-900 mb-4">New Size Variation</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Size Name *
                    </label>
                    <input
                      type="text"
                      value={newVariation.name}
                      onChange={(e) => setNewVariation({ ...newVariation, name: e.target.value })}
                      placeholder="e.g., 5mg, 10mg, 20mg"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity (mg) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newVariation.quantity_mg}
                      onChange={(e) => setNewVariation({ ...newVariation, quantity_mg: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price (₱) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newVariation.price}
                      onChange={(e) => setNewVariation({ ...newVariation, price: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      value={newVariation.stock_quantity}
                      onChange={(e) => setNewVariation({ ...newVariation, stock_quantity: parseInt(e.target.value) || 0 })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddVariation}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    Save Variation
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-pink-50 border-t-2 border-pink-200 p-3 md:p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg md:rounded-xl font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-sm md:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariationManager;

