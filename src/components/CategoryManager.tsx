import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, GripVertical, Grid, FlaskConical, Sparkles, Heart, Droplet, Package, ShoppingBag, Star, Zap, Shield, Leaf, Flame, Snowflake, Sun, Moon, Coffee, Utensils, Cake, IceCream } from 'lucide-react';
import { useCategories, Category } from '../hooks/useCategories';
import { useMenu } from '../hooks/useMenu';

// Icon mapping for Lucide icons
const getIconComponent = (iconName: string, className: string = "w-5 h-5") => {
  const iconMap: { [key: string]: React.ReactElement } = {
    Grid: <Grid className={className} />,
    FlaskConical: <FlaskConical className={className} />,
    Sparkles: <Sparkles className={className} />,
    Heart: <Heart className={className} />,
    Droplet: <Droplet className={className} />,
    Package: <Package className={className} />,
    ShoppingBag: <ShoppingBag className={className} />,
    Star: <Star className={className} />,
    Zap: <Zap className={className} />,
    Shield: <Shield className={className} />,
    Leaf: <Leaf className={className} />,
    Flame: <Flame className={className} />,
    Snowflake: <Snowflake className={className} />,
    Sun: <Sun className={className} />,
    Moon: <Moon className={className} />,
    Coffee: <Coffee className={className} />,
    Utensils: <Utensils className={className} />,
    Cake: <Cake className={className} />,
    IceCream: <IceCream className={className} />,
  };
  
  return iconMap[iconName] || <Package className={className} />;
};

interface CategoryManagerProps {
  onBack: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ onBack }) => {
  const { categories, addCategory, updateCategory, deleteCategory, reorderCategories } = useCategories();
  const { products } = useMenu();
  
  // Calculate product counts for each category
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    productCount: products.filter(p => p.category === cat.id).length
  }));
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    icon: '☕',
    sort_order: 0,
    active: true
  });

  const handleAddCategory = () => {
    const nextSortOrder = Math.max(...categories.map(c => c.sort_order), 0) + 1;
    setFormData({
      id: '',
      name: '',
      icon: '☕',
      sort_order: nextSortOrder,
      active: true
    });
    setCurrentView('add');
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      icon: category.icon,
      sort_order: category.sort_order,
      active: category.active
    });
    setCurrentView('edit');
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete category');
      }
    }
  };

  const handleSaveCategory = async () => {
    if (!formData.id || !formData.name || !formData.icon) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate ID format (kebab-case)
    const idRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    if (!idRegex.test(formData.id)) {
      alert('Category ID must be in kebab-case format (e.g., "hot-drinks", "cold-beverages")');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      setCurrentView('list');
      setEditingCategory(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save category');
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingCategory(null);
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
                  {currentView === 'add' ? '✨ Add New Category' : '✏️ Edit Category'}
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
                  onClick={handleSaveCategory}
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
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="input-field text-sm md:text-base"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Category ID *</label>
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
                    ? 'Category ID cannot be changed after creation'
                    : 'Use kebab-case format (e.g., "weight-management", "fat-dissolving")'
                  }
                </p>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Icon *</label>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="flex-1 input-field text-sm md:text-base"
                    placeholder="Enter icon name (e.g., FlaskConical, Sparkles)"
                  />
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-100 to-amber-100 rounded-lg flex items-center justify-center border-2 border-pink-200 text-pink-600">
                    {getIconComponent(formData.icon, "w-5 h-5 md:w-6 md:h-6")}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use Lucide icon name (e.g., FlaskConical, Sparkles, Heart, Droplet)
                </p>
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
                  Lower numbers appear first in the menu
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
                  <span className="text-xs md:text-sm font-semibold text-gray-700">Active Category</span>
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
              <h1 className="text-base md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">Manage Categories</h1>
            </div>
            <button
              onClick={handleAddCategory}
              className="flex items-center space-x-1 md:space-x-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Plus className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm font-medium">Add Category</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 md:py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl overflow-hidden border-2 border-pink-100">
          <div className="p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Categories</h2>
            
            {categories.length === 0 ? (
              <div className="text-center py-6 md:py-8">
                <p className="text-gray-500 mb-4 text-sm md:text-base">No categories found</p>
                <button
                  onClick={handleAddCategory}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg md:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm md:text-base"
                >
                  Add First Category
                </button>
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {categoriesWithCounts.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 p-3 md:p-4 border-2 border-pink-100 rounded-lg md:rounded-xl hover:bg-pink-50/50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
                      <div className="flex items-center space-x-1 md:space-x-2 text-gray-400 cursor-move shrink-0">
                        <GripVertical className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="text-xs md:text-sm text-gray-500">#{category.sort_order}</span>
                      </div>
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-pink-100 to-amber-100 rounded-lg md:rounded-xl flex items-center justify-center border-2 border-pink-200 shrink-0 text-pink-600">
                        {getIconComponent(category.icon, "w-4 h-4 md:w-5 md:h-5")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{category.name}</h3>
                          <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full">
                            {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 truncate">ID: {category.id}</p>
                        <p className="text-[10px] md:text-xs text-gray-400 truncate">Icon: {category.icon}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 md:space-x-3 w-full sm:w-auto justify-end">
                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                        category.active 
                          ? 'bg-pink-100 text-pink-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.active ? 'Active' : 'Inactive'}
                      </span>
                      
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-1.5 md:p-2 text-pink-600 hover:text-pink-700 hover:bg-pink-100 rounded-lg md:rounded-xl transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
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

export default CategoryManager;