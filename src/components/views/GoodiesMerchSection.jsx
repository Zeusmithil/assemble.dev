import React, { useState, useMemo } from 'react';

const INITIAL_PRODUCTS = [
  { id: 'tshirt', name: 'Event T-Shirt', price: 299, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400', colors: ['Black', 'White', 'Navy Blue', 'Crimson', 'Grey'] },
  { id: 'hoodie', name: 'Event Hoodie', price: 699, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400', colors: ['Navy Blue', 'Heather Grey', 'Charcoal', 'Forest Green'] },
  { id: 'tote', name: 'Custom Tote Bag', price: 149, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400', colors: ['Natural Canvas', 'Black', 'Olive'] },
  { id: 'backpack', name: 'Classic Backpack', price: 899, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400', colors: ['Slate', 'Crimson', 'Navy'] },
  { id: 'cap', name: 'Event Cap', price: 199, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=400', colors: ['Black', 'Navy', 'White', 'Red'] },
  { id: 'notebook', name: 'Premium Notebook', price: 99, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=400', colors: ['Midnight Blue', 'Matte Black', 'Emerald'] },
  { id: 'pen', name: 'Engraved Metal Pen', price: 49, image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=400', colors: ['Silver', 'Gold', 'Matte Black'] },
  { id: 'idcard', name: 'Event ID Badge & Lanyard', price: 39, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400', colors: ['Standard White'] },
  { id: 'mug', name: 'Custom Ceramic Mug', price: 129, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400', colors: ['White', 'Black'] },
  { id: 'certificate', name: 'Foiled Certificate', price: 29, image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=400', colors: ['Gold Foil Cream'] },
  { id: 'welcomekit', name: 'Curated Welcome Swag Box', price: 1299, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400', colors: ['Premium Kraft Box'] }
];

export const GoodiesMerchSection = ({
  events,
  goodiesCart,
  goodiesOrders,
  onAddGoodiesToCart,
  onRemoveGoodiesFromCart,
  onPlaceGoodiesOrder,
}) => {
  // Navigation states: 'catalog', 'customize', 'cart', 'checkout', 'tracking'
  const [subView, setSubView] = useState('catalog');

  // Customizer state
  const [selectedProduct, setSelectedProduct] = useState(INITIAL_PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState(INITIAL_PRODUCTS[0].colors[0]);
  const [customText, setCustomText] = useState('');
  const [textFont, setTextFont] = useState('font-sans');
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [viewSide, setViewSide] = useState('front'); // 'front', 'back'

  // Image Upload and Validation
  const [uploadedLogo, setUploadedLogo] = useState('');
  const [logoName, setLogoName] = useState('');
  const [logoWarning, setLogoWarning] = useState('');

  // Sizing matrix state
  const [sizes, setSizes] = useState({ S: 10, M: 30, L: 40, XL: 15, XXL: 5 });

  // Customizer Drag & Resize offsets
  const [logoScale, setLogoScale] = useState(50); // percentage size
  const [logoOffset, setLogoOffset] = useState({ x: 0, y: -20 }); // coordinates translation offset

  // Placed Order Tracking Detail
  const [trackingOrder, setTrackingOrder] = useState(null);

  // Derive target event
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0];
  }, [selectedEventId, events]);

  // Sizing sum
  const totalQuantity = useMemo(() => {
    return Object.values(sizes).reduce((acc, q) => acc + (Number(q) || 0), 0);
  }, [sizes]);

  // Pricing formula
  const pricingSummary = useMemo(() => {
    const basePrice = selectedProduct.price;
    const itemsCost = basePrice * totalQuantity;
    const customizationSetup = uploadedLogo || customText ? 500 : 0;
    const deliveryCharge = totalQuantity > 0 ? 200 : 0;
    const estimatedTotal = itemsCost + customizationSetup + deliveryCharge;

    return {
      unitPrice: basePrice,
      quantity: totalQuantity,
      itemsCost,
      customizationSetup,
      deliveryCharge,
      estimatedTotal
    };
  }, [selectedProduct, totalQuantity, uploadedLogo, customText]);

  // Cart total calculations
  const cartSummary = useMemo(() => {
    const subtotal = goodiesCart.reduce((acc, item) => acc + item.pricing.itemsCost, 0);
    const customization = goodiesCart.reduce((acc, item) => acc + item.pricing.customizationSetup, 0);
    const delivery = goodiesCart.reduce((acc, item) => acc + item.pricing.deliveryCharge, 0);
    const total = subtotal + customization + delivery;

    return { subtotal, customization, delivery, total };
  }, [goodiesCart]);

  // Handle Logo File Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size & warn
    const sizeKB = file.size / 1024;
    setLogoName(file.name);

    if (sizeKB < 100) {
      setLogoWarning(
        `⚠️ Your design resolution may be too low for printing (${Math.round(sizeKB)} KB). Consider uploading a higher-resolution image.`
      );
    } else {
      setLogoWarning('');
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setUploadedLogo(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setSelectedColor(prod.colors[0]);
    setSubView('customize');
  };

  const handleAddToCartSubmit = () => {
    if (totalQuantity <= 0) {
      alert("Please select at least 1 unit to order.");
      return;
    }

    const cartItem = {
      id: `cart-item-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      baseImage: selectedProduct.image,
      color: selectedColor,
      customText,
      font: textFont,
      logoUrl: uploadedLogo,
      sizes: { ...sizes },
      eventId: selectedEventId,
      eventTitle: currentEvent?.title || 'General Event',
      pricing: { ...pricingSummary },
      scale: logoScale,
      offset: { ...logoOffset }
    };

    onAddGoodiesToCart(cartItem);
    setSubView('cart');
  };

  const handleCheckoutSubmit = () => {
    if (goodiesCart.length === 0) return;

    // Link the order to the first cart item's event association
    const linkEventId = goodiesCart[0].eventId;
    const linkEventTitle = goodiesCart[0].eventTitle;

    const newOrder = onPlaceGoodiesOrder(
      linkEventId,
      linkEventTitle,
      [...goodiesCart],
      cartSummary.total
    );

    setTrackingOrder(newOrder);
    setSubView('tracking');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Tab/Breadcrumb Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-[#e1e3e4] pb-4 text-xs font-bold text-[#5f5e5e]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubView('catalog')}
            className={`hover:text-black cursor-pointer ${subView === 'catalog' ? 'text-[#00355f]' : ''}`}
          >
            Catalog
          </button>
          <span>/</span>
          <button
            disabled={subView === 'catalog'}
            onClick={() => setSubView('customize')}
            className={`hover:text-black cursor-pointer ${subView === 'customize' ? 'text-[#00355f]' : ''}`}
          >
            Customizer
          </button>
          <span>/</span>
          <button
            onClick={() => setSubView('cart')}
            className={`hover:text-black flex items-center gap-1 cursor-pointer ${subView === 'cart' ? 'text-[#00355f]' : ''}`}
          >
            Cart ({goodiesCart.length})
          </button>
        </div>

        <button
          onClick={() => {
            if (goodiesOrders.length > 0) {
              setTrackingOrder(goodiesOrders[0]);
              setSubView('tracking');
            } else {
              alert("No orders placed yet.");
            }
          }}
          className="text-[#0f4c81] hover:underline cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">local_shipping</span>
          <span>Track Placed Orders</span>
        </button>
      </div>

      {/* VIEW: CATALOG GRID */}
      {subView === 'catalog' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="font-geist text-lg font-bold text-[#00355f]">Browse Customizable Products</h3>
            <p className="font-inter text-xs text-[#5f5e5e]">
              Pick an item below to upload your logo and customize order quantities.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {INITIAL_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-[#e1e3e4] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="h-44 bg-[#f8f9fa] relative flex items-center justify-center overflow-hidden">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-geist font-bold text-sm text-[#00355f]">{prod.name}</h4>
                    <p className="font-inter text-xs text-[#5f5e5e]">Starting from ${prod.price}</p>
                    <div className="flex gap-1 pt-1">
                      {prod.colors.slice(0, 3).map((col) => (
                        <span key={col} className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block" title={col} style={{
                          backgroundColor:
                            col === 'Black' ? '#000000' :
                            col === 'White' ? '#ffffff' :
                            col === 'Navy Blue' || col === 'Navy' ? '#0a192f' :
                            col === 'Crimson' || col === 'Red' ? '#d32f2f' :
                            col === 'Grey' || col === 'Heather Grey' ? '#aaaaaa' : '#e0e0e0'
                        }} />
                      ))}
                      {prod.colors.length > 3 && <span className="text-[9px] text-[#727780] font-bold">+{prod.colors.length - 3}</span>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectProduct(prod)}
                    className="w-full py-2 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    Customize Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: PRODUCT CUSTOMIZATION TOOL */}
      {subView === 'customize' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Visual Preview Canvas */}
          <div className="lg:col-span-5 space-y-4 sticky top-24">
            <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
              Live Mockup Design Preview
            </span>

            <div className="bg-[#f8f9fa] border border-[#e1e3e4] rounded-[2rem] p-6 flex flex-col items-center relative overflow-hidden h-[380px] justify-center">
              {/* Actual Image mock layer */}
              <div className="w-64 h-64 relative flex items-center justify-center">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain mix-blend-multiply opacity-90"
                />

                {/* Simulated Visual Overlay Layer */}
                <div
                  className="absolute pointer-events-none select-none flex flex-col items-center justify-center text-center transition-all"
                  style={{
                    width: `${logoScale}%`,
                    transform: `translate(${logoOffset.x}px, ${logoOffset.y}px)`
                  }}
                >
                  {uploadedLogo && (
                    <img
                      src={uploadedLogo}
                      alt="uploaded"
                      className="max-h-24 object-contain rounded opacity-95 mb-1"
                    />
                  )}
                  {customText && (
                    <span className={`text-[10px] font-bold text-[#00355f] bg-white/80 px-2.5 py-0.5 rounded leading-tight ${textFont}`}>
                      {customText}
                    </span>
                  )}
                </div>
              </div>

              {/* Angle selector toggle */}
              <div className="absolute bottom-4 bg-white border border-[#e1e3e4] px-4 py-1.5 rounded-full flex gap-3 text-[10px] font-bold shadow-2xs">
                <button
                  onClick={() => setViewSide('front')}
                  className={`cursor-pointer ${viewSide === 'front' ? 'text-[#0f4c81]' : 'text-gray-400'}`}
                >
                  FRONT VIEW
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => setViewSide('back')}
                  className={`cursor-pointer ${viewSide === 'back' ? 'text-[#0f4c81]' : 'text-gray-400'}`}
                >
                  BACK VIEW
                </button>
              </div>
            </div>

            {/* Scale and placement sliders */}
            <div className="bg-white border border-[#e1e3e4] p-4 rounded-xl space-y-3 text-xs">
              <span className="font-bold text-[#00355f] block">Mockup Positioning Settings</span>
              
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Design Dimensions ({logoScale}%)</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={logoScale}
                  onChange={(e) => setLogoScale(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f4c81]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="space-y-1">
                  <span>Vertical Offset ({logoOffset.y}px)</span>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    value={logoOffset.y}
                    onChange={(e) => setLogoOffset({ ...logoOffset, y: Number(e.target.value) })}
                    className="w-full accent-[#0f4c81]"
                  />
                </div>
                <div className="space-y-1">
                  <span>Horizontal Offset ({logoOffset.x}px)</span>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    value={logoOffset.x}
                    onChange={(e) => setLogoOffset({ ...logoOffset, x: Number(e.target.value) })}
                    className="w-full accent-[#0f4c81]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customizer Controls Panel */}
          <div className="lg:col-span-7 bg-white border border-[#e1e3e4] rounded-[2rem] p-6 space-y-6 shadow-2xs">
            {/* Title */}
            <div className="border-b border-[#edeeef] pb-3">
              <h3 className="font-geist text-base font-bold text-[#00355f]">Configure {selectedProduct.name}</h3>
              <p className="font-inter text-xs text-[#5f5e5e] mt-0.5">Customize properties and order size amounts.</p>
            </div>

            {/* Design upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                Upload Your Design Logo
              </label>
              <div className="border-2 border-dashed border-[#c2c7d1] hover:border-[#0f4c81] rounded-2xl p-5 text-center bg-[#f8f9fa] transition-colors relative">
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.svg,.pdf"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="material-symbols-outlined text-3xl text-gray-400">upload_file</span>
                <p className="text-xs font-bold text-[#00355f] mt-2">
                  {logoName ? `Selected: ${logoName}` : 'Click to Upload SVG, PNG or PDF'}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">Recommended: high resolution transparency file</p>
              </div>
              {logoWarning && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-[11px] leading-relaxed">
                  {logoWarning}
                </div>
              )}
            </div>

            {/* Text and color input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Add Custom Text Overlay
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. AI Summit 2026"
                  className="w-full px-3.5 py-2 border border-[#c2c7d1] bg-gray-50 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Typography Style
                </label>
                <select
                  value={textFont}
                  onChange={(e) => setTextFont(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-[#c2c7d1] rounded-xl text-xs outline-none"
                >
                  <option value="font-sans">Modern Sans-Serif</option>
                  <option value="font-serif">Classic Serif</option>
                  <option value="font-mono">Technical Monospace</option>
                </select>
              </div>
            </div>

            {/* Product Color Selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                Select Product Color: <span className="font-bold text-[#0f4c81]">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.colors.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`px-3.5 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedColor === col
                        ? 'border-[#0f4c81] bg-[#d2e4ff]/20 text-[#00355f] shadow-xs'
                        : 'border-gray-200 bg-[#f8f9fa] text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Breakdown Inputs */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                Quantity Setup by Size
              </span>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <div key={sz} className="p-2 border border-gray-100 rounded-xl bg-gray-50">
                    <span className="font-bold block text-[#00355f] mb-1">{sz}</span>
                    <input
                      type="number"
                      min="0"
                      value={sizes[sz]}
                      onChange={(e) => setSizes({ ...sizes, [sz]: Math.max(0, Number(e.target.value)) })}
                      className="w-full text-center px-1 py-1 border border-[#c2c7d1] rounded bg-white font-bold"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-gray-400">Total Quantity computed:</span>
                <span className="font-bold text-[#00355f]">{totalQuantity} units</span>
              </div>
            </div>

            {/* Event Linkage Selector */}
            <div className="space-y-1.5 pt-2 border-t border-[#edeeef]">
              <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                Link to Event Project
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-[#c2c7d1] rounded-xl text-xs outline-none"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title} ({e.startDate})
                  </option>
                ))}
              </select>
            </div>

            {/* Detailed Pricing breakdown card */}
            <div className="bg-[#f8f9fa] border border-[#e1e3e4] p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5f5e5e]">{selectedProduct.name} Base Unit Price</span>
                <span className="font-semibold text-black">${pricingSummary.unitPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5f5e5e]">Items Subtotal ({totalQuantity} units)</span>
                <span className="font-semibold text-black">${pricingSummary.itemsCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5f5e5e]">Screen Setup & Customization fee</span>
                <span className="font-semibold text-black">${pricingSummary.customizationSetup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5f5e5e]">Event Express Courier delivery</span>
                <span className="font-semibold text-black">${pricingSummary.deliveryCharge}</span>
              </div>
              <div className="flex justify-between border-t border-[#e1e3e4] pt-2 font-bold text-sm text-[#00355f]">
                <span>Estimated Total Cost</span>
                <span>${pricingSummary.estimatedTotal}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSubView('catalog')}
                className="flex-grow py-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Back to Catalog
              </button>
              <button
                type="button"
                onClick={handleAddToCartSubmit}
                className="flex-grow py-3 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold cursor-pointer"
              >
                Add to Event Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SHOPPING CART */}
      {subView === 'cart' && (
        <div className="bg-white border border-[#e1e3e4] rounded-[2rem] p-6 md:p-8 space-y-6 shadow-xs">
          <div className="border-b border-[#edeeef] pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-geist text-lg font-bold text-[#00355f]">Your Event Goodies Cart</h3>
              <p className="font-inter text-xs text-[#5f5e5e] mt-0.5">Customize, review, or checkout multiple items.</p>
            </div>
            <span className="text-xs font-bold text-[#0f4c81] bg-[#d2e4ff] px-3 py-1 rounded-full">
              {goodiesCart.length} Items in Cart
            </span>
          </div>

          {goodiesCart.length === 0 ? (
            <div className="text-center py-16 p-8 space-y-3">
              <span className="material-symbols-outlined text-4xl text-gray-300">shopping_bag</span>
              <h3 className="font-geist text-base font-bold text-[#00355f]">Goodies Cart is Empty</h3>
              <p className="font-inter text-xs text-[#5f5e5e] max-w-xs mx-auto">
                Go back to the catalog to choose custom merchandise items for your summit.
              </p>
              <button
                onClick={() => setSubView('catalog')}
                className="px-6 py-2.5 bg-[#0f4c81] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Browse Goodies Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cart items list */}
              <div className="divide-y divide-[#edeeef]">
                {goodiesCart.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4 items-center">
                    <img src={item.baseImage} alt={item.productName} className="w-16 h-16 rounded-xl object-cover" />
                    
                    <div className="flex-grow space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-geist font-bold text-sm text-[#00355f]">{item.productName}</h4>
                          <p className="font-inter text-xs text-[#5f5e5e]">
                            Color: {item.color} • Associated Event: <span className="font-semibold text-black">{item.eventTitle}</span>
                          </p>
                        </div>
                        <span className="font-geist text-xs font-bold text-[#0f4c81]">${item.pricing.estimatedTotal}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500">
                        <span>Sizes: {Object.entries(item.sizes).filter(([_, q]) => q > 0).map(([sz, q]) => `${sz} (${q})`).join(', ')}</span>
                        <button
                          onClick={() => onRemoveGoodiesFromCart(item.id)}
                          className="text-red-600 hover:text-red-800 cursor-pointer underline text-[10px]"
                        >
                          Remove Item
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Sum Summary breakdown */}
              <div className="bg-[#f8f9fa] border border-[#e1e3e4] p-5 rounded-2xl space-y-2.5 text-xs max-w-md ml-auto">
                <span className="font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider block">
                  Swag Cart Summary
                </span>
                
                <div className="flex justify-between">
                  <span className="text-[#5f5e5e]">Items Subtotal</span>
                  <span className="font-semibold text-black">${cartSummary.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f5e5e]">Total Customization setup fees</span>
                  <span className="font-semibold text-black">${cartSummary.customization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f5e5e]">Express Delivery charges</span>
                  <span className="font-semibold text-black">${cartSummary.delivery}</span>
                </div>
                <div className="flex justify-between border-t border-[#e1e3e4] pt-2.5 font-bold text-sm text-[#00355f]">
                  <span>Total Order Budget</span>
                  <span>${cartSummary.total}</span>
                </div>
              </div>

              <div className="flex justify-between gap-4 pt-4 border-t border-[#e1e3e4]">
                <button
                  onClick={() => setSubView('catalog')}
                  className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Continue Shopping
                </button>

                <button
                  onClick={handleCheckoutSubmit}
                  className="px-6 py-2.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Proceed to Order
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: ORDER TRACKING TIMELINE */}
      {subView === 'tracking' && trackingOrder && (
        <div className="bg-white border border-[#e1e3e4] rounded-[2rem] p-6 md:p-8 space-y-6 shadow-xs animate-scaleUp">
          <div className="flex justify-between items-start border-b border-[#edeeef] pb-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Order ID: {trackingOrder.orderId}
              </span>
              <h3 className="font-geist text-lg font-bold text-[#00355f]">
                Goodies Order Confirmed
              </h3>
              <p className="font-inter text-xs text-[#5f5e5e] mt-0.5">
                Linked Event: <span className="font-bold text-black">{trackingOrder.eventTitle}</span> • Order Date: {trackingOrder.date}
              </p>
            </div>

            <span className="px-3 py-1 bg-[#d2e4ff] text-[#0f4c81] rounded-full text-[10px] font-bold uppercase tracking-wider">
              {trackingOrder.status}
            </span>
          </div>

          {/* Vertical milestone tracker */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
              Merchandise Production Tracking Timeline
            </span>

            <div className="relative pl-6 border-l-2 border-gray-200 space-y-5">
              {/* Milestone 1 */}
              <div className="relative">
                <div className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#1a853e] flex items-center justify-center text-white text-[8px] font-bold">✓</div>
                <div>
                  <h4 className="font-geist text-xs font-bold text-black">Design Submitted & Verified</h4>
                  <p className="font-inter text-[10px] text-gray-500">Event logos and design dimensions check complete.</p>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="relative">
                <div className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#1a853e] flex items-center justify-center text-white text-[8px] font-bold">✓</div>
                <div>
                  <h4 className="font-geist text-xs font-bold text-black">Order Confirmed</h4>
                  <p className="font-inter text-[10px] text-gray-500">Checkout complete, invoice cleared.</p>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="relative">
                <div className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#0f4c81] flex items-center justify-center text-white text-[8px] font-bold">🔄</div>
                <div>
                  <h4 className="font-geist text-xs font-bold text-black">In Production (Active)</h4>
                  <p className="font-inter text-[10px] text-[#0f4c81] font-semibold">T-shirts / merchandise print screening has commenced.</p>
                </div>
              </div>

              {/* Milestone 4 */}
              <div className="relative">
                <div className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-gray-200" />
                <div>
                  <h4 className="font-geist text-xs font-bold text-gray-400">Quality Check</h4>
                  <p className="font-inter text-[10px] text-gray-400">Mockup checks, stitch and resolution validation.</p>
                </div>
              </div>

              {/* Milestone 5 */}
              <div className="relative">
                <div className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-gray-200" />
                <div>
                  <h4 className="font-geist text-xs font-bold text-gray-400">Shipped</h4>
                  <p className="font-inter text-[10px] text-gray-400">Express dispatch tracking code will be shared.</p>
                </div>
              </div>

              {/* Milestone 6 */}
              <div className="relative">
                <div className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-gray-200" />
                <div>
                  <h4 className="font-geist text-xs font-bold text-gray-400">Delivered</h4>
                  <p className="font-inter text-[10px] text-gray-400">Estimated delivery: {trackingOrder.deliveryDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary table of order */}
          <div className="space-y-3 pt-2 border-t border-[#edeeef]">
            <span className="font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider block">
              Merchandise Order Items
            </span>

            <div className="border border-[#e1e3e4] rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left font-inter">
                <thead className="bg-[#f8f9fa] border-b border-[#e1e3e4] font-bold text-[#727780]">
                  <tr>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Color</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edeeef]">
                  {trackingOrder.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 font-semibold text-[#00355f]">{item.productName}</td>
                      <td className="p-3">{item.color}</td>
                      <td className="p-3">{item.quantity} units</td>
                      <td className="p-3 text-right font-bold text-[#0f4c81]">${item.pricing.estimatedTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#e1e3e4]">
            <button
              onClick={() => setSubView('catalog')}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Back to Catalog
            </button>
            <button
              onClick={() => setSubView('cart')}
              className="px-5 py-2.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold cursor-pointer"
            >
              View Cart Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default GoodiesMerchSection;
