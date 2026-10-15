import React, { useState } from 'react';
import {
  Plus,
  Search,
  Clock,
  Star,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MenuItem, MenuCategory } from '../../types';

const CATEGORIES: MenuCategory[] = [
  'All',
  'Burgers',
  'Pizzas',
  'Appetizers',
  'Mains',
  'Beverages',
  'Desserts',
];

export const MenuView: React.FC = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleStock } = useRestaurant();

  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Burgers');
  const [formPrice, setFormPrice] = useState('');
  const [formDiscountPrice, setFormDiscountPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsVeg, setFormIsVeg] = useState(false);
  const [formPrepTime, setFormPrepTime] = useState('15');
  const [formImage, setFormImage] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('Burgers');
    setFormPrice('');
    setFormDiscountPrice('');
    setFormDescription('');
    setFormIsVeg(false);
    setFormPrepTime('15');
    setFormImage('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPrice(String(item.price));
    setFormDiscountPrice(item.discountedPrice ? String(item.discountedPrice) : '');
    setFormDescription(item.description);
    setFormIsVeg(item.isVeg);
    setFormPrepTime(String(item.prepTimeMinutes));
    setFormImage(item.image);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    const priceNum = parseFloat(formPrice);
    const discNum = formDiscountPrice ? parseFloat(formDiscountPrice) : undefined;
    const prepNum = parseInt(formPrepTime, 10) || 15;

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name: formName.trim(),
        category: formCategory,
        price: priceNum,
        discountedPrice: discNum,
        description: formDescription.trim(),
        isVeg: formIsVeg,
        prepTimeMinutes: prepNum,
        image: formImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      });
    } else {
      addMenuItem({
        name: formName.trim(),
        category: formCategory,
        price: priceNum,
        discountedPrice: discNum,
        description: formDescription.trim(),
        isVeg: formIsVeg,
        inStock: true,
        prepTimeMinutes: prepNum,
        image: formImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        tags: ['New Addition'],
      });
    }

    setIsModalOpen(false);
  };

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesVeg = !vegOnly || item.isVeg;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesVeg && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Filter and Controls Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish by name, ingredients, or tags..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F]"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Veg Only Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition ${
              vegOnly
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
              vegOnly ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-emerald-600'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${vegOnly ? 'bg-white' : 'bg-emerald-600'}`} />
            </span>
            <span>Pure Veg Only</span>
          </button>

          {/* Add Dish Button */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E44912] shadow-md shadow-[#FF5A1F]/20 transition"
          >
            <Plus size={16} />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const count = cat === 'All' ? menuItems.length : menuItems.filter((m) => m.category === cat).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
              item.inStock ? 'border-slate-200/80 shadow-2xs hover:shadow-xs' : 'border-slate-200/60 opacity-75 bg-slate-50/50'
            }`}
          >
            <div>
              {/* Image & Quick Badges */}
              <div className="h-44 relative bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Veg / Non-veg indicator */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-1.5 rounded-lg shadow-sm">
                  <div className={`w-3.5 h-3.5 border flex items-center justify-center ${
                    item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                    }`} />
                  </div>
                </div>

                {/* Stock Badge */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleStock(item.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm transition ${
                      item.inStock
                        ? 'bg-emerald-500/90 text-white hover:bg-emerald-600'
                        : 'bg-rose-600/90 text-white hover:bg-rose-700'
                    }`}
                  >
                    {item.inStock ? 'In Stock' : 'Sold Out'}
                  </button>
                </div>

                {/* Category & Prep Time */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-semibold">
                  <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-xs">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-xs">
                    <Clock size={12} /> {item.prepTimeMinutes} mins prep
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-black flex-shrink-0">
                    <Star size={13} fill="currentColor" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Price & Action Row */}
            <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-slate-900">
                  ₹{item.discountedPrice || item.price}
                </span>
                {item.discountedPrice && (
                  <span className="text-xs text-slate-400 line-through font-semibold">
                    ₹{item.price}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(item)}
                  title="Edit Dish"
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => deleteMenuItem(item.id)}
                  title="Delete Dish"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-sm font-bold text-slate-700">No dishes match your filter</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting the category or search keywords</p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
              setVegOnly(false);
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingItem ? 'Edit Menu Dish' : 'Add New Dish to Catalog'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Smashed Double Truffle Cheeseburger"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F] bg-white"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    min="1"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Regular Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 399"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dine-In Offer Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={formDiscountPrice}
                    onChange={(e) => setFormDiscountPrice(e.target.value)}
                    placeholder="e.g. 349 (Optional)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dietary Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="dietary"
                      checked={formIsVeg}
                      onChange={() => setFormIsVeg(true)}
                    />
                    <span>Pure Vegetarian (Green)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="dietary"
                      checked={!formIsVeg}
                      onChange={() => setFormIsVeg(false)}
                    />
                    <span>Non-Vegetarian (Red)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Ingredients</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Highlight key ingredients, sauces, and house specialties..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E44912] shadow-md shadow-[#FF5A1F]/30"
                >
                  {editingItem ? 'Save Changes' : 'Publish Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
