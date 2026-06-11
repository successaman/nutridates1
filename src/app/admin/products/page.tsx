'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductSize {
  size: string;
  price: number;
  in_stock: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  sizes: ProductSize[];
  stock_status: 'in_stock' | 'out_of_stock';
  created_at: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Form states for editing
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [stockStatus, setStockStatus] = useState<'in_stock' | 'out_of_stock'>('in_stock');
  const [updating, setUpdating] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setDescription(product.description);
    setSizes(JSON.parse(JSON.stringify(product.sizes))); // deep copy
    setStockStatus(product.stock_status);
  };

  const handlePriceChange = (index: number, val: string) => {
    const updated = [...sizes];
    updated[index].price = Number(val) || 0;
    setSizes(updated);
  };

  const handleStockToggle = (index: number) => {
    const updated = [...sizes];
    updated[index].in_stock = !updated[index].in_stock;
    setSizes(updated);
  };

  const saveProductEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setUpdating(true);

    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedProduct.id,
          description,
          sizes,
          stock_status: stockStatus
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Product details successfully updated!');
        setSelectedProduct(null);
        await fetchProducts();
      } else {
        alert('Failed to update product details: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating product details.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 text-[#111111] min-h-screen pb-16">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight">
          Manage Catalog Products
        </h2>
        <p className="text-sm font-semibold text-[#4E3A2E] mt-1 uppercase tracking-wider">
          Update prices, descriptions and size inventory status
        </p>
      </div>

      {/* Product List Grid */}
      {loading ? (
        <div className="border-4 border-black bg-white rounded-xl p-16 text-center shadow-[6px_6px_0px_0px_#111111]">
          <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-[#FF5000] rounded-full mx-auto mb-4" />
          <p className="text-xs font-black uppercase text-black">Opening product vault...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="border-4 border-black bg-white rounded-xl p-16 text-center shadow-[6px_6px_0px_0px_#111111] text-xs font-bold text-stone-400 uppercase">
          No products found in database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="border-4 border-black bg-white rounded-xl shadow-[6px_6px_0px_0px_#111111] overflow-hidden flex flex-col justify-between"
            >
              <div className="bg-[#F9F7F5] border-b-2 border-black p-4 flex justify-between items-center">
                <h3 className="font-extrabold uppercase text-[#111111] text-sm">
                  {product.name}
                </h3>
                <span className={`inline-block border px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                  product.stock_status === 'in_stock' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-red-100 text-red-800 border-red-300'
                }`}>
                  {product.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="p-5 space-y-4 flex-1">
                <p className="text-xs font-semibold text-[#4E3A2E] leading-relaxed">
                  {product.description}
                </p>

                {/* Sizes and prices split */}
                <div className="space-y-2.5">
                  <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">
                    Available Packages & Pricing
                  </p>
                  <div className="border-2 border-black rounded-lg divide-y border-stone-200 overflow-hidden">
                    {product.sizes.map((s) => (
                      <div key={s.size} className="flex justify-between items-center px-4 py-3 bg-[#FDFCFB] text-xs font-bold">
                        <span className="uppercase text-black font-extrabold">{s.size} Pack</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[#FF5000] font-black">₹{s.price}</span>
                          <span className={`inline-block border px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                            s.in_stock ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-500 border-red-200'
                          }`}>
                            {s.in_stock ? 'Active' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-black p-4 bg-[#F9F7F5] text-right">
                <button
                  onClick={() => openEditModal(product)}
                  className="bg-black hover:bg-[#FF5000] text-white border-2 border-black rounded-lg px-5 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_#FF5000]"
                >
                  ✏️ Edit Catalog Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Catalog Details Modal Overlay */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black"
            />
            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg border-4 border-black bg-white rounded-xl shadow-[8px_8px_0px_0px_#111111] overflow-hidden z-10"
            >
              <div className="bg-[#2B1D14] text-white px-6 py-4 border-b-4 border-black flex items-center justify-between">
                <h3 className="font-sans text-lg font-black uppercase tracking-tight">
                  Edit: {selectedProduct.name}
                </h3>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="text-stone-300 hover:text-white font-black text-xs cursor-pointer border border-transparent hover:border-white rounded px-2 py-0.5"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={saveProductEdits} className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-2">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border-2 border-black rounded-lg px-4 py-2.5 text-xs bg-white text-black font-semibold focus:outline-hidden focus:border-[#FF5000]"
                    required
                  />
                </div>

                {/* Stock Status Overall */}
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-2">
                    Overall Catalog Status
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as any)}
                    className="w-full border-2 border-black rounded-lg px-4 py-2.5 text-xs bg-white text-[#111111] font-black uppercase focus:outline-hidden"
                  >
                    <option value="in_stock">In Stock (Active Catalog)</option>
                    <option value="out_of_stock">Out of Stock (Disable Store)</option>
                  </select>
                </div>

                {/* Sizes Pricing & Availability */}
                <div className="space-y-3">
                  <label className="block text-xs font-black uppercase text-black">
                    Sizes Pricing & Availability
                  </label>
                  <div className="space-y-3.5 max-h-[180px] overflow-y-auto pr-1">
                    {sizes.map((s, idx) => (
                      <div key={s.size} className="flex items-center gap-3 justify-between bg-stone-50 border-2 border-black rounded-lg p-3 text-xs font-bold">
                        <span className="uppercase font-extrabold text-black shrink-0">{s.size} Pack</span>
                        
                        <div className="flex items-center gap-2 max-w-[120px]">
                          <span className="text-stone-500 font-black">₹</span>
                          <input
                            type="number"
                            value={s.price}
                            onChange={(e) => handlePriceChange(idx, e.target.value)}
                            className="w-full border-2 border-black rounded px-2 py-1 bg-white text-black text-center font-bold"
                            required
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStockToggle(idx)}
                          className={`px-3 py-1.5 border-2 border-black rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer shadow-[1px_1px_0px_0px_#111111] transition-transform ${
                            s.in_stock ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                          }`}
                        >
                          {s.in_stock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end border-t border-stone-200 pt-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-[#FF5000] text-white border-2 border-black rounded-lg px-5 py-3 text-xs font-black uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_0px_#111111]"
                  >
                    {updating ? 'Saving...' : '💾 Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="bg-white text-stone-600 border-2 border-stone-300 rounded-lg px-5 py-3 text-xs font-black uppercase tracking-widest cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
